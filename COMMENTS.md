# COMMENTS.md

## ✅ Arquitetura e Decisões Técnicas

- **Backend em .NET 8 (WebAPI)**
- Arquitetura em camadas:
  - `EdTech.API`: camada de apresentação (controllers e startup)
  - `EdTech.Application`: (reservada para regras de negócio futuras)
  - `EdTech.Infrastructure`: persistência e contexto de banco
- Banco de dados PostgreSQL
- Uso do **Entity Framework Core** para ORM
- Migrations e versionamento de schema aplicados com sucesso
- Documentação automática via Swagger

## 📁 Funcionalidades implementadas

- [x] Criação de projeto WebAPI estruturado
- [x] Configuração do banco com EF Core + PostgreSQL
- [x] Criação do modelo `Student` com validações básicas
- [x] Implementação do `AppDbContext`
- [x] Criação da migration inicial e aplicação no banco
- [x] Implementação do `StudentsController` com:
  - [x] `GET /api/students`
  - [x] `GET /api/students/{id}`
  - [x] `POST /api/students`
  - [x] `PUT /api/students/{id}`
  - [x] `DELETE /api/students/{id}`
- [x] Testes realizados via Swagger UI

## 🧠 Melhorias se houvesse mais tempo

- Adicionar validações com `FluentValidation` (ex: CPF válido)
- Implementar testes unitários com xUnit
- Aplicar padrão `DTO` para entrada/saída de dados
- Melhorar tratamento de erros (retornos padronizados)
- Adicionar versionamento de API (`v1`, `v2`, etc.)
- Implementar log de ações

## 📦 Bibliotecas externas utilizadas

- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Npgsql.EntityFrameworkCore.PostgreSQL`
- `Swashbuckle.AspNetCore` (Swagger)

## ❌ Requisitos ainda não entregues

- Integração com camada Application (uso ainda mínimo)
- Testes unitários
- Validações detalhadas no modelo
