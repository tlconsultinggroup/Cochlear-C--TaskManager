using TaskApi.Models;

namespace TaskApi.Services;

public class TaskService : ITaskService
{
    private readonly List<TodoTask> _tasks = new();
    private int _nextId = 1;

    public IEnumerable<TodoTask> GetAll() => _tasks;

    public TodoTask? GetById(int id) => _tasks.FirstOrDefault(t => t.Id == id);

    public TodoTask Create(string title)
    {
        var task = new TodoTask
        {
            Id = _nextId++,
            Title = title,
            Completed = false,
            CreatedAt = DateTime.UtcNow
        };
        _tasks.Add(task);
        return task;
    }

    public TodoTask? UpdateCompleted(int id, bool completed)
    {
        var task = GetById(id);
        if (task == null) return null;
        task.Completed = completed;
        return task;
    }

    public TodoTask? Toggle(int id)
    {
        var task = GetById(id);
        if (task == null) return null;
        task.Completed = !task.Completed;
        return task;
    }

    public bool Delete(int id)
    {
        var task = GetById(id);
        if (task == null) return false;
        _tasks.Remove(task);
        return true;
    }
}
