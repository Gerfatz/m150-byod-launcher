using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ByodLauncher.Utilities;
using ByodLauncher.Utilities.JsonConverter;

namespace ByodLauncher.Models.Dto
{
    [JsonConverter(typeof(TargetDtoJsonConverter))]
    public class TargetDto
    {
        [JsonConverter(typeof(GuidConverter))] public Guid Id { get; set; }

        [Required] [StringLength(100)] public string Title { get; set; }

        public string Description { get; set; }

        public bool RequiresCredentials { get; set; }

        [JsonConverter(typeof(GuidConverter))] public Guid CategoryId { get; set; }
        public Category Category { get; set; }
    }
}