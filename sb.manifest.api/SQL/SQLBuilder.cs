namespace sb.manifest.api.SQL
{
    public class SQLBuilder
    {
        public static string GetSkydiversListSQL()
        {
            return "Select * from skydiver";
        }
        public static string GetLoadListSQL()
        {
            return "Select * from v_load";
        }
    }
}
