/*
JS DASHBOARD FUNCTIONS
----------------------
*/

let incomeForm = document.getElementById("incomeForm");
let incomeTypeSelect = document.getElementById("incomeOptions");
let incomeValue = document.getElementById("incomeValue");
let incomeError = document.getElementById("incomeTypeError");

/*  
    Source - https://stackoverflow.com/a
    Posted by robbmj, modified by community. See post 'Timeline' for change history
    Retrieved 2025-11-13, License - CC BY-SA 4.0

    MODIFIED TO STOP TIMER LOOPING USING:
    https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval#:~:text=The%20setInterval()%20function%20is,the%20interval%20using%20clearInterval()%20.
*/

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

function constructErrorMessage(error, element) {
    let para = document.createElement("p");
    let node = document.createTextNode(error);
    para.appendChild(node);

    element.appendChild(para);
}

function removeErrorMessages(parent) {
    /*
    REFERENCE THIS LATER - TAKEN FROM W3 SCHOOLS https://www.w3schools.com/jsref/prop_html_innerhtml.asp
    */
    parent.innerHTML = "";
}

incomeForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let incomeType = incomeTypeSelect.value;
    let incomeAmount = incomeValue.value;

    removeErrorMessages(incomeError);
    let checkTypeSelected = isValidTypeSelected(incomeType);
    let checkIncomeEntered = isValidAmountEntered(incomeAmount);

    if (checkTypeSelected !== true) {
        constructErrorMessage(checkTypeSelected, incomeError);
        return;
    }

    if (checkIncomeEntered !== true) {
        constructErrorMessage(checkIncomeEntered, incomeError);
        return;
    }

    /*
        SUCCESS - ADD NEW TABLE RECORD
    */
})

function isValidTypeSelected(selectType) {
    if (selectType === "auto") {
        return "Please select a valid option"
    }

    return true;
}

function isValidAmountEntered(amt) {
    if (amt.trim() === "") {
        return "Income amount cannot be blank"
    }

    let num = Number(amt);

    if (isNaN(num)) {
        return "This is not a valid income number";
    }

    if (num < 0 || num > 1000000) {
        return "Not a valid income amount. Must be in the range 1 - 1000000 inclusive"
    }

    return true;
}

function isValidDateEntered() {}

function isValidNameEntered() {}

function addTableRecord() {

}