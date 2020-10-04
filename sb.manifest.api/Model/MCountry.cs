using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MCountry
    {
        [DataField("Id")]
        public int Id { get; set; }

        [DataField("Iso")]
        public string Iso { get; set; }

        [DataField("Name")]
        public string Name { get; set; }

        [DataField("PhoneCode")]
        public int PhoneCode { get; set; }
     
    }
}
