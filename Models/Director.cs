using System;
using System.Collections.Generic;

namespace ByodLauncher.Models
{
    public class Director
    {
        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string ConnectionId { get; set; }

        public ICollection<Session> Sessions { get; set; }
    }
}