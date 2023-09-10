﻿using System;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
    public class Day : BaseModel
    {
        public DateTime DayDate { get; set; }

        public DateTime StartPeriod { get; set; }

        public DateTime EndPeriod { get; set; }

        public bool IsWorking { get; set; }

        public int FacilityId { get; set; }
        public Facility Facility { get; set; }
    }
}

