using backend.Enums.Error;
using backend.Interfaces.Response;
using backend.Models.Response;

namespace backend.Services.Response
{
    public class ResponseService : IResponseService
    {
        public ResponseService() { }

        public ApiResponseDto<T> CreateSuccessResponse<T>(T data)
        {
            try
            {
                var response = new ApiResponseDto<T>
                {
                    Success = true,
                    Data = data,
                    Error = null,
                };
                return response;
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<T>
                {
                    Success = false,
                    Data = default,
                    Error = new ApiErrorDto { Code = "Exception", Message = ex.Message },
                };
            }
        }

        public ApiResponseDto<T> CreateErrorResponse<T>(int code, string message)
        {
            try
            {
                string codeText = code.ToString();
                try
                {
                    var errorEnum = (Errors)code;
                    codeText = errorEnum.ToString();
                }
                catch { }
                var response = new ApiResponseDto<T>
                {
                    Success = false,
                    Data = default,
                    Error = new ApiErrorDto { Code = codeText, Message = message },
                };
                return response;
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<T>
                {
                    Success = false,
                    Data = default,
                    Error = new ApiErrorDto { Code = "Exception", Message = ex.Message },
                };
            }
        }
    }
}
