namespace backend.Interfaces.Jobs
{
    public interface IBackgroundJobs
    {
        Task SyncProjectsJob();
    }
}
