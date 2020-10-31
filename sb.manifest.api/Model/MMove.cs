﻿using sb.manifest.api.DAO;

namespace sb.manifest.api.Model
{
    //Model to move people from load to load 
    public class MMove
    {
        [ParamField("IdLoadFrom")]
        public int IdLoadFrom { get; set; }

        [ParamField("IdLoadTo")]
        public int IdLoadTo { get; set; }

        public int[] IdPerson { get; set; }
    }
}
