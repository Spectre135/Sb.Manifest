using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MPassenger
    {
        [DataField("IdPeople")]
        [ParamField("IdPeople")]
        public long IdPeople { get; set; }

        [DataField("IdLoad")]
        [ParamField("IdLoad")]
        public long IdLoad { get; set; }

        [DataField("IdProductSlot")]
        [ParamField("IdProductSlot")]
        public long IdProductSlot { get; set; }

    }
}
