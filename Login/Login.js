import { loginUsuario, traducirErrorFirebase } from "/Conect/auth.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    await loginUsuario(email, password);
    alert("Inicio de sesion exitoso.");
    window.location.href = "/Profile";
  } catch (error) {
    console.error(error);
    alert(traducirErrorFirebase(error));
  }
});
