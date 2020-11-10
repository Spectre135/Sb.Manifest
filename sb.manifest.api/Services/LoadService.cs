#region using
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using sb.manifest.api.DAO;
using sb.manifest.api.Hubs;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public MResponse GetLoadList(IConfiguration config, IHubContext<DisplayHub> hubContext)
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
                    decimal profit=0,_profit = 0;
                    decimal weight=0,_weight = 0;
                    int slots = 0;
                    //grupe za posamezen load da jih potem pravilno razvrstimo v objekt Group=>LoadListe
                    List<MGroup> mGroups = JsonConvert.DeserializeObject<List<MGroup>>(JsonConvert.SerializeObject(list.Where(l => l.Id == load.Id)));
                    load.GroupList = new List<MGroup>();
                    foreach (MGroup gr in mGroups)
                    {
                        if (g != gr.IdGroup)
                        {
                            g = gr.IdGroup;
                            gr.LoadList = JsonConvert.DeserializeObject<List<MLoadPerson>>(JsonConvert.SerializeObject(list.Where(u => u.IdGroup == gr.IdGroup).ToList())); ;
                            load.GroupList.Add(gr);
                            //Calculate profit of load,total weight and slots left
                            CalculateLoadParam(gr.LoadList, out _profit, out _weight);
                            weight += _weight;
                            profit += _profit;
                            slots  += gr.LoadList.Count;
                        }
                    }
                    loadlist.Add(load);
                    load.TotalWeight = weight;
                    load.Profit = profit;
                    load.SlotsLeft = load.MaxSlots - slots;
                }
            }
            
            mResponse.DataList = loadlist;

            HubService.SendLoadList(mResponse, hubContext);

            return mResponse;
        }
        private void CalculateLoadParam(List<MLoadPerson> list, out decimal profit, out decimal totalWeight)
        {
            profit = 0;
            totalWeight = 0;
            try
            {
                foreach (MLoadPerson person in list)
                {
                    profit += person.Profit;
                    totalWeight += person.Weight;
                }
            }
            catch (Exception) { }

        }

        #region Active and Active Today skydivers
        public MResponse GetActiveToday(IConfiguration config, int idLoad)
        {
            using LoadDAO dao = new LoadDAO();
            return dao.GetActiveToday(config, idLoad);
        }
        public MResponse GetActive(IConfiguration config, string search, int size, int idLoad)
        {
            using LoadDAO dao = new LoadDAO();
            return dao.GetActive(config, search, size, idLoad);
        }
        #endregion

        #region Move,Remove and Add Slot
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

        #region Confirm, Depart, Save, Delete Load
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
        public void DeleteLoad(IConfiguration config, MLoad mLoad)
        {
            using LoadDAO dao = new LoadDAO();
            dao.DeleteLoad(config, mLoad);

        }
        public void SaveDepart(IConfiguration config, MLoad mLoad)
        {
            using LoadDAO dao = new LoadDAO();
            dao.SaveDepart(config, mLoad);

        }
        #endregion
    }
}
