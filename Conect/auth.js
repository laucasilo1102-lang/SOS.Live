import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { doc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { auth, db } from "./conect.js";

export const registrarUsuario = async ({ nombre, email, telefono, nit, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "usuarios", user.uid), {
    uid: user.uid,
    nombre,
    email,
    telefono,
    nit,
    createdAt: serverTimestamp()
  });

  await sendEmailVerification(user);
  return user;
};

export const loginUsuario = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user.emailVerified) {
    throw new Error("Debes verificar tu correo antes de iniciar sesion.");
  }

  return user;
};

export const traducirErrorFirebase = (error) => {
  const code = error?.code || "";

  if (code === "auth/email-already-in-use") return "Este correo ya esta registrado.";
  if (code === "auth/invalid-email") return "El correo no es valido.";
  if (code === "auth/weak-password") return "La contrasena debe tener al menos 6 caracteres.";
  if (code === "auth/invalid-credential") return "Correo o contrasena incorrectos.";
  if (code === "auth/requires-recent-login") return "Por seguridad, vuelve a iniciar sesion y repite la accion.";
  if (code === "permission-denied" || code === "firestore/permission-denied") {
    return "Firestore bloqueo la escritura. Revisa las reglas.";
  }

  return error?.message || "Ocurrio un error inesperado.";
};

