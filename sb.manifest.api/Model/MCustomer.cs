using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MCustomer
    {
        [DataField("Id")]
        public long Id { get; set; }

        [DataField("FirstName")]
        [ParamField("FirstName")]
        public string FirstName { get; set; }

        [DataField("LastName")]
        [ParamField("LastName")]
        public string LastName { get; set; }

        [DataField("Name")]
        public string Name { get; set; }

        [DataField("Email")]
        [ParamField("Email")]
        public string Email { get; set; }

        [DataField("Country")]
        public string Country { get; set; }

        [ParamField("IdCountry")]
        public int IdCountry { get; set; }

        [DataField("Job")]
        public string Job { get; set; }

        [DataField("Balance")]
        public decimal Balance { get; set; }

        [DataField("IdStaff")]
        public long IdStaff { get; set; }

    }
}
