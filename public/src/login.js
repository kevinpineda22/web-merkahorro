// Importa Firebase y Firestore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAlaFymWa_XXlMUScf05h9CP6CNGcWEi5Y",
  authDomain: "login-736ac.firebaseapp.com",
  projectId: "login-736ac",
  storageBucket: "login-736ac.appspot.com",
  messagingSenderId: "1091401843350",
  appId: "1:1091401843350:web:f54074ef8338d9b1f2f8b7",
  measurementId: "G-0HP0QFHENJ"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cerrar sesión al cargar la página de inicio de sesión
auth.signOut();

const botonInicioSesion = document.getElementById('login');
const botonCerrarSesion = document.getElementById('cerrar');

botonInicioSesion.addEventListener('click', async (e) => {
  e.preventDefault(); // Evitar el comportamiento por defecto del formulario
  const email = document.getElementById('emaillog').value;
  const password = document.getElementById('passwordlog').value;

  try {
    const credenciales = await signInWithEmailAndPassword(auth, email, password);

    if (credenciales.user.emailVerified) {
      // Verifica si el usuario existe en Firestore
      const docUsuario = doc(db, 'usuarios', credenciales.user.uid);
      const docSnap = await getDoc(docUsuario);

      if (!docSnap.exists()) {
        // Si el usuario no existe, crea un nuevo documento
        await setDoc(docUsuario, {  
          email: credenciales.user.email,
          fechaUltimoAcceso: new Date(),
        });
      } else {
        // Si el usuario ya existe, actualiza la fecha de último acceso
        await updateDoc(docUsuario, {
          fechaUltimoAcceso: new Date()
        });
      }

      Swal.fire({
        title: 'Inicio de sesión exitoso',
        text: `Bienvenido de nuevo, ${credenciales.user.email}`,
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(() => {
        // Redirigir a otra página dentro de tu aplicación
        window.location.href = 'formacion.html'; // Cambia la URL por la ruta deseada
        console.log('Redirigiendo a:', window.location.href);
      });

    } else {
      Swal.fire({
        title: 'Verificación de correo pendiente',
        text: 'Por favor, verifica tu correo electrónico antes de continuar. Revisa tu bandeja de entrada y sigue el enlace de verificación.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        auth.signOut(); // Cerrar sesión si el correo no está verificado
      });
    }
  } catch (error) {
    const codigoError = error.code;

    let mensaje = 'Ocurrió un error al iniciar sesión.';
    switch (codigoError) {
      case 'auth/wrong-password':
        mensaje = 'La contraseña que ingresaste es incorrecta. Asegúrate de haberla escrito correctamente y vuelve a intentarlo.';
        break;
      case 'auth/user-not-found':
        mensaje = 'No encontramos una cuenta asociada con el correo electrónico proporcionado. Verifica que el correo esté correctamente escrito o crea una nueva cuenta.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El correo electrónico proporcionado no es válido. Por favor, revisa que esté bien escrito.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos fallidos. Por razones de seguridad, por favor, intenta de nuevo más tarde.';
        break;
      default:
        mensaje = 'Hubo un problema inesperado. Recuerda que debes registrarte primero antes de iniciar sesión.';
        break;
    }

    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo'
    });
    console.error('Error:', error);
  }
});

// Cerrar sesión

botonCerrarSesion.addEventListener('click', (e) => {
  auth.signOut()
    .then(() => {
      return Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente.',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    })
    .then((resultado) => {
      if (resultado.isConfirmed) {
        // Redirige a index.html
        window.location.href = 'index.html';
      }
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error al cerrar sesión',
        text: 'No se pudo cerrar sesión: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Detalles del error:', error);
    });
});

// Observador del estado de autenticación
auth.onAuthStateChanged((usuario) => {
  if (usuario) {
    console.log('Usuario activo:', usuario);
  } else {
    console.log('Usuario inactivo');
  }
});
