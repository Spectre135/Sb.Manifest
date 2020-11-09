#region using
using Microsoft.AspNetCore.SignalR;
using sb.manifest.api.Hubs;
using sb.manifest.api.Model;
using System;
using System.Threading;
#endregion

namespace sb.manifest.api.Services
{
    public static class HubService
    {
        private static readonly DisplayHub displayHub = new DisplayHub();
        private static readonly AlertHub alertHub = new AlertHub();
        public static void SendLoadList(MResponse mResponse, IHubContext<DisplayHub> hubContext)
        {
            try
            {
                //var task = Task.Run(async () => await displayHub.Send(mResponse, hubContext));
                Thread t = new Thread(async () => await displayHub.Send(mResponse, hubContext));
                t.Start();
            }
            catch (Exception ex)
            {
                //TODOD logger
            }
            
        }
        public static void SendAlert(MResponse mResponse, IHubContext<AlertHub> hubContext)
        {
            try
            {
                Thread t = new Thread(async () => await alertHub.Send(mResponse, hubContext));
                t.Start();
            }
            catch (Exception ex)
            {
                //TODOD logger
            }

        }
    }
}
