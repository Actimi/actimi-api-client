using System.Collections;
using Client.API;
using Client.API.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var apiSettings = new APISettings();

builder.Services.AddSingleton(new APIService(apiSettings));

builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
        {
            policy
                .AllowCredentials()
                .WithOrigins("http://localhost:3000");
        });
});


var app = builder.Build();
app.UseCors("cors");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapGet("/Observation", (APIService service, DateTime? afterDateTime) =>
{
    return Results.Content(service.GetObservations(afterDateTime!).Result, "application/json");
});

app.MapGet("/Patient", (APIService service, DateTime? afterDateTime) =>
{
    return Results.Content(service.GetPatients(afterDateTime!).Result, "application/json");
});

app.Run();
