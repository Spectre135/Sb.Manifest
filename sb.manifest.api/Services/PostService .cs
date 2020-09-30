#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
#endregion

namespace sb.manifest.api.Services
{
    public class PostService
    {
        public MResponse GetPostList(IConfiguration config)
        {
            using PostDAO dao = new PostDAO();
                return dao.GetPosts(config);

        }
        public MResponse GetInvoice(IConfiguration config,long idCustomer)
        {
            using PostDAO dao = new PostDAO();
            return dao.GetInvoice(config,idCustomer);

        }
    }
}
