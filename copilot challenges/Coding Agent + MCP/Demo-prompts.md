# Copilot Coding Agent Demo Prompts

## Smart Filtering System

### Filter by Categories

**Feature:**  
Add a drop down option to filter tasks by categories of work, personal and urgent.

**Ready-to-Use Prompt:**  
```
Add a drop down option to filter tasks by categories
```

---

## Demo: Create an Issue for the Feature

### 1. Prompt Copilot Chat:
   ```
   Create a GitHub issue titled "Add category filter dropdown" with the following description:
   "Implement a dropdown in the frontend to filter tasks by categories: work, personal, urgent."
   Assign this issue to the Copilot Coding Agent.
   ```

### 2. Create an issue in Github to Generate Unit Tests for the category filter dropdown feature:
   ```
   Create a unit test in [your framework, e.g. React Testing Library or Jest] for the category filter dropdown feature.
   Add the test to the same issue.
   ```

---

### 3. Assign the Pull Request for Review
After the Coding Agent opens a PR, prompt Copilot Chat:
  ```
  Assign the pull request for the category filter dropdown feature to Copilot for review.
  ```
---

### 4. Enforce Consistent Labeling & Status Tracking

**Goal:** Audit all open issues and apply consistent labels automatically based on their content.

**How it works:** Copilot iterates through every open issue via MCP and labels them all in one prompt — no manual triage needed.

**Prompt Copilot Chat:**
```
Review all open issues in tlconsultinggroup/Cochlear-C--TaskManager.
For each issue, apply appropriate labels from: bug, feature, enhancement,
urgent, in-progress, needs-review. Base the label on the issue title and description.
```

**Can this be automated?** ✅ Yes — two ways:

- **GitHub Actions Auto-Labeler** (event-driven): Uses `.github/labeler.yml` to apply labels automatically when a PR or issue is created based on file paths or keywords.
- **Scheduled Weekly Audit** (cron job): A GitHub Actions workflow runs every Monday to scan for unlabelled issues and apply labels automatically.

---

### 5. Update Issue Labels

**Goal:** Add or remove labels on a specific issue without touching the GitHub UI.

**Prompt Copilot Chat:**
```
Update the labels on issue #[number] — add "in-progress" and remove "needs-triage".
```

---

### 6. 💬 Add a Comment to an Issue

**Goal:** Post an automated status update or PR summary comment to a GitHub issue.

**Prompt Copilot Chat:**
```
Add a comment to issue #[number] saying:
"The category filter dropdown has been implemented and is ready for review in PR #[pr-number]."
```

**Can this be automated?** ✅ Yes — GitHub Actions can trigger auto-comments on events:

| Trigger | Automated Comment |
|---|---|
| PR opened | "A PR has been opened for this issue" |
| PR merged | "This issue has been resolved and deployed" |
| Tests fail | "CI failed — see run #XYZ for details" |
| Issue assigned to Copilot | "Copilot agent has picked up this issue" |

---

### 7. Assign Issue to GitHub Copilot

**Goal:** Hand off an issue to the Copilot Coding Agent for autonomous implementation.

**Prompt Copilot Chat:**
```
Assign issue #[number] to the GitHub Copilot coding agent for implementation.
```

**How does Copilot name the branch?**

When assigned, Copilot auto-generates a branch name like:
```
copilot/42-add-category-filter-dropdown
```

**Can you control the branch naming convention?** ✅ Yes — via `.github/copilot-instructions.md`:

```markdown
## Branch Naming Convention
- Features:  feat/<issue-number>-<short-description>
- Bug fixes: fix/<issue-number>-<short-description>
- Docs:      docs/<issue-number>-<short-description>

Examples:
- feat/42-add-category-filter
- fix/17-task-delete-error
```

Copilot reads this file before starting any task and follows the instructions.

---

## Feature Development

- **Automated Documentation:**  
  ```
  Generate API documentation for the backend endpoints and add it to docs/API.md.
  ```

- **End-to-End Test Generation:**  
  ```
  Create a Playwright end-to-end test for the category filter dropdown.
  ```

- **Code Refactoring:**  
  ```
  Refactor the task filtering logic to improve performance and readability.
  ```

- **Error Handling Improvements:**  
  ```
  Add error handling for invalid category selections in the dropdown.
  ```

- **Workflow Automation:**  
  ```
  Set up a GitHub Actions workflow to run all tests and report status on PRs.
  ```

- **Release Notes Generation:**  
  ```
  Generate release notes for the latest set of merged PRs.
  ```

---

Use these prompts in Copilot Chat or as GitHub issues to demonstrate the full power of the Copilot Coding Agent!
