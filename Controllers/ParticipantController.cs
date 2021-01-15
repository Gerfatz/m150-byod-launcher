using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ByodLauncher.Hubs;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("api/session/{sessionId}/[controller]")]
    public class ParticipantController : Controller
    {
        private readonly ByodLauncherContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<SessionHub, ISessionHub> _sessionHub;


        public ParticipantController(ByodLauncherContext context, IConfiguration configuration, IHubContext<SessionHub, ISessionHub> sessionHub)
        {
            _context = context;
            _configuration = configuration;
            _sessionHub = sessionHub;
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateParticipant(Guid sessionId, ParticipantCreationDto participantDto)
        {
            Participant participant = new Participant {SessionId = sessionId, DisplayName = participantDto.DisplayName};

            await _context.Participants.AddAsync(participant);
            await _context.SaveChangesAsync();

            HttpContext.Session.SetString("username", participantDto.Username);
            HttpContext.Session.SetString("password", participantDto.Password);
            HttpContext.Session.SetString("participantId", participant.Id.ToString());

            return GetResponseUrl(participant.Id);
        }


        [HttpGet("/api/joinSession/{participantId}", Name = "JoinSession")]
        public async Task<IActionResult> JoinSession(Guid participantId)
        {
            var participant = await _context.Participants.FindAsync(participantId);
            if (participant == null)
            {
                return NotFound();
            }

            return Redirect(participantId);
        }

        [HttpPost]
        [Route("requestHelp/{participantId}")]
        public async Task<IActionResult> RequestHelp(Guid sessionId, Guid participantId)
        {
            Participant participant = await _context.Participants
                .Include(p => p.Session)
                    .ThenInclude(session => session.Director)
                .Include(p => p.Session)
                    .ThenInclude(p => p.Participants)
                .SingleOrDefaultAsync(p => p.Id == participantId);

            if(participant == null)
            {
                return NotFound();
            }

            participant.NeedsHelp = !participant.NeedsHelp;
            await _context.SaveChangesAsync();

            await _sessionHub.Clients
                .Client(participant.Session.Director.ConnectionId)
                .UpdateParticipantsThatNeedHelp(participant.Session.Participants.Where(p => p.NeedsHelp).Select(p => p.DisplayName));

            return Ok();
        }

        private RedirectResult Redirect(Guid participantId)
        {
            var uriTemplate = _configuration["JoinSessionUriTemplate:Path"];
            var placeholder = _configuration["JoinSessionUriTemplate:Placeholder"];
            var path = uriTemplate.Replace(placeholder, participantId.ToString());

            var scheme = Request.Scheme;
            var domain = Request.Host.ToString();

            var fullUri = $"{scheme}://{domain}{path}";

            return Redirect(fullUri);
        }

        private string GetResponseUrl(Guid participantId)
        {
            var scheme = Request.Scheme;
            var domain = Request.Host.ToString();
            var path = Url.Action("JoinSession", new {participantId});
            return $"{scheme}://{domain}{path}";
        }
    }
}