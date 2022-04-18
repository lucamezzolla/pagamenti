function updateGraphic() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", userByTokenPath + "/?token=" + token, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", userByTokenPath);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            hideWaitingDiv();
            if (this.status === 200) {
                var user = JSON.parse(this.responseText);
                if(!user.admin) {
                    document.getElementById("button4").innerHTML = "Utenza";
                } else {
                    document.getElementById("button4").innerHTML = "Utenze";
                }
            } else if (this.readyState === 4 && this.status !== 200) {
                logout();
            }
        }
    }
    xhr.send();
}

if(!logged) {
    document.getElementById("nologged").style.setProperty('display', 'block', 'important');
    document.getElementById("logged").style.setProperty('display', 'none', 'important');
} else {
    document.getElementById("nologged").style.setProperty('display', 'none', 'important');
    document.getElementById("logged").style.setProperty('display', 'block', 'important');
    updateGraphic();
}