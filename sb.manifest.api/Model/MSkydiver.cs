using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MSkydiver
    {
        [DataField("Id")]
        public long Id { get; set; }

        [DataField("FirstName")]
        public string FirstName { get; set; }

        [DataField("LastName")]
        public string LastName { get; set; }

        [DataField("UserName")]
        public string UserName { get; set; }

        [DataField("Email")]
        public string Email { get; set; }

        [DataField("Balance")]
        public decimal Balance { get; set; }
    }
}
