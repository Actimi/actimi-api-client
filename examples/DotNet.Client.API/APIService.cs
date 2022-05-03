using System.IdentityModel.Tokens.Jwt;
using Client.API.Helpers;
using Client.API.Models;
using Nest.JsonNetSerializer;
using RestSharp;
using RestSharp.Serializers.Json;

namespace Client.API
{
    public class APIService
    {

        private RestClient _client;
        private string accessToken;
        private string apiKey;
        private DateTime tokenExp;
        public APIService(APISettings apiSettings)
        {
            this.apiKey = apiSettings.serviceApiKey;
            _client = new RestClient(apiSettings.serviceBaseUrl)
                .UseSystemTextJson();
            _client.AcceptedContentTypes = new string[] { "application/json" };
            AuthorizeClient();
        }
        async private void AuthorizeClient()
        {

            if (accessToken != null && tokenExp > DateTime.Now) return;
            var request = new RestRequest("Auth/token", Method.Post);
 
            request.RequestFormat = DataFormat.Json;
            request.AddJsonBody(new AuthRequest { apiKey = apiKey});
            var response = await _client.ExecuteAsync<AuthResponse>(request);
            


            if (!response.IsSuccessful)
                throw new Exception("Authentication Failed!");

            accessToken = response.Data.accessToken;
            
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            tokenExp = jwtSecurityToken.ValidTo;

            _client.AddDefaultHeader("Authorization", $"Bearer {accessToken}");

        }

        async public Task<string> GetPatients(DateTime? afterDateTime)
        {
            AuthorizeClient();
            var request = new RestRequest("/Patient", Method.Get);
            var afterDateTimeStr = afterDateTime?.ToString("yyyy-MM-ddThh:mm:ss.ffffff");
            if (!string.IsNullOrEmpty(afterDateTimeStr))
                request.AddQueryParameter("afterDateTime", afterDateTimeStr);
            var response = await _client.ExecuteAsync(request);
            if (!response.IsSuccessful) throw response.ErrorException;
            return response.Content;
        }
        async public Task<string> GetObservations(DateTime? afterDateTime)
        {
            AuthorizeClient();
            var request = new RestRequest("/Observation", Method.Get);
            var afterDateTimeStr = afterDateTime?.ToString("yyyy-MM-ddThh:mm:ss.ffffff");
            if (!string.IsNullOrEmpty(afterDateTimeStr))
                request.AddQueryParameter("afterDateTime", afterDateTimeStr);
            var response = await _client.ExecuteAsync(request);
            if (!response.IsSuccessful) throw response.ErrorException;
            return response.Content;
        }
    }
}
