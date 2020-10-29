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

        [DataField("BackgroundColor")]
        [ParamField("BackgroundColor")]
        public string BackgroundColor { get; set; }

        [DataField("IsProductSlot")]
        [ParamField("IsProductSlot")]
        public bool IsProductSlot { get; set; }

        [DataField("Price")]
        [ParamField("Price")]
        public decimal Price { get; set; }

        [DataField("IsFavorite")]
        [ParamField("IsFavorite")]
        public bool IsFavorite { get; set; }

    }
}
