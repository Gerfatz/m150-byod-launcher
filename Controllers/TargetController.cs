using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;

namespace ByodLauncher.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TargetController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;

        public TargetController(ByodLauncherContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Target
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TargetDto>>> GetTargets()
        {
            return _mapper.Map<List<Target>, List<TargetDto>>(await _context.Targets.ToListAsync());
        }

        // GET: api/Target/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TargetDto>> GetTarget(Guid id)
        {
            var target = await _context.Targets.FindAsync(id);

            if (target is TutorialTarget)
            {
                target = await _context.TutorialTargets
                    .Include(tt => tt.Steps)
                    .SingleOrDefaultAsync(tt => tt.Id == id);
            }

            if (target == null)
            {
                return NotFound();
            }

            return _mapper.Map<TargetDto>(target);
        }

        // PUT: api/Target/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarget(Guid id, TargetDto targetDto)
        {
            var target = _mapper.Map<Target>(targetDto);
            if (id != target.Id)
            {
                return BadRequest();
            }

            _context.Entry(target).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TargetExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Target
        [HttpPost]
        public async Task<ActionResult<TargetDto>> PostTarget(TargetDto targetDto)
        {
            var target = _mapper.Map<Target>(targetDto);

            if (target.CategoryId.Equals(Guid.Empty))
            {
                target.CategoryId = null;
            }

            await _context.Targets.AddAsync(target);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTarget", new {id = target.Id}, _mapper.Map<TargetDto>(target));
        }

        // DELETE: api/Target/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TargetDto>> DeleteTarget(Guid id)
        {
            var target = await _context.Targets.FindAsync(id);
            if (target == null)
            {
                return NotFound();
            }

            _context.Targets.Remove(target);
            await _context.SaveChangesAsync();

            return _mapper.Map<TargetDto>(target);
        }

        [HttpGet("{id}/script")]
        public async Task<IActionResult> DownloadScript(Guid id)
        {
            var target = await _context.SimpleScriptTargets.FindAsync(id);
            if (target == null)
            {
                return NotFound();
            }

            var script = target.Script
                .Replace("PARTICIPANT_ID", HttpContext.Session.GetString("participantId"))
                .Replace("TARGET_ID", target.Id.ToString());

            // TODO: Replace RESPONSE_URL

            if (target.RequiresCredentials)
            {
                script = script
                    .Replace("USERNAME", HttpContext.Session.GetString("username"))
                    .Replace("PASSWORD", HttpContext.Session.GetString("password"));
            }

            var scriptContent = Encoding.ASCII.GetBytes(script);
            var contentType = "APPLICATION/octet-stream";
            var fileName = "script.ps1";
            return File(scriptContent, contentType, fileName);
        }

        private bool TargetExists(Guid id)
        {
            return _context.Targets.Any(e => e.Id == id);
        }
    }
}