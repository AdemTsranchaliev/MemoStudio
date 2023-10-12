using Memo_Studio_Library.Services.Interfaces;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Reflection;

namespace Memo_Studio_Library.Services
{
    public class MailService : IMailService
    {
        public void Send(string recipientEmail, string subject, string title, string description, string buttonName, string buttonLink)
        {
            // Set your email and password (or use an app-specific password if using Gmail)
            string senderEmail = "project200test@gmail.com";
            string senderPassword = "qbtxlecimxoqsszm";

            // Create a new MailMessage
            MailMessage mail = new MailMessage(senderEmail, recipientEmail);

            // Set the subject and body of the email
            mail.Subject = subject;

            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com");
            smtpClient.Port = 587; // Gmail SMTP port
            smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);
            smtpClient.EnableSsl = true; // Use SSL encryption

            var path = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);


            var emailTemplate = File.ReadAllText(path+"/EmailTemplates/EmailTemplates.html");
            emailTemplate = emailTemplate.Replace("{{emailTitle}}", title);
            emailTemplate = emailTemplate.Replace("{{emailDescription}}", description);
            emailTemplate = emailTemplate.Replace("{{emailButton}}", buttonName);
            emailTemplate = emailTemplate.Replace("{{link}}", buttonLink);


            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(emailTemplate, null, MediaTypeNames.Text.Html);

            mail.AlternateViews.Add(htmlView);

            try
            {
                smtpClient.Send(mail);
                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            finally
            {
                smtpClient.Dispose();
                mail.Dispose();
            }
        }
    }
}

