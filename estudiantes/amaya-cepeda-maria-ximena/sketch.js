// Nombre: Maria Ximena Amaya Cepeda
// Título: El que la hace, se la imagina
// Descripción:  Este juego nace de todo lo aprendido durante el semestre en Pensamiento Algorítmico y busca reunir esos conocimientos en una experiencia interactiva que, además de poner a prueba la lógica y la programación, invite al jugador a reflexionar sobre la manera en que interpreta las situaciones y a las personas que lo rodean. Muchas veces tendemos a pensar lo peor de los demás sin conocer realmente lo que está pasando, y el juego busca abrir un espacio para cuestionar esas ideas, reconocer nuestros prejuicios y empezar a ver las situaciones desde otras perspectivas.

//Su desarrollo también representa mi propio proceso de aprendizaje, pues reúne las herramientas, conceptos y niveles de complejidad que fui adquiriendo a lo largo de la clase. Durante la programación recurrí a Gemini como apoyo en momentos en los que necesitaba entender mejor ciertos conceptos o complementar lo aprendido, siempre desde mi propio criterio, buscando comprender lo que hacía y decidir cómo aplicarlo en el juego. La ficha de uso de IA, adjunta en la entrega, explica con mayor detalle en qué momentos y para qué utilicé esta herramienta.

//La idea es que el juego no solo sea el resultado de lo aprendido, sino también una forma de ponerlo en práctica, explorar mis capacidades y seguir aprendiendo.



let Bhombre, Bmujer, Binteresmujer, Bintereshombre, Bstart;
let B_A, B_B;

let portales = [];
let flores = [];
let preguntas = [];
let bolas = [];
let pisosDK = [];
let escalerasDK = [];
let arboles = [];

let genero = "";
let interes = "";
let pantalla = 1;

let xFlecha = 50;
let moverFlecha = false;
let xMuneco = -40;
let puedeSaltar = true;

// Misión de flores
let floresTocadas = 0;
let momentoFlores = "inicio"; // "inicio", "mitad", "final"

// Progreso de las 10 preguntas
let indicePregunta = 0; // 0 a 9 (Preguntas 1 a 10)
let puntajeCelos = 0;
let posYPersonajeEscalera = 460;

// Movimiento, salto y escaleras en Pantalla 5
let xPersonajeEscena = 140;
let yPersonajeEscena = 237;
let velYPersonaje = 0;
let enSuelo = true;
let ySueloActual = 260;
let subiendoEscaleraDK = false;

let xOtraPersonaEscena = 660;
let yOtraPersonaEscena = 237;
let enEncuentro = false;
let mensajeObstaculo = "";
let tipoObstaculo = "libre";

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);

  // Pisos base por defecto
  pisosDK = [180, 280, 385, 490];
  escalerasDK = [
    { x: 520, yTop: 180, yBottom: 280 },
    { x: 250, yTop: 280, yBottom: 385 },
    { x: 610, yTop: 385, yBottom: 490 }
  ];

  // Botones pantalla inicial
  Bhombre = new Boton(200, 220, 180, 45, "Hombre");
  Bmujer = new Boton(420, 220, 180, 45, "Mujer");
  Binteresmujer = new Boton(150, 320, 240, 45, "Me interesan mujeres");
  Bintereshombre = new Boton(410, 320, 240, 45, "Me interesan hombres");
  Bstart = new Boton(300, 410, 200, 55, "START");

  // Botones de respuesta A y B
  B_A = new Boton(110, 365, 580, 52, "");
  B_B = new Boton(110, 430, 580, 52, "");

  // Portales
  for (let i = 0; i < 12; i++) {
    portales.push(new Portal(random(40, width - 40), random(-600, height), random(65, 115), i));
  }

  // Árboles variados (grandes, chiquitos, oscuros al fondo y claros al frente)
  for (let i = 0; i < 16; i++) {
    let esClaro = false;
    if (i % 2 === 0) {
      esClaro = true;
    }
    arboles.push(new Arbol(i * 52 + random(-8, 8), esClaro));
  }

  // Flores
  for (let i = 0; i < 3; i++) {
    flores.push(new Flor(190 + i * 210, 355));
  }

  cargarPreguntas();
  configurarNivel(0);
}

