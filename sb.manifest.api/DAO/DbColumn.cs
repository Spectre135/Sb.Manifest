﻿using System;

namespace sb.manifest.api.DAO
{
    //Field Attributes to use with models

    //Attribute za load data in object
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public sealed class DataFieldAttribute : Attribute
    {
        private readonly string _columnName;

        public DataFieldAttribute(string columnName)
        {
            _columnName = columnName;
        }

        public string ColumnName
        {
            get { return _columnName; }
        }
    }

    //Attribute za search parameter
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public sealed class DataSearchAttribute : Attribute
    {
        private readonly string _columnSearch;

        public DataSearchAttribute(string columnSearch)
        {
            _columnSearch = columnSearch;
        }

        public string ColumnSearch
        {
            get { return _columnSearch; }
        }
    }

    //Attribute za paramter pri INSERT,UPDATE
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public sealed class ParamFieldAttribute : Attribute
    {
        private readonly string _columnName;

        public ParamFieldAttribute(string columnName)
        {
            _columnName = columnName;
        }

        public string ColumnName
        {
            get { return _columnName; }
        }
    }

}
