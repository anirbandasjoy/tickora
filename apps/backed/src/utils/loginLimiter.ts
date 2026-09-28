import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again after 10 minutes.',
  skipSuccessfulRequests: true,
});

// Desktop device flow: polling hits /status every 2s, so allow bursts
// but still block enumeration. requestId remains unguessable + short-lived.
export const desktopRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: 'Too many authorization requests. Try again later.',
});

export const desktopStatusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many status checks. Slow down.',
});

export const desktopApproveLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: 'Too many approvals. Try again later.',
});
