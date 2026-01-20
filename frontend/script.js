const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

//mdp login
const loginPassword = document.getElementById("login-password");
const toggleLogin = document.getElementById("toggle-login");


toggleLogin.addEventListener("click", () => {
    if (loginPassword.type === "password") {
        loginPassword.type = "text"; // je montre le mdp
        toggleLogin.classList.replace("fa-eye-slash", "fa-eye");

    } else {
        loginPassword.type = "password"; // je le cache
        toggleLogin.classList.replace("fa-eye", "fa-eye-slash");

    }
});

//mdp register
const registerPassword = document.getElementById("register-password");
const toggleRegister = document.getElementById("toggle-register");

toggleRegister.addEventListener("click", () => {
    if (registerPassword.type === "password") {
        registerPassword.type = "text";
        toggleRegister.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        registerPassword.type = "password";
        toggleRegister.classList.replace("fa-eye", "fa-eye-slash");
    }
});

//mdp oublié
const forgotOpen = document.getElementById("forgot-open");
const forgotModal = document.getElementById("forgot-modal");
const forgotClose = document.getElementById("forgot-close");

forgotOpen.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal.style.display = "flex";
});

forgotClose.addEventListener("click", () => {
    forgotModal.style.display = "none";
});

//LOGIN
const loginForm = document.querySelector('.form-box.login form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    //env vers serv
    const rep = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await rep.json();

    if (rep.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '../todolist/index.html';
    } else {
        alert("Login incorrect");
    }
});

//REGISTER
const registerForm = document.querySelector('.form-box.register form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = registerForm.querySelectorAll('input')[0].value;
    const email = registerForm.querySelectorAll('input')[1].value;
    const password = registerForm.querySelectorAll('input')[2].value;

    //env vers serv
    const rep = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            name: username,
            firstname: username,
            password
        })
    });

    const data = await rep.json();

    if (rep.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '../todolist/index.html';
    } else {
        alert("Erreur inscription");
    }
});