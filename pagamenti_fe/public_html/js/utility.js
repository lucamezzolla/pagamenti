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

function createTableClients(responseText) {
    var json = JSON.parse(responseText);
    let text = "";
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>"+json[i].name+"</td><td>"+json[i].fiscal_Code+"</td>"
            +"<td>"+json[i].piva+"</td><td>"+json[i].state+"</td><td>"+printEditButton()+"</td></tr>";
    }
    return text;
}

function printEditButton() {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right'>"
        + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrows-fullscreen' viewBox='0 0 16 16'>"
        + "<path fill-rule='evenodd' d='M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z'></path>"
        + "</svg>"
        + "<span class='visually-hidden'>Button</span>"
        + "</button>";
}
