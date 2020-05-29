using System.Linq;
using AutoMapper;
using ByodLauncher.Models.Dto;

namespace ByodLauncher.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Director, DirectorDto>().ReverseMap();

            CreateMap<Session, SessionDto>().ReverseMap();
            CreateMap<Session, SessionJoinRequestDto>()
                .ForMember(
                    joinRequestDto => joinRequestDto.RequiresCredentials,
                    opt => opt.MapFrom(
                        session => session.Stages
                            .SelectMany(stage => stage.StageTargets)
                            .Select(stageTarget => stageTarget.Target)
                            .Any(target => target.RequiresCredentials)
                    )
                );

            CreateMap<Stage, StageDto>().ReverseMap();

            CreateMap<Target, TargetDto>()
                .Include<SimpleScriptTarget, SimpleScriptTargetDto>()
                .Include<TutorialTarget, TutorialTargetDto>()
                .ReverseMap();

            CreateMap<SimpleScriptTarget, SimpleScriptTargetDto>()
                .IncludeBase<Target, TargetDto>()
                .ReverseMap();

            CreateMap<TutorialTarget, TutorialTargetDto>()
                .ForMember(dto => dto.StepIds, opt => opt.MapFrom(tt => tt.Steps.Select(step => step.Id)))
                .IncludeBase<Target, TargetDto>();
            CreateMap<TutorialTargetDto, TutorialTarget>()
                .ForMember(tt => tt.Steps, opt => opt.Ignore())
                .IncludeBase<TargetDto, Target>();

            CreateMap<StageTarget, StageTargetDto>().ReverseMap();

            CreateMap<TutorialStep, TutorialStepDto>().ReverseMap();

            CreateMap<TargetResult, TargetResultDto>().ReverseMap();
        }
    }
}