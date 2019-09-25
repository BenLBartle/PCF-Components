using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRChat.Hubs
{
    public class D365Hub : Hub
    {

        private static IDictionary<string, IList<string>> _connectedUsers

        static D365Hub()
        {
            _connectedUsers = new Dictionary<string, IList<string>>();
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task ConnectToRecord(string user, string recordId)
        {

            _connectedUsers.Add(user);
            await Clients.Caller.SendAsync("ConnectionEstablished", _connectedUsers);
            await Clients.All.SendAsync("UserConnected", user);
        }

        public override async Task OnConnectedAsync()
        {
            Microsoft.Extensions.Primitives.StringValues groupName = Context.GetHttpContext().Request.Query["RecordId"];
            Microsoft.Extensions.Primitives.StringValues userId = Context.GetHttpContext().Request.Query["UserId"];

            if (!_connectedUsers.ContainsKey(groupName))
            {
                _connectedUsers.Add(groupName, new List<string>());
            }
            foreach (var user in _connectedUsers[groupName])
            {
                await Clients.Client(Context.ConnectionId).SendAsync("UserConnected", user);
            }
            if (!_connectedUsers[groupName].Contains(userId))
            {
                _connectedUsers[groupName].Add(Context.GetHttpContext().Request.Query["UserId"]);
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, Context.GetHttpContext().Request.Query["RecordId"]);

            await Clients.GroupExcept(groupName, Context.ConnectionId).SendAsync("UserConnected", Context.GetHttpContext().Request.Query["UserId"][0]);
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            _connectedUsers[Context.GetHttpContext().Request.Query["RecordId"]].Remove(Context.GetHttpContext().Request.Query["UserId"]);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Context.GetHttpContext().Request.Query["RecordId"]);
            await Clients.Group(Context.GetHttpContext().Request.Query["RecordId"]).SendAsync("UserDisconnected", Context.GetHttpContext().Request.Query["UserId"][0]);
        }
    }
}