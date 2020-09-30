#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System;
using System.Collections.Generic;
using System.Data;
#endregion

namespace sb.manifest.api.DAO
{
    public class PostDAO : AbstractDAO
    {
        public MResponse GetPosts(IConfiguration config)
        {
            return GetData<MPost>(config, SQLBuilder.GetPostListSQL());
        }
        public MResponse GetInvoice(IConfiguration config, long idCustomer)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdCustomer", idCustomer)
            };
            return GetData<MInvoice>(config, SQLBuilder.GetInvoiceSQL(), alParmValues);
        }
    }
}
