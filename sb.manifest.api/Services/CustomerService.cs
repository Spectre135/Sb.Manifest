#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
#endregion

namespace sb.manifest.api.Services
{
    public class CustomerService
    {
        public MResponse GetCustomers(IConfiguration config)
        {
            using CustomerDAO dao = new CustomerDAO();
                return dao.GetCustomers(config);
        }
    }
}
