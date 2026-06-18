namespace backend.Models;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
}

public class ChatResponse
{
    // "text", "project-list", or "hobby-grid"
    public string Type { get; set; } = "text"; 
    public string Text { get; set; } = string.Empty;
    public object? Data { get; set; } 
}

public class ProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProgrammingLanguagesUsed { get; set; } = string.Empty;
    public string LiveUrl { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
}