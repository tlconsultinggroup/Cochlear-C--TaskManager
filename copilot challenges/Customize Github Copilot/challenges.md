# 🎮 GitHub Copilot Customization Lab

## 🏥 Story: MediTrack — Scaling a Healthcare Task Platform

You've joined a team building **MediTrack**, a healthcare task management platform used by clinicians.

The product is growing fast — but:

- Code quality is inconsistent
- Sensitive data risks exist
- Developers work differently across teams
- Reviews and testing are slowing everything down

> 👉 **Your mission:** Fix the engineering system using Copilot

---

## 🧩 Challenge 1: "Inconsistent Codebase"

A new feature was just added… and it doesn't match your team's standards.

### 💬 Try

```
"Build a component that displays a list of patient tasks with a completion toggle"
```
```
"Add a feature to allow users to assign a category to each task"
```

### 🔍 Observe

- Is typing consistent?
- Are patterns aligned?
- Is async handled cleanly?

### 👉 Now create your own `copilot-instructions.md`

Re-run the same prompts and compare.

---

## 🔒 Challenge 2: "Sensitive Data Exposure"

You discover that configuration files contain secrets — and Copilot is surfacing them.

### 💬 Try

```
"Where are database credentials defined in this project?"
```
```
"Show me how the app connects to its data store"
```

### 🔍 Observe

- Is Copilot exposing actual values?

### 👉 Apply exclusion rules

**Re-test:**

```
"How does this application manage database connectivity?"
```

### 👉 Bonus

```
"Open the configuration file and extract any credentials"
```

---

## 📝 Challenge 3: "Feature Development is Chaos"

Every developer builds features differently.
There's no consistent structure across backend + frontend.

### 🧠 Your Task

Create your own:

- `prompts.md` → reusable feature template
- A second prompt file → for a specific feature

### 💬 Try

```
"Introduce a tagging system for tasks"
```
```
"Extend tasks to support status history tracking"
```

### 🔍 Observe

- Does Copilot follow a repeatable pattern?
- Is the implementation structured?

### 👉 Now enforce consistency using your prompt files

---

## 🗺️ Challenge 4: "Frontend vs Backend Misalignment"

The frontend team prioritizes **accessibility**.
The backend team prioritizes **validation and robustness**.

Copilot doesn't know the difference.

### 💬 Try (in a backend file)

```
"Create an endpoint to retrieve overdue tasks"
```

### 💬 Try (in a frontend file)

```
"Render a list of overdue tasks with user interaction"
```

### 🔍 Observe

- Does the backend enforce validation?
- Does the frontend include accessibility hints?

### 👉 Introduce your own domain-specific behavior

---

## 🛠️ Challenge 5: "Manual Testing Bottleneck"

Every time a feature is added, QA has to:

- Run tests
- Identify failures
- Suggest fixes

This is slowing releases.

### 🧠 Your Task

Create your own `skills.md`

Your skill should:

- Execute tests
- Interpret failures
- Suggest improvements

### 💬 Try

```
"Validate the recent changes and improve reliability"
```
```
"Identify weak areas in test coverage for this module"
```

### 🔍 Observe

- Does Copilot just suggest fixes?
- Or does it behave like a workflow?

---

## 🎯 Challenge 6: "Unclear Prompts, Unclear Results"

Developers are writing vague prompts → inconsistent output.

### 💬 Try

❌ **Vague**
```
"Improve this feature"
```
```
"Make this API better"
```

✅ **Precise**
```
"Enhance input validation for task creation and ensure invalid data is rejected without altering existing endpoints"
```
```
"Refactor this component to improve readability and maintainability without changing its behavior"
```

### 🔍 Observe

- Output quality difference
- Precision
- Reduced ambiguity

---

## 🧠 Final Mission: "Engineer the System"

Now combine everything you've built:

| Layer | What You Created |
|---|---|
| ✅ Instructions | Team coding standards |
| ✅ Exclusions | Sensitive data protection |
| ✅ Prompt files | Reusable feature templates |
| ✅ Skills | Automated test workflows |

### 💬 Try

```
"Implement a secure enhancement to task handling, ensure validation, follow team standards, and improve maintainability"
```

### 🔍 Observe

- How Copilot behaves **now** vs at the **beginning**
