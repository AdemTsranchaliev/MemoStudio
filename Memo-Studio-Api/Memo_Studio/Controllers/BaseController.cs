using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

public class BaseController : ControllerBase
{
    protected string GetBearerToken()
    {
        string authorizationHeader = HttpContext.Request.Headers["Authorization"];

        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            throw new UnauthorizedAccessException();
        }

        string token = authorizationHeader.Substring(7);

        return token;
    }

    protected Dictionary<string, object> GetTokenPayload()
    {
        string token = GetBearerToken();

        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var tokenClaims = tokenHandler.ReadJwtToken(token);

            var payloadProperties = new Dictionary<string, object>();

            foreach (var claim in tokenClaims.Claims)
            {
                payloadProperties.Add(claim.Type, claim.Value);
            }

            return payloadProperties;
        }
        catch
        {
            throw new Exception("Сървърна грешка 500, моля свържете се с поддръжка");
        }
    }

    protected Guid GetFacilityId()
    {
        Dictionary<string, object> payloadProperties = GetTokenPayload();

        if (payloadProperties == null)
        {

        }

        if (payloadProperties.ContainsKey("FacilityId"))
        {
            string subject = payloadProperties["FacilityId"].ToString();


            return Guid.Parse(subject);
        }

        return Guid.Empty;
    }

    protected string GetEmail()
    {
        Dictionary<string, object> payloadProperties = GetTokenPayload();

        if (payloadProperties == null)
        {
            return null;
        }

        if (payloadProperties.ContainsKey(ClaimTypes.Email))
        {
            string subject = payloadProperties[ClaimTypes.Email].ToString();


            return subject;
        }

        return string.Empty;
    }
}