function cargarPreguntas() {
  preguntas = [
    {
      enunciado: "1. Tu pareja o crush ve tu mensaje y no responde\ndurante un par de horas.",
      a: "A. Me está ignorando a propósito; si quisiera hablar, respondería ya.",
      b: "B. Puede estar ocupado(a) o concentrado(a); no siempre se contesta al instante."
    },
    {
      enunciado: "2. En clase o reunión, ríe mucho con otra persona\ny contigo está más serio(a).",
      a: "A. Seguro ya le llama más la atención esa persona que yo.",
      b: "B. Cada momento tiene su dinámica; reír con alguien no significa nada raro."
    },
    {
      enunciado: "3. Ves que le da like a fotos de alguien\nque le gustaba antes.",
      a: "A. Qué falta de respeto; sigue pendiente de su pasado o buscando opciones.",
      b: "B. Un like puede ser casual o educado; no saco conclusiones sin hablar."
    },
    {
      enunciado: "4. Te dice que hoy necesita un rato a solas\npara descansar y recargar energía.",
      a: "A. Me suena a excusa; cuando alguien quiere, saca tiempo sí o sí.",
      b: "B. Es sano tener espacio personal; lo respeto y nos vemos luego."
    },
    {
      enunciado: "5. Sale con su grupo de amigos/compañeros\ny no te incluye en ese plan.",
      a: "A. Me está dejando por fuera a propósito o escondiendo algo.",
      b: "B. No tenemos que ir juntos a todo; también es bueno tener espacios propios."
    },
    {
      enunciado: "6. Hoy te responde con mensajes cortos\ny un poco secos.",
      a: "A. Ya se aburrió de mí o está enojado(a) conmigo por algo.",
      b: "B. Quizás tuvo un día pesado; le pregunto con calma si todo bien."
    },
    {
      enunciado: "7. Comenta un problema personal con otra persona\nantes que contigo.",
      a: "A. Ya no me tiene tanta confianza como antes; me duele quedar segundo.",
      b: "B. Cada quien habla con quien sienta más cómodo en el momento."
    },
    {
      enunciado: "8. Llega un poco tarde a un plan\nque habían acordado juntos.",
      a: "A. No valora mi tiempo; si le importara de verdad, habría llegado puntual.",
      b: "B. Pudo haber tráfico o un imprevisto; espero a escuchar qué pasó."
    },
    {
      enunciado: "9. Publica una historia disfrutando un plan\nsin mencionarte ni etiquetarte.",
      a: "A. Quiere verse libre o mostrar que no depende de mí.",
      b: "B. No todo lo que vivimos tiene que publicarse para ser real."
    },
    {
      enunciado: "10. Menciona que conoció a alguien nuevo\ncon quien se lleva muy bien.",
      a: "A. Siento amenaza y miedo de que me reemplacen si no estoy alerta.",
      b: "B. Conocer gente buena es normal; confío en lo que construimos."
    }
  ];
}

function iniciarMisionFlores(momento) {
  momentoFlores = momento;
  floresTocadas = 0;
  for (let i = 0; i < flores.length; i++) {
    flores[i].tocada = false;
  }
  pantalla = 6;
}

//  cada nivel 
function configurarNivel(idx) {
  bolas = [];
  mensajeObstaculo = "";
  subiendoEscaleraDK = false;
  puedeSaltar = true;
  ySueloActual = 260;
  xOtraPersonaEscena = 660;
  yOtraPersonaEscena = 237;

  if (idx === 0) {
    tipoObstaculo = "libre";
  } else if (idx === 1) {
    tipoObstaculo = "saltar_uno";
  } else if (idx === 2) {
    tipoObstaculo = "esquivar_uno";
    bolas.push(new Bola(560, 246, 22, -5.8, 220, 620, false));
  } else if (idx === 3) {
    tipoObstaculo = "doble_salto_bloques";
  } else {
    // Modo Donkey Kong
    tipoObstaculo = "donkey_kong";

    if (idx === 4) {

      pisosDK = [180, 280, 385, 490];
      escalerasDK = [
        { x: 580, yTop: 385, yBottom: 490 },
        { x: 260, yTop: 280, yBottom: 385 },
        { x: 520, yTop: 180, yBottom: 280 }
      ];
      xPersonajeEscena = 140;
      xOtraPersonaEscena = 660;
    } else if (idx === 5) {
      // Nivel 6: Escaleras hacia la izquierda
      pisosDK = [170, 275, 385, 495];
      escalerasDK = [
        { x: 320, yTop: 385, yBottom: 495 },
        { x: 600, yTop: 275, yBottom: 385 },
        { x: 220, yTop: 170, yBottom: 275 }
      ];
      xPersonajeEscena = 680;
      xOtraPersonaEscena = 150;
    } else if (idx === 6) {
      // Nivel 7: Escaleras centrales y lado 
      pisosDK = [165, 270, 380, 490];
      escalerasDK = [
        { x: 430, yTop: 380, yBottom: 490 },
        { x: 210, yTop: 270, yBottom: 380 },
        { x: 640, yTop: 165, yBottom: 270 }
      ];
      xPersonajeEscena = 130;
      xOtraPersonaEscena = 700;
    } else if (idx === 7) {
      // Nivel 8: Pisos más altos y escaleras estrechas
      pisosDK = [160, 265, 375, 490];
      escalerasDK = [
        { x: 650, yTop: 375, yBottom: 490 },
        { x: 390, yTop: 265, yBottom: 375 },
        { x: 180, yTop: 160, yBottom: 265 }
      ];
      xPersonajeEscena = 140;
      xOtraPersonaEscena = 130;
    } else if (idx === 8) {
      // Nivel 9: Recorrido largo con escaleras alternadas
      pisosDK = [165, 270, 380, 490];
      escalerasDK = [
        { x: 240, yTop: 380, yBottom: 490 },
        { x: 540, yTop: 270, yBottom: 380 },
        { x: 310, yTop: 165, yBottom: 270 }
      ];
      xPersonajeEscena = 680;
      xOtraPersonaEscena = 670;
    } else {
      // Nivel 10: Reto final Donkey Kong
      pisosDK = [155, 260, 375, 490];
      escalerasDK = [
        { x: 620, yTop: 375, yBottom: 490 },
        { x: 220, yTop: 260, yBottom: 375 },
        { x: 470, yTop: 155, yBottom: 260 }
      ];
      xPersonajeEscena = 130;
      xOtraPersonaEscena = 670;
    }

    ySueloActual = pisosDK[3];
    yPersonajeEscena = pisosDK[3] - 23;
    yOtraPersonaEscena = pisosDK[0] - 23;

    // Mayor dificultad: velocidades más altas y más bolas según el nivel
    let velBase = map(idx, 4, 9, 4.5, 6.2);
    bolas.push(new Bola(350, pisosDK[3] - 12, 22, velBase, 170, 560, true));
    bolas.push(new Bola(480, pisosDK[2] - 12, 22, -velBase * 1.05, 230, 660, true));
    bolas.push(new Bola(380, pisosDK[1] - 12, 22, velBase * 1.1, 200, 620, true));

    if (idx >= 5) {
      bolas.push(new Bola(550, pisosDK[0] - 12, 22, -velBase * 1.1, 220, 690, true));
    }
    if (idx >= 7) {
      bolas.push(new Bola(240, pisosDK[2] - 12, 22, velBase * 0.8, 130, 360, true));
    }
  }
}

