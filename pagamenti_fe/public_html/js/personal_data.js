updateGraphic();
list();

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
                    document.getElementById("modal-footer").innerHTML = "";
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
    xhr.open("GET", personalDataListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                if (this.responseText === "[]") {
                    document.getElementById("noDataWarnindId").style.display = "block";
                    document.getElementById("clientTableDivId").style.display = "none";
                } else {
                    document.getElementById("clientTableDivId").style.display = "block";
                    document.getElementById("noDataWarnindId").style.display = "none";
                    document.getElementById("clientTableBodyId").innerHTML = createTableInsertClient(this.responseText);
                }
            } else if (this.readyState === 4 && this.status !== 200) {
                logout();
            }
        }
    }
    xhr.send();
}

function insert() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var name = document.getElementById("clientName").value;
    var cap = document.getElementById("clientCap").value;
    var state = document.getElementById("clientState").value;
    var fiscalCode = document.getElementById("clientFiscalCode").value;
    var phone = document.getElementById("clientPhone").value;
    var email = document.getElementById("clientEmail").value;
    var address = document.getElementById("clientAddress").value;
    var city = document.getElementById("clientCity").value;
    var country = document.getElementById("clientCountry").value;
    var piva = document.getElementById("clientPiva").value;
    var cell = document.getElementById("clientCell").value;
    var code = document.getElementById("clientCode").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("POST", personalDataCreatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataCreatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato inserito con successo.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                successComponent.style.display = "block";
                errorComponent.style.display = "none";
                list();
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }
    xhr.send("token=" + token + "&name=" + name + "&cap=" + cap + "&state=" + state + "&fiscal_code=" + fiscalCode
            + "&phone=" + phone + "&email=" + email + "&address=" + address + "&city=" + city + "&country=" + country
            + "&piva=" + piva + "&cell=" + cell + "&code=" + code);
}

function view(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataViewPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataViewPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                var id = document.getElementById("clientId");
                var name = document.getElementById("clientName");
                var cap = document.getElementById("clientCap");
                var state = document.getElementById("clientState");
                var fiscalCode = document.getElementById("clientFiscalCode");
                var phone = document.getElementById("clientPhone");
                var email = document.getElementById("clientEmail");
                var address = document.getElementById("clientAddress");
                var city = document.getElementById("clientCity");
                var country = document.getElementById("clientCountry");
                var piva = document.getElementById("clientPiva");
                var cell = document.getElementById("clientCell");
                var code = document.getElementById("clientCode");
                var json = JSON.parse(this.responseText);
                id.value = json.id;
                name.value = json.name;
                cap.value = json.cap;
                state.value = json.state;
                fiscalCode.value = json.fiscalCode;
                phone.value = json.phone;
                address.value = json.address;
                city.value = json.city;
                country.value = json.country;
                piva.value = json.partitaIva;
                cell.value = json.cell;
                code.value = json.code;
                email.value = json.email;
            }
        }
    }
    xhr.send();
}

function edit() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var id = document.getElementById("clientId").value;
    var name = document.getElementById("clientName").value;
    var cap = document.getElementById("clientCap").value;
    var state = document.getElementById("clientState").value;
    var fiscalCode = document.getElementById("clientFiscalCode").value;
    var phone = document.getElementById("clientPhone").value;
    var email = document.getElementById("clientEmail").value;
    var address = document.getElementById("clientAddress").value;
    var city = document.getElementById("clientCity").value;
    var country = document.getElementById("clientCountry").value;
    var piva = document.getElementById("clientPiva").value;
    var cell = document.getElementById("clientCell").value;
    var code = document.getElementById("clientCode").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("PUT", personalDataUpdatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataUpdatePath);
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
    xhr.send("token=" + token + "&id=" + id + "&name=" + name + "&cap=" + cap + "&state=" + state + "&fiscal_code=" + fiscalCode
            + "&phone=" + phone + "&email=" + email + "&address=" + address + "&city=" + city + "&country=" + country
            + "&piva=" + piva + "&cell=" + cell + "&code=" + code);
}

function remove() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("clientId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", personalDataDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataDeletePath);
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

function createTableInsertClient(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>" + json[i].name + "</td><td>" + json[i].fiscal_Code + "</td>"
                + "<td>" + json[i].piva + "</td><td>" + json[i].state + "</td>"
                + "<td>" + printEditClientButton(json[i].id) + "</td></tr>";
    }
    return text;
}

function printEditClientButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#clientModal' onclick='openClientModal(\"edit\",\"" + id + "\")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-zoom-in' viewBox='0 0 16 16'>"
            + "<path fill-rule='evenodd' d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'/>"
            + "<path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z'/>"
            + "<path fill-rule='evenodd' d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'/>"
            + "</svg>"
            + "</button>";
}

function openClientModal(title, id) {
    if (title == "new") {
        document.getElementById("clientId").value = "";
        document.getElementById("clientName").value = "";
        document.getElementById("clientCap").value = ""
        document.getElementById("clientState").value = "";
        document.getElementById("clientFiscalCode").value = "";
        document.getElementById("clientPhone").value = "";
        document.getElementById("clientEmail").value = "";
        document.getElementById("clientAddress").value = "";
        document.getElementById("clientCity").value = "";
        document.getElementById("clientCountry").value = "";
        document.getElementById("clientPiva").value = "";
        document.getElementById("clientCell").value = "";
        document.getElementById("clientCode").value = "";
        document.getElementById("clientModalTitle").innerHTML = "Nuova anagrafica";
        document.getElementById("clientModalRemoveButton").style.display = "none";
        document.getElementById("clientModalEditButton").style.display = "none";
        document.getElementById("clientModalInsertButton").style.display = "block";
    }
    if (title == "edit") {
        view(id);
        document.getElementById("clientModalTitle").innerHTML = "Modifica anagrafica";
        document.getElementById("clientModalRemoveButton").style.display = "block";
        document.getElementById("clientModalEditButton").style.display = "block";
        document.getElementById("clientModalInsertButton").style.display = "none";
    }
}