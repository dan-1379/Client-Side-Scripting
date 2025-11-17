// MAIN DASHBOARD FIGURES
let totalIncome = 0;
let totalIncomeValue = document.getElementById("totalIncomeValue");

let totalExpenses = 0;
let totalExpensesValue = document.getElementById("totalExpensesValue");

let remainingBalance = 0;
let remainingBalanceValue = document.getElementById("remainingBalanceValue");

// INCOME FORM ELEMENTS
let incomeForm = document.getElementById("incomeForm");
let incomeTypeSelect = document.getElementById("incomeOptions");
let incomeValue = document.getElementById("incomeValue");
let incomeError = document.getElementById("incomeTypeError");

// EXPENDITURE FORM ELEMENTS
let expenseForm = document.getElementById("expensesForm");
let expenseTypeSelect = document.getElementById("expenditureOptions");
let expenseDate = document.getElementById("expenseDate");
let expenseName = document.getElementById("expenseName");
let expenseValue = document.getElementById("expenseAmount");
let expenseError = document.getElementById("expenseTypeError");

// TABLE ELEMENTS
const table = document.getElementById("transactionTable");
let transactionRecords = [];

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

// INCOME FORM
incomeForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let incomeType = incomeTypeSelect.value;
    let incomeAmount = incomeValue.value;
    let transaction = "Income";

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

    incomeAmount = Number(incomeAmount);
    /*
        SUCCESS - ADD NEW TABLE RECORD
    */
    let delButton = document.createElement("button");
    insertTableRecord(transaction, incomeType, incomeAmount, delButton);
    updateTotalIncome(incomeAmount);
    updateRemainingBalance();
    
    incomeForm.reset();
});

// EXPENSE FORM
expenseForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let expenseTypeValue = expenseTypeSelect.value;
    let expenseDateValue = expenseDate.value;
    let expenseNameValue = expenseName.value;
    let expenseAmountValue = expenseValue.value;
    let transaction = "Expenditure";

    removeErrorMessages(expenseError);
    let checkExpenseSelected = isValidTypeSelected(expenseTypeValue);
    let checkDateEntered = isValidDateEntered(expenseDateValue);
    let checkNameEntered = isValidNameEntered(expenseNameValue);
    let checkExpenseEntered = isValidAmountEntered(expenseAmountValue);

    if (checkExpenseSelected !== true) {
        constructErrorMessage(checkExpenseSelected, expenseError);
        return;
    }

    if (checkDateEntered !== true) {
        constructErrorMessage(checkDateEntered, expenseError);
        return;
    }

    if (checkNameEntered !== true) {
        constructErrorMessage(checkNameEntered, expenseError);
        return;
    }

    if (checkExpenseEntered !== true) {
        constructErrorMessage(checkExpenseEntered, expenseError);
        return;
    }

    expenseAmountValue = Number(expenseAmountValue);
    /*
        SUCCESS - ADD NEW TABLE RECORD
    */
    let delButton = document.createElement("button");
    insertTableRecord(transaction, expenseTypeValue, expenseAmountValue, delButton);
    updateTotalExpenses(expenseAmountValue);
    updateRemainingBalance();

    expenseForm.reset();
});

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

function isValidDateEntered(date) {
    if (date.trim() == "") {
        return "Please enter a value for the date";
    }

    if (date.length != 8) {
        return "Date value must be 8 characters in the form DD/MM/YY";
    }

    let dashCount = 0;

    for (let i = 0; i < date.length; i++) {
        if (date[i] === "/") {
            dashCount++;
        }
    }

    if (dashCount != 2) {
        return "Date value must be in the form DD/MM/YY separated by a backslash";
    }

    /* https://www.w3schools.com/jsref/jsref_substring.asp */
    let dateArray = [];
    
    let day = date.substring(0, 2);
    let month = date.substring(3, 5);
    let year = date.substring(6);

    dateArray.push(day, month, year);
    let valid = true;
    
    dateArray.forEach(element => {
        let checkSection = isValidDateSection(element);

        if (checkSection !== true) {
            valid = false;
        }
    });

    if (valid == false) {
       return "Not a valid date!";
    }

    return true;
}

function isValidNameEntered(name) {
    if (name.trim() === "") {
        return "Name of the expenditure cannot be blank";
    }

    if (name.length >= 1 && name.length <= 3) {
        return "Nice try. Please use a more descriptive name";
    }

    return true;
}

function isValidDateSection(section) {
    for (let i = 0; i < section.length; i++) {
        if (section[i] < '0' || section[i] > '9') {
            return false;
        }
    }

    return true;
}

function insertTableRecord(transaction, type, amt, delButton) {
    transactionRecords.push(transaction, type, amt, delButton);
    console.log(transactionRecords);
    
    let record = document.createElement("tr");

    record.innerHTML = `
            <td>${transaction}</td>
            <td>${type}</td>
            <td>€${amt}</td>
            <td></td>`;

    delButton.textContent = "Delete";
    record.lastElementChild.appendChild(delButton);

    delButton.addEventListener("click", function(e) {
        record.remove();
    });

    table.appendChild(record);
}

function updateTotalIncome(amt) {
    totalIncomeValue.textContent =  `€${Number(totalIncome = totalIncome + amt)}`;
}

function updateTotalExpenses(amt) {
    totalExpensesValue.textContent =  `€${Number(totalExpenses = totalExpenses + amt)}`;
}

function updateRemainingBalance() {
    remainingBalanceValue.textContent = `€${Number(totalIncome - totalExpenses)}`;
}