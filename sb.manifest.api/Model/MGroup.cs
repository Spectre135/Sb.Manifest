using sb.manifest.api.DAO;
using System;
using System.Collections.Generic;

namespace sb.manifest.api.Model
{
    //Model to have people of some group in load Tandem,AFF,custom skydivers group
    public class MGroup
    {
        [ParamField("IdGroup")]
        public int IdGroup { get; set; }
        public int? IdPersonalGroup { get; set; }

        [ParamField("IdPerson")]
        public int? IdPerson { get; set; } //used only when add skydivers in personal group

        [ParamField("IdLoad")]
        public int? IdLoad { get; set; } //used only when add skydivers in personal group

        public string BackgroundColor { get; set; }
        
        public DateTime? DateOnLoad { get; set; }
        
        public List<MLoadPerson> LoadList { get; set; }
    }
}
