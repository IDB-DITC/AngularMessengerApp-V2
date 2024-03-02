var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSignalR(op =>
{
    op.MaximumReceiveMessageSize = 1024 * 1024 * 2;
});

builder.Services.AddCors();


var app = builder.Build();


app.UseCors(opt =>
{
    opt
    //.WithOrigins("https://localhost:4200", "http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()
	.SetIsOriginAllowed((host) => true)
	.AllowCredentials();
});



app.MapHub<Messenger>("/mychat");

//app.MapGet("/", () => "<h1>Hello World!</h1>");

app.Run();


