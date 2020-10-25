#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System.Collections.Generic;
#endregion

namespace sb.manifest.api.DAO
{
    public class CustomerDAO :AbstractDAO
    {
        public MResponse GetCustomers(IConfiguration config, string search, int from, int to, string orderby, bool asc)
        {
            return GetPagingData<MCustomer>(config, SQLBuilder.GetCustomersListSQL(), search, from, to, orderby, asc);
        }
        public void Save(IConfiguration config, MCustomer mCustomer)
        {
            string sql = SQLBuilder.GetInsertCustomerSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MCustomer>(mCustomer);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mCustomer.Id > 0)
            {
                sql = SQLBuilder.GetSaveCustomerSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mCustomer.Id));
            }

            SaveData(config, sql, alParmValues);
        }
        public MResponse GetTicketPosts(IConfiguration config, string search, int idCustomer, int from, int to, string orderby, bool asc)
        {
            //vedno delamo za id Customer
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdCustomer", idCustomer)
            };
            return GetPagingData<MTicketPost>(config, SQLBuilder.GetTicketPostListSQL(), search, from, to, orderby, asc, alParmValues);
        }
        public MResponse GetLoadsHistory(IConfiguration config, string search, int idCustomer, int from, int to, string orderby, bool asc)
        {
            //vedno delamo za id Customer
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdCustomer", idCustomer)
            };
            return GetPagingData<MLoadList>(config, SQLBuilder.GetLoadsHistoryByCustomerSQL(), search, from, to, orderby, asc, alParmValues);
        }
    }
}
