
//INERCIA — EL ESPACIO ENTRE
//Isabel Tobón Molina
//202521760

//CONCEPTO: INERCIA es un videojuego experimental que cuestiona la cultura de la inmediatez y nuestra necesidad constante de estímulos y respuestas instantáneas. A través de cuatro fases: Aburrirse, Observar, Pensar y Reflexionar, el jugador recorre un espacio abstracto que desafía sus expectativas de interacción. Primero experimenta la frustración de perseguir una salida que nunca puede alcanzar. Después descubre que, al detenerse y dejar de insistir, el entorno comienza a revelar formas, palabras y preguntas que antes pasaban desapercibidas. La experiencia transforma progresivamente la búsqueda de resultados en un ejercicio de contemplación e introspección, hasta llegar a un espacio donde el jugador puede expresar libremente sus reflexiones y dejar una huella personal. INERCIA propone la inactividad consciente como un acto de desobediencia frente a las dinámicas digitales que exigen interacción y gratificación constantes. Su propósito no es ganar ni completar desafíos rápidamente, sino descubrir que permanecer, observar y habitar la espera también son formas significativas de interactuar

//Para el desarrollo de INERCIA, los elementos visuales fueron creados directamente mediante formas, colores y animaciones programadas en p5.js, por lo que no fue necesario utilizar imágenes externas. Se emplearon tipografías como Georgia, Courier New y Arial, y se incorporó el audio binaural Drifting Away, de Kaazoom, como acompañamiento sonoro continuo para reforzar la sensación de calma e introspección. El código está organizado por secciones y contiene comentarios que explican el funcionamiento de las variables, funciones, clases e interacciones. Mi interpretación del proyecto parte de cuestionar la necesidad constante de estímulos y respuestas inmediatas: a través de las fases Aburrirse, Observar, Pensar y Reflexionar, busqué transformar la experiencia del jugador, pasando de la frustración y la búsqueda de resultados a la contemplación y la reflexión personal. De esta manera, tanto los elementos visuales como el sonido y las interacciones contribuyen a comunicar que detenerse y habitar la espera también puede ser una experiencia significativa.


// 1. VARIABLES GENERALES

// 0 = portada, 1 = instrucciones, 2 = aburrirse,
// 3 = observar, 4 = pensar, 5 = reflexionar, 6 = final.
let pantalla = 0;
let pulso = 0;
let lienzo;
let persona;
let umbral;
let laberinto;
let manchas = [];
let frecuencias = [];
let particulas = [];

// Tiempos aproximados a 60 fotogramas por segundo.
let TIEMPO_QUIETUD = 900;
let TIEMPO_SENAL = 360;
let TIEMPO_PREGUNTA = 540;

// Variables de progreso, escritura y transiciones.
let quietud = 0;
let movimientoInicial = 0;
let cambiosLaberinto = 0;
let pistaVisible = "";
let letrasPista = 0;
let pausaObservar = 0;
let aviso = 0;
let resonancia = 0;
let transicion = null;
let letras = [];
let respuesta = "";
let MAX_LINEAS = 5;
let MAX_LETRAS = 240;
let mensajeEscritura = "";

let palabras = ["SUELTA", "OBSERVA", "HABITA"];

let preguntas = [
  "¿Qué ocurre en ti cuando nada responde de inmediato?",
  "¿Qué aparece cuando dejas de perseguir un resultado?",
  "¿A quién le entregas tu atención cuando no decides detenerte?"
];

// Variables de las flechas.
let izquierda = false;
let derecha = false;
let arriba = false;
let abajo = false;

// Evito que mantener ENTER o ESPACIO presionados
// active varias veces la misma acción.
let enterPresionado = false;
let espacioPresionado = false;

// Música binaural que acompaña el juego.
let musicaBinaural;
let musicaIniciada = false;

// 2. CONFIGURACIÓN

function setup() {

  lienzo = createCanvas(800, 600);
  textFont("Georgia");

  // Cargo la música binaural con el nombre del archivo que subí. createAudio() permite reproducirla sin cambiar la versión de p5.js.
musicaBinaural = createAudio("kaazoom-drifting-away-full-version-binaural-beats-409329 (1).mp3");

// Mantengo un volumen suave para acompañar la experiencia.
musicaBinaural.volume(0.20);

  persona = new Persona();

  // Creo el laberinto primero para que la luz conozca la posición de la abertura.
  laberinto = new Laberinto();
  umbral = new Umbral();

  manchas.push(new Mancha(205, 306, 0));
  manchas.push(new Mancha(400, 303, 1));
  manchas.push(new Mancha(595, 306, 2));

  frecuencias.push(new Frecuencia(205, 306, 0));
  frecuencias.push(new Frecuencia(400, 303, 1));
  frecuencias.push(new Frecuencia(595, 306, 2));

  for (let i = 0; i < 43; i++) {
    particulas.push(new Particula());
  }

  // Los eventos del teclado se controlan únicamente con keyPressed() y keyReleased()

  // window.addEventListener() permite escuchar las teclas desde la ventana del juego.
  // "keydown" detecta cuando presiono una flecha y activa su movimiento.
  window.addEventListener("keydown", function(e) {

    if (esFlecha(e.key)) {
      cambiarFlecha(e.key, true);
    }

  });

  // "keyup" detecta cuando suelto una flecha y detiene su movimiento.
  window.addEventListener("keyup", function(e) {

    if (esFlecha(e.key)) {
      cambiarFlecha(e.key, false);
    }

  });

  // Permito que el canvas reciba las flechas del teclado.
// tabIndex permite seleccionarlo y focus() activa el teclado.
if (lienzo && lienzo.elt) {
  lienzo.elt.tabIndex = 0;
  lienzo.elt.focus();
}
}

// 3. MOVIMIENTO CON EL TECLADO

function esFlecha(t) {
  return t == "ArrowLeft" || t == "ArrowRight" ||
         t == "ArrowUp" || t == "ArrowDown" ||
         t == 37 || t == 39 || t == 38 || t == 40;
}

function cambiarFlecha(t, estado) {

  if (t == "ArrowLeft" || t == 37) {
    izquierda = estado;
  }

  if (t == "ArrowRight" || t == 39) {
    derecha = estado;
  }

  if (t == "ArrowUp" || t == 38) {
    arriba = estado;
  }

  if (t == "ArrowDown" || t == 40) {
    abajo = estado;
  }
}

function limpiarFlechas() {
  izquierda = false;
  derecha = false;
  arriba = false;
  abajo = false;
}

function keyPressed() {

  // FLECHAS
  if (esFlecha(keyCode)) {
    cambiarFlecha(keyCode, true);
    return false;
  }

  // ENTER
  // La variable evita avanzar varias veces si mantengo presionada la tecla.
  if (keyCode == ENTER || key == "Enter") {

    if (!enterPresionado) {
      enterPresionado = true;
      procesarEnter();
    }

    return false;
  }

  // ESPACIO: En Observar activa manchas. En Reflexión permite escribir espacios.
  if (key == " " || keyCode == 32) {

    if (pantalla == 3 && !espacioPresionado) {
      tocarMancha();
    }

    if (pantalla == 5) {
      agregarLetra(" ");
    }

    espacioPresionado = true;
    return false;
  }

  // ESCRITURA
  if (pantalla == 5) {

    // BACKSPACE borra el último carácter.
    if (keyCode == BACKSPACE || key == "Backspace") {

      if (letras.length > 0) {
        letras.pop();
      }

      reconstruirRespuesta();
      return false;
    }

    // key guarda la tecla que p5.js detecta. Solamente escribo caracteres individuales.
    
   if (key.length == 1) {
  agregarLetra(key);
  return false;
}
  }
}

