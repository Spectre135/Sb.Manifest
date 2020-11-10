using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    //Passengers on load
    public class MOnBoard
    {
        [TableName("OnLoad")] //Database table name (needed if we use seqnextvalue)

        [DataField("IdPerson")]
        [ParamField("IdPerson")]
        public long IdPerson { get; set; }

        [DataField("IdLoad")]
        [ParamField("IdLoad")]
        public long IdLoad { get; set; }

        [DataField("IdProductSlot")]
        [ParamField("IdProductSlot")]
        public long IdProductSlot { get; set; }

        [DataField("IdGroup")]
        [ParamField("IdGroup")]
        public int IdGroup { get; set; }

    }
}
