using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("api/target/{tutorialTargetId}/[controller]")]
    public class TutorialStepController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;

        public TutorialStepController(ByodLauncherContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TutorialStepDto>>> GetTutorialSteps(Guid tutorialTargetId)
        {
            var tutorialSteps = await _context.TutorialSteps
                .Where(tutorialStep => tutorialStep.TutorialTargetId == tutorialTargetId).ToListAsync();

            return _mapper.Map<List<TutorialStep>, List<TutorialStepDto>>(tutorialSteps);
        }

        [HttpGet("{tutorialStepId}")]
        public async Task<ActionResult<TutorialStepDto>> GetTutorialStep(Guid tutorialTargetId, Guid tutorialStepId)
        {
            var tutorialStep = await _context.TutorialSteps.FindAsync(tutorialStepId);
            if (tutorialStep == null)
            {
                return NotFound();
            }

            return _mapper.Map<TutorialStepDto>(tutorialStep);
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<ActionResult<TutorialStepDto>> PostTutorialStep(Guid tutorialTargetId,
            TutorialStepDto tutorialStepDto)
        {
            if (tutorialTargetId != tutorialStepDto.TutorialTargetId)
            {
                return BadRequest();
            }

            var tutorialStep = _mapper.Map<TutorialStep>(tutorialStepDto);
            _context.TutorialSteps.Add(tutorialStep);
            await _context.SaveChangesAsync();

            return _mapper.Map<TutorialStepDto>(tutorialStep);
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPut("{tutorialStepId}")]
        public async Task<IActionResult> PutTutorialStep(Guid tutorialTargetId, Guid tutorialStepId,
            TutorialStepDto tutorialStepDto)
        {
            if (tutorialStepId != tutorialStepDto.Id)
            {
                return BadRequest();
            }

            if (tutorialTargetId != tutorialStepDto.TutorialTargetId)
            {
                return BadRequest();
            }

            var tutorialStep = _mapper.Map<TutorialStep>(tutorialStepDto);
            _context.Entry(tutorialStep).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TutorialStepExists(tutorialStepId))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpDelete("{tutorialStepId}")]
        public async Task<ActionResult<TutorialStepDto>> DeleteTutorialStep(Guid tutorialTargetId, Guid tutorialStepId)
        {
            var tutorialStep = await _context.TutorialSteps.FindAsync(tutorialStepId);
            if (tutorialStep == null)
            {
                return NotFound();
            }

            _context.TutorialSteps.Remove(tutorialStep);
            await _context.SaveChangesAsync();

            return _mapper.Map<TutorialStepDto>(tutorialStep);
        }

        private bool TutorialStepExists(Guid id)
        {
            return _context.TutorialSteps.Any(e => e.Id == id);
        }
    }
}