#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using sb.manifest.api.Utils;
using System;
using System.Collections.Generic;
using System.Data;
#endregion

namespace sb.manifest.api.DAO
{
    public class LoadDAO : AbstractDAO
    {
        public MResponse GetLoad(IConfiguration config)
        {
            return GetData<MLoad>(config, SQLBuilder.GetLoadListSQL());
        }
        public void AddSlot(IConfiguration config, List<MPassenger> list)
        {
            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                foreach (MPassenger p in list)
                {
                    alParmValues = LoadParametersValue<MPassenger>(p);
                    command = CreateCommand(connection, alParmValues, SQLBuilder.GetInsertPassengersToLoadSQL());
                    command.ExecuteNonQuery();
                }

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error AddPassengers " + ex.Message, ex.InnerException);
            }
            
        }
        public void ConfirmLoad(IConfiguration config, MLoad mLoad)
        {
            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                //update load status to 1 = confirmed //TODO šifrant statusov
                alParmValues.Add(new KeyValuePair<string, object>("@Status", 1));
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mLoad.Id));
                command = CreateCommand(connection, alParmValues, SQLBuilder.GetConfirmLoadSQL());
                command.ExecuteNonQuery();

                //insert DEBIT transakcije v POST tabelo
                //id transaction sestavimo iz mmssff
                alParmValues = new List<KeyValuePair<string, object>>();
                long idTransaction = long.Parse(DateTime.Now.ToString("mmssff"));
                alParmValues.Add(new KeyValuePair<string, object>("@IdTransaction", idTransaction));
                alParmValues.Add(new KeyValuePair<string, object>("@IdCompany", 1));
                alParmValues.Add(new KeyValuePair<string, object>("@IdLoad", mLoad.Id));
                command = CreateCommand(connection, alParmValues, SQLBuilder.InsertPostLoadConfirmSQL());
                command.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error Confirm load " + ex.Message, ex.InnerException);
            }

        }
    }
}
