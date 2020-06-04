using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace ByodLauncher.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;

        public DirectorController(ByodLauncherContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DirectorDto>>> GetDirectorDto()
        {
            return _mapper.Map<List<Director>, List<DirectorDto>>(await _context.Directors.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DirectorDto>> GetDirectorDto(Guid id)
        {
            var director = await _context.Directors.FindAsync(id);

            if (director == null)
            {
                return NotFound();
            }

            return _mapper.Map<DirectorDto>(director);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirectorDto(Guid id, DirectorDto directorDto)
        {

            if (id != directorDto.Id)
            {
                return BadRequest();
            }

            var director = _mapper.Map<Director>(directorDto);
            _context.Entry(director).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorDtoExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<DirectorDto>> PostDirectorDto(DirectorDto directorDto)
        {
            var director = _mapper.Map<Director>(directorDto);
            _context.Directors.Add(director);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDirectorDto", new {id = directorDto.Id}, _mapper.Map<DirectorDto>(director));
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<DirectorDto>> DeleteDirectorDto(Guid id)
        {
            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound();
            }

            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();

            return _mapper.Map<DirectorDto>(director);
        }

        private bool DirectorDtoExists(Guid id)
        {
            return _context.Directors.Any(e => e.Id == id);
        }
    }
}