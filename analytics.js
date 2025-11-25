window.onload = function() {
    let currentTimer = localStorage.getItem("Time_Remaining");
    const display = document.querySelector('#countdownTimer');

    if (currentTimer) {
        startTimer(Number(currentTimer), display);
    } else {
        display.textContent = "00:00";
    }
}