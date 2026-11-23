/**
 * Configuración y utilidades
 */
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/**
 * Función reutilizable: voltea en espejo cada letra del contenedor al pasar el mouse
 */
function aplicarEfectoLetrasVibrantes(elementoContenedor) {
  // Cada letra se voltea en espejo al pasar el mouse y se queda así
  elementoContenedor.querySelectorAll(".letra-vibrante").forEach((span) => {
    span.addEventListener("mouseenter", () => span.classList.add("espejo"));
  });
}

/**
 * 1. Carga de datos y generación de la lista de estudiantes
 */
fetch("estudiantes.json")
  .then((response) => response.json())
  .then((data) => {
    const lista = document.getElementById("lista-estudiantes");

    data.forEach((est) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      const folderName = `${normalizeText(est.last)}-${normalizeText(est.first)}`;

      link.href = `estudiantes/${folderName}/index.html`;
      link.classList.add("enlace-estudiante");

      // --- Fragmentar nombre en letras individuales ---
      const nombreCompleto = `${est.first} ${est.last}`;
      nombreCompleto.split("").forEach((letra) => {
        const span = document.createElement("span");
        span.textContent = letra === " " ? "\u00A0" : letra;
        span.classList.add("letra-vibrante");
        link.appendChild(span);
      });

      // Asignar los eventos de hover al enlace del estudiante
      aplicarEfectoLetrasVibrantes(link);

      li.appendChild(link);
      lista.appendChild(li);
    });

    // Una vez cargada la lista, preparamos el título y los textos del cuerpo
    prepararTitulo();
    prepararTextosParrafos();
  });

/**
 * 2. Preparación del título (letras individuales que mantienen el efecto imán original)
 */
function prepararTitulo() {
  const titulo = document.getElementById("tituloPrincipal");
  const texto = titulo.textContent;
  titulo.innerHTML = "";

  texto.split("").forEach((letra) => {
    const span = document.createElement("span");
    span.textContent = letra === " " ? "\u00A0" : letra;
    span.classList.add("letra-magnetica");
    span.addEventListener("mouseenter", () => span.classList.add("espejo"));
    titulo.appendChild(span);
  });
}

/**
 * 3. NUEVO: Preparación de palabras clave dentro de los párrafos del HTML
 */
function prepararTextosParrafos() {
  const frasesAFraccionar = document.querySelectorAll(".vibrar-frase");

  frasesAFraccionar.forEach((contenedor) => {
    // Si la frase es un enlace, partimos el texto DENTRO del <a> para no borrarlo
    const destino = contenedor.querySelector("a") || contenedor;
    const textoOriginal = destino.textContent.trim();
    destino.innerHTML = ""; // Limpiamos el texto plano (el <a> se conserva)
    contenedor.classList.add("texto-vibrante-contenedor");

    // Convertimos cada letra de la palabra destacada en spans independientes
    textoOriginal.split("").forEach((letra) => {
      const span = document.createElement("span");
      span.textContent = letra === " " ? "\u00A0" : letra;
      span.classList.add("letra-vibrante");
      destino.appendChild(span);
    });

    // Le aplicamos la misma lógica de hover que tienen los estudiantes
    aplicarEfectoLetrasVibrantes(contenedor);
  });
}
