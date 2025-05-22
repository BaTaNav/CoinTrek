import { getCachedRates, cacheRates } from './cache.js';

const API_KEY = '7cac3cdb9959c5fd240c7ccb'; // API key
const BASE_CURRENCY = 'EUR'; //basis valuta in dit geval euro

// bekende regio's en beschrijvingen van de valuta toegevoegd
const currencyInfo = {
  USD: { region: "North America", description: "US Dollar" },
  EUR: { region: "Europe", description: "Euro" },
  GBP: { region: "Europe", description: "British Pound" },
  JPY: { region: "Asia", description: "Japanese Yen" },
  AUD: { region: "Oceania", description: "Australian Dollar" },
  CAD: { region: "North America", description: "Canadian Dollar" },
  CHF: { region: "Europe", description: "Swiss Franc" },
  CNY: { region: "Asia", description: "Chinese Yuan" },
  INR: { region: "Asia", description: "Indian Rupee" },
  NZD: { region: "Oceania", description: "New Zealand Dollar" },
  SGD: { region: "Asia", description: "Singapore Dollar" },
  HKD: { region: "Asia", description: "Hong Kong Dollar" },
  SEK: { region: "Europe", description: "Swedish Krona" },
  NOK: { region: "Europe", description: "Norwegian Krone" },
  MXN: { region: "North America", description: "Mexican Peso" },
  BRL: { region: "South America", description: "Brazilian Real" },
  ZAR: { region: "Africa", description: "South African Rand" },
  RUB: { region: "Europe", description: "Russian Ruble" },
  TRY: { region: "Europe", description: "Turkish Lira" },
  SAR: { region: "Middle East", description: "Saudi Riyal" }
};

export async function fetchRates() {
  const cached = getCachedRates(); // kijk of de gegevens in de cache staan
  if (cached) {
    console.log('Gegevens geladen uit cache');
    return cached;
  }

  try { // api aanroepen om de gegevens op te halen 
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
      const info = currencyInfo[code] || { 
        region: "Unknown", 
        description: `Currency for ${code}` 
      };
      
      acc[code] = {
        value,
        description: info.description,
        region: info.region
      };
      return acc;
    }, {});

    cacheRates(enrichedRates); // cachen
    return enrichedRates;

  } catch (error) {
    console.error('Fout bij ophalen API:', error);
    return null;
  }
}