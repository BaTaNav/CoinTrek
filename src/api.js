import { getCachedRates, cacheRates } from './cache.js';

const API_KEY = '7cac3cdb9959c5fd240c7ccb'; // <-- vervang dit met jouw echte key
const BASE_CURRENCY = 'EUR';

export async function fetchRates() {
  const cached = getCachedRates();
  if (cached) {
    console.log('✅ Gegevens geladen uit cache');
    return cached;
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('API response niet OK:', response.status);
      return null;
    }

    const json = await response.json();
    if (json.result !== 'success') {
      console.error('Ongeldig API antwoord:', json);
      return null;
    }

    const enrichedRates = Object.entries(json.conversion_rates).reduce((acc, [code, value]) => {
      acc[code] = {
        value,
        description: `Currency for ${code}`,
        region: 'Unknown'
      };
      return acc;
    }, {});

    cacheRates(enrichedRates);
    return enrichedRates;

  } catch (error) {
    console.error('Fout bij ophalen API:', error);
    return null;
  }
}