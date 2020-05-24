using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;

namespace ByodLauncher.Models.Dto
{
    public class TargetResultDto
    {
        [Required] public bool Success { get; set; }

        public string Details { get; set; }

        [JsonConverter(typeof(GuidConverter))] public Guid ParticipantId { get; set; }

        [JsonConverter(typeof(GuidConverter))] public Guid TargetId { get; set; }
    }
}