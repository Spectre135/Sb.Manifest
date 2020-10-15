using sb.manifest.api.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sb.manifest.api.Model
{
    public class MDashboard
    {
        [DataField("Product")]
        public string Product { get; set; }

        [DataField("BackgroundColor")]
        public string BackgroundColor { get; set; }

        [DataField("Number")]
        public int Number { get; set; }

        [DataField("Profit")]
        public decimal Profit { get; set; }
    }
}
