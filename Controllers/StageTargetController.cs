using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("/api/stage/{stageId}/[controller]")]
    public class StageTargetController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;

        public StageTargetController(ByodLauncherContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TargetDto>>> GetStageTargets(Guid stageId)
        {
            var targets = await _context.StageTargets
                .Include(st => st.Target)
                .Where(st => st.StageId == stageId)
                .Select(st => st.Target)
                .ToListAsync();

            return _mapper.Map<List<Target>, List<TargetDto>>(targets);
        }

        [HttpGet("{targetId}")]
        public async Task<ActionResult<TargetDto>> GetStageTarget(Guid stageId, Guid targetId)
        {
            var target = await _context.StageTargets
                .Include(st => st.Target)
                .Where(st => st.StageId == stageId && st.TargetId == targetId)
                .Select(st => st.Target)
                .FirstOrDefaultAsync();

            return _mapper.Map<TargetDto>(target);
        }

        [HttpPost]
        public async Task<ActionResult<TargetDto>> PostStageTarget(Guid stageId, StageTargetDto stageTargetDto)
        {
            if (stageId != stageTargetDto.StageId)
            {
                return BadRequest();
            }

            var target = await _context.Targets.FindAsync(stageTargetDto.TargetId);
            if (target == null)
            {
                return NotFound();
            }

            var stageTarget = _mapper.Map<StageTarget>(stageTargetDto);
            _context.StageTargets.Add(stageTarget);
            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(GetStageTarget),
                new {stageId, targetId = stageTarget.TargetId},
                _mapper.Map<TargetDto>(target)
            );
        }

        [HttpDelete("{targetId}")]
        public async Task<ActionResult<TargetDto>> DeleteStageTarget(Guid stageId, Guid targetId)
        {
            var stageTarget = await _context.StageTargets
                .Include(st => st.Target)
                .SingleOrDefaultAsync(st => st.StageId == stageId && st.TargetId == targetId);
            if (stageTarget == null)
            {
                return NotFound();
            }

            _context.StageTargets.Remove(stageTarget);
            await _context.SaveChangesAsync();

            return _mapper.Map<TargetDto>(stageTarget.Target);
        }
    }
}