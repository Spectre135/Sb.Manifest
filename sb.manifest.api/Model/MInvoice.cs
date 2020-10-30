using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MInvoice
    {
        [DataField("IdTransaction")]
        public long IdTransaction { get; set; }

        [DataField("Account")]
        public int Account { get; set; }

        [DataField("IdCustomer")]
        public long IdPerson { get; set; }

        [DataField("IdLoad")]
        public long IdLoad { get; set; }

        [DataField("Customer")]
        public string Person { get; set; }

        [DataField("Description")]
        public string Description { get; set; }

        [DataField("Amount")]
        public decimal Amount { get; set; }

        [DataField("Date")]
        public DateTime Date { get; set; }

        [DataField("LoadNo")]
        public string LoadNo { get; set; }

        [DataField("Aircraft")]
        public string Aircraft { get; set; }

    }
}
