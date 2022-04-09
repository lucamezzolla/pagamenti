list();
updateGraphic();

function updateGraphic() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", userByTokenPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", userByTokenPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                var user = JSON.parse(this.responseText);
                if(!user.admin) {
                    document.getElementById("newButtonCol").innerHTML = "";
                }
            } else if (this.readyState === 4 && this.status !== 200) {
                logout();
            }
        }
    }
    xhr.send();
}

function list() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", usersListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", usersListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                if (this.responseText === "[]") {
                    document.getElementById("noDataWarnindId").style.display = "block";
                    document.getElementById("userTableDivId").style.display = "none";
                } else {
                    document.getElementById("userTableDivId").style.display = "block";
                    document.getElementById("noDataWarnindId").style.display = "none";
                    document.getElementById("userTableBodyId").innerHTML = createTableInsertUser(this.responseText);
                }
            } else if (this.readyState === 4 && this.status !== 200) {
                logout();
            }
        }
    }
    xhr.send();
}

function view(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", usersViewPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", usersViewPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var id = document.getElementById("userId");
            var name = document.getElementById("userName");
            var email = document.getElementById("userEmail");
            var json = JSON.parse(this.responseText);
            console.log(json);
            id.value = json.id;
            name.value = json.name;
            email.value = json.email;
        }
    }
    xhr.send();
}

function edit() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var id = document.getElementById("userId").value;
    var name = document.getElementById("userName").value;
    var email = document.getElementById("userEmail").value;
    var password1 = document.getElementById("userPassword1").value;
    var password2 = document.getElementById("userPassword2").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("PUT", usersUpdatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", usersUpdatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "PUT");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato aggiornato correttamente.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                errorComponent.style.display = "none";
                successComponent.style.display = "block";
                list();
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }
    xhr.send("token=" + token + "&id=" + id + "&name=" + name + "&email=" + email + "&password1=" + password1 + "&password2=" + password2);
}

function remove() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("userId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", usersDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", usersDeletePath);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "DELETE");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                hideWaitingDiv();
                if (this.status === 200) {
                    errorComponent.style.display = "none";
                    var successMessage = "Il record è stato rimosso correttamente.";
                    successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                    errorComponent.style.display = "none";
                    successComponent.style.display = "block";
                    list();
                } else {
                    var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                    errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                    successComponent.style.display = "none";
                    errorComponent.style.display = "block";
                }
            }
        }
        xhr.send();
    }
}

function createTableInsertUser(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>" + json[i].name + "</td><td>" + json[i].email + "</td><td>"+printEditUserButton(json[i].id)+"</td></tr>";
    }
    return text;
}

function printEditUserButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#userModal' onclick='openUserModal(\"edit\",\"" + id + "\")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-zoom-in' viewBox='0 0 16 16'>"
            + "<path fill-rule='evenodd' d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'/>"
            + "<path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z'/>"
            + "<path fill-rule='evenodd' d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'/>"
            + "</svg>"
            + "</button>";
}

function openUserModal(title, id) {
    if (title == "new") {
        window.location.href = signUpFePath;
    }
    if (title == "edit") {
        view(id);
        document.getElementById("userPassword1").value = "";
        document.getElementById("userPassword2").value = "";
        document.getElementById("userModalTitle").innerHTML = "Modifica utente";
        document.getElementById("userPassword1Label").innerHTML = "Password";
        document.getElementById("userPassword2Label").innerHTML = "Ripeti password";
        document.getElementById("userModalTitle").innerHTML = "Modifica utente";
        document.getElementById("userModalRemoveButton").style.display = "block";
        document.getElementById("userModalEditButton").style.display = "block";
        document.getElementById("userModalInsertButton").style.display = "none";
    }
}