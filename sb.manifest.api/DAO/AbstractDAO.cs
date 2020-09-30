#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
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
        private IDbTransaction transaction;
        private IDbCommand command;

        #region Connection,Command
        public IDbConnection GetConnection(IConfiguration config)
        {
            if (connection == null)
                connection = new SqliteConnection(Config.GetDatabasePath(config));

            if (connection.State != ConnectionState.Open)
                connection.Open();

            return connection;
        }
        public IDbCommand CreateCommand(IDbConnection connection, List<KeyValuePair<string, object>> alParmValues, string sql)
        {

            try
            {
                command = connection.CreateCommand();          
                command.CommandText = sql;
                if (alParmValues != null)
                    command = BindParameters((SqliteCommand)command, alParmValues);
            }
            catch (Exception ex)
            {
                connection.Close();
                throw new Exception("Error at CreateCommand", ex);
            }

            return command;
        }
        #endregion

        #region LoadObject,ParamteresValues
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
        public static IDbCommand BindParameters(IDbCommand command, List<KeyValuePair<string, object>> alParmValues)
        {
            try
            {
                SqliteCommand cmd = (SqliteCommand)command;
                cmd.Parameters.Clear();

                foreach (var item in alParmValues)
                    cmd.Parameters.AddWithValue(item.Key, item.Value);
                
                return cmd;
            }
            catch (Exception ex)
            {
                throw new Exception("Napaka pri dodajanju paramterov", ex);
            }
        }
        public static KeyValuePair<string, object> SetParam(string name, object value)
        {
            return new KeyValuePair<string, object>(name, value);
        }
        protected static List<KeyValuePair<string, object>> LoadParametersValue<T>(object values) where T : class, new()
        {
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>();
            PropertyInfo[] propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            T src = (T)values;

            try
            {
                //for each public property on the original
                foreach (PropertyInfo pi in propertyInfos)
                {

                    //this attribute is marked with AllowMultiple=false
                    if (pi.GetCustomAttributes(typeof(ParamFieldAttribute), false) is ParamFieldAttribute[] fieldAttributeArray && fieldAttributeArray.Length == 1)
                    {
                        ParamFieldAttribute dfa = fieldAttributeArray[0];

                        try
                        {
                            object value = src.GetType().GetProperty(dfa.ColumnName).GetValue(src, null);
                            alParmValues.Add(new KeyValuePair<string, object>(String.Format("@{0}",dfa.ColumnName), value));

                        }
                        catch (Exception)
                        {
                            //do nothing --value not found
                        }
                    }
                }
            }
            catch (Exception)
            {
                //do nothing
            }

            return alParmValues;

        }
        #endregion

        #region GetData,SaveData
        public MResponse GetData<T>(IConfiguration config, string sql, List<KeyValuePair<string, object>> alParmValues=null) where T : class, new()
        {
            MResponse mResponse = new MResponse();
            List<T> list = new List<T>();

            try
            {
                using var connection = GetConnection(config);
                IDbCommand command = CreateCommand(connection, alParmValues, sql);
                using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();

                while (reader.Read())
                    list.Add(LoadObject<T>(reader));

                mResponse.DataList = list;
                mResponse.RowsCount = list.Count;

            }
            catch (Exception ex)
            {
                connection.Close();
                throw new Exception("Error Get Data" + ex.Message, ex.InnerException);
            }

            return mResponse;
        }
        public void SaveData(IConfiguration config, string sql, List<KeyValuePair<string, object>> alParmValues)
        {
            try
            {               
                using var connection = GetConnection(config);

                transaction = connection.BeginTransaction();

                command = CreateCommand(connection, alParmValues, sql);
                command.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                connection.Close();
                throw new Exception("Error in saving data" + ex.Message, ex.InnerException);
            }
        }
        #endregion

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
