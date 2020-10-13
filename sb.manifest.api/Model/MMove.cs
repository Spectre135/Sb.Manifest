using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    //Model to se when move people from load to load
    public class MMove
    {
        [ParamField("IdLoadFrom")]
        public int IdLoadFrom { get; set; }

        [ParamField("IdLoadTo")]
        public int IdLoadTo { get; set; }

        public int[] IdCustomer { get; set; }
    }
}
