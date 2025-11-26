const tableTitle = ["Income", "Expenditure", "Remaining Balance"];
const barColors = ["#b91d47","#00aba9","#2b5797"];
let transactions = JSON.parse(localStorage.getItem("User_Transactions"));

let income = 0;
let expenses = 0;

for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].t === "Income") {
        income += transactions[i].a
    } else {
        expenses += transactions[i].a
    }
}

let remaining = income - expenses;
let values = [income, expenses, remaining];



window.onload = function() {
    let currentTimer = localStorage.getItem("Time_Remaining");
    const display = document.querySelector('#countdownTimer');

    if (currentTimer) {
        startTimer(Number(currentTimer), display);
    } else {
        display.textContent = "00:00";
    }
}

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: tableTitle,
    datasets: [{
      backgroundColor: barColors,
      data: values
    }]
  },
  options: {
    plugins: {
      legend: {display:true},
      title: {
        display: true,
        text: "World Wine Production 2018",
        font: {size:16}
      }
    }
  }
});