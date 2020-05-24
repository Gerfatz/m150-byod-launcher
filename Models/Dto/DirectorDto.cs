using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;

namespace ByodLauncher.Models.Dto
{
    public class DirectorDto
    {
        [JsonConverter(typeof(GuidConverter))] public Guid Id { get; set; }

        [Required] [StringLength(100)] public string DisplayName { get; set; }

        [EmailAddress] public string Email { get; set; }
    }
}