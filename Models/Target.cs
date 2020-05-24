using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models
{
    public abstract class Target
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool RequiresCredentials { get; set; }

        public Guid? CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<StageTarget> StageTargets { get; set; }

        public ICollection<TargetResult> Results { get; set; }

        public ICollection<TargetDependency> Dependers { get; set; }

        public ICollection<TargetDependency> Dependees { get; set; }
    }
}