let form = document.getElementById("form");
let nameInput = document.getElementById("nameInput");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = nameInput.value;
    let nameCheck = isValidName(name);
    
    while (nameCheck != "valid") {
        displayError(nameCheck);
    }

});

function isValidName(name) {
    if (name == "") {
        return "The name field cannot be blank";
    }

    if (name.length < 0 || name.length > 30) {
        return "Name must be between 2 and 50 characters inclusive"
    }

    for (let i = 0; i < name.length; i++) {
        let currentChar = name[i];
        
    }


    return "valid";
}

function displayError(nameCheck) {
    let output = document.createElement("p");
    let node = document.createTextNode(nameCheck);
    output.appendChild(node);

    let element = document.getElementById("errorOutput");
    element.appendChild(output);
}