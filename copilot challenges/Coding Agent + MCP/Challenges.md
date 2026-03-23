# Coding Agent + MCP: Challenge Scenarios

Explore advanced, real-world challenges that showcase the power of Copilot Coding Agent with Model Context Protocol (MCP) integrations.

---

## 1. Implement a Feature from a Jira Ticket

**Prompt:**
```
Implement feature from Jira ticket XYZ
```

**How the Agent Works:**
- Reads the Jira ticket using MCP integration
- Understands requirements and acceptance criteria
- Writes the necessary code and tests
- Links the pull request to the Jira ticket automatically
- Updates the ticket status when the PR is merged

---

## 2. MCP-Powered Workflows (Advanced Use Cases)

With MCP and tools like Confluence, Jira, GitHub, and more, the Coding Agent can:

- **Auto-link PRs to Jira/Confluence:**
  - "Link this PR to Jira ticket ABC-123 and update the ticket with a summary."
- **Automate Documentation:**
  - "Fetch requirements from Confluence page 456 and generate API docs."
- **Cross-system Traceability:**
  - "Show all code changes related to Jira ticket XYZ across all repos."
- **Automated Test Generation:**
  - "Generate unit and e2e tests for the feature described in Jira ticket XYZ."
- **Release Coordination:**
  - "Create a release note draft from all tickets closed in this sprint."

---

## 3. Example End-to-End Challenge

**Scenario:**
> "A new requirement arrives in Jira: Add a category filter dropdown to the task manager."

**Agent Actions:**
1. Reads the Jira ticket and extracts requirements
2. Updates the codebase to add the dropdown filter
3. Generates and attaches unit/e2e tests
4. Opens a PR and links it to the Jira ticket
5. Notifies the team in Slack/Teams (if integrated)
6. Updates the Jira ticket status to "In Review"

---

## 4. More Challenge Ideas

- **Bug Triage:**
  - "Investigate and fix all open bugs labeled 'urgent' in Jira."
- **Security Audit:**
  - "Scan the codebase for security issues and create Jira tickets for each finding."
- **Automated Refactoring:**
  - "Refactor all legacy code modules linked to Jira epic DEF-789."
- **Knowledge Base Sync:**
  - "Sync API changes to Confluence documentation automatically."

---

Use these challenges to demonstrate, test, or inspire the next generation of AI-powered developer workflows with Copilot Coding Agent and MCP integrations!