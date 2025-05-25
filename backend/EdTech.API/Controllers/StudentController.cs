using EdTech.Infrastructure;
using EdTech.Infrastructure.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EdTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
     [FromQuery] int pageNumber = 1,
     [FromQuery] int pageSize = 10,
     [FromQuery] string? search = "")
    {
        if (pageNumber < 1 || pageSize < 1)
            return BadRequest("Número de página e tamanho devem ser maiores que 0.");

        // Base query
        var query = _context.Students.AsQueryable();

        // Aplica o filtro, se houver
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(search) ||
                s.RA.ToLower().Contains(search) ||
                s.Email.ToLower().Contains(search) ||
                s.CPF.ToLower().Contains(search));
        }

        var totalItems = await query.CountAsync();

        var students = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
            Items = students
        };

        return Ok(result);
    }




    // GET: api/students/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _context.Students.FindAsync(id);
        return student is null ? NotFound() : Ok(student);
    }

    // POST: api/students
    [HttpPost]
    public async Task<IActionResult> Create(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    // PUT: api/students/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Student updatedStudent)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null) return NotFound();

        student.Name = updatedStudent.Name;
        student.Email = updatedStudent.Email;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/students/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null) return NotFound();

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
