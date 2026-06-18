using backend.Endpoints;
using Google.GenAI;

var builder = WebApplication.CreateBuilder(args);

// 1. Enable CORS for BOTH your local environment and live Vercel Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "https://my-portfolio-sigma-sandy-88.vercel.app/" 
              ) 
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
// NOTE: You can temporarily comment out app.UseHttpsRedirection() if Render's internal HTTP routing gives you trouble, 
// but since Render handles SSL termination at their proxy, keeping it should be fine.
//app.UseHttpsRedirection();

app.MapChatEndpoints();

app.Run();