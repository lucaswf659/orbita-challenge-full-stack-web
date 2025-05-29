using EdTech.API.DTO.Students;
using EdTech.Infrastructure;
using EdTech.Infrastructure.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EdTech.API.Controllers
{
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
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(s =>
                    s.Name.ToLower().Contains(search) ||
                    s.Email.ToLower().Contains(search) ||
                    s.CPF.Contains(search) ||
                    s.RA.ToLower().Contains(search)
                );
            }

            var totalItems = await query.CountAsync();
            var students = await query
                .OrderBy(s => s.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                items = students.Select(s => new StudentResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    CPF = s.CPF,
                    RA = s.RA
                }),
                totalItems
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            var dto = new StudentResponse
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                CPF = student.CPF,
                RA = student.RA
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStudentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Students.AnyAsync(s => s.CPF == request.CPF);
            if (existing)
                return Conflict(new { message = "Já existe um aluno com este CPF." });

            // Buscar o último RA existente
            var lastStudent = await _context.Students
                .OrderByDescending(s => s.Id)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (lastStudent != null && lastStudent.RA?.Length == 10)
            {
                var lastNumberStr = lastStudent.RA.Substring(6); // ex: "1025"
                if (int.TryParse(lastNumberStr, out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            var student = new Student
            {
                Name = request.Name,
                Email = request.Email,
                CPF = request.CPF,
                RA = $"RA{DateTime.UtcNow:yyyy}{nextNumber:D4}"
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = student.Id }, new StudentResponse
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                CPF = student.CPF,
                RA = student.RA
            });
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStudentRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.Name = request.Name;
            student.Email = request.Email;
            student.CPF = request.CPF;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
