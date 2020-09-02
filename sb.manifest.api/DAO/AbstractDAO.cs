#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
#endregion

namespace sb.manifest.api.DAO
{
    public abstract class AbstractDAO : IDisposable
    {
        private IDbConnection connection;
        private IDbCommand command;
        public IDbConnection GetConnection(IConfiguration config)
        {
            connection = new SqliteConnection(Config.GetDatabasePath(config));

            return connection;
        }
        public IDbCommand PrepareQuery(IDbConnection connection, List<KeyValuePair<string, object>> alParmValues, string sql)
        {

            try
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();

                command = connection.CreateCommand();
                command.CommandText = sql;
            }
            catch (Exception ex)
            {
                connection.Close();
                throw new Exception("Error at PrepareQuery", ex);
            }

            return command;
        }
        protected static TEntity LoadObject<TEntity>(IDataReader dr) where TEntity : class, new()
        {
            TEntity instanceToPopulate = new TEntity();

            PropertyInfo[] propertyInfos = typeof(TEntity).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            try
            {
                //for each public property on the original
                foreach (PropertyInfo pi in propertyInfos)
                {

                    //this attribute is marked with AllowMultiple=false
                    if (pi.GetCustomAttributes(typeof(DataFieldAttribute), false) is DataFieldAttribute[] datafieldAttributeArray && datafieldAttributeArray.Length == 1)
                    {
                        DataFieldAttribute dfa = datafieldAttributeArray[0];

                        try
                        {
                            object dbValue = dr[dfa.ColumnName];

                            if (dbValue != null &&
                                !String.IsNullOrEmpty(dbValue.ToString()) &&
                                !String.IsNullOrWhiteSpace(dbValue.ToString()))
                            {

                                Type t = Nullable.GetUnderlyingType(pi.PropertyType) ?? pi.PropertyType;
                                object safeValue = (dbValue == null) ? null : Convert.ChangeType(dbValue, t);

                                pi.SetValue(instanceToPopulate, safeValue, null);
                            }
                        }
                        catch (Exception)
                        {
                            //do nothing --column not found
                        }
                    }
                }
            }
            catch (Exception)
            {
                //do nothing
            }

            return instanceToPopulate;

        }
        public void Dispose()
        {
            /*
                If you use connection object one time, use Dispose.
                If connection object must be reused, use Close method.
            */
            try
            {
                connection.Close();
            }
            catch (Exception) { }

        }
    }
}
