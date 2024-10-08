using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Ofps.Models;

var builder = WebApplication.CreateBuilder(args);
// Add controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add the CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Set maximum request body size limit
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1000 * 1024 * 1024; // 1000 MB
});
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1000 * 1024 * 1024;
});

// Add database context
builder.Services.AddDbContextPool<AppDbContext>(
    options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, LogLevel.Information)// Enable logging to console
);

var app = builder.Build();

//Using CORS 
app.UseCors("AllowAll");

// Use Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Define API endpoints
app.MapGet("/", () => "");

//app.UseHttpsRedirection();
app.MapControllers();

// Ensure static files middleware is enabled
app.UseStaticFiles();

app.Run();
