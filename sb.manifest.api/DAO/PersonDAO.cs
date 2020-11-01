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
    public class PersonDAO :AbstractDAO
    {
        public MResponse GetPersons(IConfiguration config, string search, int from, int to, string orderby, bool asc)
        {
            return GetPagingData<MPerson>(config, SQLBuilder.GetPersonsListSQL(), search, from, to, orderby, asc);
        }
        public void Save(IConfiguration config, MPerson mPerson)
        {
            string sql = SQLBuilder.GetInsertPersonSQL();
            List<KeyValuePair<string, object>> alParmValues = LoadParametersValue<MPerson>(mPerson);

            //SQLite nima MERGE zato hendalmo skozi različna SQL-a
            if (mPerson.Id > 0)
            {
                sql = SQLBuilder.GetSavePersonSQL();
                alParmValues.Add(new KeyValuePair<string, object>("@Id", mPerson.Id));
            }

            SaveData(config, sql, alParmValues);
        }
        public MResponse GetTicketPosts(IConfiguration config, string search, int idPerson, int from, int to, string orderby, bool asc)
        {
            //vedno delamo za id Person
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdPerson", idPerson)
            };
            return GetPagingData<MTicketPost>(config, SQLBuilder.GetTicketPostListSQL(), search, from, to, orderby, asc, alParmValues);
        }
        public MResponse GetLoadsHistory(IConfiguration config, string search, int idPerson, int from, int to, string orderby, bool asc)
        {
            //vedno delamo za id Person
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@IdPerson", idPerson)
            };
            return GetPagingData<MLoadList>(config, SQLBuilder.GetLoadsHistoryByPersonSQL(), search, from, to, orderby, asc, alParmValues);
        }
        public void SaveSkydiversGroup(IConfiguration config, List<MGroup> groups)
        {

            IDbTransaction transaction = null;
            try
            {
                List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
                IDbCommand command;

                using var connection = GetConnection(config);
                transaction = connection.BeginTransaction();

                foreach (MGroup g in groups)
                {
                    alParmValues = LoadParametersValue<MGroup>(g);
                    command = CreateCommand(connection, alParmValues, SQLBuilder.GetSaveSkydiversGroupSQL());
                    command.ExecuteNonQuery();
                }

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception("Error SaveSkydiversGroup " + ex.Message, ex.InnerException);
            }
        }
        public MResponse GetEmail(IConfiguration config, string email)
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@Email", email)
            };
            return GetData<MPerson>(config, SQLBuilder.GetPersonEmailSQL(), alParmValues);
        }
    }
}
