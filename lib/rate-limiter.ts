/**
 * In-memory sliding window rate limiter for HyuuCdn uploads.
 * Restricts requests per IP address over a sliding time window.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipStore = new Map<string, RateLimitRecord>();

// Default configuration: 10 uploads per 60 seconds
const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60 * 1000;

// Periodic cleanup of stale IPs every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipStore.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter((ts) => now - ts < DEFAULT_WINDOW_MS);
      if (record.timestamps.length === 0) {
        ipStore.delete(ip);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter: number; // seconds to wait if exceeded
}

export function checkRateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = ipStore.get(ip) || { timestamps: [] };

  // Filter timestamps within current sliding window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  const resetTime = Math.ceil(
    (activeTimestamps.length > 0 ? activeTimestamps[0] + windowMs : now + windowMs) / 1000
  );

  if (activeTimestamps.length >= limit) {
    const earliest = activeTimestamps[0];
    const retryAfter = Math.max(1, Math.ceil((earliest + windowMs - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
      retryAfter,
    };
  }

  // Record this request
  activeTimestamps.push(now);
  ipStore.set(ip, { timestamps: activeTimestamps });

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - activeTimestamps.length),
    reset: resetTime,
    retryAfter: 0,
  };
}

export function getClientIp(req: Request): string {
  const headers = req.headers;
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "127.0.0.1";
}
