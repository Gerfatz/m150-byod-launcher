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
using ByodLauncher.Utilities;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;


namespace ByodLauncher.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TargetController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ByodLauncherContext _context;
        private readonly IConfiguration _configuration;

        public TargetController(ByodLauncherContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
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

        [HttpGet("{id}/installer")]
        public async Task<IActionResult> DownloadInstaller(Guid id)
        {
            var target = await _context.SimpleScriptTargets
                .Include(target => target.StageTargets)
                .ThenInclude(stageTarget => stageTarget.Stage)
                .ThenInclude(stage => stage.Session)
                .SingleOrDefaultAsync(target => target.Id == id);

            if (target == null)
            {
                return NotFound();
            }

            var script = target.Script
                .Replace("PARTICIPANT_ID", HttpContext.Session.GetString("participantId"))
                .Replace("TARGET_ID", target.Id.ToString())
                .Replace("SESSION_ID", target.StageTargets.First().Stage.Session.Id.ToString())
                .Replace("RESPONSE_URL", GetResponseUrl());

            if (target.RequiresCredentials)
            {
                script = script
                    .Replace("USERNAME", HttpContext.Session.GetString("username"))
                    .Replace("PASSWORD", HttpContext.Session.GetString("password"));
            }

            var fileName = new StringBuilder(target.Title);
            foreach (var invalidChar in Path.GetInvalidFileNameChars())
            {
                fileName.Replace(invalidChar, '_');
            }

            // Write powershell script
            var tempPath = Path.GetTempPath();
            var psFileName = Path.GetRandomFileName() + ".ps1";
            var psFilePathAndName = Path.Combine(tempPath, psFileName);
            await using (StreamWriter psFile = new StreamWriter(psFilePathAndName, false))
            {
                psFile.WriteLine(script);
            }

            // Generate and write installer script
            var staticFilesPath = _configuration["FileUpload:FilesystemAbsolutePath"];
            var installerResourcesDirectory = _configuration["FileUpload:InstallerResourcesDirectoryName"];
            var installerResourcesPath = $"{staticFilesPath}/{installerResourcesDirectory}";

            var installerFileName = Path.GetRandomFileName();
            var installerFilePathAndName = Path.Combine(tempPath, installerFileName);
            var installerScript = target.NsisScript
                .Replace("INSTALLER_PATH", tempPath)
                .Replace("INSTALLER_FILENAME", installerFileName)
                .Replace("SCRIPT_PATH", tempPath)
                .Replace("SCRIPT_FILENAME", psFileName)
                .Replace("INSTALLER_RESOURCES_PATH", installerResourcesPath);

            await using (StreamWriter installerFile = new StreamWriter(installerFilePathAndName + ".nsi", false))
            {
                installerFile.WriteLine(installerScript);
            }

            // use 'makensis' to actually generate the installer
            var command = $"makensis {installerFilePathAndName}.nsi";
            command.Bash();

            var contentType = "application/vnd.microsoft.portable-executable";
            return new PhysicalFileResult(installerFilePathAndName + ".exe", contentType)
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