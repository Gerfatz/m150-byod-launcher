using System;

namespace ByodLauncher.Models
{
    public class TargetResult
    {
        public Guid Id { get; set; }

        public bool Success { get; set; }

        public string Details { get; set; }

        public DateTime Timestamp { get; set; }

        public Guid ParticipantId { get; set; }
        public Participant Participant { get; set; }

        public Guid TargetId { get; set; }
        public Target Type { get; set; }
    }
}