list();

function list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", personalDataListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", personalDataListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            var table = document.getElementById("list");
            const obj = JSON.parse(this.responseText);
            console.log(obj[0]);
            let text = "";
            for (let i = 0; i < obj.length; i++) {
                text += "<tr><td>" + obj[i].name + "</td><td>" + obj[i].fiscalCode + "</td><td>"+obj[i].partitaIva+"</td><td>"+obj[i].state+"</td><td>" + printEditButton() + "</td></tr>";
            }
            table.innerHTML = text;
        } else {
            logout();
        }
    }
    xhr.send();
}

function printEditButton() {
    return "<button type='button' class='btn btn-outline-secondary' style='float: right'>"
        + "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrows-fullscreen' viewBox='0 0 16 16'>"
        + "<path fill-rule='evenodd' d='M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z'></path>"
        + "</svg>"
        + "<span class='visually-hidden'>Button</span>"
        + "</button>";
}