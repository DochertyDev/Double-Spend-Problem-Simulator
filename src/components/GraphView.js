export class GraphView {
  constructor(container) {
    this.container = container;
    this.chart = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="graph-container">
        <canvas id="money-supply-chart"></canvas>
      </div>
    `;
    this.initChart();
  }

  initChart() {
    const ctx = document.getElementById('money-supply-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Total Money',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Deposits',
            data: [],
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
          {
            label: 'Loans',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Money Supply Growth'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }
    });
  }

  update(simulationState) {
    if (!simulationState || !this.chart) return;

    const cycles = simulationState.cycles;
    const labels = cycles.map(cycle => `Cycle ${cycle.cycleNumber}`);
    const totalMoney = cycles.map(cycle => cycle.totalMoney);
    const deposits = cycles.map(cycle => cycle.deposits);
    const loans = cycles.map(cycle => cycle.loans);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = totalMoney;
    this.chart.data.datasets[1].data = deposits;
    this.chart.data.datasets[2].data = loans;
    this.chart.update();
  }
}