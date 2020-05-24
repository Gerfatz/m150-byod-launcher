using System;

namespace ByodLauncher.Models
{
    public class StageTarget
    {
        public Guid StageId { get; set; }
        public Stage Stage { get; set; }

        public Guid TargetId { get; set; }
        public Target Target { get; set; }
    }
}