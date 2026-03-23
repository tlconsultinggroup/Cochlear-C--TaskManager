import { test, expect } from '@playwright/test';

test.describe('Backend API Tests', () => {
  let apiContext: any;

  test.beforeAll(async ({ playwright }) => {
    // Create a new API request context - use baseURL from config
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:5000',
    });
  });

  test.afterAll(async () => {
    // Dispose the API request context
    await apiContext.dispose();
  });

  test('Health check - API should be accessible', async () => {
    const response = await apiContext.get('/api/tasks');
    expect(response.status()).toBe(200);
  });

  test('GET /tasks - should return array of tasks', async () => {
    const response = await apiContext.get('/api/tasks');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  test('POST /tasks - should create task with valid data', async () => {
    const taskData = {
      title: 'Backend API Test Task'
    };

    const response = await apiContext.post('/api/tasks', {
      data: taskData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(201);
    
    const createdTask = await response.json();
    expect(createdTask).toHaveProperty('id');
    expect(createdTask.title).toBe(taskData.title);
    expect(createdTask.completed).toBe(false);
  });

  test('POST /tasks - should reject invalid data', async () => {
    const invalidData = {
      // Missing required title field
    };

    const response = await apiContext.post('/api/tasks', {
      data: invalidData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('PUT /tasks/:id - should update existing task', async () => {
    // First create a task
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Task to Update' },
      headers: { 'Content-Type': 'application/json' }
    });
    const createdTask = await createResponse.json();

    // Update the task
    const updateResponse = await apiContext.put(`/api/tasks/${createdTask.id}`, {
      data: { completed: true },
      headers: { 'Content-Type': 'application/json' }
    });

    expect(updateResponse.status()).toBe(200);
    
    const updatedTask = await updateResponse.json();
    expect(updatedTask.id).toBe(createdTask.id);
    expect(updatedTask.completed).toBe(true);
  });

  test('PUT /tasks/:id - should return 404 for non-existent task', async () => {
    const response = await apiContext.put('/api/tasks/99999', {
      data: { completed: true },
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status()).toBe(404);
  });

  test('DELETE /tasks/:id - should delete existing task', async () => {
    // First create a task
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Task to Delete' },
      headers: { 'Content-Type': 'application/json' }
    });
    const createdTask = await createResponse.json();

    // Delete the task
    const deleteResponse = await apiContext.delete(`/api/tasks/${createdTask.id}`);
    expect(deleteResponse.status()).toBe(200);

    // Verify it's deleted
    const getResponse = await apiContext.get(`/api/tasks/${createdTask.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /tasks/:id - should return 404 for non-existent task', async () => {
    const response = await apiContext.delete('/api/tasks/99999');
    expect(response.status()).toBe(404);
  });

  test('CORS headers should be present', async () => {
    const response = await apiContext.get('/api/tasks');
    const headers = response.headers();
    
    // Check for CORS headers
    expect(headers).toHaveProperty('access-control-allow-origin');
  });

  test('Content-Type headers should be correct', async () => {
    const response = await apiContext.get('/api/tasks');
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('Error responses should have proper format', async () => {
    // Try to get a non-existent task
    const response = await apiContext.get('/api/tasks/99999');
    expect(response.status()).toBe(404);
    
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('error');
    expect(typeof errorBody.error).toBe('string');
  });
});
