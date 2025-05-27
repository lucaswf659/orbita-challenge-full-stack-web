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
        for (int i = 0; i < 5; i++)
        {
            student.RA = await GenerateRAAsync();

            try
            {
                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("IX_Students_RA") == true)
                    continue;
                else
                    return StatusCode(500, "Erro ao salvar estudante");
            }
        }

        return Conflict("Não foi possível gerar RA único após várias tentativas.");
    }

    // PUT: api/students/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Student updatedStudent)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null) return NotFound();

        student.Name = updatedStudent.Name;
        student.Email = updatedStudent.Email;
        student.CPF = updatedStudent.CPF;

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

    private async Task<string> GenerateRAAsync()
    {
        var year = DateTime.UtcNow.Year.ToString(); // "2025"
        var prefix = $"RA{year}";

        var lastRa = await _context.Students
            .Where(s => s.RA.StartsWith(prefix))
            .OrderByDescending(s => s.RA)
            .Select(s => s.RA)
            .FirstOrDefaultAsync();

        int nextSequence = 1;

        if (!string.IsNullOrEmpty(lastRa) && lastRa.Length >= (prefix.Length + 4))
        {
            var sequenceStr = lastRa.Substring(prefix.Length, 4); 
            if (int.TryParse(sequenceStr, out int parsedSeq))
            {
                nextSequence = parsedSeq + 1;
            }
        }

        string newRa = $"{prefix}{nextSequence.ToString("D4")}"; // Ex: RA20250001
        return newRa;
    }
}
