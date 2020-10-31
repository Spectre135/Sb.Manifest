﻿using sb.manifest.api.DAO;
using System;
using System.Collections.Generic;

namespace sb.manifest.api.Model
{
    //Model to have people of some group in load Tandem,AFF,custom skydivers group
    public class MGroup
    {
        [ParamField("IdGroup")]
        public int IdGroup { get; set; }

        [ParamField("IdPerson")]
        public int? IdPerson { get; set; } //used only when add to skydivers group
        
        public string BackgroundColor { get; set; }
        
        public DateTime? DateOnLoad { get; set; }
        
        public List<MLoadPerson> LoadList { get; set; }
    }
}
