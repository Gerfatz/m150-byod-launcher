using System;
using System.Collections.Generic;

namespace ByodLauncher.Models.Dto
{
    public class TutorialTargetDto : TargetDto
    {
        public ICollection<Guid> StepIds { get; set; }
    }
}