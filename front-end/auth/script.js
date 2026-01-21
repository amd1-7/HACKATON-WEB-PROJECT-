const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

// --- GESTION DE L'ANIMATION (Toggle) ---
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// --- GESTION DE L'AFFICHAGE DES MOTS DE PASSE ---

// 1. Login Password Toggle
const loginPassword = document.getElementById("login-password");
const toggleLogin = document.getElementById("toggle-login");

toggleLogin.addEventListener("click", () => {
  const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
  loginPassword.setAttribute("type", type);
  toggleLogin.classList.toggle("fa-eye-slash");
  toggleLogin.classList.toggle("fa-eye");
});

// 2. Register Password Toggle (Premier champ mdp)
const registerPassword = document.getElementById("register-password");
const toggleRegister = document.getElementById("toggle-register");

toggleRegister.addEventListener("click", () => {
    const type = registerPassword.getAttribute("type") === "password" ? "text" : "password";
    registerPassword.setAttribute("type", type);
    toggleRegister.classList.toggle("fa-eye-slash");
    toggleRegister.classList.toggle("fa-eye");
});

// 3. Register Verify Password Toggle (NOUVEAU : Second champ mdp)
const registerPasswordVerify = document.getElementById("register-password-verify");
const toggleRegisterVerify = document.getElementById("toggle-register-verify");

toggleRegisterVerify.addEventListener("click", () => {
    const type = registerPasswordVerify.getAttribute("type") === "password" ? "text" : "password";
    registerPasswordVerify.setAttribute("type", type);
    // On utilise toggle ici pour simplifier la gestion des classes fa-eye/fa-eye-slash
    toggleRegisterVerify.classList.toggle("fa-eye-slash");
    toggleRegisterVerify.classList.toggle("fa-eye");
});


// --- GESTION DE LA MODAL MOT DE PASSE OUBLIÉ ---
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

// ==========================================
// INTEGRATION BACKEND (API)
// ==========================================

const API_BASE_URL = "http://localhost:8080/api/auth";

// --- LOGIN ---
const loginForm = document.querySelector(".form-box.login form");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  
  const emailVal = loginForm.querySelector('input[name="email"]').value;
  const passwordVal = loginForm.querySelector('input[name="password"]').value;

  try {
    const rep = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mail: emailVal,
        password: passwordVal
      }),
    });

    const data = await rep.json();

    if (rep.ok) {
      localStorage.setItem("token", data.token);
      // Optionnel : sauvegarder le userId si le backend le renvoie
      if(data.userId) localStorage.setItem("userId", data.userId);

      alert(data.message || "Connexion réussie !");
      window.location.href = "../todolist/index.html";
    } else {
      alert(data.message || "Erreur de connexion");
    }
  } catch (error) {
    console.error("Erreur système:", error);
    alert("Impossible de contacter le serveur.");
  }
});

// --- REGISTER (MIS A JOUR) ---
const registerForm = document.querySelector(".form-box.register form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Récupération des 3 nouveaux champs
  const emailVal = registerForm.querySelector('input[name="email"]').value;
  const passwordVal = registerForm.querySelector('input[name="password"]').value;
  const verifyPasswordVal = registerForm.querySelector('input[name="verifyPassword"]').value;

  // Petite validation frontend avant d'envoyer au backend
  if (passwordVal !== verifyPasswordVal) {
      alert("Les mots de passe ne correspondent pas !");
      return;
  }

  try {
    const rep = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Le corps correspond maintenant exactement à ce que le backend attend
      body: JSON.stringify({
        mail: emailVal,
        password: passwordVal,
        verifyPassword: verifyPasswordVal
      }),
    });

    const data = await rep.json();

    if (rep.ok) {
      alert("Compte créé avec succès ! Connectez-vous.");
      // Vider le formulaire
      registerForm.reset();
      // Basculer vers le login
      container.classList.remove("active");
    } else {
      alert(data.message || "Erreur lors de l'inscription");
    }
  } catch (error) {
    console.error("Erreur système:", error);
    alert("Impossible de contacter le serveur.");
  }
});