# TaskManager-Copilot-Lab — Local Setup Guide

This guide walks you through everything from cloning the repository to running the full application locally:

- **Backend:** ASP.NET Core (C#)
- **Frontend:** React + TypeScript

It includes:
- ✅ Cross-platform setup (**Windows/macOS/Linux**)
- ✅ **VS Code** setup
- ✅ **Visual Studio 2022** lab setup
- ✅ GitHub Copilot enablement checks

---

## 1) Prerequisites

Install these tools before starting:

| Tool | Required Version | Notes |
|---|---|---|
| Git | Latest | For cloning the repository |
| .NET SDK | **9.0+** | Required for backend API |
| Node.js | **20+** | Required for frontend |
| npm | Comes with Node.js | Package manager |
| (Optional) Visual Studio 2022 | 17.8+ recommended | Best experience for C# labs |
| (Optional) VS Code | Latest | Cross-platform editor |

### Verify installations

Run these commands in a terminal:

```bash
git --version
dotnet --version
node --version
npm --version
```

If any command fails, install that dependency first.

---

## 2) Clone the Repository

```bash
git clone https://github.com/tlconsultinggroup/TaskManager-Copilot-Lab.git
cd TaskManager-Copilot-Lab
```

---

## 3) Repository Structure (what you’ll run)

- `backend/TaskApi` → ASP.NET Core API
- `frontend` → React TypeScript app

---

## 4) Backend Setup (C# API)

From the repository root:

```bash
cd backend/TaskApi
dotnet restore
dotnet run --launch-profile http
```

Expected backend URL:
- `http://localhost:5001`

Health check:
- Open `http://localhost:5001/health` in your browser

> Keep this terminal running.

---

## 5) Frontend Setup (React)

Open a **new terminal**, from repo root:

```bash
cd frontend
npm install
npm start
```

Expected frontend URL:
- `http://localhost:3000` (some environments may use `3001`)

The frontend proxies API requests to the backend during development.

> Keep this terminal running too.

---

## 6) Run the App Locally

With both services running:
1. Open frontend URL (`http://localhost:3000`)
2. Add, complete, and delete tasks
3. Confirm backend calls succeed (no API errors in browser dev tools)

---

## 7) VS Code Setup (Cross-Platform Labs)

### Recommended extensions
- GitHub Copilot
- GitHub Copilot Chat
- C# Dev Kit
- ESLint
- Prettier (optional)

### Open the project
```bash
code .
```

### Suggested workflow for labs
1. Open two terminals in VS Code:
   - Terminal A: backend (`backend/TaskApi`)
   - Terminal B: frontend (`frontend`)
2. Start backend and frontend (commands from sections 4 & 5)
3. Use Copilot Chat prompts like:
   - “Explain this codebase”
   - “Add a due date field to tasks”
   - “Generate tests for task creation endpoint”

---

## 8) Visual Studio 2022 Setup (Labs)

> Use Visual Studio primarily for backend/C# work.  
> Use VS Code (or a second editor) for frontend TypeScript/React, unless your team standardizes otherwise.

### Install Visual Studio workloads/components
In **Visual Studio Installer**, ensure:
- **ASP.NET and web development** workload
- Latest **.NET 9 SDK** available to Visual Studio
- GitHub Copilot extension (if not already included)

### Open backend project
1. Launch Visual Studio 2022
2. **File → Open → Project/Solution**
3. Open:
   - `backend/TaskApi/TaskApi.csproj`  
   (or solution file if your lab provides one)

### Restore and run backend in Visual Studio
1. Build once (`Build → Build Solution`)
2. Run with profile `http` (or default profile configured)
3. Confirm `http://localhost:5001/health` responds

### Visual Studio + frontend lab flow
Because frontend is React/TypeScript:
1. Keep backend running from Visual Studio
2. Open terminal (VS terminal or external)
3. Run frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
4. Test full-stack behavior in browser

### Copilot in Visual Studio lab checklist
- Sign in with GitHub account
- Confirm Copilot is enabled
- Test inline suggestion:
  1. Open a C# file (e.g., controller/service)
  2. Add comment like `// create method to validate task title`
  3. Press Enter and verify suggestion appears

---

## 9) GitHub Copilot Access Check (All IDEs)

1. Sign in to GitHub from your IDE
2. Ensure Copilot seat/license is assigned in GitHub settings
3. Verify Copilot Chat opens successfully
4. Confirm inline completions appear in `.cs`, `.ts`, or `.tsx` files

---

## 10) Troubleshooting

### `dotnet` command not found
- Install .NET 9 SDK and restart terminal/IDE

### `npm install` fails
- Check Node.js version (`node --version`) is 20+
- Delete `node_modules` and retry:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Frontend cannot reach backend
- Confirm backend is running at `http://localhost:5001`
- Confirm frontend terminal has no startup errors
- Check proxy configuration in `frontend` docs/config if needed

### Port already in use
- Stop existing process on port `5001` or `3000`
- Restart both apps

### Copilot not showing suggestions
- Re-authenticate GitHub in IDE
- Check Copilot subscription/seat
- Confirm extension is enabled and updated

---

## 11) Quick Start (copy/paste)

From repo root, run in two terminals:

**Terminal 1 (Backend):**
```bash
cd backend/TaskApi
dotnet restore
dotnet run --launch-profile http
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

Open:
- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5001/health`
