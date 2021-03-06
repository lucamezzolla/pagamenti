var signin = document.getElementById("signin");
signin.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        send();
    }
});

function send() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var errorComponent = document.getElementById("error");
    xhr.open("POST", signInPath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", signInPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                errorComponent.style.display = "none";
                var token = xhr.responseText;
                localStorage.setItem("token", token);
                window.location.href = indexPath;
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = "<div class='alert alert-danger' role='alert' style='text-align: left'>" + errorMessage + "</div>";
                errorComponent.style.display = "block";
            }
        }
    }
    xhr.send("email=" + email + "&password=" + password);
}