using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models
{
    public class Category
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public ICollection<Target> Targets { get; set; }
    }
}