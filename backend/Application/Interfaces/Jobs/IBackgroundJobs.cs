namespace Portfolio.Backend.Application.Interfaces.Jobs
{
    public interface IBackgroundJobs
    {
        Task SyncProjectsJob();
    }
}
