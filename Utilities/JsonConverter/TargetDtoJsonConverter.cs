using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using ByodLauncher.Models;
using ByodLauncher.Models.Dto;

namespace ByodLauncher.Utilities.JsonConverter
{
    public class TargetDtoJsonConverter : JsonConverter<TargetDto>
    {
        public override bool CanConvert(Type typeToConvert) =>
            typeof(TargetDto).IsAssignableFrom(typeToConvert);

        public override TargetDto Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // Check for null values
            if (reader.TokenType == JsonTokenType.Null)
            {
                return null;
            }

            // Copy the current state from reader (it's a struct).
            // This is required since the JsonDocument.ParseValue call below will change the readers state.
            var readerAtStart = reader;

            using var jsonDocument = JsonDocument.ParseValue(ref reader);
            var jsonObject = jsonDocument.RootElement;

            if (jsonObject.TryGetProperty("script", out _))
            {
                return JsonSerializer.Deserialize(ref readerAtStart, typeof(SimpleScriptTargetDto), options) as
                    SimpleScriptTargetDto;
            }

            if (jsonObject.TryGetProperty("stepIds", out _))
            {
                return JsonSerializer.Deserialize(ref readerAtStart, typeof(TutorialTargetDto), options) as
                    TutorialTargetDto;
            }

            throw new NotSupportedException("Unknown type cannot be deserialized.");
        }

        public override void Write(Utf8JsonWriter writer, TargetDto targetDto, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, targetDto, targetDto.GetType(), options);
        }
    }
}