using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Tests.Services;

/// <summary>Unit tests for <see cref="TaskService"/>.</summary>
public class TaskServiceTests
{
    private readonly TaskService _sut = new();

    // ── GetAll ────────────────────────────────────────────────────────────────

    [Fact]
    public void GetAll_WhenEmpty_ReturnsEmptyCollection()
    {
        var result = _sut.GetAll();

        Assert.Empty(result);
    }

    [Fact]
    public void GetAll_AfterCreatingTasks_ReturnsAllTasks()
    {
        _sut.Create("Task A");
        _sut.Create("Task B");

        var result = _sut.GetAll();

        Assert.Equal(2, result.Count());
    }

    // ── Create ────────────────────────────────────────────────────────────────

    [Fact]
    public void Create_WithTitle_ReturnsTaskWithCorrectTitle()
    {
        var task = _sut.Create("Buy medicine");

        Assert.Equal("Buy medicine", task.Title);
    }

    [Fact]
    public void Create_NewTask_IsNotCompleted()
    {
        var task = _sut.Create("Discharge notes");

        Assert.False(task.Completed);
    }

    [Fact]
    public void Create_AssignsIncrementingIds()
    {
        var first = _sut.Create("First task");
        var second = _sut.Create("Second task");

        Assert.NotEqual(first.Id, second.Id);
        Assert.True(second.Id > first.Id);
    }

    [Fact]
    public void Create_SetsCreatedAtToUtcNow()
    {
        var before = DateTime.UtcNow;
        var task = _sut.Create("Time-sensitive task");
        var after = DateTime.UtcNow;

        Assert.InRange(task.CreatedAt, before, after);
    }

    // ── GetById ───────────────────────────────────────────────────────────────

    [Fact]
    public void GetById_WithValidId_ReturnsCorrectTask()
    {
        var created = _sut.Create("Find this task");

        var found = _sut.GetById(created.Id);

        Assert.NotNull(found);
        Assert.Equal("Find this task", found.Title);
    }

    [Fact]
    public void GetById_WithInvalidId_ReturnsNull()
    {
        var result = _sut.GetById(999);

        Assert.Null(result);
    }

    // ── Toggle ────────────────────────────────────────────────────────────────

    [Fact]
    public void Toggle_IncompleteTask_SetsCompletedTrue()
    {
        var task = _sut.Create("Lab results");

        var toggled = _sut.Toggle(task.Id);

        Assert.NotNull(toggled);
        Assert.True(toggled.Completed);
    }

    [Fact]
    public void Toggle_CompletedTask_SetsCompletedFalse()
    {
        var task = _sut.Create("Lab results");
        _sut.Toggle(task.Id); // complete it

        var toggled = _sut.Toggle(task.Id); // uncomplete it

        Assert.NotNull(toggled);
        Assert.False(toggled.Completed);
    }

    [Fact]
    public void Toggle_WithInvalidId_ReturnsNull()
    {
        var result = _sut.Toggle(999);

        Assert.Null(result);
    }

    // ── UpdateCompleted ───────────────────────────────────────────────────────

    [Fact]
    public void UpdateCompleted_WithValidId_UpdatesCompletedFlag()
    {
        var task = _sut.Create("Prescription filled");

        var updated = _sut.UpdateCompleted(task.Id, true);

        Assert.NotNull(updated);
        Assert.True(updated.Completed);
    }

    [Fact]
    public void UpdateCompleted_WithInvalidId_ReturnsNull()
    {
        var result = _sut.UpdateCompleted(999, true);

        Assert.Null(result);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    [Fact]
    public void Delete_WithValidId_ReturnsTrueAndRemovesTask()
    {
        var task = _sut.Create("Task to delete");

        var deleted = _sut.Delete(task.Id);

        Assert.True(deleted);
        Assert.Null(_sut.GetById(task.Id));
    }

    [Fact]
    public void Delete_WithInvalidId_ReturnsFalse()
    {
        var result = _sut.Delete(999);

        Assert.False(result);
    }

    [Fact]
    public void Delete_DecreasesTotalTaskCount()
    {
        _sut.Create("Task 1");
        var task2 = _sut.Create("Task 2");
        _sut.Create("Task 3");

        _sut.Delete(task2.Id);

        Assert.Equal(2, _sut.GetAll().Count());
    }
}
