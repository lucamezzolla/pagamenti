list();

function list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", paymentsListPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", paymentsListPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if(this.responseText === "[]") {
                document.getElementById("noDataWarnindId").style.display = "block";
                document.getElementById("paymentTableDivId").style.display = "none";
            } else {
                document.getElementById("paymentTableDivId").style.display = "block";
                document.getElementById("noDataWarnindId").style.display = "none";
                document.getElementById("paymentTableBodyId").innerHTML = createTableInsertPayment(this.responseText);
            }
        } else if (this.readyState === 4 && this.status !== 200) {
            //logout();
        }
    }
    xhr.send();
}

function createTableInsertPayment(responseText) {
    let text = "";
    var json = JSON.parse(responseText);
    console.log(json);
    for (var i = 0; i < json.length; i++) {
        text += "<tr><td>" + json[i].service + "</td><td>"+json[i].date+"</td>"
                + "<td>" + json[i].qty + "</td><td>" + json[i].price + "</td>"
                + "<td>" + printEditServiceButton(json[i].id) + "</td></tr>";
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
            + "</button>";
}