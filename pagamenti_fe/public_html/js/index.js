if(!logged) {
    document.getElementById("nologged").style.setProperty('display', 'block', 'important');
    document.getElementById("logged").style.setProperty('display', 'none', 'important');
} else {
    document.getElementById("nologged").style.setProperty('display', 'none', 'important');
    document.getElementById("logged").style.setProperty('display', 'block', 'important');
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}