CREATE TABLE [dbo].[Day](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[DayDate] [datetime] NOT NULL,
	[StartPeriod] [datetime] NOT NULL,
	[EndPeriod] [datetime] NOT NULL,
	[IsWorking] [bit] NULL
) ON [PRIMARY]
GO  

ALTER TABLE Bookings
ADD note nvarchar(max) NULL;