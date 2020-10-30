#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using sb.manifest.api.Utils;
#endregion

namespace sb.manifest.api.Services
{
    public class PersonService
    {
        public MResponse GetPersons(IConfiguration config, string search, int pageIndex, int pageSelected, string sortKey, bool asc)
        {
            using PersonDAO dao = new PersonDAO();
                return dao.GetPersons(config, search, (pageIndex - 1) * pageSelected, (pageIndex * pageSelected), sortKey, asc);
        }
        public void Save(IConfiguration config, MPerson mPerson)
        {
            using PersonDAO dao = new PersonDAO();
            dao.Save(config, mPerson);
        }
        public MResponse GetTicketPosts(IConfiguration config, string search, int idPerson, int pageIndex, int pageSelected, string sortKey, bool asc)
        {
            using PersonDAO dao = new PersonDAO();
            return dao.GetTicketPosts(config, search, idPerson, (pageIndex - 1) * pageSelected, (pageIndex * pageSelected), sortKey, asc);
        }
        public MResponse GetLoadsHistory(IConfiguration config, string search, int idPerson, int pageIndex, int pageSelected, string sortKey, bool asc)
        {
            using PersonDAO dao = new PersonDAO();
            return dao.GetLoadsHistory(config, search, idPerson, (pageIndex - 1) * pageSelected, (pageIndex * pageSelected), sortKey, asc);
        }
    }
}
