using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MBuy
    {
        [ParamField("IdPerson")]
        public int IdPerson { get; set; }

        [ParamField("IdProduct")]
        public int IdProduct { get; set; }

        [ParamField("Details")]
        public string Details { get; set; }

        [ParamField("Quantity")]
        public int Quantity { get; set; }

        [ParamField("Price")]
        public decimal Price { get; set; }

        [ParamField("IdPayMethod")]
        public int IdPayMethod { get; set; }
    }
}
