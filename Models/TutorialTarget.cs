using System.Collections.Generic;

namespace ByodLauncher.Models
{
    public class TutorialTarget : Target
    {
        public ICollection<TutorialStep> Steps { get; set; }
    }
}