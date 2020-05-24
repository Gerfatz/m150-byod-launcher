using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;

namespace ByodLauncher.Models.Dto
{
    public class SessionDto
    {
        [JsonConverter(typeof(GuidConverter))] public Guid Id { get; set; }
        [Required] [StringLength(100)] public string Title { get; set; }
        public string AccessCode { get; set; }
        public string EditCode { get; set; }
        public Guid DirectorId { get; set; }
        public int CurrentStage { get; set; } = 0;
    }
}