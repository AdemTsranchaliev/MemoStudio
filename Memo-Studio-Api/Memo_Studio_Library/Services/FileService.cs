using System;
using Memo_Studio_Library.Services.Interfaces;

namespace Memo_Studio_Library.Services
{
	public class FileService : IFileService
	{
        public string GetFile(string fileName)
        {
            if (fileName == null)
            {
                return null;
            }
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);

            if (System.IO.File.Exists(filePath))
            {
                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return Convert.ToBase64String(fileBytes);
            }

            return null;
        }
    }
}

