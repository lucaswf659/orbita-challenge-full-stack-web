# README.md

Este projeto implementa uma aplicação full stack de gerenciamento de matrículas de alunos utilizando:

- **Frontend**: Vue 3 + TypeScript + Vuetify 3 + Vite
- **Backend**: ASP.NET Core 8 com Entity Framework Core
- **Banco de dados**: PostgreSQL (pode ser substituído por MySQL ou banco InMemory para testes locais)

---

## ⚙️ Decisões de Arquitetura

### Frontend

- **Framework**: Utiliza Vue 3 com script setup (Composition API) para simplicidade e reuso de lógica.
- **UI**: Vuetify 3 com auto import ativado (via `vite-plugin-vuetify`).
- **Roteamento**: Vue Router com rotas nomeadas (`students`, `students/new`, `students/edit`).
- **Estado global**: Pinia com tipagem explícita, incluindo uso de `stubActions` para facilitar testes.
- **Comunicação com a API**: `axios` centralizado no serviço `studentService.ts`.
- **Componentização**: Separado em `StudentList.vue`, `StudentForm.vue`, e lógica extraída em composables:
  - `useStudentList.ts` → estado, ações e interação com store/API
  - `useStudentForm.ts` → formulário, validações, salvar e feedback
- **Testes**: `Vitest` com cobertura de comportamento e renderização, incluindo mocks de store e serviços.

#### 💡 Melhorias de Layout e Responsividade

- Adicionada responsividade à sidebar com controle dinâmico via `useDisplay` do Vuetify e breakpoints personalizados.
- A sidebar se comporta como permanente em resoluções maiores e é ocultada automaticamente em `smAndDown`.
- Ajustado `v-main` com `style="--v-layout-left: 0px"` para evitar espaços laterais mesmo com sidebar oculta.
- Refinado CSS dos componentes `.students-table` e `.text-truncate` para melhor adaptação a diferentes larguras de tela.
- Corrigido estilo global para evitar `scroll horizontal` e `vertical` indesejados em qualquer resolução.

### Backend

- **Camadas**: `API`, `Application` e `Infrastructure`, com migrações EF Core.
- **Modelos**: Agora utiliza DTOs (`CreateStudentRequest`, `UpdateStudentRequest`, `StudentResponse`) para abstrair a entidade `Student`.
- **Validação**: Realizada via `ModelState` com Data Annotations.
- **CORS**: Habilitado via política global para permitir origens como `http://localhost:5173`.
- **Migrations**: Usadas migrations padrão do EF Core para criação de banco.

---

## 📦 Bibliotecas Utilizadas

### Frontend

- `vue`, `vue-router`, `vite`, `typescript`
- `vuetify`, `vite-plugin-vuetify`
- `pinia`, `@pinia/testing`
- `axios`
- `vitest`, `@vue/test-utils`

### Backend

- `Microsoft.AspNetCore.Mvc`
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Microsoft.EntityFrameworkCore.Tools`
- `coverlet.collector`
- `reportgenerator`

---

## 🔬 Testes e Cobertura

### Frontend:

- Foram criados 21 cenários de testes unitários, todos estão passando.
- `vitest` com `@vue/test-utils` para montar componentes
- Testes validam renderização, interação, exclusão e navegação
- Router `push` mockado manualmente para testes com composables
- Comando para rodar testes:

```bash
npm run test
```

- Comando para cobertura:

```bash
npm run test -- --coverage
```

Gera arquivos `lcov` e `HTML` automaticamente.

### Backend:

- Foram criados 7 cenários de testes unitários, todos estão passando.
- Estrutura pronta para uso com `xUnit` e `coverlet`
- Script PowerShell criado para automatizar cobertura:
- Rode esse comando antes caso seja bloqueado pelo sistema

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.run-coverage.ps1
```

- Comando alternativo direto:

```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov
reportgenerator -reports:coverage/lcov.info -targetdir:coverage-report -reporttypes:Html
```

Gera relatório lcov e HTML via `reportgenerator`.

