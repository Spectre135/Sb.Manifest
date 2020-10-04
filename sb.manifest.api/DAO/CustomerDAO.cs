#region using
#endregion

using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System.Collections.Generic;

namespace sb.manifest.api.DAO
{
    public class CustomerDAO :AbstractDAO
    {
        public MResponse GetCustomers(IConfiguration config)
        {
            return GetData<MCustomer>(config, SQLBuilder.GetCustomersListSQL());
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
    }
}