function keyReleased() {

  // Cuando suelto las flechas, el personaje deja de recibir movimiento.
  if (esFlecha(keyCode)) {

    cambiarFlecha(keyCode, false);
    return false;
  }

  if (keyCode == ENTER || key == "Enter") {
    enterPresionado = false;
    return false;
  }

  if (key == " " || keyCode == 32) {
    espacioPresionado = false;
    return false;
  }
}

// 4. FUNCIÓN PRINCIPAL Y TRANSICIONES


function draw() {

  pulso++;

  if (aviso > 0) aviso--;
  if (resonancia > 0) resonancia--;

  if (
    pantalla >= 1 &&
    pantalla <= 4 &&
    transicion == null
  ) {
    persona.actualizar();
  }

  if (transicion == null) {

    if (pantalla == 2) actualizarAburrirse();
    if (pantalla == 3) actualizarObservar();
    if (pantalla == 4) actualizarPensar();
  }

  if (transicion != null) {

    transicion.paso++;

    if (transicion.paso == 45) {
      cambiarPantalla(transicion.destino);
    }

    if (transicion.paso >= 90) {
      transicion = null;
    }
  }

  if (pantalla == 0) dibujarPortada();
  if (pantalla == 1) dibujarInstrucciones();
  if (pantalla == 2) dibujarAburrirse();
  if (pantalla == 3) dibujarObservar();
  if (pantalla == 4) dibujarPensar();
  if (pantalla == 5) dibujarReflexion();
  if (pantalla == 6) dibujarFinal();

  if (pantalla >= 1 && pantalla <= 5) {
    persona.mostrar();
  }

  if (transicion != null) {
    dibujarTransicion();
  }
}

function cambiarPantalla(nueva) {

  pantalla = nueva;
  aviso = 0;
  limpiarFlechas();

  if (pantalla == 1) persona.colocar(460, 474);
  if (pantalla == 2) persona.colocar(400, 474);
  if (pantalla == 3) persona.colocar(400, 478);
  if (pantalla == 4) persona.colocar(400, 478);
  if (pantalla == 5) persona.colocar(124, 466);

  if (pantalla >= 2 && pantalla <= 4) {
    noCursor();
  } else {
    cursor(ARROW);
  }
}

function iniciarTransicion(destino) {

  if (transicion == null) {
    transicion = {
      origen: pantalla,
      destino: destino,
      paso: 0
    };
  }
}

function dibujarTransicion() {

  let t = transicion.paso;
  let transparencia = 0;

  if (t <= 45) {
    transparencia = map(t, 0, 45, 0, 255);
  } else {
    transparencia = map(t, 45, 90, 255, 0);
  }

  noStroke();

  if (transicion.origen == 2) {
    fill(231, 227, 219, transparencia);
  } else if (transicion.origen == 3) {
    fill(217, 213, 228, transparencia);
  } else {
    fill(236, 229, 219, transparencia);
  }

  rect(0, 0, width, height);

  // Las formas anteriores aparecen transformadas durante la transición.
  for (let i = 0; i < 3; i++) {

    let x = 205 + i * 195;

    if (transicion.origen == 2) {

      noStroke();
      fill(143, 145, 191, transparencia * 0.18);

      ellipse(
        x, 306,
        45 + t * 2.2,
        65 + t * 1.9
      );

    } else if (transicion.origen == 3) {

      noFill();
      stroke(107, 99, 149, transparencia * 0.32);
      strokeWeight(1);

      for (let j = 0; j < 4; j++) {
        ellipse(x, 306, 32 + j * 25 + t * 0.5);
      }

    } else {

      noFill();
      stroke(128, 121, 146, transparencia * 0.26);
      strokeWeight(1);

      line(
        220, 322 + i * 37,
        716, 322 + i * 37
      );
    }
  }
}

// 5. AMBIENTE: EL ESPACIO RESPIRA

function ambiente(etapa) {

  if (etapa == 1) background(245, 243, 238);
  if (etapa == 2) background(231, 227, 219);
  if (etapa == 3) background(217, 213, 228);
  if (etapa == 4) background(236, 229, 219);

  // Formas que se mueven aunque la persona esté quieta.
  if (etapa >= 2) {

    noStroke();

    for (let i = 0; i < 6; i++) {

      let x =
        104 + i * 123 +
        sin(pulso * 0.003 + i * 1.3) * 31;

      let y =
        315 +
        sin(pulso * 0.0037 + i * 1.8) * 40;

      if (i % 2 == 0) {
        fill(143, 145, 191, 11);
      } else {
        fill(141, 174, 203, 13);
      }

      ellipse(
        x, y,
        169 + i * 15,
        200 + i * 9
      );
    }
  }

  let cantidad = 7;

  if (etapa == 2) cantidad = 21;
  if (etapa == 3) cantidad = 43;
  if (etapa == 4) cantidad = 32;

  for (let i = 0; i < cantidad; i++) {
    particulas[i].mostrar(etapa);
  }

  let y = 450;
  let amplitud = 2;

  if (etapa == 2) {
    amplitud = 5 + persona.velocidad * 1.4;
  }

  if (etapa == 3) {
    y = 419;
    amplitud = 7;
  }

  if (etapa == 4) {
    y = 508;
    amplitud = 3 + resonancia * 0.21;
  }

  if (amplitud > 20) amplitud = 20;

  noFill();
  stroke(103, 101, 152, 100);
  strokeWeight(1);

  for (let x = 76; x < 721; x += 4) {

    let y1 =
      y +
      sin(x * 0.047 + pulso * 0.020) * amplitud;

    let y2 =
      y +
      sin((x + 4) * 0.047 + pulso * 0.020) * amplitud;

    line(x, y1, x + 4, y2);
  }
}

function marco(etiqueta) {

  stroke(79, 73, 96, 82);
  strokeWeight(1);

  line(62, 84, 738, 84);
  line(62, 556, 738, 556);

  noStroke();
  fill(66, 61, 85);

  textFont("Courier New");
  textSize(12);
  textAlign(LEFT, CENTER);
  text("INERCIA", 63, 57);

  textAlign(RIGHT, CENTER);
  text(etiqueta, 737, 57);
}

function pie(mensaje) {

  noStroke();
  fill(80, 73, 103);

  textFont("Courier New");
  textSize(12);
  textAlign(LEFT, CENTER);

  text(mensaje, 72, 534);
}

// 6. PORTADA Y CONTROLES

function dibujarPortada() {

  ambiente(1);
  marco("EL ESPACIO ENTRE");

  textAlign(LEFT, CENTER);
  noStroke();

  fill(51, 48, 72);
  textFont("Georgia");
  textSize(70);

  text("INERCIA", 72, 202);

  textSize(21);

  text(
    "Un camino que cambia cuando avanzas.",
    76, 266
  );

  fill(104, 99, 122);
  textFont("Courier New");
  textSize(12);

  text(
    "¿QUÉ BUSCAS CUANDO NO PUEDES LLEGAR?",
    76, 324
  );

  text("HAZ CLIC PARA ENTRAR", 76, 484);

  stroke(88, 80, 111);
  line(76, 500, 278, 500);

  dibujarAberturaPortada(564, 304);
}

