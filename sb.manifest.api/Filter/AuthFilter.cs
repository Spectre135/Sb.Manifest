#region using
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using sb.manifest.api.Auth;
using System;
using System.Security.Claims;
using System.Security.Principal;
#endregion

namespace sb.manifest.api.Filter
{
    public class Authorization : Attribute, IAuthorizationFilter
    {
        private string Role { get; set; }
        public Authorization()
        {
        }
        public Authorization(string role)
        {
            this.Role = role;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            context.HttpContext.Request.Headers.TryGetValue("Authorization", out StringValues token);

            if (!ValidateToken(token))
                context.Result = new CustomUnauthorizedResult("Authorization failed.");

            //Preverimo ali uporabnik ima pravico, če pravice ne rabimo vrača true;
            if (!JwtManager.HasRole(token, Role))
                context.Result = new CustomUnauthorizedResult("Permission denied.");

            return;

        }
        public static bool ValidateToken(string token)
        {
            var simplePrinciple = JwtManager.GetPrincipal(token);

            if (!(simplePrinciple?.Identity is ClaimsIdentity identity))
                return false;

            if (!identity.IsAuthenticated)
                return false;

            var usernameClaim = identity.FindFirst(ClaimTypes.NameIdentifier);
            string username = usernameClaim?.Value;

            if (string.IsNullOrEmpty(username))
                return false;

            return true;
        }
        public class CustomUnauthorizedResult : JsonResult
        {
            public CustomUnauthorizedResult(string message)
                : base(new CustomError(message))
            {
                StatusCode = StatusCodes.Status401Unauthorized;
            }
        }
        public class CustomError
        {
            public string Error { get; }

            public CustomError(string message)
            {
                Error = message;
            }
        }
    }
}

