#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Utils;
using System;
using System.Data;
#endregion

namespace sb.manifest.api.DAO
{
    public class Connection
    {
        private static IDbConnection connection;
        public static IDbConnection GetConnection(IConfiguration config)
        {
            if (connection == null)
                connection = new SqliteConnection(Config.GetDatabasePath(config));

            if (connection.State != ConnectionState.Open)
                connection.Open();

            return connection;
        }
        public static void Dispose()
        {
            try
            {
                connection.Dispose();
            }
            catch (Exception) { }
        }
        public static void Close()
        {
            try
            {
                connection.Close();
            }
            catch (Exception) { }
        }
    }
}
