using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ByodLauncher.Utilities
{
    public class GuidConverter : JsonConverter<Guid>
    {
        public override Guid Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // return Guid.Empty;
            string value = reader.GetString();
            return string.IsNullOrEmpty(value) ? default : Guid.Parse(value);
        }

        public override void Write(Utf8JsonWriter writer, Guid value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value);
        }
    }
}