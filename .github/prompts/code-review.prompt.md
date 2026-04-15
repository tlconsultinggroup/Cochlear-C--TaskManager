# Code Review — MedTask

Use this prompt to perform a structured code review of any file or set of files in the MedTask repository.
Copilot will act as a **senior engineer** reviewing for correctness, security, maintainability, and consistency with the codebase standards defined in `.github/copilot-instructions.md`.

---

## Instructions for Copilot

You are acting as a **senior full-stack engineer** performing a code review on the MedTask application.
Review the selected files (or the files changed in the current branch if none are specified).

Work through every checklist section below. For each finding:
1. State the **file and line number** (or approximate location)
2. Assign a severity: 🔴 **Critical** · 🟠 **High** · 🟡 **Medium** · 🔵 **Low** · 💡 **Suggestion**
3. Explain **why** it is a problem
4. Provide a **concrete fix** (code snippet preferred)

After listing all findings, produce a **summary table** and then **automatically fix all Critical and High findings**.

---

## Checklist: TypeScript / React (Frontend)

- [ ] No `any` types — every value has an explicit type
- [ ] No `// @ts-ignore` or `// @ts-nocheck` suppressions
- [ ] All async functions return typed Promises (e.g. `Promise<Task[]>`)
- [ ] All components use `React.FC<PropsInterface>` with a named interface
- [ ] `useEffect` dependency arrays are complete and accurate (no suppressed exhaustive-deps warnings)
- [ ] `useCallback` wraps every function passed as a prop
- [ ] Loading **and** error states are handled for every API call
- [ ] `response.ok` is checked before calling `.json()` on a fetch response
- [ ] No `console.log` left in code
- [ ] List items use stable `key` props (never array index)
- [ ] Every interactive element (`button`, `input`, `select`) has an `aria-label` or visible label

## Checklist: C# / .NET (Backend)

- [ ] All reference-type properties and return types use nullable annotations (`?`)
- [ ] All public methods have XML doc comments (`/// <summary>`)
- [ ] File-scoped namespaces used (no namespace `{ }` blocks)
- [ ] No business logic inside controller actions
- [ ] All error responses return `new { error = "message" }` — never a plain string
- [ ] `CreatedAtAction` used for POST responses (not `Ok`)
- [ ] No service is instantiated with `new` inside a controller — DI only
- [ ] Guard clauses return `NotFound` / `BadRequest` — no silent swallowing of errors

## Checklist: Security

- [ ] No sensitive data (tokens, passwords, connection strings) hardcoded or logged
- [ ] All user-supplied strings are treated as untrusted (no direct interpolation into error messages that reach the client)
- [ ] CORS policy is not open to `*` in production settings
- [ ] No exposed stack traces in API responses
- [ ] Input length/format is validated before processing

## Checklist: Tests

- [ ] Every new public method/component has at least one unit test
- [ ] Tests use `getByRole` / `getByLabelText` — no raw CSS selectors or class queries
- [ ] No `.only` or `.skip` left in test files
- [ ] Mocks are reset between tests (`afterEach` / `beforeEach`)
- [ ] Backend tests cover: happy path, not-found (404), invalid-input (400)

## Checklist: General Quality

- [ ] No dead code (unused imports, variables, methods)
- [ ] No TODO comments left without a tracking issue reference
- [ ] Naming follows conventions: PascalCase for C# classes/components, camelCase for variables, kebab-case for routes
- [ ] No magic numbers — use named constants
- [ ] Error messages are user-friendly (no internal exception details exposed)

---

## Output format

```
## Code Review Findings

### 🔴 Critical
1. [File:Line] — [Description] — Fix: [code snippet]

### 🟠 High
...

### 🟡 Medium
...

### 🔵 Low / 💡 Suggestions
...

---
## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🔵 Low | N |
| 💡 Suggestions | N |

---
## Fixes Applied
[List every Critical and High fix made, with before/after snippets]
```
