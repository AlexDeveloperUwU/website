import rateLimit from "express-rate-limit";

const EXCLUDED_IPS = new Set(["91.116.216.221", "144.24.196.201", "144.24.204.85"]);

const EXCLUDED_USER_AGENTS = new Set(["HetrixTools Uptime Monitoring Bot"]);

const isExcluded = (ip, userAgent) => {
  return (
    EXCLUDED_IPS.has(ip) || Array.from(EXCLUDED_USER_AGENTS).some((ua) => userAgent.includes(ua))
  );
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => (isExcluded(req.ip, req.get("User-Agent")) ? Infinity : 100),
  message: "Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.",
  skipFailedRequests: true,
  skip: (req) => isExcluded(req.ip, req.get("User-Agent")),
});

export default rateLimiter;
