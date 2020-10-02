using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MProductSlot
    {
        [DataField("Id")]
        public int Id{ get; set; }

        [DataField("Name")]
        [ParamField("Name")]
        public string Name { get; set; }

        [DataField("Description")]
        [ParamField("Description")]
        public string Description { get; set; }

        [DataField("Income")]
        [ParamField("Income")]
        public decimal Income { get; set; }

        [DataField("Outcome")]
        [ParamField("Outcome")]
        public decimal Outcome { get; set; }

        [DataField("IdProduct")]
        [ParamField("IdProduct")]
        public int IdProduct { get; set; }

        [DataField("ProductName")]
        public string ProductName { get; set; }

        [DataField("IdAccount")]
        [ParamField("IdAccount")]
        public int IdAccount { get; set; }

        [DataField("AccountDescription")]
        public string AccountDescription { get; set; }

    }
}
