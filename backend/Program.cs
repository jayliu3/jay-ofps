using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Ofps.Models;
using FileInfoModel = Ofps.Models.FileInfo;

var builder = WebApplication.CreateBuilder(args);
// 添加控制器
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 添加数据库上下文
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
                      .LogTo(Console.WriteLine, LogLevel.Information)); // 启用日志记录到控制台

var app = builder.Build();

// 使用 Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 定义 API 端点
app.MapGet("/", () => "Hello World!");

//app.UseHttpsRedirection();
app.MapControllers();

app.Run();
