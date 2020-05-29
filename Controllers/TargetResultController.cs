using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ByodLauncher.Hubs;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TargetResultController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;
        private readonly IHubContext<SessionHub, ISessionHub> _sessionHub;

        public TargetResultController(
            ByodLauncherContext context,
            IMapper mapper,
            IHubContext<SessionHub, ISessionHub> sessionHub
        )
        {
            _context = context;
            _mapper = mapper;
            _sessionHub = sessionHub;
        }

        [HttpPost]
        public async Task<ActionResult<TargetResultDto>> PostTargetResult(TargetResultDto targetResultDto)
        {
            var participant = await _context.Participants.FindAsync(targetResultDto.ParticipantId);
            if (participant == null)
            {
                return BadRequest();
            }

            var target = await _context.Targets.FindAsync(targetResultDto.TargetId);
            if (target == null)
            {
                return BadRequest();
            }

            var targetResult = _mapper.Map<TargetResult>(targetResultDto);
            targetResult.Timestamp = DateTime.Now;

            await _context.TargetResults.AddAsync(targetResult);
            await _context.SaveChangesAsync();

            await NotifyDirectorNewTargetResult(participant.SessionId, targetResult);

            return targetResultDto;
        }

        [HttpDelete]
        public async Task<ActionResult<TargetResultDto>> DeleteActionResult(
            [FromQuery] Guid targetId,
            [FromQuery] Guid participantId
        )
        {
            var targetResult = await _context.TargetResults
                .Include(tr => tr.Participant)
                .OrderByDescending(tr => tr.Timestamp)
                .FirstOrDefaultAsync(tr => tr.TargetId == targetId && tr.ParticipantId == participantId);

            if (targetResult == null)
            {
                return BadRequest();
            }

            _context.TargetResults.Remove(targetResult);
            await _context.SaveChangesAsync();

            await NotifyDirectorRemoveTargetResult(targetResult.Participant.SessionId, targetResult);

            return _mapper.Map<TargetResultDto>(targetResult);
        }

        /// <summary>
        /// Notify the sessions director about a new target result.
        /// </summary>
        /// <param name="sessionId">Id of the session for which a new target result should be delivered</param>
        /// <param name="targetResult">Target result object containing all relevant data</param>
        /// <returns></returns>
        private async Task NotifyDirectorNewTargetResult(Guid sessionId, TargetResult targetResult)
        {
            var session = await GetSession(sessionId);

            if (!string.IsNullOrEmpty(session.Director.ConnectionId))
            {
                await _sessionHub.Clients.Client(session.Director.ConnectionId)
                    .ReceiveTargetResult(
                        targetResult.TargetId,
                        targetResult.ParticipantId,
                        targetResult.Success,
                        targetResult.Details
                    );
            }
        }

        private async Task NotifyDirectorRemoveTargetResult(Guid sessionId, TargetResult targetResult)
        {
            var session = await GetSession(sessionId);

            if (!string.IsNullOrEmpty(session.Director.ConnectionId))
            {
                await _sessionHub.Clients.Client(session.Director.ConnectionId)
                    .RemoveTargetResult(targetResult.TargetId, targetResult.ParticipantId);
            }
        }

        private async Task<Session> GetSession(Guid sessionId)
        {
            return await _context.Sessions
                .Include(s => s.Director)
                .SingleOrDefaultAsync(s => s.Id == sessionId);
        }
    }
}