using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskApi.Controllers;
using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Tests.Controllers;

/// <summary>Unit tests for <see cref="TasksController"/>.</summary>
public class TasksControllerTests
{
    private readonly Mock<ITaskService> _mockService = new();
    private readonly TasksController _sut;

    public TasksControllerTests()
    {
        _sut = new TasksController(_mockService.Object);
    }

    // ── GET /api/tasks ────────────────────────────────────────────────────────

    [Fact]
    public void GetAll_Returns200WithAllTasks()
    {
        var tasks = new List<TodoTask>
        {
            new() { Id = 1, Title = "Task 1" },
            new() { Id = 2, Title = "Task 2" }
        };
        _mockService.Setup(s => s.GetAll()).Returns(tasks);

        var result = _sut.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(tasks, ok.Value);
    }

    // ── GET /api/tasks/{id} ───────────────────────────────────────────────────

    [Fact]
    public void GetById_WithValidId_Returns200WithTask()
    {
        var task = new TodoTask { Id = 1, Title = "Lab results" };
        _mockService.Setup(s => s.GetById(1)).Returns(task);

        var result = _sut.GetById(1);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(task, ok.Value);
    }

    [Fact]
    public void GetById_WithInvalidId_Returns404()
    {
        _mockService.Setup(s => s.GetById(999)).Returns((TodoTask?)null);

        var result = _sut.GetById(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // ── POST /api/tasks ───────────────────────────────────────────────────────

    [Fact]
    public void Create_WithValidTitle_Returns201WithTask()
    {
        var request = new CreateTaskRequest("Prescription review");
        var createdTask = new TodoTask { Id = 1, Title = "Prescription review" };
        _mockService.Setup(s => s.Create(request.Title)).Returns(createdTask);

        var result = _sut.Create(request);

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created.StatusCode);
        Assert.Equal(createdTask, created.Value);
    }

    [Fact]
    public void Create_WithEmptyTitle_Returns400()
    {
        var request = new CreateTaskRequest("");

        var result = _sut.Create(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Create_WithWhitespaceTitle_Returns400()
    {
        var request = new CreateTaskRequest("   ");

        var result = _sut.Create(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    // ── PUT /api/tasks/{id} ───────────────────────────────────────────────────

    [Fact]
    public void UpdateCompleted_WithValidId_Returns200WithUpdatedTask()
    {
        var task = new TodoTask { Id = 1, Title = "Follow-up", Completed = true };
        var request = new UpdateTaskRequest(true);
        _mockService.Setup(s => s.UpdateCompleted(1, true)).Returns(task);

        var result = _sut.UpdateCompleted(1, request);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(task, ok.Value);
    }

    [Fact]
    public void UpdateCompleted_WithInvalidId_Returns404()
    {
        _mockService.Setup(s => s.UpdateCompleted(999, true)).Returns((TodoTask?)null);

        var result = _sut.UpdateCompleted(999, new UpdateTaskRequest(true));

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // ── PATCH /api/tasks/{id} ─────────────────────────────────────────────────

    [Fact]
    public void Toggle_WithValidId_Returns200WithToggledTask()
    {
        var task = new TodoTask { Id = 1, Title = "Discharge notes", Completed = true };
        _mockService.Setup(s => s.Toggle(1)).Returns(task);

        var result = _sut.Toggle(1);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(task, ok.Value);
    }

    [Fact]
    public void Toggle_WithInvalidId_Returns404()
    {
        _mockService.Setup(s => s.Toggle(999)).Returns((TodoTask?)null);

        var result = _sut.Toggle(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // ── DELETE /api/tasks/{id} ────────────────────────────────────────────────

    [Fact]
    public void Delete_WithValidId_Returns200WithMessage()
    {
        _mockService.Setup(s => s.Delete(1)).Returns(true);

        var result = _sut.Delete(1);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void Delete_WithInvalidId_Returns404()
    {
        _mockService.Setup(s => s.Delete(999)).Returns(false);

        var result = _sut.Delete(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
