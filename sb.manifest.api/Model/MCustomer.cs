using sb.manifest.api.DAO;
using System;

namespace sb.manifest.api.Model
{
    public class MCustomer
    {
        [DataField("Id")]
        public long Id { get; set; }

        [DataField("FirstName")]
        [ParamField("FirstName")]
        public string FirstName { get; set; }

        [DataField("LastName")]
        [ParamField("LastName")]
        public string LastName { get; set; }

        [DataField("Name")]
        [DataSearch("Name")] //Tukaj je FirstName + LastName zato naziv kupca iščemo po tem polju
        public string Name { get; set; }

        [DataField("Email")]
        [DataSearch("Email")]
        [ParamField("Email")]
        public string Email { get; set; }

        [DataField("BirthDate")]
        [ParamField("BirthDate")]
        public DateTime? BirthDate { get; set; }

        [DataField("Address")]
        [ParamField("Address")]
        public string Address { get; set; }

        [DataField("PostalCode")]
        [ParamField("PostalCode")]
        public int? PostalCode { get; set; }

        [DataField("Country")]
        public string Country { get; set; }

        [DataField("CountryIso")]
        public string CountryIso { get; set; }

        [DataField("IdCountry")]
        [ParamField("IdCountry")]
        public int IdCountry { get; set; }

        [DataField("Phone")]
        [ParamField("Phone")]
        public string Phone { get; set; }

        [DataField("Balance")]
        public decimal Balance { get; set; }

        [DataField("IsStaff")]
        [ParamField("IsStaff")]
        public bool IsStaff { get; set; }

        [DataField("AvaibleTickets")]
        public int? AvaibleTickets { get; set; }

        [DataField("TicketName")]
        public string TicketName { get; set; }

        [DataField("Limit")]
        [ParamField("Limit")]
        public decimal? Limit { get; set; }

        [DataField("TicketPrice")]
        [ParamField("TicketPrice")]
        public decimal? TicketPrice { get; set; }

    }
}
