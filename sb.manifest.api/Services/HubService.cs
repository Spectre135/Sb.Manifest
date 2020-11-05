using Microsoft.AspNetCore.SignalR;
using sb.manifest.api.Hubs;
using sb.manifest.api.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sb.manifest.api.Services
{
    public static class HubService
    {
        private static readonly DisplayHub displayHub = new DisplayHub();
        public static void SendLoadList(MResponse mResponse, IHubContext<DisplayHub> hubContext)
        {
            try
            {
                var task = Task.Run(async () => await displayHub.Send(mResponse, hubContext));
            }catch (Exception ex)
            {
                //TODOD logger
            }
            
        }

    }
}
