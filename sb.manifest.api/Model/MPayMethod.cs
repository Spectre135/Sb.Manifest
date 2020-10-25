using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MPayMethod
    {
        [DataField("Id")]
        public int Id { get; set; }

        [DataField("Name")]
        public string Name{ get; set; }

    }
}
