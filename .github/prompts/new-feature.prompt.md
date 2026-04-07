# New Feature Scaffold — MedTask

Use this prompt file to implement any new vertical feature in the MedTask app.
Replace every occurrence of `[FeatureName]` with the name of your feature (e.g. `Priority`, `Assignee`, `DueDate`).

---

## Instructions for Copilot

You are implementing a new feature called **[FeatureName]** for the MedTask full-stack task manager.
Follow every rule in `.github/copilot-instructions.md` throughout this implementation.
Work through the steps below **in order**. Do not skip steps.

---

## Step 1 — Backend Model

Update `backend/TaskApi/Models/Task.cs`:

- Add a `[FeatureName]` property to the `TodoTask` class
- Use the appropriate C# type with a nullable reference type (`?`) if the field is optional
- Provide a sensible default value using the `=` initialiser
- Add an XML doc comment explaining the property

Example shape (adapt types as needed):
```csharp
/// <summary>The [FeatureName] of the task.</summary>
public [CSharpType] [FeatureName] { get; set; } = [defaultValue];
```

---

## Step 2 — Service Interface

Update `backend/TaskApi/Services/ITaskService.cs`:

- Add a new method signature to support setting or updating `[FeatureName]`
- Follow the existing pattern: return `TodoTask?` and accept the task `id` as the first parameter
- Add an XML doc comment on the method

Example:
```csharp
/// <summary>Updates the [FeatureName] of a task.</summary>
TodoTask? Update[FeatureName](int id, [CSharpType] [featureName]);
```

---

## Step 3 — Service Implementation

Update `backend/TaskApi/Services/TaskService.cs`:

- Implement the new method from the interface
- Follow the pattern of the existing `UpdateCompleted` method:
  1. Call `GetById(id)` first
  2. Return `null` if not found
  3. Mutate the property
  4. Return the updated task
- Also update the `Create` method to accept and set `[FeatureName]` if it is required on creation

---

## Step 4 — Controller

Update `backend/TaskApi/Controllers/TasksController.cs`:

- Add a new `PATCH /api/tasks/{id}/[featureName]` action (or extend the existing `PUT` body — choose whichever fits REST conventions for this field)
- Follow the existing action pattern:
  - Validate input, return `BadRequest` with `new { error = "..." }` if invalid
  - Return `NotFound` with `new { error = "Task not found" }` if the task doesn't exist
  - Return `Ok(task)` on success
- Add or update the request record (e.g. `public record Update[FeatureName]Request(...)`) at the bottom of the file
- Add XML doc comments on the action method
- Also update `CreateTaskRequest` if `[FeatureName]` should be set at creation time

---

## Step 5 — Frontend Type

Update `frontend/src/types.ts`:

- Add the `[featureName]` field to the `Task` interface using the matching TypeScript type
- Mark it optional with `?` only if the backend model is also optional
- Keep the field names camelCase to match the API's JSON serialisation

Example:
```typescript
[featureName]: [TypeScriptType]; // or [featureName]?: [TypeScriptType]
```

---

## Step 6 — React Component

Create `frontend/src/components/[FeatureName]Badge.tsx` (or update an existing component if the field is best displayed inline):

- Use `React.FC` with a named props interface — no `any`
- Display the `[FeatureName]` value clearly with an appropriate visual treatment
- Include an ARIA label on every interactive element
- Export the component as the default export

Also update `frontend/src/components/TaskList.tsx`:

- Import and render the new component/field inside the task list item
- Pass the relevant prop from the `task` object

Also update `frontend/src/components/TaskInput.tsx` if `[FeatureName]` should be set when creating a task:

- Add a controlled input or select for `[FeatureName]`
- Pass the value through to the `onAddTask` callback (update the callback signature if needed)
- Add an ARIA label on the new input

---

## Step 7 — Backend Unit Tests

Create `backend/TaskApi/__tests__/[FeatureName].test.cs` (or the equivalent xUnit test file in the test project):

- Test the new service method:
  - Returns `null` when the task ID does not exist
  - Returns the updated task with the correct `[FeatureName]` value when the task exists
- Test the new controller action:
  - Returns `404` when the task does not exist
  - Returns `400` when input is invalid (if applicable)
  - Returns `200` with the updated task on success

---

## Step 8 — Frontend Unit Tests

Create `frontend/src/components/__tests__/[FeatureName]Badge.test.tsx`:

- Follow the pattern of `TaskInput.test.tsx` and `TaskList.test.tsx`
- Use `@testing-library/react`; query by accessible role or label — never by class name
- Cover:
  - Renders correctly with a given `[featureName]` value
  - Renders correctly with the default/empty value
  - Any interactive behaviour (e.g. changing priority via a select)

---

## Checklist Before You Finish

- [ ] `TodoTask` model updated in `backend/TaskApi/Models/Task.cs`
- [ ] `ITaskService` interface updated with new method
- [ ] `TaskService` implements the new method
- [ ] Controller has a new or updated action with correct HTTP verb and route
- [ ] `frontend/src/types.ts` `Task` interface updated
- [ ] React component created or updated to display `[FeatureName]`
- [ ] `TaskInput.tsx` updated if the field is set on creation
- [ ] Backend unit tests written
- [ ] Frontend unit tests written
- [ ] No `any` types introduced
- [ ] No business logic added to the controller
- [ ] No hardcoded URLs on the frontend
