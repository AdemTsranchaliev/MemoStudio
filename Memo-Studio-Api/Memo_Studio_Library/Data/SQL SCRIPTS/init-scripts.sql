﻿-- Create the User table
CREATE TABLE [User] (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(max) NULL,
    ViberId NVARCHAR(max) NULL
    UserName NVARCHAR(256) NULL,
    NormalizedUserName NVARCHAR(256) NULL,
    Email NVARCHAR(256) NULL,
    NormalizedEmail NVARCHAR(256) NULL,
    EmailConfirmed BIT NOT NULL,
    PasswordHash NVARCHAR(max) NULL,
    SecurityStamp NVARCHAR(max) NULL,
    ConcurrencyStamp NVARCHAR(max) NOT NULL,
    PhoneNumber NVARCHAR(max) NULL,
    PhoneNumberConfirmed BIT NOT NULL,
    TwoFactorEnabled BIT NOT NULL,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL,
    AccessFailedCount INT NOT NULL,
)


-- Create the FacilityRole table
CREATE TABLE FacilityRole (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(max) NOT NULL
);

-- Create the Facility table
CREATE TABLE Facility (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FacilityId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NULL,
    Description NVARCHAR(max) NULL,
    CalendarConfigurationId INT NULL,
);

-- Create the CalendarConfiguration table
CREATE TABLE CalendarConfiguration (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StartPeriod DATETIME2 NOT NULL,
    EndPeriod DATETIME2 NOT NULL,
    Interval INT NOT NULL,
    WorkingDays NVARCHAR(max) NULL,
    AllowUserBooking BIT NOT NULL DEFAULT 0,
    FacilityId INT NOT NULL,
);

ALTER TABLE Facility ADD  CONSTRAINT FK_Facility_CalendarConfiguration FOREIGN KEY (CalendarConfigurationId) REFERENCES CalendarConfiguration (Id)
ALTER TABLE CalendarConfiguration ADD CONSTRAINT FK_CalendarConfiguration_Facility FOREIGN KEY (FacilityId) REFERENCES Facility (Id)


-- Create the Day table
CREATE TABLE Day (
    Id INT PRIMARY KEY IDENTITY(1,1),
    DayDate DATETIME2 NOT NULL,
    StartPeriod DATETIME2 NOT NULL,
    EndPeriod DATETIME2 NOT NULL,
    IsWorking BIT NOT NULL DEFAULT 1,
    FacilityId INT NOT NULL,
    CONSTRAINT FK_Day_Facility FOREIGN KEY (FacilityId) REFERENCES Facility (Id)
);

-- Create the Booking table
CREATE TABLE Booking (
    Id INT PRIMARY KEY IDENTITY(1,1),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    Timestamp DATETIME2 NOT NULL,
    CreatedOn DATETIME2 NOT NULL,
    Canceled BIT NOT NULL,
    ReservationId NVARCHAR(max) NOT NULL,
    Note NVARCHAR(max) NULL,
    Name NVARCHAR(max) NULL,
    Email NVARCHAR(max) NULL,
    Phone NVARCHAR(max) NULL,
    Confirmed BIT NOT NULL,
    RegisteredUser BIT NOT NULL,
    UserId INT NOT NULL,
    FacilityId INT NOT NULL,
    CONSTRAINT FK_Booking_User FOREIGN KEY (UserId) REFERENCES [User] (Id),
    CONSTRAINT FK_Booking_Facility FOREIGN KEY (FacilityId) REFERENCES Facility (Id)
);

-- Create the UserFalicity table
CREATE TABLE UserFalicity (
    UserId INT NOT NULL,
    FacilityId INT NOT NULL,
    FacilityRoleId INT NOT NULL,
    CONSTRAINT PK_UserFalicity PRIMARY KEY (UserId, FacilityId),
    CONSTRAINT FK_UserFalicity_User FOREIGN KEY (UserId) REFERENCES [User] (Id),
    CONSTRAINT FK_UserFalicity_Facility FOREIGN KEY (FacilityId) REFERENCES Facility (Id),
    CONSTRAINT FK_UserFalicity_FacilityRole FOREIGN KEY (FacilityRoleId) REFERENCES FacilityRole (Id)
);

-- Create the Notification table
CREATE TABLE Notification (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SentOn DATETIME2 NOT NULL,
    Type INT NOT NULL,
    Message NVARCHAR(max) NOT NULL,
    BookingId INT NOT NULL,
    UserId INT NULL,
    FacilityId INT NOT NULL,
    CONSTRAINT FK_Notification_Booking FOREIGN KEY (BookingId) REFERENCES Booking (Id),
    CONSTRAINT FK_Notification_User FOREIGN KEY (UserId) REFERENCES [User] (Id),
    CONSTRAINT FK_Notification_Facility FOREIGN KEY (FacilityId) REFERENCES Facility (Id)
);