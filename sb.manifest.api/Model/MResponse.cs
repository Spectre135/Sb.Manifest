using System.Collections.Generic;

namespace sb.manifest.api.Model
{
    //Common model to use for data response from API
    public class MResponse
    {
        public IEnumerable<object> DataList { get; set; }
        public long RowsCount { get; set; }
    }
}
