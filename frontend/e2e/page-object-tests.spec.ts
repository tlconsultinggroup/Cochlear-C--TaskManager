import { test, expect } from '@playwright/test';
import { TaskPage, ApiHelper, TestData, Utils } from './helpers/page-objects';

test.describe('Task Management with Page Objects', () => {
  let taskPage: TaskPage;
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
    apiHelper = new ApiHelper(page);
    
    // Clear any existing tasks
    await Utils.clearAllTasks(page);
    
    // Navigate to the app
    await taskPage.navigateToApp();
  });

  test('should handle task operations with UI and API sync', async () => {
    const taskTitle = TestData.randomTaskTitle();
    
    // Add task through UI
    await taskPage.addTask(taskTitle);
    
    // Verify in UI and API
    await taskPage.expectTaskVisible(taskTitle);
    await taskPage.expectTaskNotCompleted(taskTitle);
    const task = await apiHelper.expectTaskExists(taskTitle);
    
    // Toggle and verify sync
    await taskPage.toggleTask(taskTitle);
    await taskPage.expectTaskCompleted(taskTitle);
    await apiHelper.expectTaskCompleted(task.id, true);
    
    // Delete and verify
    await taskPage.deleteTask(taskTitle);
    await taskPage.expectTaskNotVisible(taskTitle);
    await apiHelper.expectTaskNotExists(task.id);
  });

  test('should handle edge cases and special inputs', async () => {
    // Test special characters
    const specialTitle = TestData.specialCharacterTitles[0];
    await taskPage.addTask(specialTitle);
    await taskPage.expectTaskVisible(specialTitle);
    const task = await apiHelper.expectTaskExists(specialTitle);
    expect(task.title).toBe(specialTitle);
    
    // Test long title
    const longTitle = TestData.longTaskTitle();
    await taskPage.addTask(longTitle);
    await taskPage.expectTaskVisible(longTitle);
    const taskItem = taskPage.taskItem(longTitle);
    await expect(taskItem).toBeVisible();
  });

  test('should handle API-initiated changes', async () => {
    const taskTitle = TestData.randomTaskTitle();
    
    // Create task via API
    const createdTask = await apiHelper.createTask(taskTitle);
    
    // Refresh to see API-created task
    await taskPage.navigateToApp();
    await taskPage.expectTaskVisible(taskTitle);
    
    // Modify via UI, verify API sync
    await taskPage.toggleTask(taskTitle);
    await apiHelper.expectTaskCompleted(createdTask.id, true);
    
    // Delete via UI
    await taskPage.deleteTask(taskTitle);
    await apiHelper.expectTaskNotExists(createdTask.id);
  });

  test.describe('Error handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Simulate server error
      await page.route('**/api/tasks', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server Error' })
          });
        } else {
          route.continue();
        }
      });
      
      const taskTitle = TestData.randomTaskTitle();
      await taskPage.addTask(taskTitle);
      
      // Task should not appear due to API error
      await taskPage.expectTaskNotVisible(taskTitle);
      
      // Cleanup
      await page.unroute('**/api/tasks');
    });
  });
});
