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

namespace ByodLauncher.Controllers
{
    [Route("api/session/{sessionId}/[controller]")]
    [ApiController]
    public class StageController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;

        public StageController(ByodLauncherContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Stage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StageDto>>> GetStages(Guid sessionId)
        {
            List<Stage> stages;
            if (sessionId.Equals(Guid.Empty))
            {
                stages = await _context.Stages.ToListAsync();
            }
            else
            {
                stages = await _context.Stages.Where(stage => stage.SessionId.Equals(sessionId)).ToListAsync();
            }

            return _mapper.Map<List<Stage>, List<StageDto>>(stages);
        }

        // GET: api/Stage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StageDto>> GetStage(Guid id)
        {
            var stage = await _context.Stages.FindAsync(id);

            if (stage == null)
            {
                return NotFound();
            }

            return _mapper.Map<StageDto>(stage);
        }

        // PUT: api/Stage/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStage(Guid id, StageDto stageDto)
        {
            var stage = _mapper.Map<Stage>(stageDto);
            if (id != stage.Id)
            {
                return BadRequest();
            }

            _context.Entry(stage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StageExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Stage
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<StageDto>> PostStage(Guid sessionId, StageDto stageDto)
        {
            stageDto.SessionId = sessionId;
            var stage = _mapper.Map<Stage>(stageDto);
            _context.Stages.Add(stage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStage", new {sessionId = sessionId, id = stage.Id},
                _mapper.Map<StageDto>(stage));
        }

        // DELETE: api/Stage/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StageDto>> DeleteStage(Guid id)
        {
            var stage = await _context.Stages.FindAsync(id);
            if (stage == null)
            {
                return NotFound();
            }

            _context.Stages.Remove(stage);
            await _context.SaveChangesAsync();

            return _mapper.Map<StageDto>(stage);
        }

        private bool StageExists(Guid id)
        {
            return _context.Stages.Any(e => e.Id == id);
        }
    }
}