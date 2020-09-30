#region using
#endregion

using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;

namespace sb.manifest.api.DAO
{
    public class CustomerDAO :AbstractDAO
    {
        public MResponse GetCustomers(IConfiguration config)
        {
            return GetData<MCustomer>(config, SQLBuilder.GetCustomersListSQL());
        }
    }
}
