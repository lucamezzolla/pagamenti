list();

function list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataListPath+"/?token="+token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            console.log(this.responseText);
        } else {
            logout();
        }
    }
    xhr.send();
}