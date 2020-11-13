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

        [DataField("Income")]
        [ParamField("Income")]
        public decimal? Income { get; set; }

        [DataField("IdAccount")]
        [ParamField("IdAccount")]
        public int IdAccount { get; set; }

        [DataField("AccountDescription")]
        public string AccountDescription { get; set; }

        [DataField("IsFavorite")]
        [ParamField("IsFavorite")]
        public bool IsFavorite { get; set; }

    }
}
