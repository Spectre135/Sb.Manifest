using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MLoadList
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
        
        [DataField("Passenger")]
        public string Passenger { get; set; }

        [DataField("IdCustomer")]
        public long IdCustomer { get; set; }

        [DataField("ProductSlotName")]
        public string ProductSlotName { get; set; }

        [DataField("Profit")]
        public decimal Profit { get; set; }

        [DataField("AvaibleTickets")]
        public int AvaibleTickets { get; set; }

        [DataField("DateC")]
        public DateTime DateConfirmed{ get; set; }

        [DataField("DateD")]
        public DateTime DateDeleted { get; set; }

        [DataField("Status")]
        public int Status { get; set; }

        [DataField("IdGroup")]
        public int IdGroup { get; set; }

        [DataField("BackgroundColor")]
        public string BackgroundColor { get; set; }

    }
}
