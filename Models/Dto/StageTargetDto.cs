using System;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models.Dto
{
    public class StageTargetDto
    {
        [Required] public Guid StageId { get; set; }

        [Required] public Guid TargetId { get; set; }
    }
}