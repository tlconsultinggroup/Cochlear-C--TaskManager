using TaskApi.Models;

namespace TaskApi.Services;

public interface ITaskService
{
    IEnumerable<TodoTask> GetAll();
    TodoTask? GetById(int id);
    TodoTask Create(string title, DateTime? dueDate = null);
    TodoTask? UpdateCompleted(int id, bool completed);
    TodoTask? UpdateDueDate(int id, DateTime? dueDate);
    TodoTask? Toggle(int id);
    bool Delete(int id);
}
