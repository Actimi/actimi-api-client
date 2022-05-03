namespace Client.API.Helpers
{
    public class APISettings
    {
        public readonly string serviceBaseUrl;
        public readonly string serviceApiKey;
        
        public APISettings()
        {
            serviceBaseUrl = Environment.GetEnvironmentVariable("SERVICE_BASE_URL");
            serviceApiKey = Environment.GetEnvironmentVariable("API_KEY");
            if (string.IsNullOrEmpty(serviceBaseUrl))
                throw new ArgumentException("Environment variable SERVICE_BASE_URL is not found!");
            if (string.IsNullOrEmpty(serviceApiKey))
                throw new ArgumentException("Environment variable API_KEY is not found!");
        }

    }
}
