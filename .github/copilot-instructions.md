# GitHub Copilot Instructions — MedTask (React + TypeScript + .NET)

> These instructions apply to all code suggestions across this repository.
> Copilot should follow these rules at all times unless a prompt explicitly overrides one.

---

## 🗂️ Project Overview

This is a full-stack task management application:
- **Frontend:** React 18 with TypeScript, located in `frontend/`
- **Backend:** ASP.NET Core 9 Web API, located in `backend/TaskApi/`
- **Tests:** Jest + React Testing Library (frontend), xUnit (backend), Playwright (e2e)
- **Shared types** between frontend and backend must stay in sync — `frontend/src/types.ts` mirrors the .NET models in `backend/TaskApi/Models/`

---

## TypeScript Rules (Frontend)

- **Always** enable and respect TypeScript strict mode. Never disable strict checks with `// @ts-ignore` or `// @ts-nocheck`.
- **Never use `any`**. Use `unknown` when the type is genuinely unknown, then narrow it explicitly.
- **Always** define explicit prop types for every React component using a named `interface` (not inline types or `type` aliases for props).
- Use `interface` for object shapes and public contracts; use `type` for unions, intersections, and utility types.
- All async functions must return typed promises, e.g., `Promise<Task[]>` — never `Promise<any>`.
- Prefer `const` over `let`. Never use `var`.
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of manual null checks where appropriate.

```typescript
// ✅ Correct
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
}

// ❌ Wrong
const TaskItem = ({ task, onToggle }: any) => { ... }
```

---

## React Rules (Frontend)

- **Always use functional components** with React hooks. Never generate class components.
- Use `React.FC<Props>` with an explicit named props interface.
- Use `useCallback` for any function passed as a prop to child components to avoid unnecessary re-renders.
- Use `useEffect` with a complete and correct dependency array — never suppress the exhaustive-deps lint rule.
- **Always handle loading and error states** when making API calls. The pattern in `App.tsx` is the reference implementation.
- Use `async/await` for all asynchronous operations — never `.then().catch()` chains.
- All fetch calls must include error handling that checks `response.ok` before parsing JSON.
- **Never `console.log` in production code.** Use it only during development and remove before committing.
- Components that render lists must always include a stable `key` prop — never use array index as a key.
- Always include ARIA labels on interactive elements (buttons, inputs, checkboxes) for accessibility.

```tsx
// ✅ Correct
const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => (
  <ul role="list" aria-label="Task list">
    {tasks.map(task => (
      <TaskItem key={task.id} task={task} onToggle={onToggle} />
    ))}
  </ul>
);
```

---

## .NET API Rules (Backend)

### REST Naming Conventions
- Route prefix: `api/[resource-plural-lowercase]` — e.g., `api/tasks`, `api/users`
- Use noun-based routes, not verb-based: `GET /api/tasks/{id}`, not `GET /api/getTask/{id}`
- Use `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpPatch]`, `[HttpDelete]` attributes explicitly on every action
- Return `CreatedAtAction` for `POST`, `Ok` for `GET`/`PUT`/`PATCH`, `NoContent` for `DELETE`, `NotFound` for missing resources, `BadRequest` for validation failures
- Error responses must always be a JSON object: `new { error = "message" }` — never a plain string

### C# Code Style
- Use **nullable reference types** (`?`) on all reference type properties and return types
- Add **XML doc comments** (`/// <summary>`) on all public methods in controllers and services
- Use **file-scoped namespaces** (no braces), e.g., `namespace TaskApi.Controllers;`
- Use **primary constructors** or constructor injection for dependency injection — never `new` up services directly
- Follow the **service pattern**: controllers must not contain business logic; all logic belongs in the service layer behind the `IXxxService` interface
- All service interfaces live in `Services/IXxxService.cs`; implementations in `Services/XxxService.cs`
- Model classes live in `Models/`; request/response DTOs are defined in the same controller file or a `Requests/` folder
- Always validate input in controllers before passing to the service layer

```csharp
// ✅ Correct
/// <summary>Returns a single task by ID.</summary>
[HttpGet("{id}")]
public IActionResult GetById(int id)
{
    var task = _taskService.GetById(id);
    if (task == null)
        return NotFound(new { error = "Task not found" });
    return Ok(task);
}
```

---

## Shared Type Conventions

- The canonical data model is `TodoTask` in `backend/TaskApi/Models/Task.cs`
- The frontend mirror is `Task` in `frontend/src/types.ts`
- **When adding a field to the model**, always update both files in the same change
- Use `camelCase` for JSON property names (configured via `JsonNamingPolicy.CamelCase` in the API)
- Date fields: always use `string` (ISO 8601) on the frontend; `DateTime` on the backend

---

## Error Handling

- **Frontend:** Always display user-facing error messages in the UI — never swallow errors silently
- **Frontend:** Use the retry-with-backoff pattern established in `App.tsx` for transient network errors
- **Backend:** Never let exceptions propagate unhandled; use middleware or try/catch with meaningful status codes
- **Never** expose stack traces or internal error details to the frontend

---

## Testing Rules

- **Frontend unit tests** use Jest + React Testing Library. Test files live in `__tests__/` alongside their component.
- **Always** write tests that query by accessible roles (`getByRole`, `getByLabelText`) — never by class names or test IDs unless no accessible selector exists
- **Backend unit tests** use xUnit. Test files live in `backend/TaskApi.Tests/` (or equivalent)
- **E2E tests** use Playwright. Test files live in `frontend/e2e/` and `backend/e2e/`
- Every new component must have a corresponding unit test file
- Every new service method must have a corresponding unit test

---

## Security Rules

- **Never hardcode credentials**, API keys, or connection strings in source code
- `appsettings.Development.json` is for local dev only — never commit secrets there
- All sensitive configuration must use environment variables or .NET's Secret Manager
- Never log task titles, user input, or any data that could contain sensitive information
- All API controller actions should eventually have `[Authorize]` attributes — flag any new action that is missing one

---

## File & Folder Structure

```
frontend/src/
  components/        # One file per component: ComponentName.tsx + __tests__/ComponentName.test.tsx
  types.ts           # All shared TypeScript interfaces — keep in sync with .NET models
  App.tsx            # Root component — orchestrates state and API calls

backend/TaskApi/
  Controllers/       # One controller per resource
  Models/            # Data models only — no logic
  Services/          # IXxxService.cs + XxxService.cs pairs
  Properties/        # launchSettings.json — do not commit local port changes
```

---

> � **Path-specific rules** are defined in subfolder instruction files that Copilot loads
> automatically when you open a file in that part of the codebase:
> - `backend/.github/copilot-instructions.md` — active for all files under `backend/`
> - `frontend/.github/copilot-instructions.md` — active for all files under `frontend/`
>
> The rules below apply globally across the entire repository regardless of which file is open.

---

## What Copilot Should Never Do

- Never generate `class` components in React
- Never use `any` in TypeScript
- Never put business logic in a controller
- Never suggest `.then().catch()` — always use `async/await`
- Never suggest `var` in TypeScript or JavaScript
- Never generate hardcoded URLs — always use `process.env.REACT_APP_API_URL || '/api'` on the frontend
- Never suppress TypeScript or ESLint errors with inline comments
