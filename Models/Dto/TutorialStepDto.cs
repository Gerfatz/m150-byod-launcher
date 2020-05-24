using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;

namespace ByodLauncher.Models.Dto
{
    public class TutorialStepDto
    {
        [JsonConverter(typeof(GuidConverter))] public Guid Id { get; set; }

        [Required] public int SequenceNumber { get; set; }

        [Required] [StringLength(100)] public string Title { get; set; }

        public string Instruction { get; set; }

        [Required]
        [JsonConverter(typeof(GuidConverter))]
        public Guid TutorialTargetId { get; set; }
    }
}