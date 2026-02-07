using Portfolio.Backend.Application.Models.Response;

namespace Portfolio.Backend.Application.Interfaces.Response
{
    public interface IResponseService
    {
        ApiResponseDto<T> CreateSuccessResponse<T>(T data);
        ApiResponseDto<T> CreateErrorResponse<T>(int code, string message);
    }
}
