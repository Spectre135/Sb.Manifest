#region
using Microsoft.IdentityModel.Tokens;
using sb.manifest.api.Model;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
#endregion

namespace sb.manifest.api.Auth
{
    public class JwtManager
    {
        private const string key = "db1OIsj+BXE9NZDy0t8W3TcNekrF+4d/1sFnWG4HjV8TZY30iTOdtVWJG8abWvB1GtOgJuQZdpF2Luqm/hccMw==";
        private const int expireHoursToken = 24;

        public static SymmetricSecurityKey GetKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        }
        public static string GenerateToken(MUser user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var now = DateTime.UtcNow;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                    {
                      new Claim(ClaimTypes.NameIdentifier, user.Username)
                    }),
                Expires = now.AddHours(Convert.ToInt32(expireHoursToken)),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(stoken);

            return token;

        }
        public static ClaimsPrincipal GetPrincipal(string token, string securityKey = key)
        {

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                    return null;

                var validationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey))
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken securityToken);

                return principal;
            }

            catch (Exception ex)
            {
                return null;
            }
        }
        //funkcija preverja ali ima uporabnik pravice iz token-a
        public static bool HasRole(string token, string role)
        {
            try
            {
                if (String.IsNullOrEmpty(role))
                    return true;

                var simplePrinciple = GetPrincipal(token);
                var identity = simplePrinciple?.Identity as ClaimsIdentity;

                List<string> roles = identity.Claims
                       .Where(c => c.Type == ClaimTypes.Role)
                       .Select(c => c.Value)
                       .ToList();

                try
                {
                    string[] _roles = role.Split(',');
                    //check if have role
                    foreach (string r in _roles)
                        if (roles.Contains(r.Trim()))
                            return true;
                }
                catch (Exception)
                {
                    return false;
                }

                //drugače vrni false
                return false;


            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
