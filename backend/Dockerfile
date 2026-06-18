# 1. Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Explicitly copy your project file by name and restore it
COPY backend-console.csproj ./
RUN dotnet restore "backend-console.csproj"

# Copy all other backend files and publish
COPY . ./
RUN dotnet publish "backend-console.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Use the official ASP.NET Core runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port Render expects
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend-console.dll"]