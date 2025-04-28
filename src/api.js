export async function fetchRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Fout bij ophalen wisselkoersen:', error);
      return {};
    }
  }
  