function dibujarAberturaPortada(x, y) {

  let latido = sin(pulso * 0.016) * 5;

  noStroke();

  for (let i = 6; i > 0; i--) {

    fill(175, 165, 199, 8);

    ellipse(
      x, y,
      115 + i * 29 + latido,
      160 + i * 32 + latido
    );
  }

  stroke(102, 95, 134, 120);
  strokeWeight(1.5);
  fill(229, 227, 239);

  rect(x - 42, y - 87, 84, 174, 2);

  noStroke();
  fill(249, 245, 224);

  rect(x - 32, y - 77, 64, 154, 2);

  fill(255, 254, 245, 150);

  rect(x - 19, y - 77, 38, 154);
}

function tecla(x, y, ancho, alto, nombre, activa) {

  strokeWeight(1);

  if (activa) {
    fill(103, 98, 146);
    stroke(103, 98, 146);
  } else {
    fill(249, 247, 243);
    stroke(155, 147, 169);
  }

  rect(x, y, ancho, alto, 6);

  noStroke();

  if (activa) {
    fill(255);
  } else {
    fill(78, 72, 105);
  }

  textFont("Arial");
  textAlign(CENTER, CENTER);

  textSize(nombre.length == 1 ? 19 : 12);

  text(
    nombre,
    x + ancho / 2,
    y + alto / 2
  );
}

function dibujarInstrucciones() {

  ambiente(1);
  marco("ANTES DE ENTRAR");

  noStroke();
  fill(51, 47, 72);

  textFont("Georgia");
  textAlign(LEFT, CENTER);
  textSize(41);

  text("Puedes caminar.", 76, 171);

  textFont("Courier New");
  textSize(12);
  fill(109, 101, 123);

  text(
    "UN CAMINO QUE PUEDE CAMBIAR BAJO TUS PIES",
    79, 221
  );

  stroke(130, 124, 149, 70);

  line(283, 263, 283, 452);
  line(528, 263, 528, 452);

  // keyIsDown(): comprueba si una flecha está presionada.
  tecla(
    166, 281, 39, 37,
    "↑",
    arriba || keyIsDown(UP_ARROW)
  );

  tecla(
    123, 323, 39, 37,
    "←",
    izquierda || keyIsDown(LEFT_ARROW)
  );

  tecla(
    166, 323, 39, 37,
    "↓",
    abajo || keyIsDown(DOWN_ARROW)
  );

  tecla(
    209, 323, 39, 37,
    "→",
    derecha || keyIsDown(RIGHT_ARROW)
  );

  tecla(334, 322, 145, 44, "ESPACIO", false);
  tecla(579, 322, 137, 44, "ENTER", false);

  noStroke();
  fill(64, 60, 85);

  textFont("Courier New");
  textSize(13);
  textAlign(CENTER, CENTER);

  text("CAMINAR", 185, 414);
  text("TOCAR", 407, 414);
  text("CONTINUAR", 648, 414);

  pie("PRUEBA LAS FLECHAS. ENTER PARA ENTRAR");
}

// 7. FASE 1: ABURRIRSE: EL LABERINTO

function actualizarAburrirse() {

  // Registro la distancia que camina la persona.
  if (persona.velocidad > 0.25) {
    movimientoInicial += persona.velocidad;
  }

  // El laberinto cambia al recorrer cierta distancia.
  laberinto.actualizar();

  // keyIsDown(): revisa si alguna flecha continúa presionada en este fotograma.
  let quieta =
    persona.velocidad < 0.12 &&
    !izquierda &&
    !derecha &&
    !arriba &&
    !abajo &&
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(UP_ARROW) &&
    !keyIsDown(DOWN_ARROW);

  // La quietud solo se acumula después de explorar.
  if (movimientoInicial >= 95 && quieta) {

    quietud++;

  } else if (!quieta && quietud > 0) {

    quietud -= 7;

    if (quietud < 0) quietud = 0;
  }

  umbral.actualizar();

  if (quietud >= TIEMPO_QUIETUD) {
    iniciarTransicion(3);
  }
}

// Las formas empiezan a aparecer cuando la persona permanece quieta.
function dibujarDescubrimiento() {

  let grado = quietud / TIEMPO_QUIETUD;

  if (grado > 1) grado = 1;

  noStroke();

  for (let i = 0; i < 3; i++) {

    let x =
      205 + i * 195 +
      sin(pulso * 0.006 + i) * 8;

    let y =
      306 +
      sin(pulso * 0.008 + i) * 9;

    for (let j = 6; j > 0; j--) {

      if (i == 0) fill(143, 145, 191, grado * 7);
      if (i == 1) fill(141, 174, 203, grado * 8);
      if (i == 2) fill(217, 195, 176, grado * 9);

      ellipse(
        x, y,
        40 + j * 14,
        50 + j * 13
      );
    }
  }

  if (grado > 0.48) {

    let fuerza = (grado - 0.48) / 0.52;

    noFill();
    stroke(115, 105, 148, fuerza * 82);
    strokeWeight(1);

    for (let x = 215; x < 590; x += 4) {

      let y1 =
        308 +
        sin(x * 0.038 + pulso * 0.012) * 5;

      let y2 =
        308 +
        sin((x + 4) * 0.038 + pulso * 0.012) * 5;

      line(x, y1, x + 4, y2);
    }
  }
}

// Las frases orientan sin decir directamente que el jugador tiene que quedarse quieto.
function fraseLaberinto() {

  if (movimientoInicial < 40) {
    return "AL FONDO, UNA LUZ.";
  }

  if (movimientoInicial < 95) {
    return "HAY UNA ABERTURA ENTRE LAS PAREDES.";
  }

  if (quietud > 680) {
    return "EL ESPACIO SIEMPRE ESTUVO AQUÍ.";
  }

  if (quietud > 400) {
    return "¿QUÉ HABÍAS DEJADO DE MIRAR?";
  }

  if (quietud > 170) {
    return "ALGUNAS COSAS OCURREN SIN QUE LAS PROVOQUES.";
  }

  if (laberinto.saltosSalida >= 3) {
    return "¿CUÁNTAS VECES SEGUIRÁS PERSIGUIÉNDOLA?";
  }

  if (laberinto.saltosSalida >= 1) {
    return "LA ABERTURA ESTABA AHÍ HACE UN INSTANTE.";
  }

  if (cambiosLaberinto >= 2) {
    return "EL CAMINO YA NO ES EL MISMO.";
  }

  return "¿HASTA DÓNDE CREES QUE LLEGA?";
}

// Las pistas aparecen letra por letra.
function mostrarPistaLaberinto() {

  let nueva = fraseLaberinto();

  if (nueva != pistaVisible) {

    pistaVisible = nueva;
    letrasPista = 0;
  }

  if (letrasPista < pistaVisible.length) {
    letrasPista += 0.32;
  }

  // substring(0, n): toma los primeros n caracteres.
  // int(): convierte la cantidad de letras a un número entero.
  pie(pistaVisible.substring(0, int(letrasPista)));
}

