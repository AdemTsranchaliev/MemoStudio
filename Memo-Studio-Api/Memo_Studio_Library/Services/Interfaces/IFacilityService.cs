using System;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IFacilityService
	{
        public Task CreateFacility(User user);

    }
}

