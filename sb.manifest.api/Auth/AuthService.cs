using sb.manifest.api.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sb.manifest.api.Auth
{
    public class AuthService
    {
        public static bool IsUserAuthenticated(MUser user)
        {
            return (user.Password.ToLower().Equals("skydive") && user.Username.ToLower().Equals("darja"));
        }
    }
}
