using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRChat.Hubs
{
    public class D365Hub : Hub
    {

        private IList<string> _connectedUsers, _editingUsers = new List<string>();

        public D365Hub() {
            _connectedUsers = new List<string>();
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
            foreach(var user in _connectedUsers) {
                await Clients.Client(Context.ConnectionId).SendAsync("UserConnected", user);
            }
            _connectedUsers.Add(Context.GetHttpContext().Request.Query["UserId"]);
            await Groups.AddToGroupAsync(Context.ConnectionId, Context.GetHttpContext().Request.Query["RecordId"]);
            await Clients.GroupExcept(Context.GetHttpContext().Request.Query["RecordId"], Context.ConnectionId).SendAsync("UserConnected", Context.GetHttpContext().Request.Query["UserId"]);
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            _connectedUsers.Remove(Context.GetHttpContext().Request.Query["UserId"]);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Context.GetHttpContext().Request.Query["RecordId"]);
            await Clients.Group(Context.GetHttpContext().Request.Query["RecordId"]).SendAsync("UserDisconnected", Context.GetHttpContext().Request.Query["UserId"]);
        }
    }
}