// Luna detallada en el cielo
function dibujarLunaDetallada() {
  noStroke();
  fill(225, 220, 245, 22);
  circle(670, 110, 155);
  fill(230, 225, 245, 42);
  circle(670, 110, 112);

  fill(242, 238, 250, 235);
  circle(670, 110, 78);

  fill(210, 205, 228, 130);
  circle(656, 98, 16);
  circle(682, 118, 20);
  circle(664, 126, 11);
  fill(195, 190, 215, 95);
  circle(684, 96, 9);
  circle(648, 114, 8);
}

// Fondo de bosque con luna y árboles
function dibujarFondoArboles(ySueloBosque, transparencia) {
  dibujarLunaDetallada();

  for (let i = 0; i < arboles.length; i++) {
    if (!arboles[i].claro) {
      arboles[i].moverViento();
      arboles[i].mostrar(ySueloBosque, transparencia);
    }
  }

  for (let i = 0; i < arboles.length; i++) {
    if (arboles[i].claro) {
      arboles[i].moverViento();
      arboles[i].mostrar(ySueloBosque, transparencia);
    }
  }
}

function draw() {
  // Colores originales del juego y fondo azul en las misiones de flores
  if (pantalla === 6) {
    background(14, 34, 72);
  } else if (pantalla === 5 && indicePregunta >= 7) {
    background(28, 10, 26);
  } else if (pantalla === 5 && indicePregunta >= 4) {
    background(20, 12, 30);
  } else if (pantalla === 5 && indicePregunta >= 2) {
    background(16, 14, 30);
  } else {
    background(10, 14, 28);
  }

  // En el inicio solo se ven los círculos después del inicio aparece el bosque
  if (pantalla > 1) {
    if (pantalla === 5) {
      dibujarFondoArboles(540, 155);
    } else if (pantalla === 6) {
      dibujarFondoArboles(530, 145);
    } else {
      dibujarFondoArboles(520, 235);
    }
  }

  cursor(ARROW);

  // PANTALLA 1: INICIO 
  if (pantalla === 1) {
    for (let i = 0; i < portales.length; i++) {
      portales[i].mover();
      portales[i].mostrar();
    }
    noStroke();
    fill(255, 220, 100);
    textSize(24);
    text("EL QUE LA HACE, SE LA IMAGINA", 400, 60);
    fill(255);
    textSize(16);
    text("1. ¿Cuál es tu género?", 400, 180);
    text("2. ¿Quién te interesa sentimentalmente?", 400, 290);

    Bhombre.mostrar();
    Bmujer.mostrar();
    Binteresmujer.mostrar();
    Bintereshombre.mostrar();
    Bstart.mostrar();
  }
  // PANTALLA 2: BIENVENIDA
  else if (pantalla === 2) {
    noStroke();
    fill(255, 220, 100);
    textSize(24);
    if (genero === "Mujer") {
      text("¡Bienvenida al juego!", 400, 130);
    } else {
      text("¡Bienvenido al juego!", 400, 130);
    }
    fill(255);
    textSize(16);
    text("Decidiste que te interesan: " + interes, 400, 180);
    text("Recuerda ser muy honesto(a). Responde con sinceridad.", 400, 240);
    text("Avanzarás por 10 situaciones y al final verás tu reflexión.", 400, 270);

    if (moverFlecha === true) {
      xFlecha += 10;
    }
    stroke(150, 180, 255);
    strokeWeight(2);
    fill(50, 70, 130);
    rect(xFlecha, 500, 80, 40, 8);
    noStroke();
    fill(255);
    textSize(20);
    text("→", xFlecha + 40, 520);
    if (xFlecha > 850) {
      pantalla = 3;
      moverFlecha = false;
      xFlecha = 50;
    }
  }
  // PANTALLA 3: BOSQUE Y CAMINATA
  else if (pantalla === 3) {
    stroke(90, 110, 175);
    strokeWeight(2);
    line(0, 520, 800, 520);

    if (xMuneco < 400) {
      xMuneco += 3;
    } else {
      noStroke();
      fill(255);
      rect(280, 380, 240, 50, 10);
      fill(20);
      textSize(13);
      text("Haz clic para continuar", 400, 405);
    }

    dibujarParejaSuperior(400, 100);

    noStroke();
    fill(255, 210, 180);
    circle(xMuneco, 482, 24);
    if (genero === "Mujer") {
      fill(220, 100, 150);
    } else {
      fill(80, 140, 220);
    }
    rect(xMuneco - 10, 494, 20, 26, 4);
  }
  // PANTALLA 4: REGLAS
  else if (pantalla === 4) {
    noStroke();
    fill(255, 220, 100);
    textSize(26);
    text("REGLAS DEL JUEGO", 400, 75);
    fill(255);
    textSize(16);
    text("1. Usa ← y → para caminar hacia la otra persona.", 400, 150);
    text("2. Salta con la flecha de arriba (↑) y sube escaleras desde el nivel 5.", 400, 195);
    text("3. Si chocas con un obstáculo, vuelves al inicio del tramo.", 400, 240);
    text("4. Son 10 situaciones en total para descubrir tu resultado.", 400, 285);
    fill(150, 220, 180);
    textSize(15);
    text("Al final obtendrás tu puntuación y reflexión de celos.", 400, 345);

    if (moverFlecha === true) {
      xFlecha += 10;
    }
    stroke(150, 180, 255);
    strokeWeight(2);
    fill(50, 70, 130);
    rect(xFlecha, 500, 80, 40, 8);
    noStroke();
    fill(255);
    textSize(20);
    text("→", xFlecha + 40, 520);
    if (xFlecha > 850) {
      moverFlecha = false;
      xFlecha = 50;
      iniciarMisionFlores("inicio");
    }
  }
  // PANTALLA 5: 10 SITUACIONES 
  else if (pantalla === 5) {
    gestionSituacionesMovimiento();
  }
  // PANTALLA 6: MISIÓN DE FLORES (FONDO AZUL)
  else if (pantalla === 6) {
    noStroke();
    fill(140, 215, 255);
    textSize(24);
    let tituloFlores = "MISIÓN: TOCA LAS FLORES";
    if (momentoFlores === "inicio") {
      tituloFlores = "MISIÓN INICIAL: TOCA LAS FLORES";
    } else if (momentoFlores === "mitad") {
      tituloFlores = "MISIÓN INTERMEDIA: TOCA LAS FLORES";
    } else if (momentoFlores === "final") {
      tituloFlores = "MISIÓN FINAL: TOCA LAS FLORES";
    }
    text(tituloFlores, 400, 100);

    fill(235, 245, 255);
    textSize(16);
    text("Haz clic sobre las tres flores para continuar con tu historia.", 400, 160);
    text("Flores tocadas: " + floresTocadas + "/3", 400, 210);
    for (let i = 0; i < flores.length; i++) {
      flores[i].mostrar();
    }
    if (floresTocadas >= 3) {
      floresTocadas = 0;
      for (let i = 0; i < flores.length; i++) {
        flores[i].tocada = false;
      }
      if (momentoFlores === "final") {
        pantalla = 7;
      } else {
        pantalla = 5;
        reiniciarPosicionEscena();
      }
    }
  }
  // PANTALLA 7: REFLEXIÓN Y PUNTAJE FINAL
  else if (pantalla === 7) {
    noStroke();
    fill(150, 220, 180);
    textSize(28);
    text("¡HISTORIA COMPLETADA!", 400, 60);

    fill(255, 220, 100);
    textSize(20);
    text("Reflexión y Análisis de tus 10 Decisiones", 400, 110);

    fill(255);
    textSize(14);
    let txtReflexion = "";
    if (puntajeCelos >= 6) {
      txtReflexion =
        "Tiendes a asumir lo peor y a anticipar escenarios de rechazo o desconfianza.\nEl refrán 'El que la hace, se la imagina' toma fuerza:\na veces proyectamos miedos o dudas propias en lo que hace el otro.";
    } else if (puntajeCelos >= 3) {
      txtReflexion =
        "Mantienes un punto intermedio: en ocasiones dudas o sientes celos,\npero también logras frenar y cuestionar tus primeras suposiciones.";
    } else {
      txtReflexion =
        "Muestras alta confianza, calma y empatía en tus vínculos.\nEntiendes que los espacios, ritmos y gestos no siempre son amenazas.";
    }
    text(txtReflexion, 400, 185);

    fill(255, 100, 150);
    textSize(22);
    text("Puntuación de celos / desconfianza: " + puntajeCelos + " / 10", 400, 285);

    fill(200, 220, 255);
    textSize(15);
    text("Haz clic para ver los créditos. Presiona R para reiniciar.", 400, 365);
  }
  // PANTALLA 8: CRÉDITOS FINALES
  else if (pantalla === 8) {
    noStroke();
    fill(255, 220, 100);
    textSize(32);
    text("GRACIAS POR JUGAR", 400, 220);
    fill(255);
    textSize(20);
    text("MARIA XIMENA AMAYA", 400, 290);
    text("202515469", 400, 330);
    fill(180, 210, 255);
    textSize(16);
    text("Entrega final – Pensamiento Algorítmico", 400, 380);
  }
}

