using System;
using System.Threading.Tasks;
using ByodLauncher.Models;

namespace ByodLauncher.Hubs
{
    public interface ISessionHub
    {
        Task StartSession(Guid sessionId, string displayName);
        Task JoinSession(Guid sessionId, Guid participantId, string displayName);
        Task ParticipantJoinedSession(Guid participantId, string displayName);
        Task ParticipantLeftSession(Guid participantId);
        Task ReceiveTargetResult(Guid targetId, Guid participantId, bool success, string details);
        Task RemoveTargetResult(Guid targetId, Guid participantId);
        Task UpdateStageNumber(int stageNumber);
    }
}