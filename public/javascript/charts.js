fetch('/admin/sales_chart')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  })
  .then((result) => {

    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['JAN-FEB', 'MAR-APR', 'MAY-JUN', 'JUL-AUG', 'SEP-OCT', 'NOV-DEC'],
        datasets: [{
          label: 'Number of Orders',
          data: result.countData,
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
  .catch((err) => console.log('Error in fetch sales chart', err));
  
fetch('/admin/customers_chart')
  .then((response) => response.json())
  .then((result) => {

    const countData = result.resultData.map(item => item.count);

    const labels = ['JAN-FEB', 'MAR-APR', 'MAY-JUN', 'JUL-AUG', 'SEP-OCT', 'NOV-DEC'];
    
    const ctxCustomers = document.getElementById('customerChart').getContext('2d');
    
    new Chart(ctxCustomers, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Users',
          data: countData,
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








