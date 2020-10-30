using System;

namespace sb.manifest.api.Filter
{
    public class SQLConstraintsException : Exception
        {
            public SQLConstraintsException()
            {
            }

            public SQLConstraintsException(string message)
                : base(message)
            {
            }

            public SQLConstraintsException(string message, Exception inner)
                : base(message, inner)
            {
            }
        }
}
