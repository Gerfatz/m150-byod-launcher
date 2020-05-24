using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;

namespace ByodLauncher.Models.Dto
{
    public class StageDto
    {
        [JsonConverter(typeof(GuidConverter))] public Guid Id { get; set; }
        [Required] public int SequenceNumber { get; set; }
        [Required] [StringLength(100)] public string Title { get; set; }
        [JsonConverter(typeof(GuidConverter))] public Guid SessionId { get; set; }
    }
}