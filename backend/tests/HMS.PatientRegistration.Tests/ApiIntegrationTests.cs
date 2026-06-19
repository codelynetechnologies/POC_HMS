using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using HMS.PatientRegistration.Application.Common;
using Microsoft.AspNetCore.Mvc.Testing;

namespace HMS.PatientRegistration.Tests;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Healthz_ReturnsHealthy()
    {
        var response = await _client.GetAsync("/api/healthz");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<ApiResponseDto<JsonElement>>();
        Assert.NotNull(body);
        Assert.True(body!.Success);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            username = "frontdesk",
            password = "FrontDesk123!",
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task SearchPatients_WithoutAuth_WhenOptionalAuthEnabled_ReturnsOk()
    {
        var response = await _client.PostAsJsonAsync("/api/patients/search", new
        {
            firstName = "Rahul",
            page = 1,
            pageSize = 10,
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
