#region using
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using sb.manifest.api.DAO;
using sb.manifest.api.Hubs;
using sb.manifest.api.Model;
using sb.manifest.api.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
#endregion

namespace sb.manifest.api.Tasks
{
    public class LoadAlertBackgroundTask : IHostedService, IDisposable
    {
        private Timer timer;
        private readonly IConfiguration config;
        private readonly IHubContext<AlertHub> hubContext;

        public LoadAlertBackgroundTask(IConfiguration configuration, IHubContext<AlertHub> _hubContext)
        {
            config = configuration;
            hubContext = _hubContext;
        }
        public void Dispose()
        {
            timer?.Dispose();
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(o => {
                SendAlert();
            },
            null,
            TimeSpan.Zero,
            TimeSpan.FromSeconds(60));

            return Task.CompletedTask;
        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
        private void SendAlert()
        {
            MResponse mResponse = new MResponse();

            using LoadDAO dao = new LoadDAO();
                mResponse= dao.GetLoads(config,0,true);

            HubService.SendAlert(mResponse, hubContext);
        } 
    }

}
