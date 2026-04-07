# GitHub MCP — Setup Guide

## 🧠 What is GitHub MCP?

GitHub MCP (Model Context Protocol) lets tools like **GitHub Copilot** and AI agents securely interact with GitHub — repos, issues, pull requests, branches, and more — using a structured, standardised protocol.

Instead of manually navigating the GitHub UI, you can ask Copilot things like:
- `"List all open issues in this repo"`
- `"Create a pull request for my feature branch"`
- `"Assign issue #12 to Copilot"`

And Copilot will do it — directly through MCP.

---

## ✅ Prerequisites

Before you start, make sure you have the following installed and ready:

| Requirement | Version | Link |
|---|---|---|
| Visual Studio Code | Latest | [Download](https://code.visualstudio.com/) |
| GitHub CLI (`gh`) | Latest | [Download](https://cli.github.com/) |
| Node.js | v18 or higher | [Download](https://nodejs.org/) |
| A GitHub account | — | [GitHub](https://github.com) |
| GitHub Copilot extension | Latest | VS Code Marketplace |

---

## 🚀 Step 1: Install the GitHub MCP Server

Open the terminal in VS Code and run:

```bash
npm install -g @modelcontextprotocol/server-github
```

Verify it installed correctly:
```bash
npx @modelcontextprotocol/server-github --version
```

---

## 🔐 Step 2: Authenticate with GitHub

Run the GitHub CLI login command:

```bash
gh auth login
```

Follow the interactive prompts:

```
? Where do you use GitHub?                  → GitHub.com
? What is your preferred protocol           → HTTPS
? How would you like to authenticate?       → Login with a web browser
```

A one-time code will appear in the terminal — a browser window will open. Paste the code and authorise.

Verify authentication was successful:
```bash
gh auth status
```

You should see:
```
✓ Logged in to github.com as YOUR_USERNAME
```

---

## ⚙️ Step 3: Configure MCP in VS Code

Create (or edit) the MCP configuration file at the **workspace level**:

```
.vscode/mcp.json
```

Add the following:

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    }
  }
}
```

> 💡 This tells VS Code which MCP servers to use and how to launch them.
> Keep `.vscode/` in `.gitignore` to avoid committing any tokens.

---

## 🧩 Step 4: Enable MCP in Copilot / Agent Mode

### Check MCP is enabled in VS Code settings

1. Open VS Code Settings:
   - **Mac:** `Cmd + ,`
   - **Windows/Linux:** `Ctrl + ,`

2. Search for: `chat.mcp`

3. Confirm both settings are enabled:

| Setting | Required Value |
|---|---|
| `chat.mcp.enabled` | ✅ `true` |
| `chat.mcp.discovery.enabled` | ✅ `true` |

### Or add directly to `settings.json`

Open `settings.json` via `Cmd/Ctrl + Shift + P` → **"Open User Settings (JSON)"** and add:

```json
{
  "chat.mcp.enabled": true,
  "chat.mcp.discovery.enabled": true
}
```

---

## ✅ Step 5: Verify It's Working

1. Open **Copilot Chat** (`Cmd/Ctrl + Shift + I`)
2. Switch to **Agent Mode** (click the mode dropdown next to the chat input)
3. Type:

```
What MCP tools do you have available?
```

Copilot will list available GitHub tools such as:
- `list_issues`
- `create_issue`
- `create_pull_request`
- `get_file_contents`
- `list_repositories`

---

## 💬 Example Prompts to Try

```
List all open issues in my repo
```
```
Create a GitHub issue titled "Add dark mode support"
```
```
Assign issue #5 to the Copilot coding agent
```
```
Create a pull request from my feature branch to main
```
```
Show me the latest commits on the main branch
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| MCP tools not appearing in Copilot | Restart VS Code after editing `mcp.json` |
| `gh auth` fails | Run `gh auth logout` then `gh auth login` again |
| `npx` command not found | Ensure Node.js v18+ is installed and in your PATH |
| 403 Forbidden errors | Re-run `gh auth login` and ensure SSO is authorised for your org |
| Changes to `mcp.json` not picked up | `Cmd/Ctrl + Shift + P` → "Reload Window" |
