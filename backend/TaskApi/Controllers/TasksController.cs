using Microsoft.AspNetCore.Mvc;
using TaskApi.Services;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    // GET /api/tasks
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_taskService.GetAll());
    }

    // GET /api/tasks/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var task = _taskService.GetById(id);
        if (task == null)
            return NotFound(new { error = "Task not found" });
        return Ok(task);
    }

    // POST /api/tasks
    [HttpPost]
    public IActionResult Create([FromBody] CreateTaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { error = "Title is required" });

        var task = _taskService.Create(request.Title);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    // PUT /api/tasks/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateCompleted(int id, [FromBody] UpdateTaskRequest request)
    {
        var task = _taskService.UpdateCompleted(id, request.Completed);
        if (task == null)
            return NotFound(new { error = "Task not found" });
        return Ok(task);
    }

    // PATCH /api/tasks/{id}
    [HttpPatch("{id}")]
    public IActionResult Toggle(int id)
    {
        var task = _taskService.Toggle(id);
        if (task == null)
            return NotFound(new { error = "Task not found" });
        return Ok(task);
    }

    // DELETE /api/tasks/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _taskService.Delete(id);
        if (!deleted)
            return NotFound(new { error = "Task not found" });
        return Ok(new { message = "Task deleted successfully" });
    }
}

public record CreateTaskRequest(string Title);
public record UpdateTaskRequest(bool Completed);
