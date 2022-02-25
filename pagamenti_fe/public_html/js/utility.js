var token = localStorage.getItem("token");
var logged = token !== null;

//backend paths
var beUrl = "http://localhost:8080/";
var signInPath = beUrl+"signin";
var signUpPath = beUrl+"signup";
var validatePath = beUrl+"validate";
var personalDataListPath = beUrl+"personal_data/list";

//frontend path
var feUrl = "http://localhost:8383/pagamenti_fe/";
var indexPath = feUrl + "index.html";
var signInFePath = feUrl + "signin.html";

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
        if (this.status === 200) {
            window.location.href = feUrl + page + ".html";
        } else {
            logout();
        }
    }
    xhr.send("token="+token);    
}
