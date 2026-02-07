using backend.Application.Models.Response;

namespace backend.Application.Interfaces.Response
{
    public interface IResponseService
    {
        ApiResponseDto<T> CreateSuccessResponse<T>(T data);
        ApiResponseDto<T> CreateErrorResponse<T>(int code, string message);
    }
}
