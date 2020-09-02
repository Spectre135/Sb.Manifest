using Microsoft.Extensions.Configuration;

namespace sb.manifest.api.Utils
{
    public class Config
    {
        public static string GetDatabasePath(IConfiguration config)
        {      
            return config.GetSection("AppConfig").GetSection("ConnectionStrings").GetSection("myDB").Value;
        }
    }
}