function reiniciarPosicionEscena() {
  xPersonajeEscena = 140;
  velYPersonaje = 0;
  enSuelo = true;
  puedeSaltar = true;
  subiendoEscaleraDK = false;
  enEncuentro = false;
  configurarNivel(indicePregunta);
  if (tipoObstaculo === "donkey_kong") {
    ySueloActual = pisosDK[3];
    yPersonajeEscena = pisosDK[3] - 23;
  } else {
    ySueloActual = 260;
    yPersonajeEscena = 237;
  }
}

function dibujarParejaSuperior(px, py) {
  noStroke();
  fill(255, 150, 200, 50);
  circle(px - 30, py, 60);
  fill(100, 200, 255, 50);
  circle(px + 30, py, 60);

  fill(255, 210, 180);
  circle(px - 30, py - 10, 25);

  if (genero === "Mujer") {
    fill(220, 100, 150);
  } else {
    fill(80, 140, 220);
  }
  rect(px - 38, py + 2, 16, 25, 3);

  fill(255, 100, 120);
  textSize(18);
  text("♥", px, py - 5);

  fill(255, 210, 180);
  circle(px + 30, py - 10, 25);

  if (interes === "Mujeres") {
    fill(220, 100, 150);
  } else {
    fill(80, 140, 220);
  }
  rect(px + 22, py + 2, 16, 25, 3);
}

