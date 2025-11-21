// GETTING THE USERS NAME
const userName = localStorage.getItem("User_Name");
const displayName = document.getElementById("userNameDisplay");
displayName.textContent = userName;

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

// FILTER BUTTON ELEMENTS
let filterButton = document.getElementById("filterButton");
let filter = document.getElementById("filterSelect");
// https://stackoverflow.com/questions/13688238/javascript-style-display-none-or-jquery-hide-is-more-efficient
filter.style.display = "none";

let typeFilter = document.getElementById("typeFieldset");
typeFilter.style.display = "none";

let costFilter = document.getElementById("costFieldset");
costFilter.style.display = "none";

// FILTER TYPE ELEMENTS
const typeSelectionRadio = document.querySelectorAll("input[name = 'transaction_type']");
const priceSelectionRadio = document.querySelectorAll("input[name = 'sort_transaction']");

// TABLE ELEMENTS
let table = document.getElementById("transactionTable");
let transactionRecords = [];

// RESET BUTTON
let reset = document.getElementById("resetButton");

/*  
    Source - https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript
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
            localStorage.removeItem("Time_Remaining");
        } else {
            localStorage.setItem("Time_Remaining", timer);
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#countdownTimer');
    // startTimer(fiveMinutes, display);

    let savedRecords = localStorage.getItem("User_Transactions");
    let savedTime = this.localStorage.getItem("Time_Remaining");

    if (savedRecords) {
        transactionRecords = JSON.parse(savedRecords);
        updateTableRecords();

        transactionRecords.forEach(rec => {
            if (rec.t === "Income") {
                updateTotalIncome(rec.a);
            } else {
                updateTotalExpenses(rec.a);
            }

            updateRemainingBalance();
        })
    }

    if (savedTime) {
        startTimer(Number(savedTime), display); // stored as string in local storage, so convert to number
    } else {
        startTimer(fiveMinutes, display);
    }
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
incomeForm.addEventListener("submit", function (e) {
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
    insertTableRecord(transaction, incomeType, incomeAmount);
    updateTotalIncome(incomeAmount);
    updateRemainingBalance();

    incomeForm.reset();
});

// EXPENSE FORM
expenseForm.addEventListener("submit", function (e) {
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

    if (num <= 0 || num > 1000000) {
        return "Not a valid income amount. Must be in the range 1 - 1000000 inclusive";
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

function insertTableRecord(transaction, type, amt) {
    transactionRecords.push({ t: transaction, tp: type, a: amt });
    console.log(transactionRecords);

    updateTableRecords();
    updateLocalStorage();
}

function updateTableRecords() {
    table.innerHTML = `<tr>
                        <th>Transaction</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Option</th>
                    </tr>`;

    let arrayLen = transactionRecords.length;

    for (let i = 0; i < arrayLen; i++) {
        let record = document.createElement("tr");

        record.innerHTML = `
            <td>${transactionRecords[i].t}</td>
            <td>${transactionRecords[i].tp}</td>
            <td>€${transactionRecords[i].a}</td>
            <td></td>`;

        let delButton = document.createElement("button");
        delButton.textContent = "Delete";

        delButton.addEventListener("click", function (e) {
            if (transactionRecords[i].t === "Income") {
                decreaseTotalIncome(transactionRecords[i].a);
            } else if (transactionRecords[i].t === "Expenditure") {
                decreaseTotalExpenses(transactionRecords[i].a);
            }

            updateRemainingBalance();

            transactionRecords.splice(i, 1);

            updateLocalStorage();
            updateTableRecords();
        });

        record.lastElementChild.appendChild(delButton);
        table.appendChild(record);
    }
}

// LOCAL STORAGE
const updateLocalStorage = () => localStorage.setItem("User_Transactions", JSON.stringify(transactionRecords));
const resetLocalStorage = () => localStorage.setItem(("Time_Remaining", 0))

// TOTAL INCOME
const updateTotalIncome = (amt) => totalIncomeValue.textContent = `€${Number(totalIncome = totalIncome + amt)}`;
const decreaseTotalIncome = (amt) => totalIncomeValue.textContent = `€${Number(totalIncome = totalIncome - amt)}`;

// TOTAL EXPENSES
const updateTotalExpenses = (amt) => totalExpensesValue.textContent = `€${Number(totalExpenses = totalExpenses + amt)}`;
const decreaseTotalExpenses = (amt) => totalExpensesValue.textContent = `€${Number(totalExpenses = totalExpenses - amt)}`;

// REMAINING BALANCE
const updateRemainingBalance = () => remainingBalanceValue.textContent = `€${Number(totalIncome - totalExpenses)}`;


reset.addEventListener("click", function (e) {
    transactionRecords = [];
    updateTableRecords();

    totalIncome = 0;
    totalIncomeValue.textContent = "€0";

    totalExpenses = 0;
    totalExpensesValue.textContent = "€0";

    remainingBalance = 0;
    remainingBalanceValue.textContent = "€0";

    localStorage.removeItem("User_Transactions");
});

filterButton.addEventListener("click", function () {
    filter.value = "auto";
    typeFilter.style.display = "none";
    costFilter.style.display = "none";

    typeSelectionRadio.forEach(record => record.checked = false);
    priceSelectionRadio.forEach(record => record.checked = false);

    if (filter.style.display == "block") {
        filter.style.display = "none"
    } else {
        filter.style.display = "block"
    }
});

filter.addEventListener("change", function () {
    if (filter.value == "type") {
        typeFilter.style.display = "block";
        costFilter.style.display = "none";
    } else if (filter.value == "price") {
        costFilter.style.display = "block";
        typeFilter.style.display = "none";
    } else {
        typeFilter.style.display = "none";
        costFilter.style.display = "none";
        updateTableRecords();
    }
});

function populateTypeArray(type) {
    let updatedArray = [];

    for (let i = 0; i < transactionRecords.length; i++) {
        if (transactionRecords[i].t === type) {
            updatedArray.push(transactionRecords[i]);
        }
    }

    console.log(updatedArray);
    displayFilterTable(updatedArray);
}

function populateCostArray(cost) {
    // https://www.geeksforgeeks.org/javascript/how-to-clone-an-array-in-javascript/
    let updatedArray = [...transactionRecords];
    console.log(updatedArray);

    // IMPLEMENT SELECTION SORT ALGORITHM (USING OOP AS REFERENCE)
    for (let i = 0; i < updatedArray.length; i++) {
        let smallest = i;

        for (let j = i + 1; j < updatedArray.length; j++) {
            if (updatedArray[j].a < updatedArray[smallest].a) {
                smallest = j;
            }
        }

        let temp = updatedArray[i];
        updatedArray[i] = updatedArray[smallest];
        updatedArray[smallest] = temp;
    }

    if (cost === "highest") {
        displayFilterTable(updatedArray.reverse());
    } else if (cost === "lowest") {
        displayFilterTable(updatedArray);
    }

    console.log(updatedArray);
}

function displayFilterTable(array) {
    table.innerHTML = `<tr>
                        <th>Transaction</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Option</th>
                    </tr>`;

    for (let i = 0; i < array.length; i++) {
        let record = document.createElement("tr");

        record.innerHTML = `
            <td>${array[i].t}</td>
            <td>${array[i].tp}</td>
            <td>€${array[i].a}</td>
            <td></td>`;

        let delButton = document.createElement("button");
        delButton.textContent = "Delete";

        delButton.addEventListener("click", function (e) {
            if (transactionRecords[i].t === "Income") {
                decreaseTotalIncome(transactionRecords[i].a);
            } else if (transactionRecords[i].t === "Expenditure") {
                decreaseTotalExpenses(transactionRecords[i].a);
            }

            updateRemainingBalance();

            transactionRecords.splice(i, 1);
            updateTableRecords();
        });

        record.lastElementChild.appendChild(delButton);
        table.appendChild(record);
    }
}

typeSelectionRadio.forEach(radio => {
    radio.addEventListener("change", function(){
        if (radio.value === "income" && radio.checked) {
            populateTypeArray("Income");
        } else if (radio.value === "expenditure" && radio.checked) {
            populateTypeArray("Expenditure");
        }
    });
});

priceSelectionRadio.forEach(radio => {
    radio.addEventListener("change", function(){
        if (radio.value === "highest" && radio.checked) {
            populateCostArray("highest");
        } else if (radio.value === "lowest" && radio.checked) {
            populateCostArray("lowest");
        }
    });
});