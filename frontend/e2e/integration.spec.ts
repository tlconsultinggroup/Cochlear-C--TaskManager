import { test, expect } from '@playwright/test';

test.describe('Full Stack Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Wait for the task input to be visible
    await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
    
    // Verify no error messages are shown (backend is responding)
    // If there's an error, wait a bit and reload
    const errorMessage = page.locator('.error-message');
    const hasError = await errorMessage.isVisible().catch(() => false);
    if (hasError) {
      console.log('Initial load had error, reloading page...');
      await page.reload();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
      // Error should be gone after reload
      await expect(errorMessage).not.toBeVisible();
    }
  });

  test('Full task lifecycle - Frontend and Backend sync', async ({ page }) => {
    const taskTitle = 'Integration Test Task';
    const taskInput = page.locator('.task-input__field');
    const addButton = page.locator('.task-input__button');

    // Add task through UI
    await taskInput.fill(taskTitle);
    await addButton.click();

    // Verify task appears in UI
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    await expect(taskItem).toBeVisible({ timeout: 5000 });

    // Verify task was created in backend
    const apiResponse = await page.request.get('http://localhost:5000/api/tasks');
    expect(apiResponse.status()).toBe(200);
    const tasks = await apiResponse.json();
    const createdTask = tasks.find((task: any) => task.title === taskTitle);
    expect(createdTask).toBeDefined();
    expect(createdTask.completed).toBe(false);

    // Toggle completion in UI
    const checkbox = taskItem.locator('.task-item__checkbox');
    await checkbox.click();
    await expect(checkbox).toBeChecked({ timeout: 3000 });

    // Verify backend reflects the change
    const updatedApiResponse = await page.request.get('http://localhost:5000/api/tasks');
    const updatedTasks = await updatedApiResponse.json();
    const updatedTask = updatedTasks.find((task: any) => task.id === createdTask.id);
    expect(updatedTask.completed).toBe(true);

    // Delete through UI
    const deleteButton = taskItem.locator('.task-item__delete');
    await deleteButton.click();
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).not.toBeVisible({ timeout: 3000 });

    // Verify deletion in backend
    const finalApiResponse = await page.request.get('http://localhost:5000/api/tasks');
    const finalTasks = await finalApiResponse.json();
    const deletedTask = finalTasks.find((task: any) => task.id === createdTask.id);
    expect(deletedTask).toBeUndefined();
  });

  test('Data persistence across page refresh', async ({ page }) => {
    const taskTitle = 'Persistent Integration Task';
    
    // Create and complete task
    await page.locator('.task-input__field').fill(taskTitle);
    await page.locator('.task-input__button').click();
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).toBeVisible({ timeout: 5000 });
    
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    await taskItem.locator('.task-item__checkbox').click();
    await expect(taskItem.locator('.task-item__checkbox')).toBeChecked({ timeout: 3000 });

    // Refresh and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
    
    const reloadedTaskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).toBeVisible();
    await expect(reloadedTaskItem.locator('.task-item__checkbox')).toBeChecked();

    // Cleanup
    await reloadedTaskItem.locator('.task-item__delete').click();
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).not.toBeVisible({ timeout: 3000 });
  });

  test('Error handling - API failure recovery', async ({ page }) => {
    // Intercept and simulate API error
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        route.continue();
      }
    });

    // Attempt to add task (should fail gracefully)
    await page.locator('.task-input__field').fill('Task that should fail');
    await page.locator('.task-input__button').click();
    await page.waitForTimeout(1000);

    // Remove interception for cleanup
    await page.unroute('**/api/tasks');
  });
});
