list();

function list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 2 || this.readyState === 3 || this.readyState === 4) && this.status === 200) {
            var table = document.getElementById("list");
            table.innerHTML = createTableClients(this.responseText);
        } else {
            logout();
        }
    }
    xhr.send();
}