function dibujarAburrirse() {

  ambiente(1);
  dibujarDescubrimiento();

  umbral.mostrar();
  laberinto.mostrar();

  marco("01 / ABURRIRSE");

  noStroke();
  fill(55, 51, 77);

  textFont("Georgia");
  textAlign(LEFT, CENTER);
  textSize(28);

  text(
    "Un camino que cambia cuando avanzas.",
    74, 145
  );

  mostrarPistaLaberinto();
}

// 8. CLASE LABERINTO

class Laberinto {

  constructor() {

    this.x = 94;
    this.y = 206;

    this.columnas = 9;
    this.filas = 5;

    this.ancho = 68;
    this.alto = 60;

    this.radio = 9;
    this.recorrido = 0;

    this.antiguas = null;
    this.fundido = 0;

    // Salida del laberinto.
    this.salidaColumna = 7;
    this.salidaAnterior = -1;
    this.saltosSalida = 0;
    this.destelloSalida = 0;
    this.enfriamientoSalida = 0;

    this.celdas = this.crearCeldas();
    this.abrirSalida(this.celdas);
  }

  indice(c, f) {
    return f * this.columnas + c;
  }

  columna(x) {

    // int(): convierte el resultado a entero para saber en qué columna estoy.
    let c = int((x - this.x) / this.ancho);

    if (c < 0) c = 0;

    if (c >= this.columnas) {
      c = this.columnas - 1;
    }

    return c;
  }

  fila(y) {

    // int(): convierte el resultado a entero para saber en qué fila estoy.
    let f = int((y - this.y) / this.alto);

    if (f < 0) f = 0;

    if (f >= this.filas) {
      f = this.filas - 1;
    }

    return f;
  }

  // Creo una cuadrícula de casillas que inicialmente tienen las cuatro paredes.
  crearCeldas() {

    let celdas = [];
    let visitadas = [];

    let cantidad =
      this.columnas * this.filas;

    for (let i = 0; i < cantidad; i++) {

      celdas.push({
        arriba: true,
        derecha: true,
        abajo: true,
        izquierda: true
      });

      visitadas.push(false);
    }

    let inicio = this.indice(4, 4);
    let pila = [inicio];

    visitadas[inicio] = true;

    while (pila.length > 0) {

      let actual = pila[pila.length - 1];
      let c = actual % this.columnas;

      // int(): obtiene el número entero de la fila.
      let f = int(actual / this.columnas);

      let opciones = [];

      if (
        f > 0 &&
        !visitadas[this.indice(c, f - 1)]
      ) {

        opciones.push({
          destino: this.indice(c, f - 1),
          lado: 0
        });
      }

      if (
        c < this.columnas - 1 &&
        !visitadas[this.indice(c + 1, f)]
      ) {

        opciones.push({
          destino: this.indice(c + 1, f),
          lado: 1
        });
      }

      if (
        f < this.filas - 1 &&
        !visitadas[this.indice(c, f + 1)]
      ) {

        opciones.push({
          destino: this.indice(c, f + 1),
          lado: 2
        });
      }

      if (
        c > 0 &&
        !visitadas[this.indice(c - 1, f)]
      ) {

        opciones.push({
          destino: this.indice(c - 1, f),
          lado: 3
        });
      }

      if (opciones.length > 0) {

        // int(): transforma el número aleatorio en un índice válido del arreglo.
        let elegido =
          opciones[int(random(opciones.length))];

        let siguiente = elegido.destino;

        // Abro la pared correspondiente.

        if (elegido.lado == 0) {
          celdas[actual].arriba = false;
          celdas[siguiente].abajo = false;
        }

        if (elegido.lado == 1) {
          celdas[actual].derecha = false;
          celdas[siguiente].izquierda = false;
        }

        if (elegido.lado == 2) {
          celdas[actual].abajo = false;
          celdas[siguiente].arriba = false;
        }

        if (elegido.lado == 3) {
          celdas[actual].izquierda = false;
          celdas[siguiente].derecha = false;
        }

        visitadas[siguiente] = true;
        pila.push(siguiente);

      } else {

        pila.pop();
      }
    }

    return celdas;
  }

  // La salida ocupa una casilla del borde superior.
  abrirSalida(celdas) {

    for (let c = 0; c < this.columnas; c++) {

      celdas[this.indice(c, 0)].arriba =
        c != this.salidaColumna;
    }
  }

  centroSalida() {

    return this.x +
      (this.salidaColumna + 0.5) * this.ancho;
  }

  // Cuando la persona se acerca, la salida se mueve a otra columna.
  moverSalida() {

    if (this.enfriamientoSalida > 0) {
      return;
    }

    let anterior = this.salidaColumna;
    let columnaPersona = this.columna(persona.x);

    let opciones = [];

    for (let c = 0; c < this.columnas; c++) {

      // dist(): calcula la distancia entre dos puntos.
      
      if (
        dist(c, 0, anterior, 0) >= 3 &&
        dist(c, 0, columnaPersona, 0) >= 3
      ) {

        opciones.push(c);
      }
    }

    if (opciones.length == 0) {

      for (let c = 0; c < this.columnas; c++) {

        if (dist(c, 0, anterior, 0) >= 2) {
          opciones.push(c);
        }
      }
    }

    // int(): convierte la posición aleatoria a entero.
    this.salidaColumna =
      opciones[int(random(opciones.length))];

    this.salidaAnterior = anterior;
    this.saltosSalida++;

    this.destelloSalida = 100;
    this.enfriamientoSalida = 44;

    // Cierro la salida anterior y abro la nueva.
    this.abrirSalida(this.celdas);

    pistaVisible = "";
    letrasPista = 0;
  }

  // Compruebo si la persona está cerca de la salida.
  revisarSalida() {

    if (this.enfriamientoSalida > 0) {
      return;
    }

    let columna = this.columna(persona.x);
    let fila = this.fila(persona.y);
    let centro = this.centroSalida();

    if (
      fila == 0 &&
      columna == this.salidaColumna &&
      dist(
        persona.x, persona.y,
        centro, this.y + 12
      ) < 66
    ) {

      this.moverSalida();
    }
  }

  // Genero un nuevo laberinto sin cambiar las paredes que rodean al personaje.
  reorganizar() {

    let nueva = this.crearCeldas();

    let c = this.columna(persona.x);
    let f = this.fila(persona.y);
    let i = this.indice(c, f);

    let vieja = this.celdas[i];

    nueva[i].arriba = vieja.arriba;
    nueva[i].derecha = vieja.derecha;
    nueva[i].abajo = vieja.abajo;
    nueva[i].izquierda = vieja.izquierda;

    if (f > 0) {
      nueva[this.indice(c, f - 1)].abajo =
        vieja.arriba;
    }

    if (c < this.columnas - 1) {
      nueva[this.indice(c + 1, f)].izquierda =
        vieja.derecha;
    }

    if (f < this.filas - 1) {
      nueva[this.indice(c, f + 1)].arriba =
        vieja.abajo;
    }

    if (c > 0) {
      nueva[this.indice(c - 1, f)].derecha =
        vieja.izquierda;
    }

    this.abrirSalida(nueva);

    this.antiguas = this.celdas;
    this.celdas = nueva;

    this.fundido = 70;
    cambiosLaberinto++;
  }

