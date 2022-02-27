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
            table.innerHTML = createTableClients(this.responseText);
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