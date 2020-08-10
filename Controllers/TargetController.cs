using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

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

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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
                .Replace("TARGET_ID", target.Id.ToString())
                .Replace("RESPONSE_URL", GetResponseUrl());

            if (target.RequiresCredentials)
            {
                script = script
                    .Replace("USERNAME", HttpContext.Session.GetString("username"))
                    .Replace("PASSWORD", HttpContext.Session.GetString("password"));
            }

            var fileName = new StringBuilder(target.Title);
            foreach (var invalidChar in System.IO.Path.GetInvalidFileNameChars())
            {
                fileName.Replace(invalidChar, '_');
            }

            // Write powershell script
            var tempPath = Path.GetTempPath();
            var psFileName = Path.GetRandomFileName() + ".ps1";
            var psFilePathAndName = Path.Combine(tempPath, psFileName);
            Console.WriteLine($"Powershell script: {psFilePathAndName}");
            await using (StreamWriter psFile = new StreamWriter(psFilePathAndName, false))
            {
                psFile.WriteLine(script);
            }

            // Generate and write installer script
            var installerFileName = Path.GetRandomFileName();
            var installerScript = $@"
!include x64.nsh

RequestExecutionLevel admin
OutFile ""{installerFileName}.exe""
SilentInstall silent

Section
    SetOutPath $EXEDIR
    File ""{psFilePathAndName}""
ExecWait ""powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File .\{psFileName}""
SectionEnd

Function .onInstSuccess
    Delete ""{psFileName}""
FunctionEnd
";
            var installerFilePathAndName = Path.Combine(tempPath, installerFileName) + ".nsi";
            Console.WriteLine($"Installer: {installerFilePathAndName}");
            await using (StreamWriter installerFile = new StreamWriter(installerFilePathAndName, false))
            {
                installerFile.WriteLine(installerScript);
            }
            
            // use 'makensis' to actually generate the installer
            var command = $"makensis {installerFilePathAndName}";
            Console.WriteLine($"Shell command: {command}");

            var contentType = "application/vnd.microsoft.portable-executable";
            return new PhysicalFileResult(Path.Combine(tempPath, installerFileName) + ".exe", contentType)
            {
                FileDownloadName = $"{fileName}.exe"
            };
        }

        private bool TargetExists(Guid id)
        {
            return _context.Targets.Any(e => e.Id == id);
        }

        private string GetResponseUrl()
        {
            var scheme = Request.Scheme;
            var domain = Request.Host.ToString();
            var path = Url.Action("PostTargetResult", "TargetResult");
            return $"{scheme}://{domain}{path}";
        }
    }
}