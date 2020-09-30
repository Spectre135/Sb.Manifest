using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MPost
    {
        [DataField("IdTransaction")]
        public long IdTransaction { get; set; }

        [DataField("Account")]
        public int Account { get; set; }

        [DataField("AccountDescription")]
        public string AccountDescription { get; set; }

        [DataField("Company")]
        public string Company{ get; set; }

        [DataField("IdCustomer")]
        public long IdCustomer { get; set; }

        [DataField("Customer")]
        public string Customer { get; set; }

        [DataField("Description")]
        public string Description { get; set; }

        [DataField("Debit")]
        public decimal Debit { get; set; }

        [DataField("Credit")]
        public decimal Credit { get; set; }

        [DataField("Date")]
        public DateTime Date{ get; set; }

        [DataField("Status")]
        public string Status { get; set; }

    }
}
