namespace backend.Application.Interfaces.Jobs
{
    public interface IBackgroundJobs
    {
        Task SyncProjectsJob();
    }
}
