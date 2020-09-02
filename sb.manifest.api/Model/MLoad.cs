using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MLoad
    {
        [DataField("Registration")]
        public string AircraftRegistration { get; set; }

        [DataField("Type")]
        public string AircraftType { get; set; }

        [DataField("Skydiver")]
        public string Skydiver { get; set; }

    }
}
