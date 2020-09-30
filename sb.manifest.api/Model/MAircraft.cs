using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MAircraft
    {
        [DataField("Id")]
        public int Id { get; set; }

        [DataField("Registration")]
        [ParamField("Registration")]
        public string Registration { get; set; }

        [DataField("Type")]
        [ParamField("Type")]
        public string Type { get; set; }

        [DataField("MaxSlots")]
        [ParamField("MaxSlots")]
        public int MaxSlots { get; set; }

        [DataField("MinSlots")]
        [ParamField("MinSlots")]
        public int MinSlots { get; set; }

        [DataField("RotationTime")]
        [ParamField("RotationTime")]
        public int RotationTime { get; set; }

        [DataField("Active")]
        [ParamField("Active")]
        public bool Active{ get; set; }

    }
}
