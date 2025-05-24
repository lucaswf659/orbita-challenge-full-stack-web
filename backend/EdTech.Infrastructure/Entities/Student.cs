namespace EdTech.Infrastructure.Entities;

public class Student
{
    public int Id { get; set; } // Primary Key
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RA { get; set; } = string.Empty; 
    public string CPF { get; set; } = string.Empty; 
}
