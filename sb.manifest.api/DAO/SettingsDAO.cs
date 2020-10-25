#region using
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System;
using System.Collections.Generic;
using System.Data;
#endregion

namespace sb.manifest.api.DAO
{
    public class SettingsDAO : AbstractDAO
    {
        #region Sales Products
        public MResponse GetSalesProduct(IConfiguration config)
        {
            return GetData<MSalesProduct>(config, SQLBuilder.GetSalesProductSQL());
        }
        public void SaveSalesProduct(IConfiguration config, MSalesProduct mSalesProduct)
        {
            string sql = SQLBuilder.GetInsertSalesProductSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MSalesProduct>(mSalesProduct);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mSalesProduct.Id > 0)
            {
                sql = SQLBuilder.GetSaveSalesProductSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mSalesProduct.Id));
            }

            SaveData(config, sql, alParmValues);
        }
        #endregion

        #region Product Slot
        public MResponse GetProductSlot(IConfiguration config)
        {
            return GetData<MProductSlot>(config, SQLBuilder.GetProductSlotSQL());
        }
        public void SaveProductSlot(IConfiguration config, MProductSlot mProductSlot)
        {
            string sql = SQLBuilder.GetInsertProductSlotSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MProductSlot>(mProductSlot);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mProductSlot.Id > 0)
            {
                sql = SQLBuilder.GetSaveProductSlotSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mProductSlot.Id));
            }

            SaveData(config, sql, alParmValues);
        }
        #endregion

        #region Aircrafts
        public MResponse GetAircrafts(IConfiguration config)
        {
            return GetData<MAircraft>(config, SQLBuilder.GetAircraftSQL());
        }
        public void SaveAircraft(IConfiguration config, MAircraft mAircraft)
        {
            string sql = SQLBuilder.GetInsertAircraftSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MAircraft>(mAircraft);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mAircraft.Id > 0)
            {
                sql = SQLBuilder.GetSaveAircraftSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mAircraft.Id));
            }

            SaveData(config, sql, alParmValues);
        }
        #endregion

        #region Accounts
        public MResponse GetAccounts(IConfiguration config)
        {
            return GetData<MAccount>(config, SQLBuilder.GetAccountsSQL());
        }
        #endregion

        #region Countries
        public MResponse GetCountries(IConfiguration config)
        {
            return GetData<MCountry>(config, SQLBuilder.GetCountriesSQL());
        }
        #endregion

        #region PayMethod
        public MResponse GetPayMethod(IConfiguration config)
        {
            return GetData<MPayMethod>(config, SQLBuilder.GetPayMethodSQL());
        }
        #endregion
    }
}
