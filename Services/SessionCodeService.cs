using System;
using System.Linq;
using ByodLauncher.Models;

namespace ByodLauncher.Services
{
    public class SessionCodeService
    {
        private readonly ByodLauncherContext _context;
        private readonly Random _numberGenerator = new Random();

        public SessionCodeService(ByodLauncherContext context)
        {
            _context = context;
        }

        public string GetSessionCode(bool uniqueCode = true)
        {
            const int lowerBoundary = 100000;
            const int upperBoundary = 999999;

            int code;
            do
            {
                code = _numberGenerator.Next(lowerBoundary, upperBoundary + 1);
            } while (!uniqueCode || CodeIsUnique(code));

            return code.ToString();
        }

        private bool CodeIsUnique(int code)
        {
            var codeString = code.ToString();
            return _context.Sessions.Any(session => session.AccessCode == codeString || session.EditCode == codeString);
        }
    }
}