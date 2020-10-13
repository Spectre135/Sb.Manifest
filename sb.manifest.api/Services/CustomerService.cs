#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using sb.manifest.api.Utils;
#endregion

namespace sb.manifest.api.Services
{
    public class CustomerService
    {
        public MResponse GetCustomers(IConfiguration config, string search, int pageIndex, int pageSelected, string sortKey, bool asc)
        {
            using CustomerDAO dao = new CustomerDAO();
                return dao.GetCustomers(config, search, (pageIndex - 1) * pageSelected, (pageIndex * pageSelected), sortKey, asc);
        }
        public void Save(IConfiguration config, MCustomer mCustomer)
        {
            using CustomerDAO dao = new CustomerDAO();
            dao.Save(config, mCustomer);
        }
    }
}
