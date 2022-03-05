var signup = document.getElementById("signup");
signup.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      send();
    }
});

function send() {
    showWaitingDiv();
    var xhr = new XMLHttpRequest();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;
    var code = document.getElementById("code").value;
    var errorComponent = document.getElementById("error");
    xhr.open("POST", signUpPath, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", signUpPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(this.readyState === XMLHttpRequest.DONE ) {
            hideWaitingDiv();
            if (this.status === 200) {
                window.location.href = indexPath;
            } else {
                var errorMessage = xhr.responseText.includes("Errore.") ? xhr.responseText : "Errore. La richiesta non è andata buon fine.";
                errorComponent.innerHTML = errorMessage;
                errorComponent.style.display = "block";
            }
        }
    }
    xhr.send("name=" + name + "&email=" + email + "&password1=" + password1 + "&password2=" + password2 + "&code=" + code);    
}