#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
#endregion

namespace sb.manifest.api.Services
{
    public class LoadService
    {
        public MResponse GetLoadList(IConfiguration config)
        {
            using LoadDAO dao = new LoadDAO();
                return dao.GetLoadList(config);

        }
    }
}