Execute o arquivo que está na raiz local do projeto de backend seed.sql para popular os dados do banco de dados.

---

## 🔁 Decisões de Arquitetura – Backend

Priorizei boas práticas de arquitetura e organização de código com foco em evolutividade, manutenção, segurança de dados e pensada como uma base em clean architecture. Abaixo, destaco as principais decisões tomadas:

### ✅ 1. Implementação de DTOs (Data Transfer Objects)

- **Objetivo**: Separar a lógica da API da entidade de domínio (`Student`).
- **Benefícios**:
  - Proteção contra exposição direta de entidades sensíveis.
  - Possibilidade de definir regras de validação específicas por contexto (Create, Update, Response).
  - Flexibilidade para evoluir o backend sem impactar diretamente o frontend.

### ✅ 2. Padronização das Respostas da API

- **Antes**: A API retornava listas simples de entidades.
- **Agora**: Retorna um objeto com metadados (`items`, `totalItems`) e dados estruturados via `StudentResponse`.
- **Impacto**:
  - Facilita paginação no frontend.
  - Torna a API mais previsível, limpa e extensível.

### ✅ 3. Preparação para Escalabilidade e Manutenibilidade

Mesmo com estrutura simples, a arquitetura:

- Isola responsabilidades.
- Permite futuras implementações de camadas como Services, Use Cases, Mediator, ou Clean Architecture.
- Abre caminho para testes unitários eficazes em cada camada.

### ✅ 4. Código mais legível e coeso

- O controller está enxuto.
- Operações organizadas com responsabilidades claras entre entrada (DTOs), lógica e saída (Response).

## 🔁 Decisões de Arquitetura – Frontend

Durante a refatoração do frontend, foquei em organização, legibilidade e separação de responsabilidades com base em boas práticas modernas do ecossistema Vue 3. Abaixo os principais pontos:

### ✅ 1. Adoção da Composition API com Composables

- **Objetivo**: Separar lógica de estado, manipulação e validação do template Vue.
- **Benefícios**:
  - Melhor reuso e testabilidade.
  - Organização clara de lógica por domínio (ex: `useStudentList.ts`, `useStudentForm.ts`).
  - Código mais limpo e coeso.

### ✅ 2. Componentes mais enxutos e focados

- **Antes**: Toda a lógica de listagem, busca, formulário e API ficava dentro dos `.vue`.
- **Agora**: Os componentes focam apenas na exibição e interação com os composables.
- **Impacto**:
  - Facilita manutenção e onboarding.
  - Isola responsabilidades visuais de lógicas de negócio.

### ✅ 3. Testes mais robustos e contextualizados

- Atualizados para cobrir o novo fluxo de estado via composables.
- Mock do router e do serviço mantidos para simular navegação e requisições.
- Cobertura com `vitest --coverage` validando todos os fluxos principais.

### ✅ 4. Ponto de melhoria futura

- Com a separação da lógica, a aplicação está pronta para evoluir com mais composables reutilizáveis (ex: toasts, validações globais, controle de diálogos).
- Próximos passos podem incluir abstração para hooks de CRUD genéricos ou store modular.

---

## 🚀 Melhorias Futuras (com tempo adicional)

- [ ] Melhorar design e responsividade.
- [ ] Barra de scroll lateral vertical está fixa.
- [ ] Adicionar validador de E-mail único.
- [ ] Criar um middleware de tratamento global de erros para respostas padronizadas.
- [ ] Melhorar as mensagens de erro para o usuário.
- [ ] Gostaria de ter subido o projeto na AWS, mas não deu tempo.

---

## ❌ Requisitos obrigatórios não entregues

Todos os requisitos obrigatórios foram entregues com sucesso ✅

---

## 🚀 Resultado Final

A aplicação entrega um CRUD completo de alunos com foco em boas práticas de arquitetura, separação de responsabilidades, integração funcional entre front e back e UX fluida com Vuetify. O código segue padrões modernos de Vue 3 com Composition API e está preparado para manutenção, testes e evolução.
