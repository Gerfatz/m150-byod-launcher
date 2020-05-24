using System;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models
{
    public class TargetDependency
    {
        public Guid DependerId { get; set; }

        /// <summary>
        /// The target that depends on the dependee.
        /// </summary>
        [Required]
        public Target Depender { get; set; }

        public Guid DependeeId { get; set; }

        /// <summary>
        /// The target that the depender depends on.
        /// </summary>
        [Required]
        public Target Dependee { get; set; }
    }
}