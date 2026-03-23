# Copilot Coding Agent + MCP — Demo Prompts

## Setup Workflow: `copilot-setup-steps.yml`

### What is it?
`.github/workflows/copilot-setup-steps.yml` is a special GitHub Actions workflow
recognised by the **GitHub Copilot Coding Agent**. It pre-installs all project
dependencies into the agent's cloud environment before it starts any task.

### Why is it significant?

| Without it | With it |
|---|---|
| Agent installs deps on every run (slow) | Deps are pre-cached and ready instantly |
| Risk of install failures mid-task | Environment is verified before agent starts |
| Agent may not know what tools are needed | Explicitly declares the full stack |
| Longer feedback loops | Agent can build, test and run code immediately |

### What it pre-installs for THIS project

| Layer | Tool | Why |
|---|---|---|
| C# Backend | .NET 9 SDK + NuGet restore | Build and run `TaskApi` (ASP.NET Core) |
| React Frontend | Node.js 20 + npm ci | Build and run the React TypeScript app |
| Legacy Backend | Node.js npm ci | Run jest unit tests + backend e2e |
| E2E Testing | Playwright + Chromium | Run frontend and backend e2e test suites |

---

## Demo Prompts — Copilot Coding Agent

Use these prompts in **GitHub Copilot Coding Agent** (github.com → your repo → Copilot tab):

### Feature Development
```
Add a task category field to tasks with values: work, personal, urgent.
Update the C# backend model, service, controller and React frontend.
```

```
Add a dropdown filter to the React frontend to filter tasks by category.
```

```
Add the ability to edit an existing task's title inline in the task list.
```

### Testing
```
Generate xUnit unit tests for TaskService.cs covering all CRUD operations,
toggle, and error cases for missing tasks.
```

```
Generate React Testing Library unit tests for TaskList and TaskInput components
including edge cases for empty state and error handling.
```

### Documentation
```
Generate full API documentation for all endpoints in TasksController.cs
in OpenAPI/Swagger format and save it to docs/API.md
```

```
Generate a setup guide for this project covering how to run the C# backend
and React frontend locally. Save to docs/SETUP.md
```

### MCP — GitHub Integration
```
List all open issues in this repository
```

```
Create a GitHub issue titled "Add task category feature" with full description
of what needs to be built across the C# backend and React frontend.
```

```
Create a pull request from the current branch to main summarising all changes made.
```