  actualizar() {

    if (persona.velocidad > 0.25) {
      this.recorrido += persona.velocidad;
    }

    let distancia = 260;

    if (persona.y < 300) {
      distancia = 190;
    }

    if (this.recorrido >= distancia) {

      this.recorrido = 0;
      this.reorganizar();
    }

    if (this.fundido > 0) this.fundido--;
    if (this.destelloSalida > 0) this.destelloSalida--;

    if (this.enfriamientoSalida > 0) {
      this.enfriamientoSalida--;
    }

    this.revisarSalida();
  }

  // Reviso las colisiones para que el personaje no atraviese las paredes.
  mover(x, y, dx, dy) {

    let c = this.columna(x);
    let f = this.fila(y);

    let celda =
      this.celdas[this.indice(c, f)];

    let izquierdaX =
      this.x + c * this.ancho;

    let derechaX =
      izquierdaX + this.ancho;

    let arribaY =
      this.y + f * this.alto;

    let abajoY =
      arribaY + this.alto;

    let nx = x + dx;
    let ny = y;

    let r = this.radio;

    // Pared derecha.
    if (
      dx > 0 &&
      celda.derecha &&
      nx > derechaX - r
    ) {
      nx = derechaX - r;
    }

    // Pared izquierda.
    if (
      dx < 0 &&
      celda.izquierda &&
      nx < izquierdaX + r
    ) {
      nx = izquierdaX + r;
    }

    // Límites horizontales.
    if (nx < this.x + r) {
      nx = this.x + r;
    }

    if (
      nx >
      this.x + this.columnas * this.ancho - r
    ) {
      nx =
        this.x +
        this.columnas * this.ancho - r;
    }

    c = this.columna(nx);
    celda = this.celdas[this.indice(c, f)];

    ny = y + dy;

    // Pared inferior.
    if (
      dy > 0 &&
      celda.abajo &&
      ny > abajoY - r
    ) {
      ny = abajoY - r;
    }

    // Pared superior.
    if (
      dy < 0 &&
      celda.arriba &&
      ny < arribaY + r
    ) {
      ny = arribaY + r;
    }

    // Si estoy casi en la salida, se desplaza antes de que pueda cruzar.
    if (
      dy < 0 &&
      f == 0 &&
      c == this.salidaColumna &&
      ny < this.y + r + 12
    ) {
      this.moverSalida();
    }

    // Límites verticales.
    if (ny < this.y + r) {
      ny = this.y + r;
    }

    if (
      ny >
      this.y + this.filas * this.alto - r
    ) {
      ny =
        this.y +
        this.filas * this.alto - r;
    }

    return {
      x: nx,
      y: ny
    };
  }

  // Dibujo las paredes del laberinto.
  dibujarParedes(celdas, opacidad) {

    noFill();
    stroke(96, 91, 135, opacidad);
    strokeWeight(2);

    for (let f = 0; f < this.filas; f++) {

      for (let c = 0; c < this.columnas; c++) {

        let celda =
          celdas[this.indice(c, f)];

        let x =
          this.x + c * this.ancho;

        let y =
          this.y + f * this.alto;

        if (celda.arriba) {
          line(x, y, x + this.ancho, y);
        }

        if (celda.izquierda) {
          line(x, y, x, y + this.alto);
        }

        if (
          f == this.filas - 1 &&
          celda.abajo
        ) {
          line(
            x, y + this.alto,
            x + this.ancho, y + this.alto
          );
        }

        if (
          c == this.columnas - 1 &&
          celda.derecha
        ) {
          line(
            x + this.ancho, y,
            x + this.ancho, y + this.alto
          );
        }
      }
    }
  }

  mostrar() {

    let grado = quietud / TIEMPO_QUIETUD;

    if (grado > 1) grado = 1;

    let alfa =
      147 * (1 - grado * 0.92);

    // El laberinto anterior se desvanece.
    if (
      this.antiguas != null &&
      this.fundido > 0
    ) {

      this.dibujarParedes(
        this.antiguas,
        (this.fundido / 70) *
        40 * (1 - grado)
      );
    }

    this.dibujarParedes(this.celdas, alfa);

    // Dibujo la abertura.
    let centro = this.centroSalida();
    let brillo = 1 - grado * grado;

    noStroke();

    fill(244, 227, 183, 23 * brillo);

    rect(
      centro - this.ancho / 2,
      this.y - 7,
      this.ancho,
      24
    );

    stroke(115, 107, 154, alfa);
    strokeWeight(2);

    line(
      centro - this.ancho / 2,
      this.y - 12,
      centro - this.ancho / 2,
      this.y + 20
    );

    line(
      centro + this.ancho / 2,
      this.y - 12,
      centro + this.ancho / 2,
      this.y + 20
    );

    // Un eco muestra la posición donde estaba antes la salida.
    if (
      this.destelloSalida > 0 &&
      this.salidaAnterior >= 0
    ) {

      let viejoCentro =
        this.x +
        (this.salidaAnterior + 0.5) *
        this.ancho;

      stroke(
        155, 146, 192,
        this.destelloSalida *
        0.65 * (1 - grado)
      );

      strokeWeight(1);

      line(
        viejoCentro - this.ancho / 2,
        this.y - 6,
        viejoCentro + this.ancho / 2,
        this.y - 6
      );
    }

    // Nodos que conectan con Observar.
    noStroke();

    for (let i = 0; i < 3; i++) {

      fill(
        143, 145, 191,
        9 + grado * 28
      );

      ellipse(
        205 + i * 195,
        307,
        8 + grado * 17
      );
    }
  }
}

// 9. CLASE UMBRAL

class Umbral {

  constructor() {

    this.x = laberinto.centroSalida();
    this.y = laberinto.y - 61;
    this.fuga = 0;
  }

  actualizar() {

    // La luz sigue la salida cambiante.
    let destino = laberinto.centroSalida();

    this.x += (destino - this.x) * 0.15;

    this.y =
      laberinto.y - 61 +
      sin(pulso * 0.014) * 2;

    if (persona.velocidad > 0.45) {

      this.fuga += 0.07;

      if (this.fuga > 70) {
        this.fuga = 70;
      }
    }
  }

  mostrar() {

    let grado = quietud / TIEMPO_QUIETUD;

    if (grado > 1) grado = 1;

    let opacidad =
      1 - grado * grado;

    let ancho =
      48 - this.fuga * 0.09;

    let alto =
      76 - this.fuga * 0.10;

    // Haz de luz.
    noStroke();

    fill(
      248, 233, 203,
      25 * opacidad
    );

    quad(
      this.x - 18,
      this.y + alto / 2,
      this.x + 18,
      this.y + alto / 2,
      laberinto.centroSalida() + 28,
      laberinto.y,
      laberinto.centroSalida() - 28,
      laberinto.y
    );

    // Halos
    for (let i = 7; i > 0; i--) {

      fill(
        176, 165, 199,
        10 * opacidad
      );

      ellipse(
        this.x, this.y,
        ancho + i * 21,
        alto + i * 15
      );
    }

    // Marco de la luz
    stroke(
      105, 98, 141,
      opacidad * 135
    );

    strokeWeight(1.5);

    fill(
      227, 221, 237,
      opacidad * 180
    );

    rect(
      this.x - ancho / 2,
      this.y - alto / 2,
      ancho, alto, 2
    );

    // Interior luminoso
    noStroke();

    fill(
      255, 249, 228,
      opacidad * 225
    );

    rect(
      this.x - ancho / 2 + 6,
      this.y - alto / 2 + 6,
      ancho - 12,
      alto - 12,
      1
    );
  }
}

