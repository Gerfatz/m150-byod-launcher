using System;
using System.Collections.Generic;

namespace ByodLauncher.Models
{
    public class Stage
    {
        public Guid Id { get; set; }

        public int SequenceNumber { get; set; }

        public string Title { get; set; }

        public Guid SessionId { get; set; }
        public Session Session { get; set; }

        public ICollection<StageTarget> StageTargets { get; set; }
    }
}