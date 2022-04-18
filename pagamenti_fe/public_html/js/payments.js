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
                    document.getElementById("modal-footer").innerHTML = "";
                    document.getElementById("paymentAttachmentModalRemoveDiv").innerHTML = "";
                    document.getElementById("paymentService").disabled = true;
                    document.getElementById("paymentCode").disabled = true;
                    document.getElementById("paymentReceipt").disabled = true;
                    document.getElementById("paymentClient").disabled = true;
                    document.getElementById("paymentDate").disabled = true;
                    document.getElementById("paymentDescription").disabled = true;
                    document.getElementById("paymentInvoice").disabled = true;
                    document.getElementById("paymentPrice").disabled = true;
                    document.getElementById("paymentQty").disabled = true;
                    document.getElementById("paymentIva").disabled = true;
                    document.getElementById("paymentIvaCode").disabled = true;
                    document.getElementById("paymentAttachment").disabled = true;
                }
            } else if (this.readyState === 4 && this.status !== 200) {
                logout();
            }
        }
    }
    xhr.send();
}

document.getElementById("paymentTableDivId").style.display = "none";
document.getElementById("noDataWarnindId").style.display = "block";

clientList();
serviceList();

var clientArray = new Array();
var serviceArray = new Array();
var attachment;
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
        }
    }
    xhr.send();
}

function serviceList() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", servicesNameListPath + "?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", servicesNameListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            hideWaitingDiv();
            serviceArray = this.responseText;
            document.getElementById("searchSelectService").innerHTML = createSelectInsertPayment(serviceArray, "Scegli un servizio");
        }
    }
    xhr.send();
}

function list(id) {
    document.getElementById("noAttachmentWarnindId").style.display = "none";
    document.getElementById("success").style.display = "none";
    document.getElementById("error").style.display = "none";
    if (id > 0) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", paymentsListPath + "/?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsListPath);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                hideWaitingDiv();
                if (this.status === 200) {
                    if (this.responseText === "[]") {
                        document.getElementById("noDataWarnindId").style.display = "block";
                        document.getElementById("paymentTableDivId").style.display = "none";
                    } else {
                        document.getElementById("paymentTableDivId").style.display = "block";
                        document.getElementById("noDataWarnindId").style.display = "none";
                        document.getElementById("paymentTableBodyId").innerHTML = createTableInsertPayment(this.responseText);
                    }
                } else if (this.readyState === 4 && this.status !== 200) {
                    logout();
                }
            }
        }
        xhr.send();
    } else {
        document.getElementById("paymentTableBodyId").innerHTML = "";
        document.getElementById("paymentTableDivId").style.display = "none";
        document.getElementById("noDataWarnindId").style.display = "none";
    }
}

function insert() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var serviceId = document.getElementById("paymentService").value;
    var code = document.getElementById("paymentCode").value;
    var receipt = document.getElementById("paymentReceipt").value;
    var qty = document.getElementById("paymentQty").value;
    var iva = document.getElementById("paymentIva").value;
    var clientId = document.getElementById("paymentClient").value;
    var paymentDate = document.getElementById("paymentDate").value;
    var description = document.getElementById("paymentDescription").value;
    var invoice = document.getElementById("paymentInvoice").value;
    var price = document.getElementById("paymentPrice").value;
    var ivaCode = document.getElementById("paymentIvaCode").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("POST", paymentsCreatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsCreatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                document.getElementById("noAttachmentWarnindId").style.display = "none";
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato inserito con successo.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                successComponent.style.display = "block";
                errorComponent.style.display = "none";
                list(document.getElementById("searchSelectService").value);
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }

    xhr.send("token=" + token + "&serviceId=" + serviceId + "&code=" + code + "&receipt=" + receipt + "&qty=" + qty + "&iva=" + iva
            + "&clientId=" + clientId + "&paymentDate=" + paymentDate + "&description=" + description + "&invoice=" + invoice
            + "&price=" + price + "&ivaCode=" + ivaCode + "&attachment=" + attachment);

}

function loadingAttachment() {
    var button;
    if (isNew == 1)
        button = document.getElementById("paymentModalInsertButton");
    else
        button = document.getElementById("paymentModalEditButton");
    button.style.display = "none";
    var file = document.getElementById("paymentAttachment").files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
        //const metadata = `name: ${file.name}, type: ${file.type}, size: ${file.size}, contents:`;
        attachment = evt.target.result;
    }
    reader.onloadend = function () {
        button.style.display = "block";
    }
    reader.readAsDataURL(file);
}

function readerFunction(reader) {
    return reader.result;
}

