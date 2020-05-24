using System;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models
{
    public class TutorialStep
    {
        public Guid Id { get; set; }

        public int SequenceNumber { get; set; }

        public string Title { get; set; }

        public string Instruction { get; set; }

        public Guid TutorialTargetId { get; set; }
        public TutorialTarget TutorialTarget { get; set; }
    }
}