
/* 
JS HOMEPAGE FUNCTIONS
---------------------
*/
const homeForm = document.getElementById("beginForm");

homeForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameInput = document.getElementById("nameInput");
    const errorDiv = document.getElementById("errorOutput");

    let checkValid = isValidInput(nameInput.value);
    removeErrorMessages(errorDiv);

    if (checkValid !== true) {
        constructErrorMessage(checkValid, errorDiv);
        return;
    }
    
    /* 
    https://stackoverflow.com/questions/38338144/how-can-i-make-a-button-redirect-my-page-to-another-page-using-addeventlistener
    */
    document.location.href = "dashboard.html";
});

function isValidInput(inputType) {
    if (inputType === "") {
        return "No name entered";
    }

    if (inputType.length < 2 || inputType.length > 20) {
        return "Name must be between 2 and 20 characters inclusive";
    }

    return true;
}

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


/*
JS DASHBOARD FUNCTIONS
----------------------
*/

function decrementTimer() {
    let minutes = 5;
    let seconds = 60;
}