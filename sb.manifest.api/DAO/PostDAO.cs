#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System;
using System.Collections.Generic;
using System.Data;
#endregion

namespace sb.manifest.api.DAO
{
    public class PostDAO : AbstractDAO
    {
        public MResponse GetPosts(IConfiguration config, string search, int from, int to, string orderby, bool asc)
        {
            return GetPagingData<MPost>(config, SQLBuilder.GetPostListSQL(),search,from,to,orderby,asc);
        }
        public MResponse GetInvoice(IConfiguration config, long idCustomer)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdCustomer", idCustomer)
            };
            return GetData<MInvoice>(config, SQLBuilder.GetInvoiceSQL(), alParmValues);
        }
        public void PayInvoice(IConfiguration config, List<MInvoice> invoices)
        {
            //TODO parameters insert
            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                foreach (MInvoice i in invoices){
                    alParmValues = new List<KeyValuePair<string, object>>();
                    alParmValues.Add(new KeyValuePair<string, object>("@IdTransaction", i.IdTransaction));
                    alParmValues.Add(new KeyValuePair<string, object>("@Account", 1001));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdCompany", 1));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdCustomer",i.IdCustomer));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdLoad", i.IdLoad));
                    alParmValues.Add(new KeyValuePair<string, object>("@Description", i.Description));
                    alParmValues.Add(new KeyValuePair<string, object>("@Debit", i.Amount));
                    alParmValues.Add(new KeyValuePair<string, object>("@Credit", 0));
                    command = CreateCommand(connection, alParmValues, SQLBuilder.InsertPostPayInvoiceSQL());
                    command.ExecuteNonQuery();

                    alParmValues = new List<KeyValuePair<string, object>>();
                    alParmValues.Add(new KeyValuePair<string, object>("@IdTransaction", i.IdTransaction));
                    alParmValues.Add(new KeyValuePair<string, object>("@Account", i.Account));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdCompany", 1));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdCustomer", i.IdCustomer));
                    alParmValues.Add(new KeyValuePair<string, object>("@IdLoad", i.IdLoad));
                    alParmValues.Add(new KeyValuePair<string, object>("@Description", i.Description));
                    alParmValues.Add(new KeyValuePair<string, object>("@Debit", 0));
                    alParmValues.Add(new KeyValuePair<string, object>("@Credit", i.Amount));
                    command = CreateCommand(connection, alParmValues, SQLBuilder.InsertPostPayInvoiceSQL());
                    command.ExecuteNonQuery();
                }

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error Pay invoices " + ex.Message, ex);
            }

        }
        public void Buy(IConfiguration config, MBuy mBuy)
        {
            IDbTransaction transaction = null;
            try
            {

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                //insert DEBIT transakcijo v POST tabelo
                List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MBuy>(mBuy);
                //id transaction sestavimo iz mmssff
                long idTransaction = long.Parse(DateTime.Now.ToString("mmssff"));
                alParmValues.Add(new KeyValuePair<string, object>("@IdTransaction", idTransaction));
                IDbCommand command = CreateCommand(connection, alParmValues, SQLBuilder.InsertPostBuyTransactionSQL());
                command.ExecuteNonQuery();

                //poknjižimo še tickete v ticketpost tabelo, če customer ima paket ticketov
                command = CreateCommand(connection, alParmValues, SQLBuilder.InsertCreditTicketsSQL());
                command.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error Create Buy transaction " + ex.Message, ex);
            }

        }
    }
}
