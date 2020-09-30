using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MAccount
    {
        [DataField("Account")]
        public int Account { get; set; }

        [DataField("XAccount")]
        public int XAccount { get; set; }

        [DataField("Description")]
        public string Description { get; set; }
     
    }
}
