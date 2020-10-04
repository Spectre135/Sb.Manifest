﻿#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using System.Collections.Generic;
#endregion

namespace sb.manifest.api.Services
{
    public class PostService
    {
        public MResponse GetPostList(IConfiguration config, string search, int pageIndex, int pageSelected, string sortKey, bool asc)
        {
            using PostDAO dao = new PostDAO();
                return dao.GetPosts(config, search, (pageIndex - 1) * pageSelected, (pageIndex * pageSelected) , sortKey,asc);

        }
        public MResponse GetInvoice(IConfiguration config,long idCustomer)
        {
            using PostDAO dao = new PostDAO();
            return dao.GetInvoice(config,idCustomer);

        }
        public void PayInvoice(IConfiguration config, List<MInvoice> invoices)
        {
            using PostDAO dao = new PostDAO();
            dao.PayInvoice(config, invoices);

        }
    }
}
