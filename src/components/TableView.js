export class TableView {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
<div class="table-container table-widget" style="padding: var(--card-padding)">
        <table class="simulation-table">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Deposits</th>
              <th>Reserves</th>
              <th>Loans</th>
              <th>Total Money</th>
            </tr>
          </thead>
          <tbody id="simulation-data">
          </tbody>
        </table>
      </div>
    `;
  }

  update(simulationState) {
    if (!simulationState) return;

    const tbody = this.container.querySelector('#simulation-data');
    const cycles = simulationState.cycles;

    // Clear existing rows
    tbody.innerHTML = '';

    // Add new rows
    cycles.forEach(cycle => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cycle.cycleNumber}</td>
        <td>$${cycle.deposits.toFixed(2)}</td>
        <td>$${cycle.reserves.toFixed(2)}</td>
        <td>$${cycle.loans.toFixed(2)}</td>
        <td>$${cycle.totalMoney.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  }
}