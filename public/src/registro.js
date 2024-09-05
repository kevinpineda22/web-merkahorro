import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyAlaFymWa_XXlMUScf05h9CP6CNGcWEi5Y",
  authDomain: "login-736ac.firebaseapp.com",
  projectId: "login-736ac",
  storageBucket: "login-736ac.appspot.com",
  messagingSenderId: "1091401843350",
  appId: "1:1091401843350:web:f54074ef8338d9b1f2f8b7",
  measurementId: "G-0HP0QFHENJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Obtener elementos del DOM
const registroButton = document.getElementById('registro');

// función para mostrar u ocultar la contraseña
 // Define la función en el contexto global
 window.lupaContraseña = function(inputId) {
  const passwordInput = document.getElementById(inputId);
  const icon = passwordInput.parentNode.querySelector('.toggle-password');

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.innerHTML = "&#128065;";
  } else {
    passwordInput.type = "password";
    icon.innerHTML = "&#128065;";
  }
}

// Registro de usuario
registroButton.addEventListener('click', (e) => {
  e.preventDefault(); // Evitar el comportamiento por defecto del formulario

  const nombre = document.getElementById('Nombre').value.trim();
  const cedula = document.getElementById('Cedula').value.trim();
  const email = document.getElementById('emailreg').value.trim();
  const password = document.getElementById('passwordreg').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  // Validar que todos los campos obligatorios estén llenos
  if (!nombre) {
    Swal.fire({
      title: 'Error',
      text: 'El campo "Nombre" es obligatorio. Por favor, complétalo.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  if (!cedula) {
    Swal.fire({
      title: 'Error',
      text: 'El campo "Cédula" es obligatorio. Por favor, complétalo.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    Swal.fire({
      title: 'Error',
      text: 'Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return; // Detener la ejecución del resto del código
  }

  // Desactivar el botón de registro para evitar múltiples clics
  registroButton.disabled = true;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // Mostrar mensaje de usuario creado
      return Swal.fire({
        title: 'Usuario creado exitosamente',
        text: 'Se ha enviado un correo de verificación a tu email. Por favor, verifica tu correo.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Enviar correo de verificación
        return sendEmailVerification(auth.currentUser);
      });
    })
    .then(() => {
      // Mostrar mensaje de correo de verificación enviado
      return Swal.fire({
        title: 'Correo de verificación enviado',
        text: 'Revisa tu bandeja de entrada para verificar tu correo.',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    })
    .then((result) => {
      if (result.isConfirmed) {
        // Redirige a login.html
        window.location.href = 'login.html';
      }
    })
    .catch((error) => {
      // Mostrar mensaje de error
      const errorCode = error.code;
      const errorMessage = error.message;
      
      let message = 'Error al registrar: ';
      switch (errorCode) {
        case 'auth/email-already-in-use':
          message = 'El correo ya está en uso. Por favor, intenta con otro.';
          break;
        case 'auth/invalid-email':
          message = 'El correo proporcionado no es válido. Verifica y prueba de nuevo.';
          break;
        case 'auth/weak-password':
          message = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        default:
          message += errorMessage;
          break;
      }
      
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    })
    .finally(() => {
      // Asegúrate de habilitar el botón si algo sale mal antes del procesamiento del correo
      registroButton.disabled = false;
    });
});
