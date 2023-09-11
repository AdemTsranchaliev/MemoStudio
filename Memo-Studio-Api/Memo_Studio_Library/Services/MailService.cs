using System;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using Memo_Studio_Library.Services.Interfaces;

namespace Memo_Studio_Library.Services
{
    public class MailService : IMailService
    {
        public void Send(string recipientEmail, string subject, string message)
        {
            // Set your email and password (or use an app-specific password if using Gmail)
            string senderEmail = "project200test@gmail.com";
            string senderPassword = "ixywxovizwforqgg";

            // Create a new MailMessage
            MailMessage mail = new MailMessage(senderEmail, recipientEmail);

            // Set the subject and body of the email
            mail.Subject = subject;

            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com");
            smtpClient.Port = 587; // Gmail SMTP port
            smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);
            smtpClient.EnableSsl = true; // Use SSL encryption

            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(message, null, MediaTypeNames.Text.Html);

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

