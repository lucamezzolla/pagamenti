list();

function list() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", servicesListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", servicesListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                if (this.responseText === "[]") {
                    document.getElementById("noDataWarnindId").style.display = "block";
                    document.getElementById("serviceTableDivId").style.display = "none";
                } else {
                    document.getElementById("serviceTableDivId").style.display = "block";
                    document.getElementById("noDataWarnindId").style.display = "none";
                    document.getElementById("serviceTableBodyId").innerHTML = createTableInsertService(this.responseText);
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
    var name = document.getElementById("serviceName").value;
    var fiscalCode = document.getElementById("serviceFiscalCode").value;
    var piva = document.getElementById("servicePiva").value;
    var description = document.getElementById("serviceDescription").value;
    var address = document.getElementById("serviceAddress").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("POST", servicesCreatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", servicesCreatePath);
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
    xhr.send("token=" + token + "&name=" + name + "&fiscal_code=" + fiscalCode + "&address=" + address + "&piva=" + piva + "&description=" + description);
}

function view(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", servicesViewPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", servicesViewPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var id = document.getElementById("serviceId");
            var name = document.getElementById("serviceName");
            var fiscalCode = document.getElementById("serviceFiscalCode");
            var address = document.getElementById("serviceAddress");
            var piva = document.getElementById("servicePiva");
            var description = document.getElementById("serviceDescription");
            var json = JSON.parse(this.responseText);
            id.value = json.id;
            name.value = json.name;
            fiscalCode.value = json.fiscalCode;
            address.value = json.address;
            piva.value = json.piva;
            description.value = json.description;
        }
    }
    xhr.send();
}

function edit() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var id = document.getElementById("serviceId").value;
    var name = document.getElementById("serviceName").value;
    var fiscalCode = document.getElementById("serviceFiscalCode").value;
    var piva = document.getElementById("servicePiva").value;
    var description = document.getElementById("serviceDescription").value;
    var address = document.getElementById("serviceAddress").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("PUT", servicesUpdatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", servicesUpdatePath);
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
    xhr.send("token=" + token + "&id=" + id + "&name=" + name + "&fiscal_code=" + fiscalCode + "&address=" + address + "&piva=" + piva + "&description=" + description);
}

function remove() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("serviceId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", servicesDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", servicesDeletePath);
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

function createTableInsertService(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    console.log(json);
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>" + json[i].name + "</td><td>" + json[i].address + "</td>"
                + "<td>" + json[i].fiscal_Code + "</td>" + "<td>" + json[i].piva + "</td>"
                + "<td>" + printEditServiceButton(json[i].id) + "</td></tr>";
    }
    return text;
}

function printEditServiceButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#serviceModal' onclick='openServiceModal(\"edit\",\"" + id + "\")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-zoom-in' viewBox='0 0 16 16'>"
            + "<path fill-rule='evenodd' d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'/>"
            + "<path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z'/>"
            + "<path fill-rule='evenodd' d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'/>"
            + "</svg>"
            + "</button>";
}

function openServiceModal(title, id) {
    if (title == "new") {
        document.getElementById("serviceId").value = "";
        document.getElementById("serviceName").value = "";
        document.getElementById("serviceFiscalCode").value = "";
        document.getElementById("serviceAddress").value = "";
        document.getElementById("servicePiva").value = "";
        document.getElementById("serviceDescription").value = "";
        document.getElementById("serviceModalTitle").innerHTML = "Nuovo servizio";
        document.getElementById("serviceModalRemoveButton").style.display = "none";
        document.getElementById("serviceModalEditButton").style.display = "none";
        document.getElementById("serviceModalInsertButton").style.display = "block";
    }
    if (title == "edit") {
        view(id);
        document.getElementById("serviceModalTitle").innerHTML = "Modifica servizio";
        document.getElementById("serviceModalRemoveButton").style.display = "block";
        document.getElementById("serviceModalEditButton").style.display = "block";
        document.getElementById("serviceModalInsertButton").style.display = "none";
    }
}