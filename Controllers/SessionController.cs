using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using ByodLauncher.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace ByodLauncher.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;
        private readonly SessionCodeService _sessionCodeService;

        public SessionController(ByodLauncherContext context, IMapper mapper, SessionCodeService sessionCodeService)
        {
            _context = context;
            _mapper = mapper;
            _sessionCodeService = sessionCodeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SessionDto>>> GetSession(
            [FromQuery(Name = "accessCode")] string accessCode,
            [FromQuery(Name = "editCode")] string editCode
        )
        {
            List<Session> sessions;

            var query = _context.Sessions
                .Include(s => s.Stages)
                .ThenInclude(stage => stage.StageTargets)
                .ThenInclude(stageTarget => stageTarget.Target);

            if (string.IsNullOrEmpty(accessCode) && string.IsNullOrEmpty(editCode))
            {
                sessions = await query.ToListAsync();
            }
            else if (!string.IsNullOrEmpty(accessCode))
            {
                sessions = await query.Where(session => session.AccessCode == accessCode).ToListAsync();
            }
            else
            {
                sessions = await query.Where(session => session.EditCode == editCode).ToListAsync();
            }

            return _mapper.Map<List<Session>, List<SessionJoinRequestDto>>(sessions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SessionDto>> GetSession(Guid id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null)
            {
                return NotFound();
            }

            return _mapper.Map<SessionDto>(session);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSession(Guid id, SessionDto sessionDto)
        {
            var session = _mapper.Map<Session>(sessionDto);
            if (id != session.Id)
            {
                return BadRequest();
            }

            _context.Entry(session).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SessionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<SessionDto>> PostSession(SessionDto sessionDto)
        {
            var session = _mapper.Map<Session>(sessionDto);
            session.AccessCode = _sessionCodeService.GetSessionCode();
            session.EditCode = _sessionCodeService.GetSessionCode();
            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSession", new {id = sessionDto.Id}, _mapper.Map<SessionDto>(session));
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<SessionDto>> DeleteSession(Guid id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null)
            {
                return NotFound();
            }

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();

            return _mapper.Map<SessionDto>(session);
        }

        private bool SessionExists(Guid id)
        {
            return _context.Sessions.Any(e => e.Id == id);
        }
    }
}