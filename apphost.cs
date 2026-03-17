#:package Aspire.Hosting.Python@13.1.2
#:package Aspire.Hosting.NodeJs@9.5.2
#:sdk Aspire.AppHost.Sdk@13.1.2

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddPythonApp("backend", "./backend", "run.py", "./backend/.venv")
    .WithHttpEndpoint(targetPort: 8000);

builder.AddNpmApp("frontend", "./frontend", "start")
    .WithHttpEndpoint(targetPort: 3000, env: "PORT")
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("REACT_APP_API_URL", backend.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .WaitFor(backend);

builder.Build().Run();
