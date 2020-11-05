#region using
using Microsoft.AspNetCore.SignalR;
using sb.manifest.api.Filter;
using sb.manifest.api.Model;
using System;
using System.Threading.Tasks;
#endregion

namespace sb.manifest.api.Hubs
{
    public class DisplayHub : Hub
    {
        public async Task Send(MResponse mResponse, IHubContext<DisplayHub> hubContext)
        {
            if (hubContext.Clients != null)
                await hubContext.Clients.All.SendAsync("messageReceived", mResponse);
        }
        public override Task OnConnectedAsync()
        {
            //Check auth token before connect to Hub
            var token = Context.GetHttpContext().Request.Query["access_token"];
            if (!Authorization.ValidateToken(token))
                return null;

            return base.OnConnectedAsync();
        }
    }
}
