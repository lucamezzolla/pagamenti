var token = localStorage.getItem("token");
var logged = token !== null;

//backend paths
var beUrl = "http://localhost:8080/";
var signInPath = beUrl+"signin";
var signUpPath = beUrl+"signup";
var validatePath = beUrl+"validate";
var personalDataNameListPath = beUrl+"personal_data/name-list";
var personalDataListPath = beUrl+"personal_data/list";
var personalDataCreatePath = beUrl+"personal_data/create";
var personalDataViewPath = beUrl+"personal_data/view";
var personalDataUpdatePath = beUrl+"personal_data/update";
var personalDataDeletePath = beUrl+"personal_data/delete";
var servicesNameListPath = beUrl+"services/name-list";
var servicesListPath = beUrl+"services/list";
var servicesCreatePath = beUrl+"services/create";
var servicesViewPath = beUrl+"services/view";
var servicesUpdatePath = beUrl+"services/update";
var servicesDeletePath = beUrl+"services/delete";
var paymentsListPath = beUrl+"payments/list";
var paymentsCreatePath = beUrl+"payments/create";
var paymentsViewPath = beUrl+"payments/view";
var paymentsUpdatePath = beUrl+"payments/update";
var paymentsDeletePath = beUrl+"payments/delete";
var paymentsAttachmentPath = beUrl+"payments/attachment";
var paymentsAttachmentDeletePath = beUrl+"payments/attachment/delete";
var usersListPath = beUrl+"users/list";
var usersViewPath = beUrl+"users/view";
var usersUpdatePath = beUrl+"users/update";
var usersDeletePath = beUrl+"users/delete";
var loansCreatePath = beUrl+"loans/create";
var loansListPath = beUrl+"loans/list";
var loansViewPath = beUrl+"loans/view";
var loansUpdatePath = beUrl+"loans/update";
var loansDeletePath = beUrl+"loans/delete";
var returnedLoansListPath = beUrl+"rloans/list";
var returnedLoansCreatePath = beUrl+"rloans/create";
var returnedLoansDeletePath = beUrl+"rloans/delete";
var userByTokenPath = beUrl+"users/get-user-by-token";

//frontend path
var feUrl = "http://localhost:8383/pagamenti_fe/";
var indexPath = feUrl + "index.html";
var signInFePath = feUrl + "signin.html";
var signUpFePath = feUrl + "signup.html";
var personalDataFePath = feUrl + "personal_data.html";
var servicesFePath = feUrl + "services.html";

//functions
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function goto(page) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", validatePath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", validatePath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = feUrl + page + ".html";
        } else if (this.readyState === 4 && this.status !== 200) {
            logout();
        }
    }
    xhr.send("token="+token);    
}

function showWaitingDiv () {
    document.getElementById("waiting").style.display = "block";
}

function hideWaitingDiv() {
    document.getElementById("waiting").style.display = "none";
}

function confirmRemove() {
    return confirm("Attenzione questo record verrà rimosso dal database. Sei sicuro?");
}