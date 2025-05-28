namespace EdTech.API.DTO.Students
{
    public class StudentResponse
    {
        public int Id { get; set; }
        public string RA { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
    }
}
