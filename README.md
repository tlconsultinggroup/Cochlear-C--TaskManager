# Full Stack TypeScript Application

This is a full-stack application with a TypeScript Express backend and React TypeScript frontend.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/) for version control

Required knowledge:
- Basic understanding of TypeScript
- Familiarity with React
- Understanding of Express.js
- Knowledge of RESTful APIs

IDE Requirements:
- VS Code (recommended) with the following extensions:
  - ESLint
  - Prettier (for code formatting)
  - TypeScript support

## Project Structure

- `backend/` - Express TypeScript backend
- `frontend/` - React TypeScript frontend

## Getting Started

**Important**: Both the backend and frontend servers need to be running for the application to work properly.

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:5000

You can verify the backend is running by visiting http://localhost:5000/health

### Frontend

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

The frontend will run on http://localhost:3000

## Development

- Backend: The TypeScript Express server is configured with hot-reloading using ts-node.
- Frontend: Create React App with TypeScript template provides hot-reloading out of the box.

## Available Scripts

### Backend
- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm start` - Run the built code
- `npm run watch` - Run TypeScript compiler in watch mode

### Frontend
- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

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

## API Documentation

### Endpoints

#### GET /health
- Description: Health check endpoint to verify server is running
- Response:
```typescript
{
  status: "ok",
  timestamp: string (ISO 8601 date)
}
```

#### GET /api/tasks
- Description: Retrieve all tasks
- Response: Array of Task objects
```typescript
[
  {
    id: number,
    title: string,
    completed: boolean,
    createdAt: Date
  }
]
```

#### GET /api/tasks/:id
- Description: Retrieve a specific task by ID
- Parameters:
  - id: Task ID (number)
- Response: Task object
- Error: 404 if task not found

#### POST /api/tasks
- Description: Create a new task
- Request Body:
```typescript
{
  title: string
}
```
- Response: Created Task object
- Status Code: 201 Created
- Validation: Title is required and cannot be empty

#### PATCH /api/tasks/:id
- Description: Toggle task completion status
- Parameters: 
  - id: Task ID (number)
- Response: Updated Task object
- Error: 404 if task not found

#### PUT /api/tasks/:id
- Description: Update task properties (title and/or completed status)
- Parameters:
  - id: Task ID (number)
- Request Body:
```typescript
{
  title?: string,
  completed?: boolean
}
```
- Response: Updated Task object
- Error: 404 if task not found

#### DELETE /api/tasks/:id
- Description: Delete a specific task
- Parameters:
  - id: Task ID (number)
- Response: 200 OK with success message
```typescript
{
  message: "Task deleted successfully"
}
```
- Error: 404 if task not found

#### DELETE /api/tasks
- Description: Clear all tasks (useful for testing)
- Response: 200 OK with success message
```typescript
{
  message: "All tasks cleared"
}
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

## Deployment

### Frontend Deployment
1. Build the production bundle:
```bash
cd frontend
npm run build
```
2. The build folder will contain optimized static files ready for deployment

### Backend Deployment
1. Build the TypeScript code:
```bash
cd backend
npm run build
```
2. The dist folder will contain compiled JavaScript ready for deployment

## Troubleshooting

### "Failed to fetch" Error

If you see a "Failed to fetch" error message when the application loads:

1. **Make sure the backend server is running**: The backend must be started before the frontend can fetch data
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify the backend is accessible**: Visit http://localhost:5000/health in your browser. You should see:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

3. **Check if the port is already in use**: If you see "Port 5000 is already in use", stop the other process or change the port:
   ```bash
   PORT=5001 npm run dev
   ```

### Common Issues

**Backend won't start**
- Check if another process is using port 5000
- Ensure you've run `npm install` in the backend directory
- Check for TypeScript compilation errors

**Frontend can't connect to backend**
- Verify the backend is running on port 5000
- Check that the proxy setting in `frontend/package.json` points to the correct backend URL
- Clear your browser cache and restart the frontend server

**Voice input not working**
- Voice input requires a compatible browser (Chrome, Edge, or Safari)
- Grant microphone permissions when prompted
- Ensure the backend is running as voice input creates tasks via API

## License

This project is licensed under the MIT License - see the LICENSE file for details