// 10. FASE 2: OBSERVAR

function actualizarObservar() {

  let total = 0;

  for (let i = 0; i < manchas.length; i++) {

    manchas[i].actualizar();

    if (manchas[i].descubierta) {
      total++;
    }
  }

  if (total == 3) {

    pausaObservar++;

    if (pausaObservar >= 180) {
      iniciarTransicion(4);
    }
  }
}

function dibujarObservar() {

  ambiente(2);
  marco("02 / OBSERVAR");

  noStroke();
  fill(53, 49, 74);

  textFont("Georgia");
  textSize(38);
  textAlign(LEFT, CENTER);

  text(
    "La luz se ha fragmentado.",
    74, 147
  );

  // Líneas entre las manchas activadas.
  for (let i = 0; i < manchas.length - 1; i++) {

    if (
      manchas[i].descubierta &&
      manchas[i + 1].descubierta
    ) {

      stroke(121, 113, 153, 100);
      strokeWeight(1);

      line(
        manchas[i].x,
        manchas[i].y,
        manchas[i + 1].x,
        manchas[i + 1].y
      );
    }
  }

  let total = 0;
  let cerca = false;
  let lista = false;

  for (let i = 0; i < manchas.length; i++) {

    manchas[i].mostrar();

    if (manchas[i].descubierta) {
      total++;
    }

    if (
      !manchas[i].descubierta &&
      manchas[i].estaCerca()
    ) {

      cerca = true;

      if (manchas[i].carga >= TIEMPO_SENAL) {
        lista = true;
      }
    }
  }

  if (total == 3) {

    pie("ALGO HA CAMBIADO EN EL ESPACIO");

  } else if (lista) {

    pie("ESPACIO: SI DECIDES TOCAR");

  } else if (cerca) {

    pie("NO LA FUERCES");

  } else {

    pie("ACÉRCATE DESPACIO");
  }
}

function tocarMancha() {

  if (pantalla != 3 || transicion != null) {
    return;
  }

  let logro = false;

  for (let i = 0; i < manchas.length; i++) {

    if (
      !manchas[i].descubierta &&
      manchas[i].estaCerca() &&
      manchas[i].carga >= TIEMPO_SENAL
    ) {

      manchas[i].descubierta = true;
      logro = true;
    }
  }

  if (!logro) {
    aviso = 80;
  }
}

// 11. CLASE MANCHA

class Mancha {

  constructor(x, y, indice) {

    this.baseX = x;
    this.baseY = y;

    this.x = x;
    this.y = y;

    this.indice = indice;

    this.ritmo = random(0.005, 0.011);

    this.carga = 0;
    this.descubierta = false;
    this.aparicion = 0;
  }

  estaCerca() {

    return dist(
      persona.x,
      persona.y - 46,
      this.x,
      this.y
    ) < 85;
  }

  actualizar() {

    this.x =
      this.baseX +
      sin(pulso * this.ritmo + this.indice) * 10;

    this.y =
      this.baseY +
      sin(pulso * 0.007 + this.indice) * 7;

    if (this.descubierta) {

      if (this.aparicion < 255) {
        this.aparicion += 3;
      }

      if (this.aparicion > 255) {
        this.aparicion = 255;
      }

      return;
    }

    // Solo avanza cuando el jugador esta quieto y cerca.
    if (
      this.estaCerca() &&
      persona.velocidad < 0.14
    ) {

      this.carga++;

    } else if (
      this.estaCerca() &&
      persona.velocidad < 0.30
    ) {

      this.carga -= 0.5;

    } else {

      this.carga -= 2.2;
    }

    if (this.carga < 0) this.carga = 0;

    if (this.carga > TIEMPO_SENAL) {
      this.carga = TIEMPO_SENAL;
    }
  }

  mostrar() {

    let tension =
      this.carga / TIEMPO_SENAL;

    let soplo =
      sin(pulso * 0.018 + this.indice) *
      (6 - tension * 4);

    noStroke();

    // Formas orgánicas transparentes.
    for (let i = 8; i > 0; i--) {

      if (this.indice == 0) {
        fill(143, 145, 191, 10 + tension * 3);
      }

      if (this.indice == 1) {
        fill(141, 174, 203, 11 + tension * 3);
      }

      if (this.indice == 2) {
        fill(217, 195, 176, 13 + tension * 3);
      }

      ellipse(
        this.x,
        this.y,
        38 + i * 13 + soplo,
        50 + i * 12 + soplo
      );
    }

    if (this.descubierta) {

      fill(61, 57, 85, this.aparicion);

      textFont("Georgia");
      textSize(18);
      textAlign(CENTER, CENTER);

      text(
        palabras[this.indice],
        this.x,
        this.y
      );

    } else {

      // La mancha se estabiliza progresivamente.
      noFill();
      stroke(88, 82, 120, 34 + tension * 112);
      strokeWeight(1);

      ellipse(
        this.x,
        this.y,
        26 + tension * 24
      );

      if (
        this.estaCerca() &&
        this.carga > TIEMPO_SENAL * 0.82
      ) {

        noStroke();
        fill(70, 64, 98, 100);

        textFont("Courier New");
        textSize(10);
        textAlign(CENTER, CENTER);

        text("...", this.x, this.y - 92);
      }
    }
  }
}

// 12. FASE 3: PENSAR


function actualizarPensar() {

  for (let i = 0; i < frecuencias.length; i++) {
    frecuencias[i].actualizar();
  }
}

function totalPreguntas() {

  let total = 0;

  for (let i = 0; i < frecuencias.length; i++) {

    if (
      frecuencias[i].descubierta &&
      frecuencias[i].aparicion >= 255
    ) {

      total++;
    }
  }

  return total;
}

function dibujarPensar() {

  ambiente(3);
  marco("03 / PENSAR");

  noStroke();
  fill(53, 49, 75);

  textFont("Georgia");
  textSize(38);
  textAlign(LEFT, CENTER);

  text(
    "Las formas guardan preguntas.",
    74, 146
  );

  for (let i = 0; i < frecuencias.length; i++) {
    frecuencias[i].mostrar();
  }

  // Las preguntas permanecen visibles.
  textFont("Georgia");
  textSize(15);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < 3; i++) {

    if (frecuencias[i].descubierta) {

      fill(
        61, 57, 86,
        frecuencias[i].aparicion
      );

      text(
        preguntas[i],
        83,
        446 + i * 27
      );

    } else {

      fill(134, 127, 149);

      text(
        "························",
        83,
        446 + i * 27
      );
    }
  }

  if (totalPreguntas() == 3) {

    pie("ENTER PARA DEJAR UNA HUELLA");

  } else {

    pie("ESCUCHA ANTES DE PASAR");
  }
}


// 13. CLASE FRECUENCIA

class Frecuencia {

  constructor(x, y, indice) {

    this.x = x;
    this.y = y;

    this.indice = indice;

    this.carga = 0;
    this.descubierta = false;
    this.aparicion = 0;
  }

