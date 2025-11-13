/*
JS DASHBOARD FUNCTIONS
----------------------
*/

/*  
    Source - https://stackoverflow.com/a
    Posted by robbmj, modified by community. See post 'Timeline' for change history
    Retrieved 2025-11-13, License - CC BY-SA 4.0

    MODIFIED TO STOP TIMER LOOPING USING:
    https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval#:~:text=The%20setInterval()%20function%20is,the%20interval%20using%20clearInterval()%20.
*/

let incomeTypeSelect = document.getElementById("incomeOptions");

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    
    let countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        timer--;

        if (timer < 0) {
            clearInterval(countdown);
            display.textContent = "00:00";
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 5,
    display = document.querySelector('#countdownTimer');
    startTimer(fiveMinutes, display);
};

function isValidTypeSelected(selectType) {
    if (selectType.selectedIndex !== 0) {
        return true;
    }
    return false;
}

function isValidAmountEntered() {}

function isValidDateEntered() {}

function isValidNameEntered() {}