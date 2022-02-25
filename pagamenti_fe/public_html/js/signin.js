var signin = document.getElementById("signin");
signin.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      send();
    }
});

function send() {
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
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            errorComponent.style.display = "none";
            var token = xhr.responseText;
            localStorage.setItem("token", token);
            window.location.href = indexPath;
        } else {
            var errorMessage = xhr.responseText === "" ? "Errore di connessione al server." : xhr.responseText;
            errorComponent.innerHTML = "<div class='alert alert-danger' role='alert'>"+errorMessage+"</div>";
            errorComponent.style.display = "block";
        }
    }
    xhr.send("email=" + email + "&password=" + password);    
}