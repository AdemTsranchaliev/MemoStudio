using System;
namespace Memo_Studio_Library.ViewModels.Viber
{
	public class ViberCodeGenerationResponse
	{
        public DateTime ValidTo { get; set; }
        public DateTime GeneratedOn { get; set; }
        public string Code { get; set; }
        public bool IsUsed { get; set; }

        public int UserId { get; set; }
    }
}