function view(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", paymentsViewPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsViewPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var id = document.getElementById("paymentId");
            var code = document.getElementById("paymentCode");
            var receipt = document.getElementById("paymentReceipt");
            var qty = document.getElementById("paymentQty");
            var iva = document.getElementById("paymentIva");
            var paymentDate = document.getElementById("paymentDate");
            var description = document.getElementById("paymentDescription");
            var invoice = document.getElementById("paymentInvoice");
            var price = document.getElementById("paymentPrice");
            var ivaCode = document.getElementById("paymentIvaCode");
            var json = JSON.parse(this.responseText);
            id.value = json.id;
            code.value = json.code;
            receipt.value = json.receipt;
            qty.value = json.quantity;
            iva.value = json.iva;
            paymentDate.value = json.paymentDateTime;
            description.value = json.description;
            invoice.value = json.invoice;
            price.value = json.price;
            ivaCode.value = json.ivaCode;
            var service = document.getElementById("paymentService");
            var client = document.getElementById("paymentClient");
            service.value = json.service.id;
            client.value = json.client.id;
        }
    }
    xhr.send();
}


function edit() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var id = document.getElementById("paymentId").value;
    var serviceId = document.getElementById("paymentService").value;
    var code = document.getElementById("paymentCode").value;
    var receipt = document.getElementById("paymentReceipt").value;
    var qty = document.getElementById("paymentQty").value;
    var iva = document.getElementById("paymentIva").value;
    var clientId = document.getElementById("paymentClient").value;
    var paymentDate = document.getElementById("paymentDate").value;
    var description = document.getElementById("paymentDescription").value;
    var invoice = document.getElementById("paymentInvoice").value;
    var price = document.getElementById("paymentPrice").value;
    var ivaCode = document.getElementById("paymentIvaCode").value;
    var successComponent = document.getElementById("success");
    var errorComponent = document.getElementById("error");
    xhr.open("PUT", paymentsUpdatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsUpdatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "PUT");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                document.getElementById("noAttachmentWarnindId").style.display = "none";
                errorComponent.style.display = "none";
                var successMessage = "Il record è stato aggiornato correttamente.";
                successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>" + successMessage + "</div>";
                errorComponent.style.display = "none";
                successComponent.style.display = "block";
                list(document.getElementById("searchSelectService").value);
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
                successComponent.style.display = "none";
            }
        }
    }
    xhr.send("token=" + token + "&id=" + id + "&serviceId=" + serviceId + "&code=" + code + "&receipt=" + receipt + "&qty=" + qty + "&iva=" + iva
            + "&clientId=" + clientId + "&paymentDate=" + paymentDate + "&description=" + description + "&invoice="
            + invoice + "&price=" + price + "&ivaCode=" + ivaCode + "&attachment=" + attachment);
}

function remove() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("paymentId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", paymentsDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsDeletePath);
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
                    list(document.getElementById("searchSelectService").value);
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

