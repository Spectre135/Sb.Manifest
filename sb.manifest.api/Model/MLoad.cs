using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MLoad
    {
        [DataField("Id")]
        public int Id { get; set; }

        [DataField("Number")]
        public int Number { get; set; }

        [DataField("Registration")]
        public string AircraftRegistration { get; set; }

        [DataField("Type")]
        public string AircraftType { get; set; }

        [DataField("Passenger")]
        public string Passenger { get; set; }

        [DataField("ProductSlotName")]
        public string ProductSlotName { get; set; }

        [DataField("Profit")]
        public decimal Profit { get; set; }

        [DataField("DateC")]
        public DateTime DateConfirmed{ get; set; }

        [DataField("DateD")]
        public DateTime DateDeleted { get; set; }

    }
}
