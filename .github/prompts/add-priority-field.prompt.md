# Feature: Add Priority to Tasks

> **This prompt uses `.github/prompts/new-feature.prompt.md` as its scaffold.**
> All general rules from that file and from `.github/copilot-instructions.md` apply.
> This file provides the Priority-specific values to fill in every `[FeatureName]` placeholder.

---

## Feature Summary

Add a **Priority** field to the MedTask task model. Priority represents urgency and can be one of three levels: `Low`, `Medium`, or `High`. It should default to `Medium` when a task is created without an explicit priority.

---

## Priority-Specific Substitutions

| Placeholder | Value for this feature |
|---|---|
| `[FeatureName]` | `Priority` |
| `[featureName]` | `priority` |
| `[CSharpType]` | `TaskPriority` (enum — defined in Step 1) |
| `[TypeScriptType]` | `'low' \| 'medium' \| 'high'` |
| `[defaultValue]` | `TaskPriority.Medium` |

---

## Step 1 — Backend Model

In `backend/TaskApi/Models/Task.cs`:

1. First, define the enum **in the same file**, above the `TodoTask` class:
```csharp
/// <summary>Represents the urgency level of a task.</summary>
public enum TaskPriority
{
    Low = 0,
    Medium = 1,
    High = 2
}
```

2. Add the property to `TodoTask`:
```csharp
/// <summary>The urgency level of this task. Defaults to Medium.</summary>
public TaskPriority Priority { get; set; } = TaskPriority.Medium;
```

---

## Step 2 — Service Interface

In `backend/TaskApi/Services/ITaskService.cs`, add:

```csharp
/// <summary>Updates the priority of an existing task.</summary>
TodoTask? UpdatePriority(int id, TaskPriority priority);
```

Also update the `Create` signature to accept an optional priority:
```csharp
TodoTask Create(string title, TaskPriority priority = TaskPriority.Medium);
```

---

## Step 3 — Service Implementation

In `backend/TaskApi/Services/TaskService.cs`:

- Update `Create` to accept and set `priority`:
```csharp
public TodoTask Create(string title, TaskPriority priority = TaskPriority.Medium)
{
    var task = new TodoTask
    {
        Id = _nextId++,
        Title = title,
        Completed = false,
        Priority = priority,
        CreatedAt = DateTime.UtcNow
    };
    _tasks.Add(task);
    return task;
}
```

- Implement `UpdatePriority` following the `UpdateCompleted` pattern:
```csharp
public TodoTask? UpdatePriority(int id, TaskPriority priority)
{
    var task = GetById(id);
    if (task == null) return null;
    task.Priority = priority;
    return task;
}
```

---

## Step 4 — Controller

In `backend/TaskApi/Controllers/TasksController.cs`:

1. Update `CreateTaskRequest` to include optional priority:
```csharp
public record CreateTaskRequest(string Title, TaskPriority Priority = TaskPriority.Medium);
```

2. Update the `Create` action to pass priority to the service:
```csharp
var task = _taskService.Create(request.Title, request.Priority);
```

3. Add a new PATCH action for updating priority:
```csharp
// PATCH /api/tasks/{id}/priority
/// <summary>Updates the priority of a task.</summary>
[HttpPatch("{id}/priority")]
public IActionResult UpdatePriority(int id, [FromBody] UpdatePriorityRequest request)
{
    if (!Enum.IsDefined(typeof(TaskPriority), request.Priority))
        return BadRequest(new { error = "Invalid priority value" });

    var task = _taskService.UpdatePriority(id, request.Priority);
    if (task == null)
        return NotFound(new { error = "Task not found" });
    return Ok(task);
}
```

4. Add the request record at the bottom of the file:
```csharp
public record UpdatePriorityRequest(TaskPriority Priority);
```

---

## Step 5 — Frontend Type

In `frontend/src/types.ts`, update the `Task` interface:

```typescript
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    priority: TaskPriority; // new field — matches API JSON
}
```

---

## Step 6 — React Components

### New file: `frontend/src/components/PriorityBadge.tsx`

Create a badge component that displays the priority visually:

```tsx
import React from 'react';
import { TaskPriority } from '../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low:    { label: 'Low',    className: 'priority-badge--low' },
  medium: { label: 'Medium', className: 'priority-badge--medium' },
  high:   { label: 'High',   className: 'priority-badge--high' },
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const { label, className } = priorityConfig[priority];
  return (
    <span
      className={`priority-badge ${className}`}
      aria-label={`Priority: ${label}`}
      role="status"
    >
      {label}
    </span>
  );
};

export default PriorityBadge;
```

### Update `frontend/src/components/TaskList.tsx`

- Import `PriorityBadge` and render it next to the task title inside each list item.

### Update `frontend/src/components/TaskInput.tsx`

- Add a `<select>` for priority with options Low / Medium / High, defaulting to `medium`
- Update the `onAddTask` callback signature to accept `(title: string, priority: TaskPriority) => Promise<void>`
- Add `aria-label="Task priority"` to the select

---

## Step 7 — Backend Unit Tests

Create unit tests (xUnit) covering:

- `TaskService.Create` sets `Priority = Medium` when no priority is given
- `TaskService.Create` sets the correct priority when one is supplied
- `TaskService.UpdatePriority` returns `null` for a non-existent task ID
- `TaskService.UpdatePriority` returns the task with the updated priority
- `TasksController` `UpdatePriority` returns `400` for an invalid priority value
- `TasksController` `UpdatePriority` returns `404` when the task does not exist
- `TasksController` `UpdatePriority` returns `200` with the updated task on success

---

## Step 8 — Frontend Unit Tests

Create `frontend/src/components/__tests__/PriorityBadge.test.tsx`:

- Renders `"Low"` text and the correct ARIA label for `priority="low"`
- Renders `"Medium"` text and the correct ARIA label for `priority="medium"`
- Renders `"High"` text and the correct ARIA label for `priority="high"`
- Each badge has `role="status"`

Also update `frontend/src/components/__tests__/TaskInput.test.tsx`:

- Renders the priority select with the correct accessible label
- Defaults to `medium`
- Calls `onAddTask` with both `title` and `priority` when submitted

---

## Checklist

- [ ] `TaskPriority` enum defined in `Task.cs`
- [ ] `TodoTask.Priority` property added with default `Medium`
- [ ] `ITaskService.UpdatePriority` and updated `Create` signature
- [ ] `TaskService` implements both changes
- [ ] `PATCH /api/tasks/{id}/priority` action added to controller
- [ ] `UpdatePriorityRequest` record added
- [ ] `CreateTaskRequest` updated to include `Priority`
- [ ] `TaskPriority` type and `Task.priority` field added to `frontend/src/types.ts`
- [ ] `PriorityBadge.tsx` created
- [ ] `TaskList.tsx` renders `PriorityBadge`
- [ ] `TaskInput.tsx` includes priority select and updated callback
- [ ] Backend tests cover service and controller
- [ ] Frontend tests cover `PriorityBadge` and updated `TaskInput`
- [ ] No `any` types introduced anywhere
