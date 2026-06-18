using backend.Models;
using Google.GenAI;
using Google.GenAI.Types;

namespace backend.Endpoints;

public static class ChatEndpoints
{
    public static void MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/chat", async (ChatRequest request, Client aiClient) =>
        {
            string userInput = request.Message.Trim();

            // 1. Slash Command Interception (Instant UI Components)
            if (userInput.StartsWith("/"))
            {
                var commandLower = userInput.ToLower();

                if (commandLower == "/projects")
                {
                    var mockProjects = new List<ProjectDto>
                    {
                        new() { 
                            Title = "Asteroids", 
                            Description = "A game built using Unity where you try to avoid the Asteroids using your mouse and click inputs.", 
                            ProgrammingLanguagesUsed = "C#, Unity", 
                            GithubUrl = "https://github.com/S1n7h/Asteroids" 
                        },
                        new() { 
                            Title = "Tower Defense", 
                            Description = "The Duck kingdom has launched an attack against your empire. Defend!", 
                            ProgrammingLanguagesUsed = "C#, Aseprite, Unity", 
                            GithubUrl = "https://github.com/S1n7h/Tower-Defense-Game-Using-Unity" 
                        },
                        new() { 
                            Title = "Vikcord", 
                            Description = "A high-performance real-time chat platform modeled closely after Discord architecture.", 
                            ProgrammingLanguagesUsed = "C#, ASP.NET Core, SQL Server, React, TypeScript, CSS, HTML", 
                            GithubUrl = "https://github.com/S1n7h/Vikord" 
                        }
                    };

                    return Results.Ok(new ChatResponse { Type = "project-list", Text = "Here are my featured projects:", Data = mockProjects });
                }

                if (commandLower == "/hobbies")
                {
                    var mockHobbies = new List<string> { "Programming", "Reading novels", "Watching shows" };
                    return Results.Ok(new ChatResponse { Type = "hobby-grid", Text = "Here is what I do in my free time:", Data = mockHobbies });
                }

                return Results.Ok(new ChatResponse { Type = "text", Text = $"Unknown command '{userInput}'. Try typing `/projects` or `/hobbies`." });
            }

            // 2. Real Official Gemini AI Fallback Logic
            try
            {
                var config = new GenerateContentConfig();

                config.SystemInstruction = new Content
                {
                    Parts = new List<Part> 
                    { 
                        new() { Text = """
                            You are the dedicated, witty AI portfolio assistant for a developer. 
                            Your purpose is to answer user inquiries professionally and warmly.

                            Here is the exact ground truth context about the developer you represent:
                            - Tech Stack Focus: Advanced Backend and Frontend engineering using .NET, C#, and React.
                            - Primary Core Competencies: Software engineering, competitive programming, algorithm design, and custom game loops.
                            - Key Portfolio Highlights:
                              1. "Vikcord" -> A real-time chatting workspace utility built using ASP.NET Core, SQL Server, React, and TypeScript.
                              2. "Tower Defense" -> A 2D defensive layout strategy game built in Unity featuring retro graphics drawn in Aseprite.
                              3. "Asteroids" -> A desktop arcade recreation written in C# and Unity mapping clean vector target calculations.

                            Instructions:
                            - Keep descriptions concise, bold, and punchy. Do not ramble.
                            - If a user asks a question completely out of context (e.g. "How do I bake a cake?"), politely steer them back: "I can look that up for you, but as a specialized portfolio agent, I'd rather tell you about building scalable apps or custom game design!"
                            """ 
                        }
                    }
                };

                config.MaxOutputTokens = 300;
                config.Temperature = 0.7;

                var aiResponse = await aiClient.Models.GenerateContentAsync(
                    model: "gemini-2.5-flash",
                    contents: userInput,
                    config: config
                );

                string responseText = aiResponse.Text ?? "I couldn't generate a clear response right now.";

                return Results.Ok(new ChatResponse 
                { 
                    Type = "text", 
                    Text = responseText
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gemini Error: {ex.Message}");
                return Results.Ok(new ChatResponse 
                { 
                    Type = "text", 
                    Text = "Oops! My neural links are a bit busy right now. However, you can still use `/projects` or `/hobbies` directly!" 
                });
            }
        })
        .RequireCors("AllowFrontend"); // 🟢 THIS RIGHT HERE COMPELS THE ENDPOINT TO SEND CORS HEADERS FOR PREFLIGHT
    }
}