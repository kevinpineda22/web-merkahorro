document.addEventListener("DOMContentLoaded", function () {
  const navItem = document.getElementById("compania-toggle");
  const subNav = document.getElementById("compania-info");
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");
  const subNavLinks = subNav.querySelectorAll("a");
  const submenuLinks = document.querySelectorAll("#compania-info a"); // Enlaces del submenú dentro de "Nosotros"

  // Función para mostrar el submenú
  function mostrarSubmenu() {
    subNav.classList.add("show");
  }

  // Función para ocultar el submenú
  function ocultarSubmenu() {
    subNav.classList.remove("show");
  }

  // Mostrar el submenú cuando se pasa el mouse sobre el ítem de navegación (pantallas grandes)
  navItem.addEventListener("mouseenter", () => {
    if (window.innerWidth > 839) { // Solo en pantallas grandes
      mostrarSubmenu();
    }
  });

  // Ocultar el submenú cuando se quita el mouse del ítem de navegación (pantallas grandes)
  navItem.addEventListener("mouseleave", () => {
    if (window.innerWidth > 839) { // Solo en pantallas grandes
      ocultarSubmenu();
    }
  });

  // Ocultar el submenú cuando el mouse sale del área del submenú (pantallas grandes)
  subNav.addEventListener("mouseleave", () => {
    if (window.innerWidth > 839) { // Solo en pantallas grandes
      ocultarSubmenu();
    }
  });

  // Mostrar el submenú cuando el mouse entra en el área del submenú (pantallas grandes)
  subNav.addEventListener("mouseenter", () => {
    if (window.innerWidth > 839) { // Solo en pantallas grandes
      mostrarSubmenu();
    }
  });

  // Alternar la visibilidad del submenú en dispositivos móviles al hacer clic
  navItem.addEventListener("click", (event) => {
    event.stopPropagation();
    if (window.innerWidth <= 839) { // Solo en pantallas móviles
      mostrarSubmenu();
    }
  });

  // Alternar la visibilidad del menú de navegación en dispositivos móviles
  menuToggle.addEventListener("click", () => {
    if (window.innerWidth <= 839) {
      navList.classList.toggle("show");
    }
  });

  // Cerrar el submenú si se hace clic fuera de él en dispositivos móviles
  document.addEventListener("click", (event) => {
    if (!navItem.contains(event.target) && !subNav.contains(event.target)) {
      ocultarSubmenu();
    }
  });

  // Manejar clics en los enlaces del submenú tanto en dispositivos móviles como de escritorio
  subNavLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      // Evitar el comportamiento predeterminado del enlace
      event.preventDefault();

      // Navegar a la URL del enlace
      const targetId = link.getAttribute("href").substring(1); // Eliminar el símbolo '#' del href
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Desplazar a la sección
        targetElement.scrollIntoView({ behavior: "smooth" });
      }

      // Cerrar el submenú
      ocultarSubmenu();
    });
  });

  // Cerrar el menú de navegación y desplazarse al contenido cuando se haga clic en cualquier enlace del submenú dentro de "Nosotros"
  submenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 839) { // Solo en pantallas móviles
        navList.classList.remove('show');
      }
      
      // Navegar a la URL del enlace
      const targetId = link.getAttribute("href").substring(1); // Eliminar el símbolo '#' del href
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Desplazar a la sección
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// Lógica del carrusel

const slides = document.querySelectorAll('.slide');
// Selecciona todos los elementos con la clase 'dot' y los almacena en la variable 'dots'
const dots = document.querySelectorAll('.dot');
// Inicializa el índice actual en 0 (el primer slide)
let currentIndex = 0;
// Declara una variable 'interval' para almacenar el identificador del intervalo
let interval;

// Función para mostrar la diapositiva actual según el índice
function mostrarSlide(index) {
    // Recorre todos los slides
    slides.forEach((slide, i) => {
        // Muestra el slide correspondiente al índice actual y oculta los demás
        slide.style.display = (i === index) ? 'block' : 'none';
    });
    // Recorre todos los puntos de navegación
    dots.forEach((dot, i) => {
        // Añade o quita la clase 'active' al punto correspondiente al índice actual
        dot.classList.toggle('active', i === index);
    });
}

// Función para avanzar al siguiente slide
function siguienteSlide() {
    // Incrementa el índice actual y utiliza el módulo para volver al inicio si se supera el número de slides
    currentIndex = (currentIndex + 1) % slides.length;
    // Muestra el slide correspondiente al nuevo índice
    mostrarSlide(currentIndex);
}

// Función para configurar la navegación automática del carrusel
function iniciarCarrusel() {
    // Establece un intervalo que llama a 'siguienteSlide' cada 5000 milisegundos (5 segundos)
    interval = setInterval(siguienteSlide, 5000);
}

// Evento para los puntos de navegación
dots.forEach(dot => {
    // Añade un evento de clic a cada punto
    dot.addEventListener('click', () => {
        // Detiene la navegación automática al hacer clic en un punto
        clearInterval(interval);
        // Obtiene el índice del punto clicado y lo convierte a un número entero
        currentIndex = parseInt(dot.getAttribute('data-index'));
        // Muestra el slide correspondiente al índice del punto clicado
        mostrarSlide(currentIndex);
        // Reinicia la navegación automática
        iniciarCarrusel();
    });
});

// Inicia el carrusel mostrando el primer slide
mostrarSlide(currentIndex);
// Comienza la navegación automática
iniciarCarrusel();
