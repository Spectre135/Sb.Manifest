using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MTicketPost
    {
        [DataField("Id")]
        public long Id { get; set; }

        [DataField("IdCostumer")]
        public long IdCostumer { get; set; }

        [DataField("IdProduct")]
        public int IdProduct { get; set; }

        [DataField("IdTransaction")]
        public long IdTransaction { get; set; }

        [DataField("IdLoad")]
        public int IdLoad { get; set; }

        [DataField("LoadNo")]
        public int LoadNo { get; set; }

        [DataField("Tickets")]
        public int Tickets { get; set; }

        [DataField("CTickets")]
        public int CTickets { get; set; }

        [DataField("DTickets")]
        public int DTickets { get; set; }

        [DataField("Date")]
        public DateTime Date { get; set; }

        [DataField("AircraftRegistration")]
        public string AircraftRegistration { get; set; }

        [DataField("Name")]
        public string Name { get; set; }

        [DataField("Description")]
        public string Description { get; set; }
    }
}
