#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
#endregion

namespace sb.manifest.api.DAO
{
    public class DashboardDAO :AbstractDAO
    {
        public MResponse GetDashboardProductList(IConfiguration config)
        {
            return GetData<MDashboard>(config, SQLBuilder.GetDashboardProductListSQL());
        }
    }
}
