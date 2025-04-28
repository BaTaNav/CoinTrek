export function renderRates(rates) {
    const table = document.getElementById('ratesTable');
    table.innerHTML = '';
  
    for (const [currency, value] of Object.entries(rates)) {
      const div = document.createElement('div');
      div.classList.add('rate-item');
      div.innerHTML = `
        <strong>${currency}</strong>: ${value}
        <button class="add-favorite" data-currency="${currency}">⭐</button>
      `;
      table.appendChild(div);
    }
  }
  