using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models.Dto
{
    public class SimpleScriptTargetDto : TargetDto
    {
        [Required] public string Script { get; set; }
    }
}