function estaSobreEscalera() {
  if (tipoObstaculo !== "donkey_kong") {
    return null;
  }
  for (let i = 0; i < escalerasDK.length; i++) {
    let esc = escalerasDK[i];
    let distX = xPersonajeEscena - esc.x;
    if (distX < 0) {
      distX = -distX;
    }
    if (
      distX < 18 &&
      yPersonajeEscena + 23 >= esc.yTop - 5 &&
      yPersonajeEscena + 23 <= esc.yBottom + 5
    ) {
      return esc;
    }
  }
  return null;
}

function ejecutarSalto() {
  let pisoTorso = ySueloActual - 23;
  if (enSuelo || yPersonajeEscena >= pisoTorso - 3) {
    velYPersonaje = -13.5;
    enSuelo = false;
    puedeSaltar = false;
  }
}

function gestionSituacionesMovimiento() {
  noStroke();
  textAlign(CENTER, CENTER);

  let actual = preguntas[indicePregunta];
  let pisoTorso = ySueloActual - 23;

  if (!enEncuentro) {
    if (keyIsDown(LEFT_ARROW)) {
      xPersonajeEscena -= 4.8;
      if (xPersonajeEscena < 100) {
        xPersonajeEscena = 100;
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      xPersonajeEscena += 4.8;
      if (xPersonajeEscena > 730) {
        xPersonajeEscena = 730;
      }
    }

    // Subir o bajar escaleras en modo Donkey Kong 
    let esc = estaSobreEscalera();
    if (esc !== null) {
      if (keyIsDown(UP_ARROW)) {
        subiendoEscaleraDK = true;
        enSuelo = false;
        velYPersonaje = 0;
        yPersonajeEscena -= 3.8;
        if (yPersonajeEscena <= esc.yTop - 23) {
          yPersonajeEscena = esc.yTop - 23;
          ySueloActual = esc.yTop;
          pisoTorso = ySueloActual - 23;
          subiendoEscaleraDK = false;
          enSuelo = true;
          puedeSaltar = true;
        }
      } else if (keyIsDown(DOWN_ARROW)) {
        subiendoEscaleraDK = true;
        enSuelo = false;
        velYPersonaje = 0;
        yPersonajeEscena += 3.8;
        if (yPersonajeEscena >= esc.yBottom - 23) {
          yPersonajeEscena = esc.yBottom - 23;
          ySueloActual = esc.yBottom;
          pisoTorso = ySueloActual - 23;
          subiendoEscaleraDK = false;
          enSuelo = true;
          puedeSaltar = true;
        }
      }
    } else {
      subiendoEscaleraDK = false;
    }

    // Salto con flecha 
    if (!subiendoEscaleraDK && keyIsDown(UP_ARROW) && puedeSaltar) {
      ejecutarSalto();
    }
    if (!keyIsDown(UP_ARROW) && enSuelo) {
      puedeSaltar = true;
    }

    // Gravedad y salto
    if (!subiendoEscaleraDK) {
      if (velYPersonaje < 0 || yPersonajeEscena < pisoTorso) {
        yPersonajeEscena += velYPersonaje;
        velYPersonaje += 0.85;
        if (velYPersonaje > 0 && yPersonajeEscena >= pisoTorso) {
          yPersonajeEscena = pisoTorso;
          velYPersonaje = 0;
          enSuelo = true;
          puedeSaltar = true;
        }
      } else {
        yPersonajeEscena = pisoTorso;
        velYPersonaje = 0;
        enSuelo = true;
        puedeSaltar = true;
      }
    }

    
    if (tipoObstaculo === "saltar_uno") {
      let d1 = xPersonajeEscena - 400;
      if (d1 < 0) d1 = -d1;
      if (d1 < 21 && yPersonajeEscena > pisoTorso - 26) {
        reiniciarPosicionEscena();
        mensajeObstaculo = "¡Bloque alto! Salta con la flecha ↑.";
      }
    } else if (tipoObstaculo === "doble_salto_bloques") {
      let dA = xPersonajeEscena - 325;
      if (dA < 0) dA = -dA;
      let dB = xPersonajeEscena - 455;
      if (dB < 0) dB = -dB;
      if ((dA < 19 || dB < 19) && yPersonajeEscena > pisoTorso - 24) {
        reiniciarPosicionEscena();
        mensajeObstaculo = "¡Dos bloques seguidos! Salta ambos con ↑.";
      }
    }

   
    for (let i = 0; i < bolas.length; i++) {
      bolas[i].mover();
      if (dist(xPersonajeEscena, yPersonajeEscena + 8, bolas[i].x, bolas[i].y) < bolas[i].r * 0.5 + 10) {
        reiniciarPosicionEscena();
        mensajeObstaculo = "¡Te golpeó una bola! Vuelves a empezar el nivel.";
      }
    }

    // Encuentro con la otra persona
    if (dist(xPersonajeEscena, yPersonajeEscena, xOtraPersonaEscena, yOtraPersonaEscena) < 40) {
      enEncuentro = true;
      mensajeObstaculo = "";
    }
  }

  // Barra  de progreso 
  stroke(100, 120, 180);
  strokeWeight(3);
  line(50, 140, 50, 460);
  for (let i = 0; i <= 10; i++) {
    line(42, 140 + i * 32, 58, 140 + i * 32);
  }
  posYPersonajeEscalera = 460 - indicePregunta * 32;
  fill(255, 100, 150);
  noStroke();
  circle(50, posYPersonajeEscalera, 14);
  fill(255);
  textSize(10);
  text(indicePregunta + 1 + "/10", 50, posYPersonajeEscalera - 16);

  // Pisos y escaleras 
  if (tipoObstaculo === "donkey_kong") {
    for (let i = 0; i < pisosDK.length; i++) {
      stroke(235, 140, 60);
      strokeWeight(4);
      line(95, pisosDK[i], 745, pisosDK[i]);
    }
    for (let i = 0; i < escalerasDK.length; i++) {
      let esc = escalerasDK[i];
      stroke(120, 200, 240);
      strokeWeight(3);
      line(esc.x - 14, esc.yTop, esc.x - 14, esc.yBottom);
      line(esc.x + 14, esc.yTop, esc.x + 14, esc.yBottom);
      strokeWeight(2);
      for (let ry = esc.yTop + 12; ry < esc.yBottom; ry += 14) {
        line(esc.x - 14, ry, esc.x + 14, ry);
      }
    }
  } else {
    stroke(80, 100, 150);
    strokeWeight(2);
    line(80, 260, 750, 260);
  }

  // Bloques de los niveles 2 y 4
  noStroke();
  if (tipoObstaculo === "saltar_uno") {
    fill(235, 140, 60);
    rect(386, 230, 28, 30, 4);
  } else if (tipoObstaculo === "doble_salto_bloques") {
    fill(235, 140, 60);
    rect(311, 232, 28, 28, 4);
    rect(441, 232, 28, 28, 4);
  }

  // Dibujar bolas
  for (let i = 0; i < bolas.length; i++) {
    bolas[i].mostrar();
  }

  // Dibujar la otra persona
  fill(255, 210, 180);
  circle(xOtraPersonaEscena, yOtraPersonaEscena - 12, 24);
  if (interes === "Mujeres") {
    fill(220, 100, 150);
  } else {
    fill(80, 140, 220);
  }
  rect(xOtraPersonaEscena - 8, yOtraPersonaEscena, 16, 23, 3);

  // Dibujar personaje principal
  fill(255, 210, 180);
  circle(xPersonajeEscena, yPersonajeEscena - 12, 24);
  if (genero === "Mujer") {
    fill(220, 100, 150);
  } else {
    fill(80, 140, 220);
  }
  rect(xPersonajeEscena - 8, yPersonajeEscena, 16, 23, 3);

  // Textos superiores o pregunta al encontrarse
  if (!enEncuentro) {
    fill(255, 220, 100);
    textSize(16);
    text("PREGUNTA " + (indicePregunta + 1) + " DE 10", 400, 48);

    fill(255);
    textSize(14);
    let guia = "Avanza con ← y → hasta llegar con la otra persona.";
    if (tipoObstaculo === "saltar_uno" || tipoObstaculo === "doble_salto_bloques") {
      guia = "Salta los bloques con la flecha ↑ para seguir avanzando.";
    } else if (tipoObstaculo === "esquivar_uno") {
      guia = "Salta con ↑ o esquiva la bola para llegar.";
    } else if (tipoObstaculo === "donkey_kong") {
      guia = "Modo Donkey Kong: sube por las escaleras y salta con ↑ hasta arriba.";
    }
    text(guia, 400, 80);

    if (mensajeObstaculo !== "") {
      fill(255, 130, 150);
      textSize(13);
      text(mensajeObstaculo, 400, 108);
    }
  } else {
    fill(255, 220, 100);
    textSize(16);
    text("PREGUNTA " + (indicePregunta + 1) + " DE 10", 400, 48);

    fill(255);
    textSize(15);
    text(actual.enunciado, 400, 95);

    B_A.nombre = actual.a;
    B_B.nombre = actual.b;

    B_A.mostrar();
    B_B.mostrar();
  }
}

function keyPressed() {
  // Saltar con la flecha de arriba
  if (pantalla === 5 && !enEncuentro && !subiendoEscaleraDK) {
    if (keyCode === UP_ARROW && puedeSaltar) {
      ejecutarSalto();
    }
  }

  // Reiniciar con R
  if (key === "r" || key === "R") {
    pantalla = 1;
    indicePregunta = 0;
    puntajeCelos = 0;
    genero = "";
    interes = "";
    xMuneco = -40;
    reiniciarPosicionEscena();
  }
}

function mousePressed() {
  if (pantalla === 1) {
    if (Bhombre.clic()) {
      genero = "Hombre";
    }
    if (Bmujer.clic()) {
      genero = "Mujer";
    }
    if (Binteresmujer.clic()) {
      interes = "Mujeres";
    }
    if (Bintereshombre.clic()) {
      interes = "Hombres";
    }
    if (Bstart.clic() && genero !== "" && interes !== "") {
      pantalla = 2;
    }
  } else if (pantalla === 2) {
    if (mouseX > xFlecha && mouseX < xFlecha + 80 && mouseY > 500 && mouseY < 540) {
      moverFlecha = true;
    }
  } else if (pantalla === 3) {
    if (xMuneco >= 400) {
      pantalla = 4;
    }
  } else if (pantalla === 4) {
    if (mouseX > xFlecha && mouseX < xFlecha + 80 && mouseY > 500 && mouseY < 540) {
      moverFlecha = true;
    }
  } else if (pantalla === 5 && enEncuentro) {
    let sumoCelos = false;
    if (B_A.clic()) {
      puntajeCelos += 1;
      sumoCelos = true;
    } else if (B_B.clic()) {
      sumoCelos = true;
    }

    if (sumoCelos) {
      enEncuentro = false;
      indicePregunta += 1;

      if (indicePregunta === 5) {
        iniciarMisionFlores("mitad");
      } else if (indicePregunta >= 10) {
        iniciarMisionFlores("final");
      } else {
        reiniciarPosicionEscena();
      }
    }
  } else if (pantalla === 7) {
    pantalla = 8;
  } else if (pantalla === 6) {
    for (let i = 0; i < flores.length; i++) {
      if (!flores[i].tocada && dist(mouseX, mouseY, flores[i].x, flores[i].y) < 48) {
        flores[i].tocada = true;
        floresTocadas += 1;
      }
    }
  }
}

class Arbol {
  constructor(x, esClaro) {
    this.x = x;
    this.claro = esClaro;
    if (esClaro) {
      this.altoTronco = random(135, 180);
      this.anchoTronco = random(16, 22);
      this.anchoCopa = random(86, 114);
      this.altoCopa = random(100, 135);
      this.velViento = 0.25;
      this.maxViento = 6.5;
    } else {
      this.altoTronco = random(95, 135);
      this.anchoTronco = random(11, 15);
      this.anchoCopa = random(58, 80);
      this.altoCopa = random(70, 96);
      this.velViento = 0.16;
      this.maxViento = 3.5;
    }
    this.vientoX = random(-2, 2);
    this.dirViento = 1;
  }

  moverViento() {
    this.vientoX += this.velViento * this.dirViento;
    if (this.vientoX > this.maxViento) {
      this.vientoX = this.maxViento;
      this.dirViento = -1;
    } else if (this.vientoX < -this.maxViento) {
      this.vientoX = -this.maxViento;
      this.dirViento = 1;
    }
  }

  mostrar(yBase, alphaVal) {
    noStroke();
    if (this.claro) {
      fill(28, 38, 68, alphaVal);
    } else {
      fill(12, 16, 32, alphaVal);
    }
    rect(this.x, yBase - this.altoTronco, this.anchoTronco, this.altoTronco);

    let cx = this.x + this.anchoTronco / 2 + this.vientoX;
    let cy = yBase - this.altoTronco - this.altoCopa * 0.35;

    if (this.claro) {
      stroke(45, 65, 110, alphaVal);
    } else {
      stroke(18, 26, 48, alphaVal);
    }
    strokeWeight(3);
    line(this.x + this.anchoTronco / 2, yBase - this.altoTronco * 0.65, cx - this.anchoCopa * 0.25, cy + 8);
    line(this.x + this.anchoTronco / 2, yBase - this.altoTronco * 0.55, cx + this.anchoCopa * 0.25, cy + 10);

    noStroke();
    if (this.claro) {
      fill(38, 56, 98, alphaVal);
    } else {
      fill(16, 24, 46, alphaVal);
    }
    ellipse(cx, cy - 8, this.anchoCopa * 0.78, this.altoCopa * 0.78);
    ellipse(cx, cy + 4, this.anchoCopa, this.altoCopa * 0.85);

    if (this.claro) {
      fill(52, 76, 126, alphaVal);
    } else {
      fill(22, 32, 58, alphaVal);
    }
    ellipse(cx - this.anchoCopa * 0.28 + this.vientoX * 0.35, cy + 10, this.anchoCopa * 0.68, this.altoCopa * 0.68);
    ellipse(cx + this.anchoCopa * 0.28 + this.vientoX * 0.35, cy + 10, this.anchoCopa * 0.68, this.altoCopa * 0.68);
  }
}

class Bola {
  constructor(x, y, r, vx, minX, maxX, esDK) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.minX = minX;
    this.maxX = maxX;
    this.esDK = esDK;
    this.ang = 0;
  }

  mover() {
    this.x += this.vx;
    this.ang += this.vx * 0.1;
    if (this.x < this.minX) {
      this.x = this.minX;
      if (this.vx < 0) {
        this.vx = -this.vx;
      }
    } else if (this.x > this.maxX) {
      this.x = this.maxX;
      if (this.vx > 0) {
        this.vx = -this.vx;
      }
    }
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    noStroke();
    if (this.esDK) {
      fill(255, 145, 60);
    } else {
      fill(255, 85, 135);
    }
    circle(0, 0, this.r);
    stroke(255, 225, 170);
    strokeWeight(2);
    line(-this.r * 0.3, 0, this.r * 0.3, 0);
    pop();
  }
}

