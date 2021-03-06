﻿using sb.manifest.api.DAO;
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

        [DataField("RotationTime")]
        public int? RotationTime { get; set; }

        [DataField("RefuelTime")]
        public int? RefuelTime { get; set; }

        [DataField("Passenger")]
        public string Passenger { get; set; }

        [DataField("IdPerson")]
        public long IdPerson { get; set; }

        [DataField("Weight")]
        public int? Weight { get; set; }

        [DataField("ProductSlotName")]
        public string ProductSlotName { get; set; }

        [DataField("Profit")]
        public decimal Profit { get; set; }

        [DataField("AvailableTickets")]
        public int AvailableTickets { get; set; }

        [DataField("DateCreated")]
        public DateTime? DateCreated{ get; set; }

        [DataField("DateDeparted")]
        public DateTime? DateDeparted { get; set; }

        //[DataField("DepartureSecondsLeft")]
        public int? DepartureSecondsLeft { get; set; }

        [DataField("DateOnLoad")]
        public DateTime? DateOnLoad { get; set; }

        [DataField("Status")]
        public int Status { get; set; }

        [DataField("IdGroup")]
        public int IdGroup { get; set; }

        [DataField("IdPersonalGroup")]
        public int? IdPersonalGroup { get; set; }

        [DataField("BackgroundColor")]
        public string BackgroundColor { get; set; }

        [DataField("Refuel")]
        public Boolean? Refuel { get; set; }

    }
}
