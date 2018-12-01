var loginShowBtn = document.getElementById("loginBtn");

loginShowBtn.addEventListener('click',()=>{
    loginShowBtn.style.display = 'none'
    var loginForm = document.getElementById("loginForm")
    loginForm.style.position = 'relative'
    loginForm.style.opacity = "1"
    loginForm.style.marginTop = "50px"
    loginForm.style.zIndex = "1"
})