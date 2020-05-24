using System;
using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models
{
    public class Participant
    {
        public Guid Id { get; set; }

        [Required] [StringLength(100)] public string DisplayName { get; set; }

        public string ConnectionId { get; set; }
        public Guid SessionId { get; set; }
        public Session Session { get; set; }
    }
}