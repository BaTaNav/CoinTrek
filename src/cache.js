// data word opgeslaan gedurende 1 uur door de time to live zal deze data hergebruikt worden zolang deze niet ouder is dan een uur.
// als er geen data is zal deze null retourneren zelfde voor als dedata ouder is dan 1 uur


const CACHE_KEY = 'exchangeCache'; // sleutel waar de data is opgeslagen in de lacolstorage
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
