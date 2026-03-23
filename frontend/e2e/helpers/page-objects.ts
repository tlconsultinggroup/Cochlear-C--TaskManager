import { Page, Locator, expect } from '@playwright/test';

// Task interface
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Page Object for Task Management UI
export class TaskPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly addButton: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.locator('[data-testid="task-input"], input[type="text"]');
    this.addButton = page.locator('[data-testid="add-button"], button:has-text("Add")');
    this.taskList = page.locator('[data-testid="task-list"], .task-list');
  }

  // Locator helpers for dynamic elements
  taskItem(title: string): Locator {
    return this.page.locator(`[data-testid="task-item"]:has-text("${title}"), .task-item:has-text("${title}")`);
  }

  taskTitle(title: string): Locator {
    return this.taskItem(title).locator('[data-testid="task-title"], .task-title, span, div').first();
  }

  taskCheckbox(title: string): Locator {
    return this.taskItem(title).locator('input[type="checkbox"]');
  }

  taskDeleteButton(title: string): Locator {
    return this.taskItem(title).locator('[data-testid="delete-button"], button:has-text("Delete"), .delete-btn');
  }

  // Navigation
  async navigateToApp(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    
    // Wait for app to be visible
    await expect(this.page.locator('.task-input')).toBeVisible({ timeout: 10000 });
    
    // Check for and handle any initial errors
    const errorMessage = this.page.locator('.error-message');
    const hasError = await errorMessage.isVisible().catch(() => false);
    if (hasError) {
      console.log('Initial load had error, reloading page...');
      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('.task-input')).toBeVisible({ timeout: 10000 });
      // Error should be gone after reload
      await expect(errorMessage).not.toBeVisible();
    }
  }

  // Actions
  async addTask(title: string): Promise<void> {
    await this.taskInput.fill(title);
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

  async toggleTask(title: string): Promise<void> {
    const checkbox = this.taskCheckbox(title);
    await checkbox.waitFor({ state: 'visible' });
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async deleteTask(title: string): Promise<void> {
    const deleteButton = this.taskDeleteButton(title);
    await deleteButton.waitFor({ state: 'visible' });
    await deleteButton.click();
    await this.page.waitForTimeout(300);
  }

  async clearInput(): Promise<void> {
    await this.taskInput.clear();
  }

  async getTaskCount(): Promise<number> {
    return await this.page.locator('.task-item, [data-testid="task-item"]').count();
  }

  async getAllTaskTitles(): Promise<string[]> {
    const titles = await this.page.locator('.task-item .task-title, [data-testid="task-title"]').allTextContents();
    return titles;
  }

  async waitForTaskToAppear(title: string, timeout = 5000): Promise<void> {
    await this.taskTitle(title).waitFor({ state: 'visible', timeout });
  }

  async waitForTaskToDisappear(title: string, timeout = 5000): Promise<void> {
    await this.taskTitle(title).waitFor({ state: 'hidden', timeout });
  }

  // Assertions
  async expectTaskVisible(title: string): Promise<void> {
    await expect(this.taskTitle(title)).toBeVisible();
  }

  async expectTaskNotVisible(title: string): Promise<void> {
    await expect(this.taskTitle(title)).not.toBeVisible();
  }

  async expectTaskCompleted(title: string): Promise<void> {
    await expect(this.taskCheckbox(title)).toBeChecked();
  }

  async expectTaskNotCompleted(title: string): Promise<void> {
    await expect(this.taskCheckbox(title)).not.toBeChecked();
  }

  async expectTaskCount(count: number): Promise<void> {
    await expect(this.page.locator('.task-item, [data-testid="task-item"]')).toHaveCount(count);
  }

  async expectInputCleared(): Promise<void> {
    await expect(this.taskInput).toHaveValue('');
  }

  async expectInputHasValue(value: string): Promise<void> {
    await expect(this.taskInput).toHaveValue(value);
  }
}

// API Helper for backend interactions
export class ApiHelper {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page, baseUrl = 'http://localhost:5000/api') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async getTasks(): Promise<Task[]> {
    const response = await this.page.request.get(`${this.baseUrl}/tasks`);
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async createTask(title: string): Promise<Task> {
    const response = await this.page.request.post(`${this.baseUrl}/tasks`, {
      data: { title },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBe(201);
    return await response.json();
  }

  async updateTask(id: number, data: { title?: string; completed?: boolean }): Promise<Task> {
    const response = await this.page.request.put(`${this.baseUrl}/tasks/${id}`, {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async deleteTask(id: number): Promise<void> {
    const response = await this.page.request.delete(`${this.baseUrl}/tasks/${id}`);
    expect(response.status()).toBe(200);
  }

  async expectTaskExists(title: string): Promise<Task> {
    const tasks = await this.getTasks();
    const task = tasks.find((t: Task) => t.title === title);
    expect(task).toBeDefined();
    return task as Task;
  }

  async expectTaskNotExists(id: number): Promise<void> {
    const tasks = await this.getTasks();
    const task = tasks.find((t: Task) => t.id === id);
    expect(task).toBeUndefined();
  }

  async expectTaskCompleted(id: number, completed: boolean = true): Promise<Task> {
    const tasks = await this.getTasks();
    const task = tasks.find((t: Task) => t.id === id);
    expect(task).toBeDefined();
    expect(task!.completed).toBe(completed);
    return task as Task;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const tasks = await this.getTasks();
    return tasks.find((t: Task) => t.id === id);
  }

  async getTaskByTitle(title: string): Promise<Task | undefined> {
    const tasks = await this.getTasks();
    return tasks.find((t: Task) => t.title === title);
  }

  async getCompletedTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t: Task) => t.completed);
  }

  async getIncompleteTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t: Task) => !t.completed);
  }

  async getTaskCount(): Promise<number> {
    const tasks = await this.getTasks();
    return tasks.length;
  }
}

// Test data generators
export const TestData = {
  randomTaskTitle: (): string => `Test Task ${Date.now()}`,
  
  taskTitles: [
    'Buy groceries',
    'Walk the dog',
    'Complete project',
    'Call mom',
    'Read a book'
  ] as const,

  longTaskTitle: (): string => 'This is a very long task title that should test how the application handles longer text content and potentially overflow situations',

  specialCharacterTitles: [
    'Task with émojis 🚀✨',
    'Task with "quotes" and \'apostrophes\'',
    'Task with <HTML> & symbols',
    'Task with numbers 123456789'
  ] as const
} as const;

// Utility functions
export const Utils = {
  async waitForApiCall(page: Page, timeout = 1000): Promise<void> {
    await page.waitForTimeout(timeout);
  },

  async clearAllTasks(page: Page): Promise<void> {
    const apiHelper = new ApiHelper(page);
    try {
      // Try using the clear all endpoint first
      const response = await page.request.delete('http://localhost:5000/api/tasks');
      if (response.status() === 200) {
        return;
      }
      // Fallback to deleting individual tasks
      const tasks = await apiHelper.getTasks();
      for (const task of tasks) {
        await apiHelper.deleteTask(task.id);
      }
    } catch (error) {
      // Ignore errors during cleanup
      console.log('Cleanup error (ignored):', error);
    }
  },

  async setupTestData(page: Page, taskTitles: string[]): Promise<Task[]> {
    const apiHelper = new ApiHelper(page);
    const createdTasks: Task[] = [];
    
    for (const title of taskTitles) {
      try {
        const task = await apiHelper.createTask(title);
        createdTasks.push(task);
      } catch (error) {
        console.log(`Failed to create task "${title}":`, error);
      }
    }
    
    return createdTasks;
  }
};
