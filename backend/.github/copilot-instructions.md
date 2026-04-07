# Copilot Instructions — Backend (ASP.NET Core 9)

> These rules are **automatically merged** with the global rules in
> `/.github/copilot-instructions.md` whenever you are editing any file under `backend/`.
> You do not need to reference this file manually — Copilot loads it by proximity.

---

## Nullable Reference Types — Mandatory

Every reference type property, parameter, and return type must explicitly declare nullability.
Never leave a reference type without a nullability annotation.

```csharp
// ✅ Correct
public TodoTask? GetById(int id) { ... }
public string Title { get; set; } = string.Empty;

// ❌ Wrong — missing nullability annotation
public TodoTask GetById(int id) { ... }
public string Title { get; set; }
```

---

## XML Doc Comments — Mandatory on All Public Members

Always generate `/// <summary>` before every `public` method, property, and class
in `Controllers/`, `Services/`, and `Models/`. Include `<param>` and `<returns>` on methods.

```csharp
// ✅ Correct
/// <summary>Creates a new task with the given title and priority.</summary>
/// <param name="request">The creation request payload.</param>
/// <returns>201 Created with the new task, or 400 Bad Request if input is invalid.</returns>
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateTaskRequest request) { ... }
```

---

## `var` Usage

Only use `var` when the type is immediately obvious from the right-hand side.
When the type could be ambiguous, declare it explicitly — especially for nullable types.

```csharp
// ✅ Correct — type is obvious
var tasks = new List<TodoTask>();

// ❌ Wrong — reader cannot tell this is nullable without looking at the service
var result = _taskService.GetById(id);

// ✅ Correct — nullability is explicit and visible
TodoTask? result = _taskService.GetById(id);
```

---

## Controller Actions — Always Async

Always use `async Task<IActionResult>` for controller actions, even when the current
service implementation is synchronous. This keeps the API ready for async I/O without
requiring a signature change later.

```csharp
// ✅ Correct
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    var task = await _taskService.GetByIdAsync(id);
    if (task == null)
        return NotFound(new { error = "Task not found" });
    return Ok(task);
}
```

---

## Guard Clauses — Always First

Validate all inputs and return early before any service call or business logic.
Never mix validation and business logic in the same block.

```csharp
// ✅ Correct — guard at the top, logic follows
if (string.IsNullOrWhiteSpace(request.Title))
    return BadRequest(new { error = "Title is required" });

var task = _taskService.Create(request.Title, request.Priority);
return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
```

---

## Controllers — Rules

- **No business logic in controllers.** If you write more than a guard clause + a service call, extract to the service layer.
- Every action must declare its HTTP verb and route explicitly — never rely on convention routing.
- Every action missing `[Authorize]` must be flagged:
  ```csharp
  // TODO: Add [Authorize] — required for HIPAA compliance
  ```
- Error responses must always be a JSON object — never a plain string:
  ```csharp
  return BadRequest(new { error = "Title is required" });   // ✅
  return BadRequest("Title is required");                    // ❌
  ```

---

## Services — Rules

- All service logic lives behind an interface: `IXxxService.cs` + `XxxService.cs` in `Services/`
- Service methods that will eventually hit a database must be designed as `async Task<T>` from the start
- Never `new` up a service — always inject via the constructor

---

## Models — Rules

- Models contain **properties only** — no methods, no business logic, no service calls
- All `string` properties must have `= string.Empty` as the default initialiser
- All `DateTime` properties must store UTC time — document this on the property:
  ```csharp
  /// <summary>The UTC timestamp when this task was created.</summary>
  public DateTime CreatedAt { get; set; }
  ```
- All properties must have XML doc comments

---

## Unit Tests — Backend

- Test files live in `backend/TaskApi/__tests__/` and follow the naming pattern `[ClassName]Tests.cs`
- Every public service method must have a corresponding unit test
- Every controller action must have tests covering: success path, not-found path, and invalid-input path
- Every `describe`-equivalent (`public class`) must read as a plain-English sentence: *"TaskService_UpdatePriority"*
- Every test method name must describe expected behaviour: *"ReturnsNull_WhenTaskDoesNotExist"*

---

## File & Folder Structure (Backend)

```
backend/TaskApi/
  Controllers/    ← one controller per resource, actions only (no logic)
  Models/         ← data shapes only (no methods)
  Services/
    IXxxService.cs   ← interface
    XxxService.cs    ← implementation
  Properties/     ← do not commit local port changes in launchSettings.json
  __tests__/      ← xUnit test files
```
