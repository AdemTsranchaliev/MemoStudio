using System;
using Memo_Studio_Library.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilityController : ControllerBase
	{
        private readonly IFacilityService facilityService;

        public FacilityController(IFacilityService facilityService)
		{
            this.facilityService = facilityService;
        }
	}
}

