#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
#endregion

namespace sb.manifest.api.DAO
{
    public class LoadDAO : AbstractDAO
    {
        public MResponse GetLoadList(IConfiguration config)
        {
            MResponse mResponse = new MResponse();
            List<MLoad> listLoad = new List<MLoad>();

            try
            {
                using var connection = GetConnection(config);
                IDbCommand command = PrepareQuery(connection, null, SQLBuilder.GetLoadListSQL());
                using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();

                while (reader.Read())
                    listLoad.Add(LoadObject<MLoad>(reader));

                mResponse.DataList = listLoad;
                mResponse.RowsCount = listLoad.Count;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return mResponse;
        }

    }
}
