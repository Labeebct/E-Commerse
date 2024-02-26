
fetch('/admin/sales_chart')
  .then((response) => response.json())
  .then((result) => {

    const ctx = document.getElementById('salesChart').getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['JANUARY', 'MARCH', 'MAY', 'JULY', 'SEPTEMBER', 'DECEMBER'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  })
  .catch((err) => console.log('Error in fetch sales chart', err))



fetch('/admin/customers_chart')
  .then((response) => response.json())
  .then((result) => {

    const ctxCustomers = document.getElementById('customerChart').getContext('2d')
    new Chart(ctxCustomers, {
      type: 'bar',
      data: {
        labels: ['JANUARY', 'MARCH', 'MAY', 'JULY', 'SEPTEMBER', 'DECEMBER'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  })
  .catch((err) => console.log('Error in fetch sales chart', err))



fetch('/admin/stocks_chart')
  .then((response) => response.json())
  .then((result) => {
    
    const ctxProducts = document.getElementById('stocksChart').getContext('2d')
    new Chart(ctxProducts, {
      type: 'doughnut',
      data: {
        labels: result.labels,
        datasets: [{
          label: 'Number of Products',
          data: result.data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  })
  .catch((err) => console.log('Error in fetch sales chart', err))