  actualizar() {

    if (this.descubierta) {

      if (this.aparicion < 255) {
        this.aparicion += 2.8;
      }

      if (this.aparicion > 255) {
        this.aparicion = 255;
      }

      return;
    }

    let cerca = dist(
      persona.x,
      persona.y - 46,
      this.x,
      this.y
    ) < 82;

    if (
      cerca &&
      persona.velocidad < 0.12
    ) {

      this.carga++;

    } else if (
      cerca &&
      persona.velocidad < 0.26
    ) {

      this.carga -= 0.7;

    } else {

      this.carga -= 2.5;
    }

    if (this.carga < 0) this.carga = 0;

    if (this.carga >= TIEMPO_PREGUNTA) {

      this.carga = TIEMPO_PREGUNTA;
      this.descubierta = true;
    }
  }

  mostrar() {

    let tension =
      this.carga / TIEMPO_PREGUNTA;

    let respiracion =
      sin(pulso * 0.016 + this.indice) *
      (7 - tension * 5);

    let intensidad = map(
      this.carga,
      0, TIEMPO_PREGUNTA,
      60, 210
    );

    if (this.descubierta) {
      intensidad = 80;
    }

    noFill();
    strokeWeight(1);

    for (let i = 0; i < 5; i++) {

      stroke(93, 87, 137, intensidad);

      ellipse(
        this.x,
        this.y,
        36 + i * 24 + respiracion
      );
    }

    noStroke();
    fill(75, 69, 106);

    textFont("Courier New");
    textSize(13);
    textAlign(CENTER, CENTER);

    if (this.descubierta) {

      text("•", this.x, this.y);

    } else {

      text(
        "0" + (this.indice + 1),
        this.x,
        this.y
      );
    }

    if (
      !this.descubierta &&
      this.carga > TIEMPO_PREGUNTA * 0.88
    ) {

      fill(74, 68, 104, 115);
      textSize(10);

      text("...", this.x, this.y - 88);
    }
  }
}

// 14. REFLEXIÓN Y ESCRITURA

function reconstruirRespuesta() {

  respuesta = "";

  for (let i = 0; i < letras.length; i++) {
    respuesta += letras[i];
  }
}

// Divido el texto según el ancho de cada renglón.
function dividirRenglones(texto, ancho) {

  let lineas = [];
  let actual = "";

  for (let i = 0; i < texto.length; i++) {

    let intento = actual + texto[i];

    if (
      textWidth(intento) > ancho &&
      actual.length > 0
    ) {

      lineas.push(actual);
      actual = texto[i];

    } else {

      actual = intento;
    }
  }

  lineas.push(actual);

  return lineas;
}

function agregarLetra(letra) {

  if (
    pantalla != 5 ||
    letras.length >= MAX_LETRAS
  ) {
    return;
  }

  textFont("Georgia");
  textSize(20);

  let posibles =
    dividirRenglones(respuesta + letra, 475);

  if (posibles.length > MAX_LINEAS) {

    mensajeEscritura =
      "LA PÁGINA ESTÁ COMPLETA";

    aviso = 100;

    return;
  }

  letras.push(letra);
  reconstruirRespuesta();

  // Las letras generan ondas en el entorno.
  resonancia = 27;
}

function dibujarReflexion() {

  ambiente(4);
  marco("04 / DEJAR UNA HUELLA");

  noStroke();
  fill(50, 47, 72);

  textFont("Georgia");
  textSize(41);
  textAlign(LEFT, CENTER);

  text(
    "Este espacio te escucha.",
    76, 143
  );

  // Las tres preguntas aparecen encima de la hoja.
  fill(101, 95, 119);

  textFont("Courier New");
  textSize(11);

  for (let i = 0; i < 3; i++) {

    text(
      "0" + (i + 1) + "  " + preguntas[i],
      222,
      191 + i * 24
    );
  }

  // Renglones de escritura.
  stroke(128, 121, 146, 91);
  strokeWeight(1);

  for (let i = 0; i < MAX_LINEAS; i++) {

    line(
      220,
      322 + i * 37,
      716,
      322 + i * 37
    );
  }

  noStroke();
  fill(58, 54, 79);

  textFont("Georgia");
  textSize(20);
  textAlign(LEFT, BASELINE);

  let lineas =
    dividirRenglones(respuesta, 475);

  // Escribo cada parte sobre un renglón.
  for (let i = 0; i < lineas.length; i++) {

    text(
      lineas[i],
      224,
      316 + i * 37
    );
  }

  // Cursor de escritura.
  if (pulso % 56 < 28) {

    let ultima = lineas.length - 1;

    text(
      "|",
      224 + textWidth(lineas[ultima]),
      316 + ultima * 37
    );
  }

  if (aviso > 0) {

    pie(mensajeEscritura);

  } else {

    pie(
      "ESCRIBE LIBREMENTE. ENTER PARA TERMINAR"
    );
  }

  fill(107, 100, 124);

  textFont("Courier New");
  textSize(11);
  textAlign(RIGHT, CENTER);

  text(
    letras.length + "/" + MAX_LETRAS,
    734, 533
  );
}

// 15. PANTALLA FINAL

function dibujarFinal() {

  ambiente(4);
  marco("TU HUELLA");

  noStroke();
  fill(51, 48, 72);

  textFont("Georgia");
  textSize(44);
  textAlign(LEFT, CENTER);

  text(
    "La espera no estaba vacía.",
    79, 166
  );

  fill(103, 96, 119);

  textFont("Courier New");
  textSize(12);

  text(
    "LO QUE LA PRISA NO TE DEJABA VER",
    82, 242
  );

  // Muestro la reflexión final.
  textFont("Georgia");
  textSize(19);
  textAlign(LEFT, BASELINE);

  fill(57, 53, 79);

  let lineas =
    dividirRenglones(respuesta, 608);

  for (let i = 0; i < lineas.length; i++) {

    text(
      lineas[i],
      85,
      308 + i * 28
    );
  }

  pie(
    "ENTER O CLIC PARA COMENZAR OTRA VEZ"
  );
}

// 16. CLASE PERSONA


class Persona {

  constructor() {

    this.x = 400;
    this.y = 475;

    this.vx = 0;
    this.vy = 0;

    this.velocidad = 0;
    this.paso = 0;
    this.mirada = 1;
  }

  colocar(x, y) {

    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.velocidad = 0;
  }

  actualizar() {

    let dx = 0;
    let dy = 0;

    // keyIsDown(): devuelve true mientras la tecla indicada sigue presionada.
    if (izquierda || keyIsDown(LEFT_ARROW)) dx--;
    if (derecha || keyIsDown(RIGHT_ARROW)) dx++;
    if (arriba || keyIsDown(UP_ARROW)) dy--;
    if (abajo || keyIsDown(DOWN_ARROW)) dy++;

    // Corrijo la velocidad diagonal.
    if (dx != 0 && dy != 0) {

      dx *= 0.7;
      dy *= 0.7;
    }

    // Aceleración y frenado.
    this.vx += (dx * 3.05 - this.vx) * 0.27;
    this.vy += (dy * 3.05 - this.vy) * 0.27;

    let antesX = this.x;
    let antesY = this.y;

    // En el laberinto hay colisiones.
    if (pantalla == 2) {

      let posicion = laberinto.mover(
        this.x,
        this.y,
        this.vx,
        this.vy
      );

      this.x = posicion.x;
      this.y = posicion.y;

    } else {

      // En las otras fases camina libremente.
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 75) this.x = 75;
      if (this.x > 725) this.x = 725;
      if (this.y < 240) this.y = 240;
      if (this.y > 487) this.y = 487;
    }

