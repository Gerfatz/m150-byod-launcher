using System;
using System.Net.Http;
using System.Threading.Tasks;
using ByodLauncher.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ByodLauncher.Hubs
{
    public class SessionHub : Hub<ISessionHub>
    {
        private readonly ByodLauncherContext _context;

        public SessionHub(ByodLauncherContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Set ConnectionId property to null for disconnected participant/director. 
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            var participant = await _context.Participants
                .Include(p => p.Session)
                .Include(p => p.Session.Director)
                .SingleOrDefaultAsync(p => p.ConnectionId == connectionId);
            if (participant != null)
            {
                participant.ConnectionId = null;
                _context.Update(participant);
                await NotifyDirectorForParticipantLeave(participant.Session.Director.ConnectionId, participant.Id);
            }
            else
            {
                var director = await _context.Directors.SingleOrDefaultAsync(d => d.ConnectionId == connectionId);
                if (director != null)
                {
                    director.ConnectionId = null;
                    _context.Update(director);
                }
            }

            await _context.SaveChangesAsync();

            await base.OnDisconnectedAsync(exception);
        }

        public async Task StartSession(Guid sessionId)
        {
            var session = await _context.Sessions
                .Include(sess => sess.Director)
                .SingleOrDefaultAsync(sess => sess.Id == sessionId);
            session.CurrentStage = 0;
            _context.Sessions.Update(session);

            session.Director.ConnectionId = Context.ConnectionId;
            _context.Directors.Update(session.Director);
            await _context.SaveChangesAsync();

            // Add director to group
            await AddToGroup(sessionId.ToString());

            // Start session on client
            await Clients.Caller.StartSession(sessionId, session.Director.DisplayName);
        }

        public async Task UpdateStageNumber(Guid sessionId, int stageNumber)
        {
            await Clients.Group(sessionId.ToString()).UpdateStageNumber(stageNumber);
            var session = await _context.Sessions.FindAsync(sessionId);
            if (session != null)
            {
                session.CurrentStage = stageNumber;
                _context.Update(session);
                await _context.SaveChangesAsync();
            }
        }

        public async Task JoinSession(Guid sessionId, string displayName, string username, string password)
        {
            var participant = new Participant
            {
                SessionId = sessionId,
                DisplayName = displayName,
                ConnectionId = Context.ConnectionId,
            };
            await _context.Participants.AddAsync(participant);
            await _context.SaveChangesAsync();

            var session = await _context.Sessions
                .Include(sess => sess.Director)
                .SingleOrDefaultAsync(sess => sess.Id == sessionId);

            await NotifyDirecterForNewParticipant(session.Director.ConnectionId, participant.Id, displayName);

            await AddToGroup(sessionId.ToString());
            await Clients.Caller.JoinSession(sessionId, participant.Id, displayName);
        }

        public async Task JoinSessionAsParticipant(Guid participantId)
        {
            var participant = await _context.Participants
                .Include(p => p.Session)
                .ThenInclude(session => session.Director)
                .SingleOrDefaultAsync(p => p.Id == participantId);

            participant.ConnectionId = Context.ConnectionId;
            _context.Update(participant);
            await _context.SaveChangesAsync();

            await NotifyDirecterForNewParticipant(
                participant.Session.Director.ConnectionId,
                participantId,
                participant.DisplayName
            );

            await AddToGroup(participant.SessionId.ToString());
            await Clients.Caller.JoinSession(participant.SessionId, participant.Id, participant.DisplayName);

            //await SendCurrentStageNumber(participant.Session);
        }

        private async Task SendCurrentStageNumber(Session session)
        {
            if (session.CurrentStage != null)
            {
                await Clients.Group(session.Id.ToString()).UpdateStageNumber((int) session.CurrentStage);
            }
        }

        private async Task NotifyDirecterForNewParticipant(
            string directorConnectionId,
            Guid participantId,
            string participantDisplayName
        )
        {
            if (!string.IsNullOrEmpty(directorConnectionId))
            {
                await Clients.Client(directorConnectionId)
                    .ParticipantJoinedSession(participantId, participantDisplayName);
            }
        }

        private async Task NotifyDirectorForParticipantLeave(string directorConnectionId, Guid participantId)
        {
            if (!string.IsNullOrEmpty(directorConnectionId))
            {
                await Clients.Client(directorConnectionId)
                    .ParticipantLeftSession(participantId);
            }
        }

        private async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        private async void RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}