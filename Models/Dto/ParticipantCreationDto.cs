using System.ComponentModel.DataAnnotations;

namespace ByodLauncher.Models.Dto
{
    public class ParticipantCreationDto
    {
        [Required] public string Username { get; set; }
        [Required] public string Password { get; set; }
        [Required] [StringLength(100)] public string DisplayName { get; set; }
    }
}