function removeAttachment() {
    if (confirmRemove()) {
        showWaitingDiv();
        var xhr = new XMLHttpRequest();
        var id = document.getElementById("paymentId").value;
        var successComponent = document.getElementById("success");
        var errorComponent = document.getElementById("error");
        xhr.open("DELETE", paymentsAttachmentDeletePath + "?token=" + token + "&id=" + id, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsAttachmentDeletePath);
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
                    list(document.getElementById("searchSelectService").value);
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

function createTableInsertPayment(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    for (var i = 0; i < json.length; i++) {
        let date = json[i].paymentDateTimeString.substring(0, json[i].paymentDateTimeString.length - 3);
        text += "<tr style='vertical-align: middle'>"
                + "<td title='"+json[i].service.name+"' style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap'>" + json[i].service.name + "</td>"
                + "<td title='"+date+"' style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap'>" + date + "</td>"
                + "<td title='€ "+json[i].price+"' style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap'>€ " + json[i].price + "</td>"
                + "<td title='"+json[i].description+"' style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 400px'>" + json[i].description + "</td>"
                + "<td>" + printEditPaymentButton(json[i].id) + "</td>"
                + "</tr>";
    }
    return text;
}

function printEditPaymentButton(id) {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#paymentModal' onclick='openPaymentModal(\"edit\",\"" + id + "\")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-zoom-in' viewBox='0 0 16 16'>"
            + "<path fill-rule='evenodd' d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'/>"
            + "<path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z'/>"
            + "<path fill-rule='evenodd' d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'/>"
            + "</svg>"
            + "</button>"
            + "<button type='button' class='btn btn-outline-secondary' style='float: right; margin-right: 8px' onclick='showAttachment(" + id + ")'>"
            + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-card-image' viewBox='0 0 16 16'>"
            + "<path d='M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'></path>"
            + "<path d='M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z'></path>"
            + "</svg>"
            + "<span class='visually-hidden'>Button</span>"
            + "</button>"
}

function createSelectInsertPayment(array, optionZero) {
    let text = "<option value='-1' selected>" + optionZero + "</option>";
    var json = JSON.parse(array);
    for (var i = 0; i < json.length; i++) {
        text += "<option value='" + json[i].id + "'>" + json[i].name + "</option>";
    }
    return text;
}

function openPaymentModal(title, id) {
    if (title == "new") {
        isNew = 1;
        attachment = "";
        document.getElementById("paymentId").value = "";
        document.getElementById("paymentService").value = "";
        document.getElementById("paymentCode").value = "";
        document.getElementById("paymentReceipt").value = "";
        document.getElementById("paymentClient").value = "";
        document.getElementById("paymentDate").value = "";
        document.getElementById("paymentDescription").value = "";
        document.getElementById("paymentInvoice").value = "";
        document.getElementById("paymentPrice").value = "";
        document.getElementById("paymentQty").value = "";
        document.getElementById("paymentIva").value = "";
        document.getElementById("paymentIvaCode").value = "";
        document.getElementById("paymentAttachment").value = "";
        document.getElementById("paymentModalTitle").innerHTML = "Nuovo pagamento";
        document.getElementById("paymentAttachmentLabel").innerHTML = "Allegato";
        document.getElementById("paymentAttachmentModalRemoveButton").style.display = "none";
        document.getElementById("paymentModalRemoveButton").style.display = "none";
        document.getElementById("paymentModalEditButton").style.display = "none";
        document.getElementById("paymentModalInsertButton").style.display = "block";
        document.getElementById("success").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("paymentClient").innerHTML = createSelectInsertPayment(clientArray, "Scegli un'anagrafica");
        document.getElementById("paymentService").innerHTML = createSelectInsertPayment(serviceArray, "Scegli un servizio");
    }
    if (title == "edit") {
        isNew = 0;
        attachment = "";
        document.getElementById("paymentAttachment").value = "";
        document.getElementById("paymentAttachmentLabel").innerHTML = "Allegato";
        document.getElementById("paymentModalTitle").innerHTML = "Pagamento";
        document.getElementById("noAttachmentWarnindId").style.display = "none";
        var removeButton = document.getElementById("paymentModalRemoveButton");
        var editButton = document.getElementById("paymentModalEditButton");
        var insertButton = document.getElementById("paymentModalInsertButton");
        var removeAttachmentButton = document.getElementById("paymentAttachmentModalRemoveButton");
        if(removeButton !== null) document.getElementById("paymentModalRemoveButton").style.display = "block";
        if(editButton !== null) document.getElementById("paymentModalEditButton").style.display = "block";
        if(insertButton !== null) document.getElementById("paymentModalInsertButton").style.display = "none";
        if(removeAttachmentButton !== null) document.getElementById("paymentAttachmentModalRemoveButton").style.display = "block";
        document.getElementById("success").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("paymentClient").innerHTML = createSelectInsertPayment(clientArray, "Scegli un'anagrafica");
        document.getElementById("paymentService").innerHTML = createSelectInsertPayment(serviceArray, "Scegli un servizio");
        view(id);
    }
    updateGraphic();
}

function showAttachment(id) {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", paymentsAttachmentPath + "?token=" + token + "&id=" + id, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsAttachmentPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            hideWaitingDiv();
            if (this.responseText) {
                document.getElementById("noAttachmentWarnindId").style.display = "none";
                document.getElementById("success").style.display = "none";
                document.getElementById("error").style.display = "none";
                var json = JSON.parse(this.responseText);
                let data = json.attachment;
                if (this.responseText.includes("application/pdf")) {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write(
                            "<iframe style='margin: 0; border: none' width='100%' height='100%' src='" + encodeURI(data) + "'></iframe><script>document.body.style.margin = 0;</script>"
                            );
                } else {
                    var image = new Image();
                    image.src = data;
                    image.style.setProperty("display", "block");
                    image.style.setProperty("margin-left", "auto");
                    image.style.setProperty("margin-right", "auto");
                    image.style.setProperty("max-width", "80%");
                    image.style.setProperty("height", "auto");
                    var w = window.open("");
                    w.document.write(image.outerHTML);
                }
            } else {
                document.getElementById("noAttachmentWarnindId").style.display = "block";
            }
        }
    }
    xhr.send();
}