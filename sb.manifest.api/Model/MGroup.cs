using System;
using System.Collections.Generic;

namespace sb.manifest.api.Model
{
    //Model to have people of some group in load Tandem,AFF,custom skydivers group
    public class MGroup
    {
        public int IdGroup { get; set; }
        public string BackgroundColor { get; set; }
        public DateTime? DateOnLoad { get; set; }
        public List<MLoadPerson> LoadList { get; set; }
    }
}
