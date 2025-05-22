# COMMENTS.md

## 🧱 Architecture Used

The project follows a layered architecture for clarity, scalability, and separation of concerns:

- `EdTech.API` – ASP.NET Core Web API project, responsible for exposing endpoints
- `EdTech.Application` – Application layer to contain business logic (to be expanded)
- `EdTech.Infrastructure` – Persistence layer using Entity Framework Core with PostgreSQL

This approach allows clear separation between the web layer, domain logic, and data access.

---

## 📦 Third-Party Libraries

The following NuGet packages were used to support Entity Framework Core and PostgreSQL integration:

- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Npgsql.EntityFrameworkCore.PostgreSQL`

These libraries enable code-first migrations and PostgreSQL support through EF Core.

---

## 🧠 What I Would Improve With More Time

- Add unit tests using xUnit and Moq
- Implement validation for CPF and RA fields
- Create DTOs and mapping logic to separate domain entities from API models
- Add Swagger customization and API versioning
- Build seed data and add pagination for student listing
- Integrate a service layer with interfaces for better testability and extensibility

---

## ❌ Unimplemented Requirements

- Unit tests (not yet implemented)
- Frontend (to be added in the next stage)

---

## ✅ Additional Notes

The `.gitignore` was updated to support both .NET (Visual Studio, EF Core build folders) and potential frontend tools (Node/Vue). The repository structure mirrors best practices for clean separation between backend and frontend layers.