    if (this.vx > 0.15) this.mirada = 1;
    if (this.vx < -0.15) this.mirada = -1;

    this.velocidad = dist(
      antesX,
      antesY,
      this.x,
      this.y
    );

    this.paso += this.velocidad * 0.20;
  }

  mostrar() {

    let caminar =
      sin(this.paso) * this.velocidad * 1.9;

    let respirar =
      sin(pulso * 0.032) * 1.4;

    let pelo =
      sin(pulso * 0.026) * 1.8 +
      caminar * 0.14;

    push();
    translate(this.x, this.y);

    if (pantalla == 2) {
      scale(0.62);
    }

    // Sombra.
    noStroke();
    fill(79, 69, 95, 24);

    ellipse(0, 7, 45, 10);

    // Halos de las fases siguientes.
    if (pantalla >= 3) {

      fill(141, 174, 203, 29);
      ellipse(0, -47, 71, 117);
    }

    if (pantalla >= 4) {

      noFill();
      stroke(143, 145, 191, 78);

      ellipse(
        0, -47,
        93 + sin(pulso * 0.02) * 5,
        127
      );
    }

    if (pantalla == 5) {

      stroke(217, 195, 176, 145);

      ellipse(
        0, -47,
        111 + sin(pulso * 0.016) * 5,
        143
      );
    }

    // Piernas.
    stroke(76, 73, 101);
    strokeWeight(9);

    line(-8, -28, -10 + caminar * 0.5, -14);
    line(8, -28, 10 - caminar * 0.5, -14);

    line(
      -10 + caminar * 0.5,
      -14,
      -11 + caminar,
      0
    );

    line(
      10 - caminar * 0.5,
      -14,
      11 - caminar,
      0
    );

    // Pies.
    noStroke();
    fill(68, 64, 89);

    ellipse(-13 + caminar, 0, 18, 8);
    ellipse(13 - caminar, 0, 18, 8);

    // Cabello largo.
    fill(78, 64, 77);

    ellipse(
      0,
      -72 + respirar,
      43, 66
    );

    ellipse(-17 + pelo * 0.2, -59, 15, 47);
    ellipse(17 + pelo * 0.2, -59, 15, 47);
    ellipse(-16 + pelo, -42, 13, 23);
    ellipse(16 + pelo, -42, 13, 23);

    // Torso.
    fill(118, 111, 150);

    ellipse(
      0,
      -57 + respirar * 0.2,
      39, 19
    );

    rect(-17, -58, 34, 32, 9);

    // Cadera.
    fill(103, 96, 133);
    ellipse(0, -30, 31, 17);

    // Brazos.
    stroke(113, 104, 143);
    strokeWeight(8);

    line(
      -17, -57,
      -23 - caminar * 0.3,
      -43
    );

    line(
      -23 - caminar * 0.3,
      -43,
      -22 - caminar * 0.6,
      -27
    );

    line(
      17, -57,
      23 + caminar * 0.3,
      -43
    );

    line(
      23 + caminar * 0.3,
      -43,
      22 + caminar * 0.6,
      -27
    );

    // Manos.
    noStroke();
    fill(183, 151, 137);

    ellipse(
      -22 - caminar * 0.6,
      -26,
      8, 10
    );

    ellipse(
      22 + caminar * 0.6,
      -26,
      8, 10
    );

    // Cuello.
    rect(
      -5,
      -75 + respirar,
      10, 12,
      3
    );

    // Cabeza.
    ellipse(
      0,
      -86 + respirar,
      25, 30
    );

    // Orejas.
    ellipse(-12, -85 + respirar, 5, 8);
    ellipse(12, -85 + respirar, 5, 8);

    // Cabello superior.
    fill(78, 64, 77);

    ellipse(0, -99 + respirar, 28, 15);
    ellipse(-9, -93 + respirar, 10, 19);
    ellipse(7, -94 + respirar, 11, 14);

    pop();
  }
}

// 17. CLASE PARTÍCULA

class Particula {

  constructor() {

    this.x = random(84, 715);
    this.y = random(135, 481);

    this.tamano = random(2, 6);
    this.ritmo = random(0.004, 0.012);
    this.desfase = random(0, 6);
  }

  mostrar(etapa) {

    let x =
      this.x +
      sin(pulso * this.ritmo + this.desfase) * 22;

    let y =
      this.y +
      sin(
        pulso * this.ritmo * 0.7 +
        this.desfase
      ) * 15;

    noStroke();

    if (etapa == 1) fill(119, 115, 145, 18);
    if (etapa == 2) fill(141, 174, 203, 57);
    if (etapa == 3) fill(106, 100, 149, 67);
    if (etapa == 4) fill(143, 145, 191, 51);

    ellipse(x, y, this.tamano);
  }
}

// 18. ENTER, MOUSE Y REINICIO

function procesarEnter() {

  if (transicion != null) {
    return;
  }

  if (pantalla == 0) {

    cambiarPantalla(1);

  } else if (pantalla == 1) {

    cambiarPantalla(2);

  } else if (
    pantalla == 4 &&
    totalPreguntas() == 3
  ) {

    iniciarTransicion(5);

  } else if (pantalla == 5) {

    if (respuesta.trim().length >= 5) {

      cambiarPantalla(6);

    } else {

      mensajeEscritura =
        "ESCRIBE AL MENOS UNA FRASE";

      aviso = 120;
    }

  } else if (pantalla == 6) {

    reiniciar();
  }
}

function mousePressed() {
  // La música empieza con el primer clic dentro del juego. loop() la vuelve a iniciar cuando termina, sin interrumpir el juego. musicaIniciada evita iniciarla varias veces con otros clics.
if (!musicaIniciada) {
  musicaBinaural.loop();
  musicaIniciada = true;
}

  if (transicion != null) {
    return false;
  }

  if (pantalla == 0) {

    cambiarPantalla(1);

  } else if (pantalla == 1) {

    cambiarPantalla(2);

  } else if (pantalla == 3) {

    tocarMancha();

  } else if (pantalla == 6) {

    reiniciar();
  }

  return false;
}

function reiniciar() {

  quietud = 0;
  movimientoInicial = 0;
  pausaObservar = 0;

  resonancia = 0;
  aviso = 0;

  letras = [];
  respuesta = "";

  mensajeEscritura = "";
  transicion = null;

  laberinto = new Laberinto();
  umbral = new Umbral();

  cambiosLaberinto = 0;
  pistaVisible = "";
  letrasPista = 0;

  for (let i = 0; i < manchas.length; i++) {

    manchas[i].carga = 0;
    manchas[i].descubierta = false;
    manchas[i].aparicion = 0;
  }

  for (let i = 0; i < frecuencias.length; i++) {

    frecuencias[i].carga = 0;
    frecuencias[i].descubierta = false;
    frecuencias[i].aparicion = 0;
  }

  cambiarPantalla(0);
}
