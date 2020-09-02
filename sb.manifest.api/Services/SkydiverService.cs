#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
#endregion

namespace sb.manifest.api.Services
{
    public class SkydiverService
    {
        public MResponse GetSkydivers(IConfiguration config)
        {
            using SkydiverDAO dao = new SkydiverDAO();
                return dao.GetSkydivers(config);

        }
    }
}
