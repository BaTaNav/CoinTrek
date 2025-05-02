const CACHE_KEY = 'exchangeCache';
const CACHE_TTL = 60 * 60 * 1000; // 1 uur in ms

export function getCachedRates() {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
  return isExpired ? null : cached.data;
}

export function cacheRates(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}
