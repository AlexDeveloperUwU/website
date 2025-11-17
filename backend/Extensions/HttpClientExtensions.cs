using System.Net.Http.Headers;
using System.Reflection;

namespace backend.Extensions
{
    public static class HttpClientExtensions
    {
        public static IServiceCollection AddHttpClients(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services.AddHttpClient(
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
            );

            var gitLabServerUrl = configuration["GITLAB_SERVER"];
            if (!string.IsNullOrEmpty(gitLabServerUrl))
            {
                services.AddHttpClient(
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
                );
            }

            return services;
        }
    }
}
