list();

function list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var table = document.getElementById("list");
            table.innerHTML = createTableInsertClient(this.responseText);
        } else if (this.readyState === 4 && this.status !== 200) {
            logout();
        }
    }
    xhr.send();
}

function insert() {
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
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            errorComponent.style.display = "none";
            var successMessage = "Il record è stato inserito con successo.";
            successComponent.innerHTML = "<div class='alert alert-success' role='alert' style='text-align: left'>"+successMessage+"</div>";
            successComponent.style.display = "block";
            list();
        } else {
            var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
            errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>"+errorMessage+"</div>";
            errorComponent.style.display = "block";
        }
    }
    xhr.send("token="+token+"&name="+name+"&cap="+cap+"&state="+state+"&fiscal_code="+fiscalCode
        +"&phone="+phone+"&email="+email+"&address="+address+"&city="+city+"&country="+country    
        +"&piva="+piva+"&cell="+cell+"&code="+code);
}

function createTableInsertClient(responseText) {
    var json = JSON.parse(responseText);
    let text = "";
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>"+json[i].name+"</td><td>"+json[i].fiscal_Code+"</td>"
            +"<td>"+json[i].piva+"</td><td>"+json[i].state+"</td><td>"+printEditClientButton()+"</td></tr>";
    }
    return text;
}

function printEditClientButton() {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right' data-bs-toggle='modal' data-bs-target='#clientModal' onclick='openClientModal(\"edit\")'>"
        + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrows-fullscreen' viewBox='0 0 16 16'>"
        + "<path fill-rule='evenodd' d='M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z'></path>"
        + "</svg>"
        + "<span class='visually-hidden'>Button</span>"
        + "</button>";
}

function openClientModal(title) {
    if(title == "new") document.getElementById("clientModalTitle").innerHTML = "Nuova anagrafica";
    if(title == "edit") {
        document.getElementById("clientModalTitle").innerHTML = "Modifica anagrafica";
        
    }
}