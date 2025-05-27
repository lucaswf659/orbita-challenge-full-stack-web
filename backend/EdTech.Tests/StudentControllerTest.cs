using EdTech.API.Controllers;
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
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .UseApplicationServiceProvider(new ServiceCollection().BuildServiceProvider()) // previne erro de DI
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated(); // garante estrutura do banco
        return context;
    }

    [Fact]
    public async Task Create_ShouldGenerateRA_AndSaveStudent()
    {
        // Arrange
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var student = new Student
        {
            Name = "Lucas Dev",
            Email = "lucas@dev.com",
            CPF = "12345678900"
        };

        // Act
        var result = await controller.Create(student);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
        var created = context.Students.First();
        created.Name.Should().Be("Lucas Dev");
        created.RA.Should().StartWith("RA");
    }

    [Fact]
    public async Task Update_ShouldChangeEditableFields_AndKeepRA()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var original = new Student
        {
            Name = "Yasmin",
            Email = "yasmin@exemplo.com",
            CPF = "00000000000",
            RA = "RA20250001"
        };

        context.Students.Add(original);
        await context.SaveChangesAsync();

        var updated = new Student
        {
            Name = "Yasmin Atualizada",
            Email = "nova@exemplo.com",
            CPF = "00000000000",  // should not be changed
            RA = "RA99999999"    // should be ignored
        };

        var result = await controller.Update(original.Id, updated);

        result.Should().BeOfType<NoContentResult>();
        var stored = await context.Students.FindAsync(original.Id);
        stored!.Name.Should().Be("Yasmin Atualizada");
        stored.Email.Should().Be("nova@exemplo.com");
        stored.RA.Should().Be("RA20250001");
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
    public async Task GetAll_ShouldReturnFilteredStudents_WithPagination()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        // Arrange
        context.Students.AddRange(new List<Student>
        {
            new() { Name = "Lucas Dev", Email = "lucas@dev.com", CPF = "11111111111", RA = "RA20250001" },
            new() { Name = "Yasmin", Email = "yasmin@dev.com", CPF = "22222222222", RA = "RA20250002" },
            new() { Name = "João", Email = "joao@dev.com", CPF = "33333333333", RA = "RA20250003" },
        });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll(1, 2, "yas");

        // Assert
        var okResult = result as OkObjectResult;
        okResult.Should().NotBeNull();

        var json = JsonSerializer.Serialize(okResult!.Value);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        int totalItems = root.GetProperty("TotalItems").GetInt32();
        var itemsJson = root.GetProperty("Items").EnumerateArray().ToList();

        totalItems.Should().Be(1);
        itemsJson[0].GetProperty("Name").GetString().Should().Be("Yasmin");
    }

    [Fact]
    public async Task Delete_ShouldOnlyRemoveSelectedStudent()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var aluno1 = new Student { Name = "A", Email = "a@a.com", CPF = "11111111111", RA = "RA20250001" };
        var aluno2 = new Student { Name = "B", Email = "b@b.com", CPF = "22222222222", RA = "RA20250002" };

        context.Students.AddRange(aluno1, aluno2);
        await context.SaveChangesAsync();

        var result = await controller.Delete(aluno1.Id);

        result.Should().BeOfType<NoContentResult>();
        context.Students.Count().Should().Be(1);
        context.Students.First().Name.Should().Be("B");
    }

    [Fact]
    public async Task Create_ShouldReturnConflict_IfCpfAlreadyExists()
    {
        var context = GetDbContext();
        var controller = new StudentsController(context);

        var existing = new Student
        {
            Name = "Original",
            Email = "original@dev.com",
            CPF = "99999999999",
            RA = "RA20250001"
        };
        context.Students.Add(existing);
        await context.SaveChangesAsync();

        var duplicate = new Student
        {
            Name = "Duplicado",
            Email = "dup@dev.com",
            CPF = "99999999999" // mesmo CPF!
        };

        var result = await controller.Create(duplicate);

        result.Should().BeOfType<ConflictObjectResult>();
        (result as ConflictObjectResult)!.Value.ToString().Should().Contain("já existe");
    }

}
