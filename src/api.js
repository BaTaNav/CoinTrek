import { getCachedRates, cacheRates } from './cache.js';

const API_KEY = '7cac3cdb9959c5fd240c7ccb'; // API key
const BASE_CURRENCY = 'EUR'; //basis valuta in dit geval euro

export async function fetchRates() {
  const cached = getCachedRates();
  if (cached) {
    console.log('✅ Gegevens geladen uit cache');
    return cached;
  }

  try {
    console.log('Gegevens ophalen van ExchangeRate API');
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('API response niet OK:', response.status);
      return null;
    }

    const json = await response.json();

    if (json.result !== 'success' || typeof json.conversion_rates !== 'object') {
      console.error('Ongeldig API antwoord:', json);
      return null;
    }

    cacheRates(json.conversion_rates);
    return json.conversion_rates;

  } catch (error) {
    console.error('Fout bij ophalen API:', error);
    return null;
  }
}
