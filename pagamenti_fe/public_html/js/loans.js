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
        var currency = json[i].currency.split("#");
        var total = json[i].total;
        var totalr = json[i].totalReturned;
        var totalReturnedColor = totalr < total ? "red" : "green";
        if(currency[1] == "euro") { total += "€"; totalr += "€" }
        if(currency[1] == "dollaro") { total += "$"; totalr += "€" }
        if(currency[1] == "sterlina") { total += "£"; totalr += "€" }
        if(currency[1] == "real") { total += "R$"; totalr += "€" }
        text += "<tr style='vertical-align: middle'><td>" + json[i].client.name + "</td><td>" + total + "</td><td style='color: "+totalReturnedColor+"; font-weight: bold'>" + totalr + "</td>"
            + "<td>" + formatDate(json[i].dateLoan) + "</td><td>" + formatDate(json[i].dateExpiration) + "</td>"
            + "<td>"+printTotalReturnedButton(json[i].id)+"</td><td>"+printEditLoanButton(json[i].id)+"</td></tr>";    
    }
    return text;
}

function printTotalReturnedButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#totalReturnedLoanModal' onclick='openReturnedLoanModal("+id+")'>"
            +"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-cash-coin' viewBox='0 0 16 16'>"
            +"<path fill-rule='evenodd' d='M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z'/>"
            +"<path d='M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z'/>"
            +"<path d='M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z'/>"
            +"<path d='M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z'/>"
            +"</svg>"
            + "</button>";
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

function openReturnedLoanModal(id) {
    var xhr = new XMLHttpRequest();
    document.getElementById("totalReturnedLoanId").value = id;
    document.getElementById("errorRloan").style.display = "none";
    xhr.open("GET", returnedLoansListPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", returnedLoansListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById("rltable").innerHTML = "";
            var json = JSON.parse(this.responseText);
            if(json.length > 0) {
                var text = "<table class='table table-striped'><thead><th style='width: 150px'>Data</th><th>Cifra restituita</th><th style='width: 50px'></th></thead>";
                for (var i = 0; i < json.length; i++) {
                    text += "<tr style='vertical-align: middle'>"
                        +"<td>" + formatDate(json[i].date) + "</td>"
                        +"<td>" + json[i].total + "</td>"
                        +"<td><button><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16' onclick='removeReturnLoad("+json[i].id+")'>"
                            +"<path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>"
                            +"<path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>"
                            +"</svg></button></td>"
                        +"</tr>";    
                }
                text += "</table>";
                document.getElementById("rltable").innerHTML = text;
            }
        }
    }
    xhr.send();
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

function insertReturnedLoan() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var total = document.getElementById("returned").value;
    var loanId = document.getElementById("totalReturnedLoanId").value;
    var errorComponent = document.getElementById("errorRloan");
    xhr.open("POST", returnedLoansCreatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", returnedLoansCreatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                openReturnedLoanModal(loanId); //aggiorna tabella delle cifre restuite
                list(document.getElementById("searchSelectLoan").value); //aggiorna tabella dei prestiti
                document.getElementById("returned").value = 0;
                errorComponent.style.display = "none";
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
            }
        }
    }
    xhr.send("token=" + token + "&loanId=" + loanId + "&total=" + total);  
}

function removeReturnLoad(id) {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("errorRloan");
        var loanId = document.getElementById("totalReturnedLoanId").value;
        xhr.open("DELETE", returnedLoansDeletePath + "?token=" + token + "&rloanId=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", returnedLoansDeletePath);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "DELETE");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                hideWaitingDiv();
                if (this.status === 200) {
                    errorComponent.innerHTML = "";
                    openReturnedLoanModal(loanId);
                    list(document.getElementById("searchSelectLoan").value);
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