#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using sb.manifest.api.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Cryptography;
#endregion

namespace sb.manifest.api.DAO
{
    public class LoadDAO : AbstractDAO
    {
        public MResponse GetLoads(IConfiguration config, int status = 0, bool alert = false)
        {
            string sql = SQLBuilder.GetLoadSQL();
            sql += " and Status = @Status";

            //filter za alarme na loade kateri so v 15min časovnem oknu
            if (alert)
                //sql += " and DateDeparted between datetime('now','localtime', '-15 Minute') and datetime('now','localtime', '+15 Minute')  ";
                sql += " and DateDeparted is not null and DateDeparted <= datetime('now','localtime', '+15 Minute')  ";

            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                SetParam("@Status", status)
            };

            return GetData<MLoad>(config, sql, alParmValues);
        }
        public MResponse GetLoadList(IConfiguration config)
        {
            return GetData<MLoadList>(config, SQLBuilder.GetLoadListSQL());
        }

        #region Active and Active Today skydivers
        public MResponse GetActiveToday(IConfiguration config, int idLoad)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdLoad", idLoad)
            };
            return GetData<MSlot>(config, SQLBuilder.GetActiveTodaySQL(), alParmValues);
        }
        public MResponse GetActive(IConfiguration config, string search, int size, int idLoad)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdLoad", idLoad),
                new KeyValuePair<string, object>("@Name", "%" + search.ToLower() + "%"),
                new KeyValuePair<string, object>("@Limit", size)
            };

            return GetData<MSlot>(config, SQLBuilder.GetActiveSQL(), alParmValues);
        }
        #endregion

        #region Move and Add Slot
        public void AddSlot(IConfiguration config, List<MOnBoard> list)
        {
            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();
                //idGroup za skupine ali tandeme da imamo skupaj osebe, če jih premikamo med loadi
                //int idGroup = int.Parse(DateTime.Now.ToString("mmssff"));
                int idGroup = GetSeqNextValue<MOnBoard>(connection);

                foreach (MOnBoard p in list)
                {
                    p.IdGroup = idGroup;
                    alParmValues = LoadParametersValue<MOnBoard>(p);
                    command = CreateCommand(connection, alParmValues, SQLBuilder.GetInsertPassengersToLoadSQL());
                    command.ExecuteNonQuery();
                }

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error AddPassengers to load " + ex.Message, ex.InnerException);
            }

        }
        public void MoveSlot(IConfiguration config, MMove mMove)
        {
            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                foreach (int idPerson in mMove.IdPerson)
                {

                    alParmValues = LoadParametersValue<MMove>(mMove);
                    alParmValues.Add(new KeyValuePair<string, object>("@IdPerson", idPerson));
                    command = CreateCommand(connection, alParmValues, mMove.IdLoadTo == 0 ? SQLBuilder.GetRemoveSlotSQL() : SQLBuilder.GetMoveSlotSQL());
                    command.ExecuteNonQuery();
                }

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error Moving passengers from-to load " + ex.Message, ex.InnerException);
            }

        }
        #endregion

        #region Confirm, Depart, Save, Delete Load
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
                //long idTransaction = long.Parse(DateTime.Now.ToString("mmssff"));
                long idTransaction = GetSeqNextValue<MPost>(connection);
                alParmValues.Add(new KeyValuePair<string, object>("@IdTransaction", idTransaction));
                alParmValues.Add(new KeyValuePair<string, object>("@IdCompany", 1));
                alParmValues.Add(new KeyValuePair<string, object>("@IdLoad", mLoad.Id));
                command = CreateCommand(connection, alParmValues, SQLBuilder.InsertPostLoadConfirmSQL());
                command.ExecuteNonQuery();

                //Debit ticketov če uporabniki imajo tickete
                command = CreateCommand(connection, alParmValues, SQLBuilder.DebitTicketSQL());
                command.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error Confirm load " + ex.Message, ex.InnerException);
            }

        }
        public void SaveLoad(IConfiguration config, MLoad mLoad)
        {
            string sql = SQLBuilder.GetInsertLoadSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MLoad>(mLoad);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mLoad.Id > 0)
            {
                sql = SQLBuilder.GetSaveLoadSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mLoad.Id));
            }

            SaveData(config, sql, alParmValues);

        }
        public void DeleteLoad(IConfiguration config, MLoad mLoad)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@Id", mLoad.Id)
            };

            SaveData(config, SQLBuilder.GetDeleteLoadSQL(), alParmValues);

        }
        public void SaveDepart(IConfiguration config, MLoad mLoad)
        {

            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@Id", mLoad.Id),
                new KeyValuePair<string, object>("@DateDeparted", mLoad.DateDeparted),
                new KeyValuePair<string, object>("@IdAircraft", mLoad.IdAircraft),
                new KeyValuePair<string, object>("@Number", mLoad.Number)
            };

            SaveData(config, SQLBuilder.GetSaveDepartSQL(), alParmValues);

        }
        #endregion
    }
}
