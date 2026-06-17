import rateLimit from 'express-rate-limit';

export function resolveGuidedRateLimitConfig(env = process.env) {
  const isProduction = env.NODE_ENV === 'production';
  const limit = Number(env.RATE_LIMIT_GUIDED_MAX) || (isProduction ? 30 : 60);
  const windowMs = Number(env.RATE_LIMIT_GUIDED_WINDOW_MS) || (isProduction ? 1_000 : 60_000);

  return {
    limit,
    windowMs,
  };
}

export function createGuidedLimiter(overrides = {}, env = process.env) {
  const defaults = resolveGuidedRateLimitConfig(env);
  const limit = overrides.limit ?? defaults.limit;
  const windowMs = overrides.windowMs ?? defaults.windowMs;

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
      const retryAfterSeconds = Math.max(1, Math.ceil(windowMs / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({
        error: 'Too many guided analysis requests.',
        retryAfterSeconds,
      });
    },
  });
}
