using System;

namespace sb.manifest.api.Model
{
    public class MLoadPerson
    {
        //objekt uporabimo za load lista grupa pa potem list s potniki
        public int Id { get; set; }
        public string Passenger { get; set; }
        public long IdCustomer { get; set; }
        public int Weight { get; set; }
        public string ProductSlotName { get; set; }
        public decimal Profit { get; set; }
        public int AvailableTickets { get; set; }
        public int IdGroup { get; set; }
        public string BackgroundColor { get; set; }

    }
}
