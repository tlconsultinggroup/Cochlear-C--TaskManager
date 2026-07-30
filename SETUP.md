# TaskManager-Copilot-Lab — Local Setup Guide

Simple steps to clone the repo, install dependencies, and run the app locally.

- **Backend:** ASP.NET Core (C#)
- **Frontend:** React + TypeScript

---

## 1) Prerequisites

Install these tools:

| Tool | Required Version |
|---|---|
| Git | Latest |
| .NET SDK | 9.0+ |
| Node.js | 20+ (includes npm) |

Verify installations:

```bash
git --version
dotnet --version
node --version
npm --version
```

---

## 2) Clone the Repository

```bash
git clone https://github.com/tlconsultinggroup/TaskManager-Copilot-Lab.git
cd TaskManager-Copilot-Lab
```

---

## 3) Run the Backend (API)

```bash
cd backend/TaskApi
dotnet restore
dotnet run --launch-profile http
```

- Backend URL: `http://localhost:5001`
- Health check: `http://localhost:5001/health`

Keep this terminal running.

---

## 4) Run the Frontend (React)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

- Frontend URL: `http://localhost:3000`

Keep this terminal running.

---

## 5) Use the App

With both running, open `http://localhost:3000` and add, complete, or delete tasks.

---

## 6) Troubleshooting

- **`dotnet` not found:** Install .NET 9 SDK and restart your terminal.
- **`npm install` fails:** Confirm Node.js is 20+, then delete `node_modules` and `package-lock.json` and run `npm install` again.
- **Frontend can't reach backend:** Make sure the backend is running at `http://localhost:5001`.
- **Port already in use:** Stop the process using port `5001` or `3000`, then restart.
