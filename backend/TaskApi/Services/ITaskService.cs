using TaskApi.Models;

namespace TaskApi.Services;

public interface ITaskService
{
    IEnumerable<TodoTask> GetAll();
    TodoTask? GetById(int id);
    TodoTask Create(string title);
    TodoTask? UpdateCompleted(int id, bool completed);
    TodoTask? Toggle(int id);
    bool Delete(int id);
}
