#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System.Collections.Generic;
#endregion

namespace sb.manifest.api.Services
{
    public class LoadService
    {
        public MResponse GetLoadList(IConfiguration config)
        {
            using LoadDAO dao = new LoadDAO();
              return dao.GetLoad(config);

        }
        public void AddSlot(IConfiguration config,List<MPassenger> list)
        {
            using LoadDAO dao = new LoadDAO();
             dao.AddSlot(config,list);

        }
        public void ConfirmLoad(IConfiguration config, MLoad mLoad)
        {
            using LoadDAO dao = new LoadDAO();
            dao.ConfirmLoad(config, mLoad);

        }
    }
}
