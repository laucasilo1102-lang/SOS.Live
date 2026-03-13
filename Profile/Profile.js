import { deleteUser, onAuthStateChanged, sendEmailVerification, signOut, updateEmail } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { auth, db } from "/Conect/conect.js";
import { traducirErrorFirebase } from "/Conect/auth.js";

const form = document.getElementById("profileForm");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");
const nitInput = document.getElementById("nit");
const deleteBtn = document.getElementById("deleteBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

const cargarDatos = async (user) => {
  const userRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? snap.data() : {};

  nombreInput.value = data.nombre || "";
  emailInput.value = data.email || user.email || "";
  telefonoInput.value = data.telefono || "";
  nitInput.value = data.nit || "";
};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/Login";
    return;
  }

  currentUser = user;
  try {
    await cargarDatos(user);
  } catch (error) {
    console.error(error);
    alert("No fue posible cargar los datos del perfil.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) return;

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const nit = nitInput.value.trim();

  if (!nombre || !email || !telefono || !nit) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    if (email !== currentUser.email) {
      await updateEmail(currentUser, email);
      await sendEmailVerification(currentUser);
      alert("Correo actualizado. Verifica el nuevo correo.");
    }

    await setDoc(doc(db, "usuarios", currentUser.uid), {
      uid: currentUser.uid,
      nombre,
      email,
      telefono,
      nit,
      updatedAt: serverTimestamp()
    }, { merge: true });

    alert("Datos actualizados correctamente.");
  } catch (error) {
    console.error(error);
    alert(traducirErrorFirebase(error));
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "/Login";
});

deleteBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  const confirmDelete = confirm("Esta accion eliminara la cuenta y sus datos. Deseas continuar?");
  if (!confirmDelete) return;

  const userRef = doc(db, "usuarios", currentUser.uid);
  const snap = await getDoc(userRef);
  const backupData = snap.exists() ? snap.data() : null;

  try {
    if (snap.exists()) {
      await deleteDoc(userRef);
    }

    await deleteUser(currentUser);
    alert("Cuenta eliminada correctamente.");
    window.location.href = "/Home";
  } catch (error) {
    if (backupData) {
      try {
        await setDoc(userRef, backupData);
      } catch (restoreError) {
        console.error("No se pudo restaurar el documento tras error:", restoreError);
      }
    }

    console.error(error);
    alert(traducirErrorFirebase(error));
  }
});
