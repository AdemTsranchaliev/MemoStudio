using AutoMapper;
using Memo_Studio_Library;
using Memo_Studio_Library.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Booking, BookingsResponceViewModel>();
    }
}