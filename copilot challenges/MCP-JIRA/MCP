# How to Create and Use an MCP Server for JIRA

## 1. What is MCP for JIRA?
MCP (Model Context Protocol) allows Copilot and other AI agents to interact with external systems like JIRA via a standardized API. With an MCP JIRA server, Copilot can:
- Read JIRA tickets
- Create/update issues
- Link PRs to tickets
- Transition ticket status

---

## 2. Prerequisites
- Access to your JIRA Cloud instance (admin rights recommended)
- A JIRA API token (see below)
- Node.js (for running the MCP server)
- VS Code with Copilot Chat (Agent Mode)

---

## 3. Create a JIRA API Token
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it (e.g., "MCP Copilot") and click "Create"
4. Copy the token (you won't see it again)

---

## 4. Set Up the MCP JIRA Server

### Option 1: Use an Open Source MCP JIRA Adapter
- Check for open source MCP JIRA adapters (e.g., [microsoft/mcp-jira-adapter](https://github.com/microsoft/mcp-jira-adapter))
- Clone the repo:
  ```sh
  git clone https://github.com/microsoft/mcp-jira-adapter.git
  cd mcp-jira-adapter
  npm install
  ```
- Configure your JIRA credentials in `.env` or `config.json`:
  ```env
  JIRA_BASE_URL=https://your-domain.atlassian.net
  JIRA_EMAIL=your.email@domain.com
  JIRA_API_TOKEN=your-api-token-here
  ```
- Start the server:
  ```sh
  npm start
  # or
  node index.js
  ```
- The server will run on a port (e.g., http://localhost:4000)

### Option 2: Build Your Own MCP Adapter
- Follow the MCP protocol spec: https://github.com/microsoft/model-context-protocol
- Implement endpoints for JIRA issue search, create, update, transition, etc.

---

## 5. Configure VS Code to Use the MCP JIRA Server
- Open (or create) `.vscode/mcp.json` in your project root:
  ```json
  {
    "servers": {
      "jira": {
        "type": "http",
        "url": "http://localhost:4000/mcp/",
        "headers": {
          "Authorization": "Bearer YOUR_JIRA_API_TOKEN"
        }
      }
    }
  }
  ```
- Replace `YOUR_JIRA_API_TOKEN` with your real token (or use basic auth if required)

---

## 6. Using MCP JIRA in Copilot Chat
- Open Copilot Chat in Agent Mode
- Try prompts like:
  - `List all open Jira tickets assigned to me`
  - `Create a Jira ticket titled "Add category filter" with description ...`
  - `Update Jira ticket XYZ-123 to status In Review`
  - `Link this PR to Jira ticket XYZ-123`

---

## 7. Troubleshooting
- Ensure your MCP JIRA server is running and accessible from your machine
- Check that your API token has the right permissions
- Review logs from the MCP server for errors
- Make sure your `.vscode/mcp.json` is correctly configured

---

## 8. Resources
- [JIRA API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Model Context Protocol Spec](https://github.com/microsoft/model-context-protocol)
- [Example MCP JIRA Adapter](https://github.com/microsoft/mcp-jira-adapter)
