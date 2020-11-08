using System;

namespace sb.manifest.api.Utils
{
    public class AppUtils
    {
        public static string RemoveFirstChar(string charToRemove, string value)
        {
            try
            {
                if (value.StartsWith(charToRemove))
                    value = value.Remove(0, 1);
                return value;

            }
            catch (Exception)
            {
                return value;
            }
        }
    }
}
