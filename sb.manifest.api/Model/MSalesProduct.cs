using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MSalesProduct
    {
        [DataField("Id")]
        public int Id{ get; set; }

        [DataField("Name")]
        [ParamField("Name")]
        public string Name { get; set; }

        [DataField("Description")]
        [ParamField("Description")]
        public string Description { get; set; }

    }
}
