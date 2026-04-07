using TaskApi.Models;

namespace TaskApi.Services;

public interface ITaskService
{
    IEnumerable<TodoTask> GetAll();
    TodoTask? GetById(int id);
    /// <summary>Creates a new task with an optional priority (defaults to Medium).</summary>
    TodoTask Create(string title, TaskPriority priority = TaskPriority.Medium);
    TodoTask? UpdateCompleted(int id, bool completed);
    TodoTask? Toggle(int id);
    bool Delete(int id);
    /// <summary>Updates the priority of an existing task.</summary>
    TodoTask? UpdatePriority(int id, TaskPriority priority);
}
