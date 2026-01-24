using System.Net.Http.Headers;
using System.Reflection;
using EasyLogging.Extensions;

namespace backend.Extensions
{
    public static class HttpClientExtensions
    {
        public static IServiceCollection AddHttpClients(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            // Add GitHub HTTP client
            services
                .AddHttpClient(
                    "GitHub",
                    client =>
                    {
                        client.BaseAddress = new Uri("https://api.github.com/");
                        client.DefaultRequestHeaders.UserAgent.Add(
                            new ProductInfoHeaderValue(
                                "AlexDevUwU-Portfolio-Sync",
                                Assembly.GetExecutingAssembly().GetName().Version?.ToString(3)
                                    ?? "1.0.0"
                            )
                        );
                    }
                )
                .AddEasyLoggingClient();

            // Add GitLab HTTP client
            var gitLabServerUrl = configuration["GITLAB_SERVER"];
            if (!string.IsNullOrEmpty(gitLabServerUrl))
            {
                services
                    .AddHttpClient(
                        "GitLab",
                        client =>
                        {
                            client.BaseAddress = new Uri(gitLabServerUrl);
                            client.DefaultRequestHeaders.UserAgent.Add(
                                new ProductInfoHeaderValue(
                                    "AlexDevUwU-Portfolio-Sync",
                                    Assembly.GetExecutingAssembly().GetName().Version?.ToString(3)
                                        ?? "1.0.0"
                                )
                            );
                        }
                    )
                    .AddEasyLoggingClient();
            }

            return services;
        }
    }
}
