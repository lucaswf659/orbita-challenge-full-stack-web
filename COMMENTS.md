# COMMENTS.md

## ✅ Architecture and Technical Decisions

- **Backend built with .NET 8 (WebAPI)**
- Layered architecture:
  - `EdTech.API`: presentation layer (controllers and startup config)
  - `EdTech.Application`: reserved for business logic (not yet used)
  - `EdTech.Infrastructure`: persistence layer and database context
- PostgreSQL as the database
- **Entity Framework Core** used as ORM
- Migrations managed and applied with EF CLI
- Auto-generated API documentation using Swagger

## 📁 Implemented Features

- [x] Created structured WebAPI solution
- [x] Configured PostgreSQL connection via EF Core
- [x] Created `Student` entity with base validation
- [x] Implemented `AppDbContext` for database mapping
- [x] Created and applied initial database migration
- [x] Implemented `StudentsController` with full CRUD operations:
  - [x] `GET /api/students`
  - [x] `GET /api/students/{id}`
  - [x] `POST /api/students`
  - [x] `PUT /api/students/{id}`
  - [x] `DELETE /api/students/{id}`
- [x] All endpoints tested using Swagger UI

## 🚀 Potential Improvements (if more time was available)

- Add validation using FluentValidation (e.g., valid CPF)
- Implement unit tests with xUnit or NUnit
- Use DTOs for input/output models
- Apply standardized error handling (problem details)
- Enable API versioning (`v1`, `v2`, etc.)
- Add action/event logging

## 📦 Third-party Packages Used

- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Npgsql.EntityFrameworkCore.PostgreSQL`
- `Swashbuckle.AspNetCore` (Swagger/OpenAPI)

## ❌ Pending Requirements

- Business logic layer (Application) integration
- Unit tests
- Detailed field validation (e.g., unique CPF and RA checks)
