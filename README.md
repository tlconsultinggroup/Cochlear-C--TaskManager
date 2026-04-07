# Cochlear Task Manager

A full-stack Task Management application built with an **ASP.NET Core (C#) REST API** backend and a **React TypeScript** frontend.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | ASP.NET Core 9 (C#), REST API, In-Memory Storage |
| **Frontend** | React 19, TypeScript, Material UI |
| **Testing** | xUnit (C#), Jest, React Testing Library, Playwright (E2E) |
| **CI/CD** | GitHub Actions |
| **Dev Tools** | VS Code, .NET 9 SDK, Node.js 20 |

---

## ✨ Core Features

- ✅ **Add Tasks** — Create tasks with a title via text input or voice
- ✅ **View Tasks** — See all tasks in a clean, responsive list
- ✅ **Toggle Completion** — Mark tasks as complete or pending with a checkbox
- ✅ **Delete Tasks** — Remove individual tasks instantly
- ✅ **Voice Input** — Add tasks using your microphone (Chrome, Edge, Safari)
- ✅ **Real-time Feedback** — Loading states and user-friendly error messages
- ✅ **Health Check** — Backend exposes a `/health` endpoint for monitoring

---

## 🗂️ Project Structure

```
├── backend/
│   └── TaskApi/                  # ASP.NET Core Web API (C#)
│       ├── Controllers/
│       │   └── TasksController.cs
│       ├── Models/
│       │   └── Task.cs
│       ├── Services/
│       │   ├── ITaskService.cs
│       │   └── TaskService.cs
│       ├── Program.cs
│       └── TaskApi.csproj
├── frontend/                     # React TypeScript SPA
│   └── src/
│       ├── components/
│       │   ├── TaskInput.tsx
│       │   ├── TaskList.tsx
│       │   └── VoiceInput.tsx
│       ├── App.tsx
│       └── types.ts
└── .github/
    └── workflows/                # GitHub Actions CI/CD
```

---

## 🛠️ Prerequisites

| Tool | Version | Link |
|---|---|---|
| .NET SDK | 9.0 or higher | [Download](https://dotnet.microsoft.com/download) |
| Node.js | 20.0 or higher | [Download](https://nodejs.org/) |
| npm | comes with Node.js | — |
| Git | latest | [Download](https://git-scm.com/) |

**VS Code Extensions (Recommended):**
- C# Dev Kit
- ESLint
- Prettier

---

## ▶️ Getting Started

> **Important:** Both the backend and frontend servers must be running for the application to work.

### Backend (ASP.NET Core)

1. Navigate to the backend project:
   ```bash
   cd backend/TaskApi
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Start the development server:
   ```bash
   dotnet run --launch-profile http
   ```

The backend will run on **http://localhost:5001**

Verify it's running: http://localhost:5001/health

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on **http://localhost:3000**

The React dev server proxies `/api` requests to the backend automatically.

---

## 📜 Available Scripts

### Backend (C#)
| Command | Description |
|---|---|
| `dotnet run --launch-profile http` | Start the API on port 5001 |
| `dotnet build` | Build the project |
| `dotnet test` | Run xUnit tests |
| `dotnet publish` | Publish for deployment |

### Frontend (React)
| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm test` | Run Jest unit tests |
| `npm run build` | Build for production |
| `npm run test:e2e` | Run Playwright E2E tests |

## Development Progress

Here's a chronological list of development steps and issues addressed:

1. Initial Setup
   - Created a full-stack TypeScript application with React frontend and Express backend
   - Set up basic project structure and dependencies
   - Implemented basic API endpoint communication

2. Task Management Implementation
   - Added Task interface and API endpoints for CRUD operations
   - Implemented frontend components (TaskInput and TaskList)
   - Set up proper TypeScript types

3. Troubleshooting & Fixes
   - Fixed TypeScript module issues with types.ts
   - Resolved backend server startup issues
   - Added proper error handling and loading states
   - Fixed task creation functionality
   - Improved backend server binding for better network compatibility (binds to 0.0.0.0)
   - Added comprehensive error handling for server startup failures
   - Added health check endpoint for monitoring server status

4. Features Implemented
   - Add new tasks
   - Display list of tasks
   - Toggle task completion status
   - Delete tasks
   - Real-time error feedback
   - Loading states for better UX
   - **Voice input capability** (see [Voice Input Guide](docs/VOICE_INPUT_GUIDE.md))
     - Add tasks using voice commands
     - Support for English language
     - 200 character limit
     - Confirmation before task creation
     - Works on mobile and desktop devices

## 🔌 API Documentation

Base URL: `http://localhost:5001`

### Endpoints

#### `GET /health`
Health check endpoint.
```json
{ "status": "ok", "timestamp": "2026-04-02T00:00:00Z" }
```

#### `GET /api/tasks`
Returns all tasks.
```json
[{ "id": 1, "title": "My task", "completed": false, "createdAt": "2026-04-02T..." }]
```

#### `GET /api/tasks/:id`
Returns a single task. Returns `404` if not found.

#### `POST /api/tasks`
Creates a new task.
```json
// Request
{ "title": "My new task" }

// Response 201
{ "id": 2, "title": "My new task", "completed": false, "createdAt": "2026-04-02T..." }
```

#### `PATCH /api/tasks/:id`
Toggles the completion status of a task. Returns `404` if not found.

#### `PUT /api/tasks/:id`
Updates the `completed` field of a task.
```json
// Request
{ "completed": true }
```

#### `DELETE /api/tasks/:id`
Deletes a task. Returns `404` if not found.
```json
{ "message": "Task deleted successfully" }
```

## Component Documentation

### TaskInput
- Location: `frontend/src/components/TaskInput.tsx`
- Props:
```typescript
interface TaskInputProps {
    onAddTask: (title: string) => Promise<void>;
}
```
- Description: A form component that allows users to add new tasks
- Features:
  - Input validation (non-empty title)
  - Clears input after successful submission
  - Error handling for failed submissions

### TaskList
- Location: `frontend/src/components/TaskList.tsx`
- Props:
```typescript
interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: number) => Promise<void>;
    onDeleteTask: (id: number) => Promise<void>;
}
```
- Description: Displays the list of tasks with toggle and delete functionality
- Features:
  - Checkbox for task completion
  - Delete button for task removal
  - Visual indication of completed tasks

## Error Handling

The application implements comprehensive error handling:

### Frontend
- Loading states during API calls
- User-friendly error messages
- Network error handling
- Form validation feedback

### Backend
- Input validation
- Error status codes
- Error response messages
- CORS error handling

## TypeScript Types

### Task Interface
Location: `frontend/src/types.ts` and `backend/src/index.ts`
```typescript
interface Task {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
}
```

## Code Style and Best Practices

- TypeScript strict mode enabled
- React functional components with hooks
- Async/await for API calls
- Error boundaries for React components
- Proper TypeScript type definitions
- Consistent file and component naming
- CSS BEM naming convention for styles

## Testing

This project follows the **Test Pyramid** approach for comprehensive testing at different levels. See [Testing Strategy](docs/TESTING_STRATEGY.md) for detailed information.

### Quick Start

#### Run All Tests
```bash
# Backend
cd backend
npm test              # Unit tests (Jest)
npm run test:e2e      # Integration/API tests (Playwright)

# Frontend
cd frontend
npm test              # Unit tests (Jest)
npm run test:e2e      # E2E tests (Playwright)
```

#### Test Distribution

Following the test pyramid:
- **Unit Tests** (Many, Fast): 23 tests covering components and API logic
- **Integration Tests** (Some, Medium): 11 tests for API contracts
- **E2E Tests** (Few, Slow): 10 tests for critical user flows

### E2E Testing with Playwright

First-time setup:
```bash
cd frontend
npm run playwright:install
```

Run E2E tests:
```bash
# Run tests
npm run test:e2e

# Run with UI mode (interactive debugging)
npm run test:e2e:ui

# Run in headed mode (watch browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

**Important**: E2E tests require both backend and frontend servers to be running. The test configuration will start them automatically in development mode.

### Test Guidelines

- Write **unit tests** for individual components and functions
- Write **integration tests** for API endpoints and service interactions  
- Write **E2E tests** only for critical user journeys
- Use proper wait conditions instead of arbitrary timeouts
- Follow the test pyramid to keep tests fast and maintainable

See [Testing Strategy](docs/TESTING_STRATEGY.md) for best practices and detailed guidelines.

## 🚢 Deployment

### Backend (ASP.NET Core)
```bash
cd backend/TaskApi
dotnet publish -c Release -o ./publish
```
Deploy the `./publish` folder to Azure App Service, a Docker container, or any .NET-compatible host.

### Frontend (React)
```bash
cd frontend
npm run build
```
Deploy the `build/` folder to Azure Static Web Apps, Netlify, Vercel, or any static host.

## 🔧 Troubleshooting

### "Failed to fetch" Error

1. **Make sure the backend server is running:**
   ```bash
   cd backend/TaskApi
   dotnet run --launch-profile http
   ```

2. **Verify the backend is accessible:** Visit http://localhost:5001/health — you should see:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

3. **Check if the port is already in use:**
   ```bash
   lsof -i :5001
   ```

### Common Issues

| Problem | Solution |
|---|---|
| Backend won't start | Check if port 5001 is in use. Run `dotnet restore` first. |
| Frontend can't connect | Verify backend is on port 5001 and `setupProxy.js` targets it |
| .NET SDK not found | Install .NET 9 SDK from https://dotnet.microsoft.com/download |
| Voice input not working | Use Chrome/Edge/Safari and grant microphone permission |

## License

This project is licensed under the MIT License - see the LICENSE file for details
