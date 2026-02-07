namespace Portfolio.Backend.Application.Enums.Error
{
    public enum Errors
    {
        // General Errors
        UNKNOWN_ERROR = -100,

        // Database Errors
        GENERAL_DATABASE_ERROR = -200,
        CANNOT_CONNECT_DATABASE = -201,
        CANNOT_READ_DATA = -202,
        CANNOT_WRITE_DATA = -203,
        DATA_NOT_FOUND = -204,
    }
}
