import { test, expect } from '@playwright/test';

test.describe('Task Management App - Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    
    // Wait for the app to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for the task input to be visible (app is loaded)
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

  test('should complete full task lifecycle (add, toggle, delete)', async ({ page }) => {
    const taskTitle = 'Complete Lifecycle Task';
    
    // Step 1: Verify main UI elements are present
    await expect(page).toHaveTitle(/React App/);
    await expect(page.locator('input[placeholder="Add a new task..."]')).toBeVisible();
    await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
    
    // Step 2: Add a new task
    const taskInput = page.locator('.task-input__field');
    const addButton = page.locator('.task-input__button');
    
    await taskInput.fill(taskTitle);
    await addButton.click();
    
    // Wait for task to appear using proper selector
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).toBeVisible({ timeout: 5000 });
    
    // Verify input is cleared
    await expect(taskInput).toHaveValue('');
    
    // Step 3: Toggle task completion
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    const checkbox = taskItem.locator('.task-item__checkbox');
    
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    
    // Wait for completion state to update
    await expect(checkbox).toBeChecked({ timeout: 3000 });
    await expect(taskItem).toHaveClass(/completed/);
    
    // Step 4: Delete the task
    const deleteButton = taskItem.locator('.task-item__delete');
    await deleteButton.click();
    
    // Verify task is removed
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).not.toBeVisible({ timeout: 3000 });
  });

  test('should handle input validation and edge cases', async ({ page }) => {
    const addButton = page.locator('.task-input__button');
    const taskInput = page.locator('.task-input__field');
    
    // Test 1: Should not add empty task
    const initialTaskCount = await page.locator('.task-item').count();
    await addButton.click();
    await page.waitForTimeout(500);
    const afterEmptyCount = await page.locator('.task-item').count();
    expect(afterEmptyCount).toBe(initialTaskCount);
    
    // Test 2: Should handle multiple tasks
    const tasks = ['Task One', 'Task Two', 'Task Three'];
    for (const task of tasks) {
      await taskInput.fill(task);
      await addButton.click();
      await expect(page.locator('.task-item__title', { hasText: task })).toBeVisible({ timeout: 3000 });
    }
    
    // Verify all tasks are present
    const finalCount = await page.locator('.task-item').count();
    expect(finalCount).toBeGreaterThanOrEqual(tasks.length);
  });

  test('should persist task state across page refresh', async ({ page }) => {
    const taskTitle = 'Persistent Task';
    
    // Add and complete a task
    const taskInput = page.locator('.task-input__field');
    const addButton = page.locator('.task-input__button');
    
    await taskInput.fill(taskTitle);
    await addButton.click();
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).toBeVisible({ timeout: 5000 });
    
    // Toggle completion
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    const checkbox = taskItem.locator('.task-item__checkbox');
    await checkbox.click();
    await expect(checkbox).toBeChecked({ timeout: 3000 });
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.task-input')).toBeVisible();
    
    // Verify the task persists with completed state
    const reloadedTaskItem = page.locator('.task-item').filter({ hasText: taskTitle });
    const reloadedCheckbox = reloadedTaskItem.locator('.task-item__checkbox');
    
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).toBeVisible();
    await expect(reloadedCheckbox).toBeChecked();
    await expect(reloadedTaskItem).toHaveClass(/completed/);
    
    // Cleanup
    await reloadedTaskItem.locator('.task-item__delete').click();
    await expect(page.locator('.task-item__title', { hasText: taskTitle })).not.toBeVisible({ timeout: 3000 });
  });
});
