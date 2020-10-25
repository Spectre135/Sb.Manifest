using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MUser
    {
        [DataField("Username")]
        public string Username { get; set; }

        [DataField("Password")]
        public string Password { get; set; }

        public string NewPassword{ get; set; }

        [DataField("Email")]
        public string Email { get; set; }

        public int BadLogon { get; set; }
        public DateTime AccountLocked { get; set; } 


    }
}
