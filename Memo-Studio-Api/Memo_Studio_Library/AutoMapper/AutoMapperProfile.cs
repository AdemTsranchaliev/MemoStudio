using AutoMapper;
using Memo_Studio_Library;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Viber;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Booking, BookingsResponceViewModel>();
        CreateMap<DayAddViewModel, Day>();
        CreateMap<ViberCode, ViberCodeGenerationResponse>();
    }
}