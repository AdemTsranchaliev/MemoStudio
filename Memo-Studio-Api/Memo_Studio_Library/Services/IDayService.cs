﻿using System;
using Memo_Studio_Library.Data.Models;

namespace Memo_Studio_Library.Services
{
    public interface IDayService
    {
        public void AddDay(Day model);
        public Day GetDay(DateTime dateTime, int employeeId);
        Task CancelDay(Day day);
    }
}

