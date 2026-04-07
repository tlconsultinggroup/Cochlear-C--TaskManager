# Copilot Instructions — Frontend (React 18 + TypeScript)

> These rules are **automatically merged** with the global rules in
> `/.github/copilot-instructions.md` whenever you are editing any file under `frontend/`.
> You do not need to reference this file manually — Copilot loads it by proximity.

---

## React Components — Core Rules

- **Always use functional components** with `React.FC<Props>`. Never generate class components.
- **Always define a named, explicit props interface** — never inline prop types, never use `any`.
  ```tsx
  // ✅ Correct
  interface DeleteButtonProps {
    taskId: number;
    taskTitle: string;
    onDelete: (id: number) => Promise<void>;
  }
  const DeleteButton: React.FC<DeleteButtonProps> = ({ taskId, taskTitle, onDelete }) => { ... }

  // ❌ Wrong
  const DeleteButton = ({ taskId, onDelete }: { taskId: number; onDelete: any }) => { ... }
  ```

---

## Accessibility (A11y) — Mandatory for All Components

Every interactive element **must** have an accessible label. This is non-negotiable
in a healthcare application where assistive technology users are a primary audience.

| Element | Required attribute |
|---|---|
| Icon-only `<button>` | `aria-label="Action description"` |
| `<input>` without visible label | `aria-label="Field description"` |
| `<select>` | `aria-label="Select description"` |
| `<input>` with a visible `<label>` | Use `htmlFor` + `id` pairing instead |
| Status indicators | `role="status"` + `aria-label` |
| Lists | `role="list"` on `<ul>`, `role="listitem"` on `<li>` if not implied |

```tsx
// ✅ Correct
<button
  aria-label={`Delete task: ${task.title}`}
  onClick={() => onDelete(task.id)}
>
  🗑️
</button>

<input
  aria-label="New task title"
  type="text"
  value={title}
  onChange={e => setTitle(e.target.value)}
/>

// ❌ Wrong — no accessible label, screen reader announces nothing useful
<button onClick={() => onDelete(task.id)}>🗑️</button>
```

---

## Semantic HTML — Mandatory

Use the correct HTML element for the job. Never use `<div>` or `<span>` with an
`onClick` as a substitute for a real interactive element.

```tsx
// ✅ Correct
<button onClick={handleDelete}>Delete</button>   // action
<a href="/tasks/1">View task</a>                 // navigation
<ul><li>…</li></ul>                              // list
<form onSubmit={handleSubmit}>…</form>           // form

// ❌ Wrong
<div onClick={handleDelete}>Delete</div>
```

---

## Keyboard Navigation

Any interaction available via mouse must also be reachable and operable via keyboard.
- Use native interactive elements (`<button>`, `<input>`, `<select>`) wherever possible — they handle keyboard events for free.
- Only add `onKeyDown` manually when building a custom interactive widget (e.g. a custom dropdown).
- Never set `tabIndex="-1"` on a focusable element unless it is genuinely non-interactive (e.g. a decorative icon inside a button that already has a label).

---

## CSS Class Names — BEM Convention

Follow the BEM pattern already used throughout the project: `block__element--modifier`.

```tsx
// ✅ Correct
<li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
  <button className="task-item__delete task-item__delete--danger">Delete</button>
</li>

// ❌ Wrong — arbitrary class names break the existing stylesheet conventions
<li className={`taskItem ${task.completed ? 'done' : ''}`}>
```

---

## Component File Rules (`src/components/**`)

- One component per file. Filename must match the component name exactly: `TaskList.tsx` exports `TaskList`.
- Every component file must have a corresponding test file: `__tests__/TaskList.test.tsx`.
- Export the component as the **default export**.
- Keep all component-local types (`interface XxxProps`) in the same file as the component — do not create a separate `types/` file per component.

---

## Hooks & State

- Use `useCallback` for every function passed as a prop to a child — prevents unnecessary re-renders.
- Use `useEffect` with a complete dependency array. Never suppress the `exhaustive-deps` ESLint rule.
- Extract reusable stateful logic into a custom hook in `src/hooks/` (e.g. `useTaskApi.ts`).
- Never store derived state in `useState` — compute it from existing state instead.

---

## API Calls — Frontend Pattern

Follow the pattern established in `App.tsx` for all API interactions:

1. Set a `loading` flag to `true` before the call
2. Clear any previous `error` state
3. Check `response.ok` before parsing JSON
4. Set `error` state in the `catch` block — never swallow errors silently
5. Always `finally { setLoading(false) }`

```tsx
// ✅ Reference pattern
const fetchTasks = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data: Task[] = await response.json();
    setTasks(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
}, [API_URL]);
```

- **Never hardcode URLs.** Always use `process.env.REACT_APP_API_URL || '/api'`.
- Never use `.then().catch()` chains — always `async/await`.

---

## Unit Tests (`src/components/__tests__/**`)

- Query by accessible role or label first — in this order of preference:
  1. `getByRole` (e.g. `getByRole('button', { name: /delete/i })`)
  2. `getByLabelText`
  3. `getByText`
  4. `getByTestId` — last resort only
- Always wrap interactions that trigger state updates in `await act(async () => { ... })`
- Mock all async operations with `jest.fn()` — never make real HTTP calls in unit tests
- Test file naming: `[ComponentName].test.tsx` — must match the component filename exactly
- `describe` block names read as plain-English sentences: *"TaskInput component"*
- `it`/`test` names describe expected behaviour: *"calls onAddTask with the entered title when the form is submitted"*

---

## File & Folder Structure (Frontend)

```
frontend/src/
  components/           ← one .tsx file per component
    __tests__/          ← one .test.tsx per component, co-located here
  hooks/                ← custom hooks (e.g. useTaskApi.ts)
  types.ts              ← ALL shared TypeScript interfaces — keep in sync with .NET models
  App.tsx               ← root component, orchestrates state and API calls
  App.css               ← global styles
  index.tsx             ← entry point — do not add logic here
```
