using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MBuy
    {
        [ParamField("IdCustomer")]
        public int IdCustomer { get; set; }

        [ParamField("IdProduct")]
        public int IdProduct { get; set; }

        [ParamField("Quantity")]
        public int Quantity { get; set; }

        [ParamField("IdPayMethod")]
        public int IdPayMethod { get; set; }
    }
}
