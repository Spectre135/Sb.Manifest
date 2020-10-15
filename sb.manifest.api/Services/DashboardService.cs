#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using System.Collections.Generic;
#endregion

namespace sb.manifest.api.Services
{
    public class DashboardService
    {
        public MResponse GetDashboardProductList(IConfiguration config)
        {
            using DashboardDAO dao = new DashboardDAO();
                return dao.GetDashboardProductList(config);

        }
    }
}
