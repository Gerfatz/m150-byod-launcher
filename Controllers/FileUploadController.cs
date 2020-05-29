using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : Controller
    {
        private readonly IConfiguration _configuration;

        public FileUploadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile upload)
        {
            if (upload.Length > 0)
            {
                var fileName = Path.GetRandomFileName() + Path.GetExtension(upload.FileName);
                var filePath = _configuration["FileUpload:FilesystemAbsolutePath"];
                var urlPath = _configuration["FileUpload:UriPathSegment"];
                var fullPath = Path.Combine(filePath, fileName);
                await using (var stream = System.IO.File.Create(fullPath))
                {
                    await upload.CopyToAsync(stream);
                }

                return Ok(new {url = $"{urlPath}/{fileName}"});
            }

            return BadRequest();
        }
    }
}