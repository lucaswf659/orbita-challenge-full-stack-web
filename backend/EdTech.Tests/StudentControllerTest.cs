using EdTech.API.Controllers;
using EdTech.API.DTO.Students;
using EdTech.Infrastructure;
using EdTech.Infrastructure.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using Xunit;

namespace EdTech.Tests.Controllers;

public class StudentControllerTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .UseApplicationServiceProvider(new ServiceCollection().BuildServiceProvider())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task Create_ShouldGenerateRA_AndSaveStudent()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var request = new CreateStudentRequest
        {
            Name = "Lucas Dev",
            Email = "lucas@dev.com",
            CPF = "12345678900"
        };

        var result = await controller.Create(request);

        result.Should().BeOfType<CreatedAtActionResult>();
        var created = context.Students.First();
        created.Name.Should().Be("Lucas Dev");
        created.RA.Should().StartWith("RA");
    }

    [Fact]
    public async Task Create_ShouldReturnConflict_IfCpfAlreadyExists()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        context.Students.Add(new Student
        {
            Name = "Original",
            Email = "original@dev.com",
            CPF = "99999999999",
            RA = "RA20250001"
        });
        await context.SaveChangesAsync();

        var duplicate = new CreateStudentRequest
        {
            Name = "Duplicado",
            Email = "dup@dev.com",
            CPF = "99999999999"
        };

        var result = await controller.Create(duplicate);
        result.Should().BeOfType<ConflictObjectResult>();
        (result as ConflictObjectResult)!.Value!.ToString()!
        .Should().Contain("message = Já existe");
    }

    [Fact]
    public async Task Update_ShouldUpdateAllowedFields_AndKeepRA()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var original = new Student
        {
            Name = "Yasmin",
            Email = "yas@dev.com",
            CPF = "12345678900",
            RA = "RA20250010"
        };
        context.Students.Add(original);
        await context.SaveChangesAsync();

        var update = new UpdateStudentRequest
        {
            Name = "Yasmin Atualizada",
            Email = "nova@dev.com"
        };

        var result = await controller.Update(original.Id, update);
        result.Should().BeOfType<NoContentResult>();

        var stored = await context.Students.FindAsync(original.Id);
        stored!.Name.Should().Be("Yasmin Atualizada");
        stored.Email.Should().Be("nova@dev.com");
        stored.RA.Should().Be("RA20250010");
    }

    [Fact]
    public async Task Update_ShouldReturnNotFound_WhenStudentDoesNotExist()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var result = await controller.Update(999, new UpdateStudentRequest
        {
            Name = "Fake",
            Email = "fake@x.com"
        });

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Delete_ShouldRemoveStudent()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var student = new Student
        {
            Name = "Aluno Removido",
            Email = "remove@teste.com",
            CPF = "99999999999",
            RA = "RA20251234"
        };

        context.Students.Add(student);
        await context.SaveChangesAsync();

        var result = await controller.Delete(student.Id);
        result.Should().BeOfType<NoContentResult>();
        context.Students.Any().Should().BeFalse();
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_WhenStudentDoesNotExist()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var result = await controller.Delete(999);
        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetAll_ShouldReturnFilteredResults()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        context.Students.AddRange(new List<Student>
        {
            new() { Name = "Lucas", Email = "lucas@dev.com", CPF = "111", RA = "RA01" },
            new() { Name = "Yasmin", Email = "yas@dev.com", CPF = "222", RA = "RA02" },
            new() { Name = "João", Email = "joao@dev.com", CPF = "333", RA = "RA03" },
        });
        await context.SaveChangesAsync();

        var result = await controller.GetAll(1, 10, "yas");

        var ok = result as OkObjectResult;
        ok.Should().NotBeNull();

        var json = JsonSerializer.Serialize(ok!.Value);
        var root = JsonDocument.Parse(json).RootElement;
        var items = root.GetProperty("items").EnumerateArray().ToList();
        var total = root.GetProperty("totalItems").GetInt32();

        total.Should().Be(1);
        items[0].GetProperty("Name").GetString().Should().Be("Yasmin");
    }
}
