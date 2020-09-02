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
    public class SkydiverDAO :AbstractDAO
    {
        public MResponse GetSkydivers(IConfiguration config)
        {
            MResponse mResponse = new MResponse();
            List<MSkydiver> listSkydivers = new List<MSkydiver>();

            try
            {
                using var connection = GetConnection(config);
                IDbCommand command = PrepareQuery(connection, null, SQLBuilder.GetSkydiversListSQL());
                using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();

                while (reader.Read())
                    listSkydivers.Add(LoadObject<MSkydiver>(reader));

                mResponse.DataList = listSkydivers;
                mResponse.RowsCount = listSkydivers.Count;

            }catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return mResponse;
        }

    }
}
