#region using
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Filter;
using sb.manifest.api.Model;
using sb.manifest.api.SQL;
using sb.manifest.api.Utils;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Text;
#endregion

namespace sb.manifest.api.DAO
{
    public abstract class AbstractDAO : IDisposable
    {

        #region Command
        public IDbCommand CreateCommand(IDbConnection connection, List<KeyValuePair<string, object>> alParmValues, string sql)
        {
            IDbCommand command = null;
            try
            {
                command = connection.CreateCommand();          
                command.CommandText = sql;
                if (alParmValues != null)
                    command = BindParameters((SqliteCommand)command, alParmValues);
            }
            catch (Exception ex)
            {
                connection.Dispose();
                command.Dispose();
                throw new Exception("Error at CreateCommand", ex);
            }

            return command;
        }
        #endregion

        #region LoadObject,Parameters Values
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
                    cmd.Parameters.AddWithValue(item.Key, item.Value ?? DBNull.Value);
                
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
                            //check if we have null value for SQL parameter
                            if (src.GetType().GetProperty(dfa.ColumnName).PropertyType == typeof(string) && value == null)
                                value = string.Empty;

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
        public static string GetSearchFields<T>() where T : class, new()
        {

            Type objType = typeof(T);

            StringBuilder sb = new StringBuilder();

            foreach (PropertyInfo p in objType.GetProperties())
            {
                foreach (DataSearchAttribute a in p.GetCustomAttributes(typeof(DataSearchAttribute), false))
                {
                    if (a.ColumnSearch != null)
                        sb.Append(String.Format("IFNULL({0},'')||", a.ColumnSearch));
                }

            }
            //remove last char wich is +
            //string response = sb.ToString().Substring(0, sb.Length - 1);
            string response = sb.ToString().Substring(0, sb.Length - 2);
            response = " LOWER(" + response + ") ";

            return response;

        }
        public long GetPageCount(IDataReader reader)
        {
            try
            {
                return  (long)reader["COUNT"];
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public static string GetTableName<T>() where T : class, new()
        {

            Type objType = typeof(T);
            foreach (PropertyInfo p in objType.GetProperties())
            {
                foreach (TableNameAttribute a in p.GetCustomAttributes(typeof(TableNameAttribute), false))
                {
                    if (a.TableName != null)
                        return a.TableName;
                }

            }

            return null;

        }
        #endregion

        #region GetData,SaveData
        public MResponse GetData<T>(IConfiguration config, string sql, List<KeyValuePair<string, object>> alParmValues=null) where T : class, new()
        {
            MResponse mResponse = new MResponse();
            List<T> list = new List<T>();

            try
            {
                using IDbCommand command = CreateCommand(Connection.GetConnection(config), alParmValues, sql);
                using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();
                while (reader.Read())
                    list.Add(LoadObject<T>(reader));

                mResponse.DataList = list;
                mResponse.RowsCount = list.Count;

            }
            catch (Exception ex)
            {
                Connection.Dispose();
                throw new Exception("Error Get Data" + ex.Message, ex.InnerException);
            }

            return mResponse;
        }
        public MResponse GetPagingData<T>(IConfiguration config, string sql, string search, int from, int to, string orderby, bool asc,
            List<KeyValuePair<string, object>> alParmValues = null) where T : class, new()
        {
            MResponse mResponse = new MResponse();
            List<T> list = new List<T>();

            try
            {
                if (alParmValues == null)
                    alParmValues = new List<KeyValuePair<string, object>>();

                StringBuilder _sql = new StringBuilder(sql);

                //Search string
                if (!String.IsNullOrEmpty(search) && !search.ToLower().Equals("undefined"))
                {
                    _sql.Append(" and ").Append(GetSearchFields<T>()).Append(" like @searchParam ");
                    alParmValues.Add(SetParam("@searchParam", "%" + search.ToLower() + "%"));
                }

                string finalSQL = GetPagingQuery(_sql.ToString(), from, to, orderby, asc);

                using var connection = Connection.GetConnection(config);
                using IDbCommand command = CreateCommand(connection, alParmValues, finalSQL);
                using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(LoadObject<T>(reader));
                    if (list.Count == 1)
                        mResponse.RowsCount = GetPageCount(reader);
                }

                mResponse.DataList = list;

            }
            catch (Exception ex)
            {
                Connection.Dispose();
                throw new Exception("Error Get Paging Data" + ex.Message, ex.InnerException);
            }

            return mResponse;
        }
        public void SaveData(IConfiguration config, string sql, List<KeyValuePair<string, object>> alParmValues)
        {
            IDbTransaction transaction = null;
            try
            {               
                using var connection = Connection.GetConnection(config);

                transaction = connection.BeginTransaction();

                IDbCommand command = CreateCommand(connection, alParmValues, sql);
                command.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (SqliteException ex)
            {
                transaction.Rollback();
                Connection.Dispose();

                if (ex.SqliteErrorCode== 19) // FOREIGN KEY exception
                    throw new SQLConstraintsException("Can't delete Foreign key!",ex);

                throw new Exception("Error in saving data" + ex.Message, ex.InnerException);
            }
            catch (Exception ex)
            {              
                transaction.Rollback();
                Connection.Dispose();
                throw new Exception("Error in saving data" + ex.Message, ex.InnerException);
            }
        }
        #endregion

        #region PagingQuery
        protected static string GetPagingQuery(string query, int from, int to, string order, bool asc)
        {
            //front end pri sortiranju pošlje "-" pred order poljem zato odstranimo

            return string.Format(@"WITH sql AS ({0}),
                                        sqlrows AS (SELECT COUNT(*) total_rows FROM sql)
                                SELECT * FROM (
                                    SELECT ROW_NUMBER () OVER (ORDER BY {1} {2}) RowNum,
                                        sql.*,sqlrows.total_rows COUNT
                                    FROM sql,sqlrows 
                                ) t
                    WHERE
                    RowNum > {3} AND RowNum <= {4}", query, (string.IsNullOrEmpty(order) ? "NULL" : AppUtils.RemoveFirstChar("-",order)), (asc ? "ASC" : "DESC"), from, to);
        }
        #endregion

        #region Sequences
        public int GetSeqNextValue<T>(IDbConnection connection) where T : class, new()
        {
            int seqval=0;
            List<KeyValuePair<string, object>> alParmValues = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>("@TableName", GetTableName<T>())
            };

            IDbCommand command = CreateCommand(connection, alParmValues, SQLBuilder.GetSequenceValueSQL());
            using SqliteDataReader reader = (SqliteDataReader)command.ExecuteReader();

            if (reader.Read())
                seqval = reader.GetInt32(0);

            return seqval++;

        }
        #endregion

        public void Dispose()
        {
            Connection.Close();
        }
    }
}
