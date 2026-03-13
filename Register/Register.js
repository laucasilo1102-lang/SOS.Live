import { registrarUsuario, traducirErrorFirebase } from "../Conect/auth.js";

const form = document.getElementById("registerForm");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");
const nitInput = document.getElementById("nit");
const passwordInput = document.getElementById("password");
const termsInput = document.getElementById("terms");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const nit = nitInput.value.trim();
  const password = passwordInput.value;
  const termsAccepted = termsInput.checked;

  if (!nombre || !email || !telefono || !nit || !password) {
    alert("Completa todos los campos.");
    return;
  }

  if (!termsAccepted) {
    alert("Debes aceptar los terminos y condiciones.");
    return;
  }

  try {
    await registrarUsuario({ nombre, email, telefono, nit, password });
    alert("Cuenta creada correctamente. Revisa tu correo para verificarla.");
    window.location.href = "../Login/Login.html";
  } catch (error) {
    console.error(error);
    alert(traducirErrorFirebase(error));
  }
});
