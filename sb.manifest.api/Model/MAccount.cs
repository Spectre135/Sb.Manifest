using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MAccount
    {
        [DataField("Id")]
        public int Id{ get; set; }

        [DataField("DAccount")]
        public int Account { get; set; }

        [DataField("CAccount")]
        public int XAccount { get; set; }

        [DataField("Description")]
        public string Description { get; set; }
     
    }
}
