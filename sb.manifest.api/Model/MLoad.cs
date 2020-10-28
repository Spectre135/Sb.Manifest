using sb.manifest.api.DAO;
using System;
using System.Collections.Generic;

namespace sb.manifest.api.Model
{
    public class MLoad
    {
        [DataField("Id")]
        public int Id { get; set; }

        [DataField("Number")]
        [ParamField("Number")]
        public int Number { get; set; }

        [DataField("Description")]
        [ParamField("Description")]
        public string Description { get; set; }

        [DataField("IdAircraft")]
        [ParamField("IdAircraft")]
        public int IdAircraft { get; set; }

        [DataField("AircraftRegistration")]
        public string AircraftRegistration { get; set; }

        [DataField("AircraftType")]
        public string AircraftType { get; set; }

        [DataField("AircraftName")]
        public string AircraftName { get; set; }

        [DataField("MaxSlots")]
        public int MaxSlots { get; set; }

        [DataField("Status")]
        public int Status { get; set; }

        [DataField("DateC")]
        public DateTime? DateConfirmed{ get; set; }

        [DataField("DateD")]
        public DateTime? DateDeleted { get; set; }

        public List<MGroup> GroupList { get; set; }
        public decimal? TotalWeight { get; set; }
        public int? SlotsLeft { get; set; }
        public decimal? Profit { get; set; }

    }
}
