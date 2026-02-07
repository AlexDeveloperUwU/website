using System.Text.Json.Serialization;

namespace Portfolio.Backend.Application.Models.Response
{
    public class ApiResponseDto<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ApiErrorDto? Error { get; set; }
    }
}