class Boton {
  constructor(x, y, w, h, nombre) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.nombre = nombre;
  }

  clic() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
  }

  mostrar() {
    let encima = this.clic();
    if (encima) {
      cursor(HAND);
    }

    let seleccionado = false;
    if (this.nombre === "Hombre" && genero === "Hombre") seleccionado = true;
    if (this.nombre === "Mujer" && genero === "Mujer") seleccionado = true;
    if (this.nombre === "Me interesan mujeres" && interes === "Mujeres") seleccionado = true;
    if (this.nombre === "Me interesan hombres" && interes === "Hombres") seleccionado = true;

    stroke(150, 180, 255);
    strokeWeight(2);
    if (seleccionado) {
      fill(90, 160, 130);
    } else if (encima) {
      fill(70, 95, 165);
    } else {
      fill(35, 48, 88);
    }
    rect(this.x, this.y, this.w, this.h, 8);

    noStroke();
    fill(255);
    textSize(14);
    text(this.nombre, this.x + this.w / 2, this.y + this.h / 2);
  }
}

class Portal {
  constructor(x, y, tam, indiceColor) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.vy = random(1.5, 3.6);
    this.ang = random(0, 6);

    // Diferentes tonos de azul para el borde
    if (indiceColor % 4 === 0) {
      this.rCol = 60;
      this.gCol = 130;
      this.bCol = 255;
    } else if (indiceColor % 4 === 1) {
      this.rCol = 90;
      this.gCol = 200;
      this.bCol = 255;
    } else if (indiceColor % 4 === 2) {
      this.rCol = 40;
      this.gCol = 85;
      this.bCol = 190;
    } else {
      this.rCol = 130;
      this.gCol = 225;
      this.bCol = 255;
    }
  }

  mover() {
    this.y += this.vy;
    this.ang += 0.02;

    // Se mueven de arriba a abajo y vuelven arriba al salir por abajo
    if (this.y > height + this.tam) {
      this.y = -this.tam;
      this.x = random(40, width - 40);
    }
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    noFill();
    stroke(this.rCol, this.gCol, this.bCol, 150);
    strokeWeight(3);
    circle(0, 0, this.tam);
    stroke(this.rCol, this.gCol, this.bCol, 95);
    strokeWeight(2);
    circle(0, 0, this.tam * 0.65);
    pop();
  }
}

class Flor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tocada = false;
  }

  mostrar() {
    if (dist(mouseX, mouseY, this.x, this.y) < 48 && !this.tocada) {
      cursor(HAND);
    }
    noStroke();
    if (this.tocada) {
      fill(120, 210, 150);
    } else {
      fill(245, 120, 165);
    }
    circle(this.x - 20, this.y, 34);
    circle(this.x + 20, this.y, 34);
    circle(this.x, this.y - 20, 34);
    circle(this.x, this.y + 20, 34);

    fill(255, 220, 90);
    circle(this.x, this.y, 30);
  }
}