#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.DAO;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
#endregion

namespace sb.manifest.api.Services
{
    public class SettingsService
    {
        #region Sales Products
        public MResponse GetSalesProductList(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetSalesProduct(config);

        }
        public void SaveSalesProduct(IConfiguration config, MSalesProduct mSalesProduct)
        {
            using SettingsDAO dao = new SettingsDAO();
            dao.SaveSalesProduct(config, mSalesProduct);
        }
        public void DeleteSalesProduct(IConfiguration config, MSalesProduct mSalesProduct)
        {
            using SettingsDAO dao = new SettingsDAO();
            dao.DeleteSalesProduct(config, mSalesProduct);
        }
        #endregion

        #region Product Slot
        public MResponse GetSlotProductList(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetProductSlot(config);

        }
        public void SaveProductSlot(IConfiguration config, MProductSlot mProductSlot)
        {
            using SettingsDAO dao = new SettingsDAO();
            dao.SaveProductSlot(config, mProductSlot);
        }
        public void DeleteProductSlot(IConfiguration config, MProductSlot mProductSlot)
        {
            using SettingsDAO dao = new SettingsDAO();
            dao.DeleteProductSlot(config, mProductSlot);
        }
        #endregion

        #region Aircrafts
        public MResponse GetAircrafts(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetAircrafts(config);

        }
        public void SaveAircraft(IConfiguration config, MAircraft mAircraft)
        {
            using SettingsDAO dao = new SettingsDAO();
                dao.SaveAircraft(config, mAircraft);
        }
        public void DeleteAircraft(IConfiguration config, MAircraft mAircraft)
        {
            using SettingsDAO dao = new SettingsDAO();
            dao.DeleteAircraft(config, mAircraft);
        }
        #endregion

        #region Accounts
        public MResponse GetAccounts(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetAccounts(config);

        }
        #endregion

        #region Countries
        public MResponse GetCountries(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetCountries(config);

        }
        #endregion

        #region PayMethod
        public MResponse GetPayMethod(IConfiguration config)
        {
            using SettingsDAO dao = new SettingsDAO();
            return dao.GetPayMethod(config);

        }
        #endregion
    }
}
