#region using
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System.Collections.Generic;
using System.Linq;
#endregion

namespace sb.manifest.api.Services
{
    public class LoadService
    {
        public MResponse GetLoads(IConfiguration config)
        {
            using LoadDAO dao = new LoadDAO();
            return dao.GetLoads(config);

        }
        public MResponse GetLoadList(IConfiguration config)
        {
            MResponse mResponse = new MResponse();
            List<MLoad> loadlist = new List<MLoad>();
            int i = 0;
            int g = 0;

            using LoadDAO dao = new LoadDAO();
                mResponse = dao.GetLoadList(config);

            //pazi obvezno order by IdGroup
            List<MLoadList> list = ((List<MLoadList>)mResponse.DataList).OrderBy(l => l.IdGroup).ToList();
            //grupiramo loade da se ne podvajajo glede na potnike
            var loads = JsonConvert.DeserializeObject<List<MLoad>>(JsonConvert.SerializeObject(list)).GroupBy(u => u.Id).Select(grp => grp.ToList()).ToList();

            //zložimo objekt da ga zna front end pravilno prikazat in drag&drop pravilno dela
            //List Load >> List Grupe v loadu >> Posamezna grupa >> LoadPerson kjer so potniki
            foreach (var l in loads)
            {
                MLoad load = JsonConvert.DeserializeObject<MLoad>(JsonConvert.SerializeObject(l.FirstOrDefault()));
                if (i != load.Id)
                {
                    i = load.Id;
                    //grupe za posamezen load da jih potem pravilno razvrstimo v objekt Group=>LoadListe
                    List<MGroup> mGroups = JsonConvert.DeserializeObject<List<MGroup>>(JsonConvert.SerializeObject(list.Where(l =>l.Id==load.Id)));
                    load.GroupList = new List<MGroup>();
                    foreach (MGroup gr in mGroups)
                    {
                        if (g != gr.IdGroup)
                        {
                            g = gr.IdGroup;
                            gr.LoadList = JsonConvert.DeserializeObject<List<MLoadPerson>>(JsonConvert.SerializeObject(list.Where(u => u.IdGroup == gr.IdGroup).ToList())); ;
                            load.GroupList.Add(gr);
                        }
                    }
                    loadlist.Add(load);
                }
            }

            mResponse.DataList = loadlist;

            return mResponse;
        }

        #region Active and Active Today skydivers
        public MResponse GetActiveToday(IConfiguration config, int idLoad)
        {
            using LoadDAO dao = new LoadDAO();
            return dao.GetActiveToday(config,idLoad);
        }
        public MResponse GetActive(IConfiguration config, string search, int size, int idLoad)
        {
            using LoadDAO dao = new LoadDAO();
            return dao.GetActive(config, search, size, idLoad);
        }
        #endregion

        #region Move and Add Slot
        public void AddSlot(IConfiguration config, List<MOnBoard> list)
        {
            using LoadDAO dao = new LoadDAO();
            dao.AddSlot(config, list);

        }
        public void MoveSlot(IConfiguration config, MMove mMove)
        {
            using LoadDAO dao = new LoadDAO();
            dao.MoveSlot(config, mMove);

        }
        #endregion

        #region Confirm and Save Load
        public void ConfirmLoad(IConfiguration config, MLoad mLoad)
        {
            using LoadDAO dao = new LoadDAO();
            dao.ConfirmLoad(config, mLoad);

        }
        public void SaveLoad(IConfiguration config, MLoad mLoad)
        {
            using LoadDAO dao = new LoadDAO();
            dao.SaveLoad(config, mLoad);

        }
        #endregion
    }
}
