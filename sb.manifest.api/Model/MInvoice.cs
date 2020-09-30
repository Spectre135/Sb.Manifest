using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MInvoice
    {
        [DataField("IdCustomer")]
        public long IdCustomer{ get; set; }

        [DataField("Customer")]
        public string Customer { get; set; }

        [DataField("Description")]
        public string Description { get; set; }

        [DataField("Amount")]
        public decimal Amount { get; set; }

        [DataField("Qty")]
        public int Qty{ get; set; }

    }
}
