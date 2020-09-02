using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sb.manifest.api.Model
{
    public class MResponse
    {
        public IEnumerable<object> DataList { get; set; }
        public long RowsCount { get; set; }
    }
}
