using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MCustomer
    {
        [DataField("Id")]
        public long Id { get; set; }

        [DataField("FirstName")]
        public string FirstName { get; set; }

        [DataField("LastName")]
        public string LastName { get; set; }

        [DataField("Name")]
        public string Name { get; set; }

        [DataField("Job")]
        public string Job { get; set; }

        [DataField("Payment")]
        public decimal Payment { get; set; }

        [DataField("IdStaff")]
        public long IdStaff { get; set; }

    }
}
