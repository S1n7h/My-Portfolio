using backend.Endpoints;
using Google.GenAI;

var builder = WebApplication.CreateBuilder(args);

// 1. Enable CORS for your React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Register the Official Google GenAI Client
var geminiConfig = builder.Configuration.GetSection("Gemini");
builder.Services.AddSingleton(sp => 
    new Client(apiKey: geminiConfig["ApiKey"])
);

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.MapChatEndpoints();

app.Run();