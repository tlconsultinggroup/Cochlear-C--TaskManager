namespace TaskApi.Models;

/// <summary>Represents the urgency level of a task.</summary>
public enum TaskPriority
{
    Low = 0,
    Medium = 1,
    High = 2
}

public class TodoTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public DateTime CreatedAt { get; set; }
    /// <summary>The urgency level of this task. Defaults to Medium.</summary>
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
}
