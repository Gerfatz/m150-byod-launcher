using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models.Dto
{
    public class ParticipantCreationDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        [Required] [StringLength(100)] public string DisplayName { get; set; }
    }
}