using Newtonsoft.Json;
using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    public class MSlot
    {
        //Model used  to add passengers to load
        [JsonProperty(NullValueHandling = NullValueHandling.Include)]
        public string DummyId { get; set; } //empty string to work <md-select> angularjs 

        [DataField("Id")]
        public long Id { get; set; }

        [DataField("Name")]
        [DataSearch("Name")] 
        public string Name { get; set; }

        [DataField("IdLoad")]
        public long IdLoad { get; set; }

        [DataField("OnBoard")]
        public bool OnBoard { get; set; }

        [DataField("IsStaff")]
        public bool IsStaff { get; set; }

        [DataField("AvailableTickets")]
        public int? AvailableTickets { get; set; }

        [DataField("TicketName")]
        public string TicketName { get; set; }

        [DataField("IdProductSlot")]
        public int? IdProductSlot { get; set; }

        [DataField("AvailableFunds")]
        public decimal? AvailableFunds { get; set; }
    }
}
