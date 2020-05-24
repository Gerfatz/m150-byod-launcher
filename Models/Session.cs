using System;
using System.Collections.Generic;

namespace ByodLauncher.Models
{
    public class Session
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string AccessCode { get; set; }

        public string EditCode { get; set; }

        public Guid DirectorId { get; set; }
        public Director Director { get; set; }

        public int? CurrentStage { get; set; } = null;

        public ICollection<Stage> Stages { get; set; }

        public ICollection<Participant> Participants { get; set; }
    }
}