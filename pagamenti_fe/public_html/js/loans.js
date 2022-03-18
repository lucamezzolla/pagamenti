document.getElementById("loanTableDivId").style.display = "none";
document.getElementById("noDataWarnindId").style.display = "block";

clientList();

var clientArray = new Array();
var isNew = 1;

function clientList() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataNameListPath + "?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataNameListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            hideWaitingDiv();
            clientArray = this.responseText;
            document.getElementById("searchSelectLoan").innerHTML = createSelectInsertLoan(clientArray, "Scegli un'anagrafica");
        }
    }
    xhr.send();
}

function list(id) {
    document.getElementById("success").style.display = "none";
    document.getElementById("error").style.display = "none";
    if (id > 0) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", loansListPath + "/?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", loansListPath);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                hideWaitingDiv();
                if (this.status === 200) {
                    if (this.responseText === "[]") {
                        document.getElementById("noDataWarnindId").style.display = "block";
                        document.getElementById("loanTableDivId").style.display = "none";
                    } else {
                        document.getElementById("loanTableDivId").style.display = "block";
                        document.getElementById("noDataWarnindId").style.display = "none";
                        document.getElementById("loanTableBodyId").innerHTML = createTableInsertLoan(this.responseText);
                    }
                } else if (this.readyState === 4 && this.status !== 200) {
                    logout();
                }
            }
        }
        xhr.send();
    } else {
        document.getElementById("loanTableBodyId").innerHTML = "";
        document.getElementById("loanTableDivId").style.display = "none";
        document.getElementById("noDataWarnindId").style.display = "none";
    }
}

function insert() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var total = document.getElementById("loanTotal").value;
    var currency = document.getElementById("loanCurrency").value;
    var dateLoan = document.getElementById("loanDate").value;
    var dateExpiration = document.getElementById("loanExpirationDate").value;
    var clientId = document.getElementById("loanClient").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("POST", loansCreatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", loansCreatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                document.getElementById("searchSelectLoan").options[clientId].selected = "true";
                list(document.getElementById("searchSelectLoan").value);
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato inserito correttamente.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                errorComponent.style.display = "none";
                successComponent.style.display = "block";
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }
    xhr.send("token=" + token + "&clientId=" + clientId + "&total=" + total + "&currency=" + currency + "&dateLoan=" + dateLoan + "&dateExpiration=" + dateExpiration);
}

function view(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", loansViewPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", loansViewPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var id = document.getElementById("loanId");
            var total = document.getElementById("loanTotal");
            var dateLoan = document.getElementById("loanDate");
            var dateExpiration = document.getElementById("loanExpirationDate");
            var client = document.getElementById("loanClient");
            var currency = document.getElementById("loanCurrency");
            var json = JSON.parse(this.responseText);
            id.value = json.id;
            name.value = json.name;
            total.value = json.total;
            dateLoan.value = json.dateLoan;
            dateExpiration.value = json.dateExpiration;
            client.options[json.client.id].selected = "true";   
            var arrCurrency = json.currency.toString().split("#");
            currency.options[arrCurrency[0]].selected = "true";
        }
    }
    xhr.send();
}

function edit() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var id = document.getElementById("loanId").value;
    var total = document.getElementById("loanTotal").value;
    var currency = document.getElementById("loanCurrency").value;
    var dateLoan = document.getElementById("loanDate").value;
    var dateExpiration = document.getElementById("loanExpirationDate").value;
    var clientId = document.getElementById("loanClient").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("PUT", loansUpdatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", loansUpdatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "PUT");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                document.getElementById("searchSelectLoan").options[clientId].selected = "true";
                list(document.getElementById("searchSelectLoan").value);
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato aggiornato correttamente.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                errorComponent.style.display = "none";
                successComponent.style.display = "block";
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }
    xhr.send("token=" + token + "&id=" + id + "&clientId=" + clientId + "&total=" + total + "&currency=" + currency + "&dateLoan=" + dateLoan + "&dateExpiration=" + dateExpiration);
}


function remove() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("loanId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", loansDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", loansDeletePath);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "DELETE");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                hideWaitingDiv();
                if (this.status === 200) {
                    list(document.getElementById("searchSelectLoan").value);
                    errorComponent.style.display = "none";
                    var successMessage = "Il record è stato rimosso correttamente.";
                    successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                    errorComponent.style.display = "none";
                    successComponent.style.display = "block";
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

function formatDate(date) {
    var arrayDate = date.split("-");
    var retval = arrayDate[2]+"/"+arrayDate[1]+"/"+arrayDate[0];
    return retval;
}

function createTableInsertLoan(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    for (var i = 0; i < json.length; i++) {
        var total = json[i].total;
        if(json[i].currency == "euro") total += "€";
        if(json[i].currency == "dollaro") total += "$";
        if(json[i].currency == "sterlina") total += "£";
        if(json[i].currency == "real") total += "R$";
        text += "<tr><td>" + json[i].client.name + "</td><td>" + total + "</td>"
            + "<td>" + formatDate(json[i].dateLoan) + "</td><td>" + formatDate(json[i].dateExpiration) + "</td><td>"+printEditLoanButton(json[i].id)+"</td></tr>";
    }
    return text;
}

function printEditLoanButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#loanModal' onclick='openLoanModal(\"edit\",\"" + id + "\")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-zoom-in' viewBox='0 0 16 16'>"
            + "<path fill-rule='evenodd' d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'/>"
            + "<path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z'/>"
            + "<path fill-rule='evenodd' d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'/>"
            + "</svg>"
            + "</button>";
}

function createSelectInsertLoan(array, optionZero) {
    let text = "<option value='-1' selected>" + optionZero + "</option>";
    var json = JSON.parse(array);
    for (var i = 0; i < json.length; i++) {
        text += "<option value='" + json[i].id + "'>" + json[i].name + "</option>";
    }
    return text;
}

function openLoanModal(title, id) {
    if (title == "new") {
        isNew = 1;
        document.getElementById("loanId").value = "";
        document.getElementById("loanClient").value = "";
        document.getElementById("loanDate").value = "";
        document.getElementById("loanExpirationDate").value = "";
        document.getElementById("loanTotal").value = "0";
        document.getElementById("loanCurrency").selectedIndex = 0;
        document.getElementById("loanModalTitle").innerHTML = "Nuovo prestito";
        document.getElementById("loanModalRemoveButton").style.display = "none";
        document.getElementById("loanModalEditButton").style.display = "none";
        document.getElementById("loanModalInsertButton").style.display = "block";
        document.getElementById("success").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("loanClient").innerHTML = createSelectInsertLoan(clientArray, "Scegli un'anagrafica");
    }
    if (title == "edit") {
        isNew = 0;
        document.getElementById("loanModalTitle").innerHTML = "Modifica prestito";
        document.getElementById("loanModalRemoveButton").style.display = "block";
        document.getElementById("loanModalRemoveButton").style.display = "block";
        document.getElementById("loanModalEditButton").style.display = "block";
        document.getElementById("loanModalInsertButton").style.display = "none";
        document.getElementById("success").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("loanClient").innerHTML = createSelectInsertLoan(clientArray, "Scegli un'anagrafica");
        view(id);
    }
}