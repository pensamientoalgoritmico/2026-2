/**
 * Botón para volver a la página inicial.
 * Se carga desde el index.html de cada estudiante con:
 *   <script src="../../assets/volver.js"></script>
 * Trae sus propios estilos para no depender (ni interferir) con los del juego.
 */
(function () {
  var LILA = "#aa90ff";

  var css =
    "#volver-inicio{" +
    "position:fixed!important;top:16px!important;right:16px!important;" +
    "z-index:2147483647!important;" +
    "width:44px!important;height:44px!important;border-radius:50%!important;" +
    "background:" + LILA + "!important;color:#000!important;" +
    "display:flex!important;align-items:center!important;justify-content:center!important;" +
    "font:400 24px/1 system-ui,-apple-system,'Segoe UI',sans-serif!important;" +
    "text-decoration:none!important;border:none!important;outline:none;" +
    "padding:0!important;margin:0!important;box-shadow:none!important;" +
    "cursor:pointer!important;user-select:none!important;" +
    "transition:transform .25s ease!important;}" +
    "#volver-inicio:hover,#volver-inicio:focus-visible{transform:scaleX(-1)!important;}";

  function agregarBoton() {
    if (document.getElementById("volver-inicio")) return;

    var estilo = document.createElement("style");
    estilo.textContent = css;
    document.head.appendChild(estilo);

    var boton = document.createElement("a");
    boton.id = "volver-inicio";
    boton.href = "../../index.html";
    boton.textContent = "\u2190"; // flecha izquierda
    boton.title = "Volver al inicio";
    boton.setAttribute("aria-label", "Volver a la página inicial");
    document.body.appendChild(boton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", agregarBoton);
  } else {
    agregarBoton();
  }
})();
