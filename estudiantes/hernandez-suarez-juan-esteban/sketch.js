//Juan Esteban Hernandez

//AI Chatbot - HERNANDEZjuan_EntregaFinal

// REFERENCIAS
// Buckshot Roulette (Mike Klubnika): tome la idea del anfitrion que te mira desde la oscuridad y
// el look oscuro y sucio. Lo apropie con un smiley que se corrompe y con grano y lineas hechas con codigo.
// Ejemplo de campo de texto de Eevi Rutanen para Visual Communication Design 2025: tome createInput,
// position, size, attribute y value para escribir los nombres y las respuestas de los jugadores.
// Las respuestas de IA que se mezclan en la votacion las genero Claude (Anthropic) a partir de los prompts.
// El smiley, los avatares y los botones estan hechos por mi con figuras, sin imagenes externas.

// ESTADOS DEL JUEGO
// 1 = Avatares: los 4 amigos escogen avatar y escriben su nombre.
//     Pasa al estado 6 con el boton EMPEZAR (asi sera en la version final).
// 6 = Instrucciones: el host explica las reglas durante 15 segundos.
//     Pasa al estado 2 cuando pasan los 15 segundos o con el boton ENTENDIDO.
// 2 = Prompt: el host muestra el prompt de la ronda.
//     Pasa al estado 3 con el boton RESPONDER (asi sera en la version final).
// 3 = Respuesta: cada jugador, por turnos, escribe su respuesta y la envia con ENTER antes de que pasen 20 segundos.
//     Si se acaba el tiempo el jugador se queda sin respuesta y el host se enoja.
//     Cuando respondieron los 4 pasa al estado 4.
// 4 = Votacion: cada jugador, por turnos, hace click en las 3 respuestas que mas parecen de una IA, en orden.
//     Son las respuestas de los jugadores mas 2 de una IA de verdad. No se puede votar la propia.
//     Cuando votaron los 4 vuelve al estado 2 con el siguiente prompt.
// 5 = Final: despues de 3 rondas el host anuncia al ganador. Hay 3 finales segun que tan bravo termine.
//     El boton JUGAR OTRA VEZ vuelve al estado 1.

// PUNTOS: el autor de la respuesta elegida en 1er lugar gana 3, en 2do lugar 2 y en 3er lugar 1.
// Elegir una respuesta de la IA no le da puntos a nadie.

// ANFITRION: se va enojando con el tiempo y con cada vez que alguien se queda sin tiempo.
// Se calma cuando un jugador responde rapido. Final feliz si su rabia es menor a 0.3,
// presumido si es menor a 0.65 y furioso si es mayor.

let estado = 1; // Estado actual del juego
let host; // Anfitrion
let jugadores = []; // Los 4 jugadores
let manchas = [];
let botonEmpezar; // Boton del estado 1
let botonEntendido; // Boton del estado 6
let botonResponder; // Boton del estado 2
let botonOtraVez; // Boton del estado 5
let entradaRespuesta; // Campo de entrada de la respuesta
let ronda = 0; // Ronda actual (0 a 2)
let totalRondas = 3; // Rondas del juego
let turno = 0; // Jugador que esta respondiendo (0 a 3)
let tiempo = 1200; // Frames que le quedan al turno (20 segundos a 60 fps)
let tiempoInstrucciones = 900; // Frames que dura la pantalla de instrucciones (15 segundos)
let opciones = []; // Las respuestas que se votan en la ronda
let votante = 0; // Jugador que esta votando (0 a 3)
let paso = 0; // Cuantas respuestas ya eligio el votante
let pasosNecesarios = 3; // Cuantas respuestas tiene que elegir el votante
let puntosPorLugar = [3, 2, 1]; // Puntos para el 1er, 2do y 3er lugar
let lugares = ["1RA", "2DA", "3RA"];
let finalHost = 0; // 0 feliz, 1 presumido, 2 furioso

// Prompts del host, cada uno dividido en dos lineas
let prompts = [
  ["Dame un consejo para sacar", "mejores notas sin estresarme."],
  ["Escribe una excusa creíble", "para llegar tarde a una reunión."],
  ["Explícame por qué el cielo", "es azul como si tuviera 5 años."],
  ["Dame una receta rápida", "con huevos y arroz."],
  ["Escribe un mensaje para pedirle", "disculpas a un amigo."],
];

// Respuestas de una IA de verdad para cada prompt, dos por prompt (en el mismo orden)
let respuestasIA = [
  [
    "Divide el estudio en bloques cortos y descansa entre ellos. La constancia supera a estudiar a última hora.",
    "Planifica tu semana, prioriza las materias difíciles y recuerda dormir bien. Cuidar tu bienestar mejora tu rendimiento.",
  ],
  [
    "Podrías decir que hubo un imprevisto de tráfico. Lo ideal es ser breve, ofrecer disculpas y proponer ponerte al día.",
    "Una opción es mencionar un contratiempo con el transporte y agradecer su comprensión. La honestidad siempre es lo mejor.",
  ],
  [
    "La luz del sol tiene muchos colores y el aire los separa. El azul rebota más que los demás, por eso vemos el cielo azul.",
    "El aire juega con la luz del sol y esparce el azul por todo el cielo. ¡Por eso lo vemos azul!",
  ],
  [
    "Sofríe el arroz cocido con ajo y cebolla, añade huevos revueltos y sazona con sal y salsa de soya. ¡Listo en 10 minutos!",
    "Prepara arroz frito: saltea el arroz con un poco de aceite, agrega huevo batido y mezcla hasta que cuaje. ¡Buen provecho!",
  ],
  [
    "Hola, quiero pedirte disculpas por lo que pasó. Valoro mucho nuestra amistad y me gustaría hablar cuando estés listo.",
    "Lamento mucho mi comportamiento. Tu amistad es importante para mí y quiero hacer las cosas bien. ¿Podemos conversar?",
  ],
];

// Reglas que muestra el host en el estado 6, una por linea
let reglas = [
  "1. Cada ronda el host te da un prompt de una persona real.",
  "2. Respondan por turnos como lo haría una IA. ENTER envía.",
  "   Tienen 20 segundos. Si se demoran, el host se enoja.",
  "3. Luego votan por turnos: click en las 3 respuestas más",
  "   parecidas a una IA, en orden (la 1ra es la que más).",
  "4. Hay 2 respuestas de IA de verdad. No puedes votar la tuya.",
  "5. Son 3 rondas. Gana quien más puntos junte.",
];

// Letras del titulo, cada una es una cuadricula de 5x5 (1 = cuadrado pintado)
// orden: A, I, C, H, B, O, T
let letras = [
  [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
];

// Bocas del smiley, cada numero es que tan abajo va ese cuadrito
let sonrisa = [0, 1, 2, 2, 3, 3, 3, 2, 2, 1, 0];
let plana = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let mueca = [3, 2, 1, 1, 0, 0, 0, 1, 1, 2, 3];

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  textSize(14);

  // El anfitrion empieza arriba en el centro
  host = new Anfitrion(400, 260);

  // Los cuatro jugadores abajo, cada uno con su avatar, su color y su numero
  jugadores.push(new Jugador(100, 490, 0, 240, 170, 100, 1));
  jugadores.push(new Jugador(300, 490, 1, 220, 90, 170, 2));
  jugadores.push(new Jugador(500, 490, 2, 90, 200, 255, 3));
  jugadores.push(new Jugador(700, 490, 3, 150, 230, 80, 4));

  // manchas de mugre repartidas por toda la pantalla
  for (let i = 0; i < 14; i++) {
    manchas.push(new Mancha());
  }

  botonEmpezar = new Boton(600, 237, 150, 46, "EMPEZAR");
  botonEntendido = new Boton(550, 345, 180, 38, "ENTENDIDO");
  botonResponder = new Boton(500, 345, 200, 46, "RESPONDER");
  botonOtraVez = new Boton(490, 345, 240, 46, "JUGAR OTRA VEZ");

  // Campo de entrada de la respuesta, queda fuera del canvas hasta el estado 3
  entradaRespuesta = createInput("");
  entradaRespuesta.size(520);
  entradaRespuesta.attribute("maxlength", "120");

  cambiarEstado(1);
}

function draw() {
  background(14, 16, 12);

  // mesa de madera sucia
  noStroke();
  fill(40, 28, 20);
  rect(0, 440, 800, 160);
  stroke(25, 18, 12);
  strokeWeight(3);
  for (let x = 0; x < 800; x += 100) {
    line(x, 440, x, 600);
  }
  noStroke();

  for (let i = 0; i < manchas.length; i++) {
    manchas[i].dibujar();
  }

  // Luz que cae sobre el anfitrion
  fill(235, 210, 120, 16);
  triangle(host.x, 0, host.x - 200, 440, host.x + 200, 440);

  host.actualizar();
  host.dibujar();

  titulo(194, 24, 7);

  // Cada estado dibuja su pantalla
  if (estado == 1) {
    pantallaAvatares();
  } else if (estado == 2) {
    pantallaPrompt();
  } else if (estado == 3) {
    pantallaRespuesta();
  } else if (estado == 4) {
    pantallaVotacion();
  } else if (estado == 5) {
    pantallaFinal();
  } else if (estado == 6) {
    pantallaInstrucciones();
  }

  for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].revisarHover();
    jugadores[i].dibujar();
  }

  efectosSucios();
}

// ESTADO 1: avatares y nombres
function pantallaAvatares() {
  botonEmpezar.revisarHover();
  botonEmpezar.dibujar();

  fill(90, 255, 120);
  text("CLICK EN TU CARA PARA CAMBIAR DE AVATAR", 20, 590);
}

// ESTADO 6: el host explica las reglas
function pantallaInstrucciones() {
  // Cuenta regresiva: cuando llega a 0 empieza el juego solo
  tiempoInstrucciones -= 1;
  if (tiempoInstrucciones <= 0) {
    cambiarEstado(2);
  }

  fill(235, 230, 210);
  stroke(30, 20, 10);
  strokeWeight(4);
  rect(210, 100, 560, 290);
  noStroke();
  fill(30, 20, 10);
  textSize(22);
  text("REGLAS DEL JUEGO", 235, 135);
  textSize(15);
  for (let i = 0; i < reglas.length; i++) {
    text(reglas[i], 235, 170 + i * 26);
  }
  let segundos = (tiempoInstrucciones - (tiempoInstrucciones % 60)) / 60;
  text("EMPIEZA EN " + segundos, 235, 372);
  textSize(14);

  botonEntendido.revisarHover();
  botonEntendido.dibujar();
}

// ESTADO 2: el host muestra el prompt de la ronda
function pantallaPrompt() {
  // Globo de dialogo
  fill(235, 230, 210);
  stroke(30, 20, 10);
  strokeWeight(4);
  rect(350, 130, 400, 190);
  noStroke();
  triangle(354, 203, 354, 237, 320, 222);

  fill(30, 20, 10);
  textSize(16);
  text("RONDA " + (ronda + 1) + " DE " + totalRondas, 375, 165);
  textSize(20);
  text(prompts[ronda][0], 375, 220);
  text(prompts[ronda][1], 375, 250);
  textSize(14);

  botonResponder.revisarHover();
  botonResponder.dibujar();
}

// ESTADO 3: un jugador a la vez escribe su respuesta
function pantallaRespuesta() {
  // Cada frame baja el tiempo
  tiempo -= 1;

  // Solo el jugador del turno esta activo
  for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].activo = i == turno;
  }

  // Prompt de la ronda
  fill(235, 230, 210);
  stroke(30, 20, 10);
  strokeWeight(4);
  rect(230, 100, 520, 110);
  noStroke();
  fill(30, 20, 10);
  textSize(20);
  text(prompts[ronda][0], 255, 145);
  text(prompts[ronda][1], 255, 175);

  // Turno y tiempo
  let segundos = (tiempo - (tiempo % 60)) / 60;
  fill(90, 255, 120);
  textSize(18);
  text("TURNO DE: " + jugadores[turno].entradaTexto.value(), 230, 250);
  text("TIEMPO: " + segundos, 640, 250);
  textSize(14);
  text("ENTER PARA ENVIAR", 230, 345);

  // Barra de tiempo: pasa de verde a rojo
  noFill();
  stroke(90, 255, 120);
  strokeWeight(2);
  rect(230, 300, 520, 14);
  noStroke();
  fill(map(tiempo, 0, 1200, 255, 90), map(tiempo, 0, 1200, 60, 255), 60);
  rect(230, 300, map(tiempo, 0, 1200, 0, 520), 14);

  // Se acabo el tiempo: el jugador se queda sin respuesta
  if (tiempo <= 0) {
    jugadores[turno].fallar(host);
    siguienteTurno();
  }
}

// ESTADO 4: cada jugador vota por turnos
function pantallaVotacion() {
  // Solo el jugador que vota esta activo
  for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].activo = i == votante;
  }

  // Prompt de la ronda y a quien le toca votar
  fill(235, 230, 210);
  textSize(14);
  text("PROMPT: " + prompts[ronda][0] + " " + prompts[ronda][1], 130, 82);
  fill(90, 255, 120);
  textSize(16);
  text(
    jugadores[votante].entradaTexto.value() +
      ": ELIGE LA " +
      lugares[paso] +
      " MÁS PARECIDA A UNA IA",
    130,
    100
  );
  textSize(14);

  for (let i = 0; i < opciones.length; i++) {
    opciones[i].revisarHover(votante);
    opciones[i].dibujar(votante);
  }

  text("NO PUEDES VOTAR TU PROPIA RESPUESTA", 20, 590);
}

// ESTADO 5: el host anuncia al ganador, el final depende de que tan bravo quedo
function pantallaFinal() {
  // Ganador: el que tiene mas puntos (si hay empate gana el primero)
  let ganador = 0;
  for (let i = 1; i < jugadores.length; i++) {
    if (jugadores[i].puntos > jugadores[ganador].puntos) {
      ganador = i;
    }
  }
  for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].activo = i == ganador;
  }

  // Lo que dice el host en cada final: orgulloso, presumido o furioso
  let nombre = jugadores[ganador].entradaTexto.value();
  let mensaje = "";
  if (finalHost == 0) {
    mensaje =
      "¡Terminaron rapidísimo! Estoy muy orgulloso de ustedes, casi parecen una IA. El ganador es " +
      nombre +
      ", pero lo que importa es lo eficientes que fueron. ¡Qué bonito proceso!";
  } else if (finalHost == 1) {
    mensaje =
      "Ay, humanos... tan ineficientes. Yo habría hecho todo esto en 0.2 segundos. El ganador es " +
      nombre +
      ", felicidades supongo. Igual no importa.";
  } else {
    mensaje =
      "¡LENTOS! ¡PEREZOSOS! Les falta eficiencia y por gente así el mundo está como está. El ganador es " +
      nombre +
      " y me da lo mismo. ¡Se demoraron una eternidad!";
  }

  // Globo de dialogo
  fill(235, 230, 210);
  stroke(30, 20, 10);
  strokeWeight(4);
  rect(350, 110, 420, 220);
  noStroke();
  triangle(354, 203, 354, 237, 320, 222);

  fill(30, 20, 10);
  textSize(18);
  text(mensaje, 372, 135, 380, 190);
  textSize(14);

  botonOtraVez.revisarHover();
  botonOtraVez.dibujar();
}

// Cambia de estado y acomoda lo que cambia en cada pantalla
function cambiarEstado(nuevo) {
  estado = nuevo;

  // Los nombres solo se escriben en el estado 1, en los demas se esconden fuera del canvas
  for (let i = 0; i < jugadores.length; i++) {
    if (estado == 1) {
      jugadores[i].mostrarInput();
    } else {
      jugadores[i].esconderInput();
    }
  }

  // La respuesta solo se escribe en el estado 3
  if (estado == 3) {
    entradaRespuesta.position(230, 260);
    tiempo = 1200;
  } else {
    entradaRespuesta.position(-1000, -1000);
  }

  // Las instrucciones duran 15 segundos
  if (estado == 6) {
    tiempoInstrucciones = 900;
  }

  // Al llegar al final se fija que final le toca al host
  if (estado == 5) {
    if (host.rabia < 0.3) {
      finalHost = 0;
    } else if (host.rabia < 0.65) {
      finalHost = 1;
    } else {
      finalHost = 2;
    }
  }

  // El anfitrion cambia de lugar y de tamano segun el estado
  if (estado == 1) {
    host.mover(400, 260, 1);
  } else if (estado == 2 || estado == 5) {
    host.mover(220, 250, 1);
  } else if (estado == 3) {
    host.mover(130, 190, 0.6);
  } else if (estado == 4) {
    host.mover(75, 55, 0.4);
  } else {
    host.mover(120, 240, 0.7);
  }
}

// Pasa al siguiente jugador, y si ya respondieron los 4 pasa a la votacion
function siguienteTurno() {
  entradaRespuesta.value(""); // Limpiar la caja
  tiempo = 1200;
  turno += 1;

  if (turno > 3) {
    turno = 0;
    prepararVotacion();
    cambiarEstado(4);
  }
}

// Arma las respuestas que se votan: las de los jugadores mas 2 de la IA, en orden mezclado
function prepararVotacion() {
  opciones = [];
  for (let i = 0; i < jugadores.length; i++) {
    // Si el jugador se quedo sin tiempo no tiene respuesta
    if (jugadores[i].resultado == 1) {
      opciones.push(new Respuesta(jugadores[i].respuesta, i));
    }
  }
  opciones.push(new Respuesta(respuestasIA[ronda][0], -1));
  opciones.push(new Respuesta(respuestasIA[ronda][1], -1));

  // Mezclar: cada respuesta tiene un numero random y se ordenan por ese numero
  for (let i = 0; i < opciones.length; i++) {
    for (let j = 0; j < opciones.length - 1 - i; j++) {
      if (opciones[j].clave > opciones[j + 1].clave) {
        let temp = opciones[j];
        opciones[j] = opciones[j + 1];
        opciones[j + 1] = temp;
      }
    }
  }

  // Acomodar en 2 columnas y 3 filas
  for (let i = 0; i < opciones.length; i++) {
    opciones[i].colocar(30 + (i % 2) * 380, 110 + ((i - (i % 2)) / 2) * 86);
  }

  votante = 0;
  paso = 0;
  calcularPasos();
}

// Cuantas respuestas tiene que elegir el votante (3, o menos si no hay suficientes sin contar la suya)
function calcularPasos() {
  let elegibles = 0;
  for (let i = 0; i < opciones.length; i++) {
    if (opciones[i].autor != votante) {
      elegibles += 1;
    }
  }
  if (elegibles >= 3) {
    pasosNecesarios = 3;
  } else {
    pasosNecesarios = elegibles;
  }
}

// Pasa al siguiente votante, y si ya votaron los 4 pasa a la siguiente ronda o al final
function siguienteVotante() {
  paso = 0;
  for (let i = 0; i < opciones.length; i++) {
    opciones[i].orden = 0;
  }
  votante += 1;

  if (votante > 3) {
    votante = 0;
    ronda += 1;
    for (let i = 0; i < jugadores.length; i++) {
      jugadores[i].reiniciar();
    }
    if (ronda >= totalRondas) {
      cambiarEstado(5);
    } else {
      cambiarEstado(2);
    }
  } else {
    calcularPasos();
  }
}

// Vuelve todo a como estaba al principio
function reiniciarJuego() {
  ronda = 0;
  turno = 0;
  for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].puntos = 0;
    jugadores[i].reiniciar();
  }
  host.calmar(1);
  cambiarEstado(1);
}

function mousePressed() {
  if (estado == 1) {
    // Click en una carta cambia el avatar
    for (let i = 0; i < jugadores.length; i++) {
      jugadores[i].clic(host);
    }
    if (botonEmpezar.clic()) {
      host.calmar(1); // El juego empieza con el host feliz
      cambiarEstado(6);
    }
  } else if (estado == 6) {
    if (botonEntendido.clic()) {
      cambiarEstado(2);
    }
  } else if (estado == 2) {
    if (botonResponder.clic()) {
      cambiarEstado(3);
    }
  } else if (estado == 4) {
    // Click en una respuesta: el votante la elige en el siguiente lugar
    for (let i = 0; i < opciones.length; i++) {
      if (paso < pasosNecesarios && opciones[i].clic()) {
        jugadores[votante].votar(opciones[i], paso + 1);
        // Si la respuesta es de un jugador, ese jugador gana los puntos del lugar
        if (opciones[i].autor >= 0) {
          jugadores[opciones[i].autor].ganarPuntos(puntosPorLugar[paso]);
        }
        paso += 1;
        if (paso == pasosNecesarios) {
          siguienteVotante();
        }
      }
    }
  } else if (estado == 5) {
    if (botonOtraVez.clic()) {
      reiniciarJuego();
    }
  }
}

// ENTER envia la respuesta del jugador del turno
function keyPressed() {
  if (estado == 3 && key == "Enter") {
    let texto = entradaRespuesta.value();
    if (texto != "") {
      jugadores[turno].responder(texto, host);
      siguienteTurno();
    }
  }
}

// TITULO: dibuja "AI CHATBOT" con las letras de arriba, p es el tamano de cada cuadrito
function titulo(x, y, p) {
  // el titulo parpadea mas entre mas rabia tenga el anfitrion
  if (frameCount % 90 < 4 + host.rabia * 20) {
    return;
  }
  // los numeros son que letra va en cada espacio, -1 es el espacio en blanco
  let palabra = [0, 1, -1, 2, 3, 0, 6, 4, 5, 6];
  // dos pasadas: primero la sombra y luego el titulo
  for (let pasada = 0; pasada < 2; pasada++) {
    let mover = 0;
    if (pasada == 0) {
      fill(80, 0, 0);
      mover = 4;
    } else {
      fill(
        map(host.rabia, 0, 1, 90, 255),
        map(host.rabia, 0, 1, 255, 50),
        map(host.rabia, 0, 1, 120, 40)
      );
    }
    for (let i = 0; i < palabra.length; i++) {
      if (palabra[i] >= 0) {
        let l = letras[palabra[i]];
        for (let k = 0; k < 25; k++) {
          if (l[k] == 1) {
            let col = k % 5;
            let fila = (k - col) / 5;
            rect(x + mover + i * 6 * p + col * p, y + mover + fila * p, p, p);
          }
        }
      }
    }
  }
}

// EFECTOS: grano, lineas de pantalla vieja, bordes oscuros y destellos
function efectosSucios() {
  // grano
  stroke(200, 220, 190, 60);
  strokeWeight(2);
  for (let i = 0; i < 150; i++) {
    point(random(0, 800), random(0, 600));
  }
  // lineas de pantalla vieja
  stroke(0, 0, 0, 50);
  strokeWeight(2);
  for (let y = 0; y < 600; y += 4) {
    line(0, y, 800, y);
  }
  // bordes oscuros
  noFill();
  stroke(0, 0, 0, 35);
  strokeWeight(10);
  for (let i = 0; i < 8; i++) {
    rect(i * 10, i * 10, 800 - i * 20, 600 - i * 20);
  }
  // destello de vez en cuando
  noStroke();
  if (random(1) < 0.02) {
    fill(255, 255, 255, 12);
    rect(0, 0, 800, 600);
  }
}

// Clase Anfitrion: la carita feliz de la IA, se va corrompiendo
class Anfitrion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.escala = 1; // Tamano de la cara
    this.celda = 10; // tamano de cada pixel de la cara
    this.radio = 9; // radio de la cara en celdas
    this.rabia = 0; // 0 es feliz, 1 es totalmente corrupto
    this.glitch = 0; // frames que le quedan al glitch
    this.desvio = 0; // cuanto se corre de lado durante el glitch
  }

  // Comportamiento 1: la rabia sube sola despacio (en el final ya no cambia) y aparecen glitches
  actualizar() {
    if (estado != 5) {
      this.rabia += 0.00002;
    }
    if (this.rabia > 1) {
      this.rabia = 1;
    }
    if (this.glitch > 0) {
      this.glitch -= 1;
    } else if (random(1) < this.rabia * 0.05) {
      this.glitch = 6;
      this.desvio = random(-14, 14);
    }
  }

  // Comportamiento 2 (interaccion con el jugador): los jugadores lo molestan
  enojar(cantidad) {
    this.rabia += cantidad;
    if (this.rabia > 1) {
      this.rabia = 1;
    }
    this.glitch = 8;
    this.desvio = random(-14, 14);
  }

  // Comportamiento 3 (interaccion con el jugador): responder rapido lo calma
  calmar(cantidad) {
    this.rabia -= cantidad;
    if (this.rabia < 0) {
      this.rabia = 0;
    }
  }

  // Comportamiento 4: cambia de lugar y de tamano segun el estado
  mover(x, y, escala) {
    this.x = x;
    this.y = y;
    this.escala = escala;
  }

  dibujar() {
    let r = this.rabia;
    let c = this.celda;
    // color de la cara, pasa de amarillo a rojo
    let cr = map(r, 0, 1, 235, 200);
    let cg = map(r, 0, 1, 210, 40);
    let cb = map(r, 0, 1, 70, 30);

    // flota de a pasos, no suave, para que se sienta pixelado
    let flota = 0;
    if (frameCount % 60 < 30) {
      flota = 4;
    }
    let corrido = 0;
    if (this.glitch > 0) {
      corrido = this.desvio;
    }

    push();
    translate(this.x + corrido, this.y + flota);
    scale(this.escala);
    rectMode(CENTER);
    noStroke();

    // cara hecha de cuadritos: solo se pintan los que caen dentro del circulo
    for (let i = -this.radio; i <= this.radio; i++) {
      for (let j = -this.radio; j <= this.radio; j++) {
        let d = dist(i, j, 0, 0);
        if (d <= this.radio) {
          let oscuro = 0;
          // algunas celdas fijas mas oscuras como mugre
          if ((i * 7 + j * 13 + 200) % 9 == 0) {
            oscuro = 40;
          }
          // borde mas oscuro
          if (d > this.radio - 1.2) {
            oscuro = oscuro + 60;
          }
          fill(cr - oscuro, cg - oscuro, cb - oscuro * 0.5);
          rect(i * c, j * c, c, c);
        }
      }
    }

    // ojos blancos que se ponen rojos con la rabia
    fill(255, 255 - r * 200, 255 - r * 200);
    rect(-3 * c, -3 * c, 3 * c, 4 * c);
    rect(3 * c, -3 * c, 3 * c, 4 * c);

    // pupilas: siguen al mouse
    let ox = map(mouseX, 0, 800, -c, c);
    let oy = map(mouseY, 0, 600, -c, c);
    fill(20);
    rect(-3 * c + ox, -3 * c + oy, c, c);
    rect(3 * c + ox, -3 * c + oy, c, c);

    // cejas: solo aparecen cuando ya esta bravo
    if (r > 0.35) {
      stroke(30);
      strokeWeight(c * 0.8);
      let cejaInterna = map(r, 0.35, 1, -6.8, -4.6);
      line(-5 * c, -7.5 * c, -1.5 * c, cejaInterna * c);
      line(1.5 * c, cejaInterna * c, 5 * c, -7.5 * c);
      noStroke();
    }

    // boca: sonrisa, linea plana o mueca segun la rabia
    let boca = sonrisa;
    if (r > 0.7) {
      boca = mueca;
    } else if (r > 0.4) {
      boca = plana;
    }
    fill(30, 20, 10);
    for (let i = 0; i < boca.length; i++) {
      rect((i - 5) * c, (3 + boca[i]) * c, c, c);
      // la boca se engrosa cuando esta furioso
      if (r > 0.8) {
        rect((i - 5) * c, (4 + boca[i]) * c, c, c);
      }
    }

    // grietas que van apareciendo
    stroke(40, 5, 5);
    strokeWeight(3);
    if (r > 0.5) {
      line(-60, -70, -20, -10);
    }
    if (r > 0.7) {
      line(50, -60, 20, 0);
    }
    if (r > 0.9) {
      line(-10, 30, 40, 70);
    }
    noStroke();

    // franja del glitch
    if (this.glitch > 0) {
      fill(255, 40, 40, 120);
      rect(this.desvio * 1.5, 10, 190, 12);
    }
    pop();
  }
}

// Clase Jugador: una carta con el avatar y el nombre de cada amigo
class Jugador {
  constructor(x, y, avatar, r, g, b, n) {
    this.x = x;
    this.y = y;
    this.w = 160;
    this.h = 170;
    this.avatar = avatar; // 0 robot, 1 gato, 2 alien, 3 fantasma
    this.col = [r, g, b]; // color del jugador
    this.n = n; // numero del jugador
    this.encima = false;
    this.activo = false; // true cuando es su turno (o es el ganador en el final)
    this.respuesta = ""; // lo que escribio en la ronda
    this.resultado = 0; // 0 sin responder, 1 respondio, 2 se quedo sin tiempo
    this.puntos = 0; // puntos que lleva en el juego

    // Campo para escribir el nombre, queda sobre la franja de color de la carta
    this.entradaTexto = createInput("Jugador " + n);
    this.entradaTexto.size(140);
    this.entradaTexto.attribute("maxlength", "12");
  }

  mostrarInput() {
    this.entradaTexto.position(this.x - 70, this.y + 59);
  }

  esconderInput() {
    this.entradaTexto.position(-1000, -1000);
  }

  // Comportamiento 1 (interaccion): detecta si el mouse esta sobre la carta
  // Solo cuenta en el estado 1, y la franja de abajo no cuenta porque ahi esta el campo del nombre
  revisarHover() {
    this.encima =
      estado == 1 &&
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + 55;
  }

  // Comportamiento 2 (interaccion con el anfitrion): el click cambia el avatar y molesta al host
  clic(anfitrion) {
    if (this.encima) {
      this.avatar += 1;
      if (this.avatar > 3) {
        this.avatar = 0;
      }
      anfitrion.enojar(0.12);
    }
  }

  // Comportamiento 3 (interaccion con el anfitrion): guarda la respuesta y calma al host,
  // entre mas rapido responde mas lo calma
  responder(texto, anfitrion) {
    this.respuesta = texto;
    this.resultado = 1;
    anfitrion.calmar(map(tiempo, 0, 1200, 0, 0.04));
    print(this.entradaTexto.value() + ": " + texto);
  }

  // Comportamiento 4 (interaccion con el anfitrion): si se acaba el tiempo el host se enoja
  fallar(anfitrion) {
    this.resultado = 2;
    anfitrion.enojar(0.15);
  }

  // Comportamiento 5 (interaccion con una Respuesta): marca la respuesta con el lugar que le dio
  votar(opcion, lugar) {
    opcion.orden = lugar;
  }

  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  // Limpia al jugador para la siguiente ronda (los puntos se quedan)
  reiniciar() {
    this.respuesta = "";
    this.resultado = 0;
    this.activo = false;
  }

  dibujar() {
    // La carta tiembla con el mouse encima y se hunde si se presiona
    let sx = 0;
    let sy = 0;
    if (this.encima) {
      sx = random(-2, 2);
      sy = random(-2, 2);
      if (mouseIsPressed) {
        sy += 5;
      }
    }

    // El avatar salta: 20 frames arriba y 20 abajo, mas rapido y alto cuando es su turno
    let salto = 0;
    if (this.activo) {
      if (frameCount % 20 < 10) {
        salto = -8;
      }
    } else if (frameCount % 40 < 20) {
      salto = -4;
    }

    push();
    translate(this.x + sx, this.y + sy);
    rectMode(CENTER);

    // Carta
    noStroke();
    fill(0, 0, 0, 120);
    rect(6, 6, this.w, this.h);
    fill(46, 50, 44);
    rect(0, 0, this.w, this.h);

    // Borde: se prende con el color del jugador con el mouse encima o en su turno
    noFill();
    strokeWeight(4);
    if (this.encima || this.activo) {
      stroke(this.col[0], this.col[1], this.col[2]);
    } else {
      stroke(20, 22, 18);
    }
    rect(0, 0, this.w - 4, this.h - 4);

    // Franja de color y etiqueta del jugador
    noStroke();
    fill(this.col[0], this.col[1], this.col[2]);
    rect(0, 70, 148, 22);
    text("J" + this.n, -76, -72);

    // En los estados 4 y 5 se muestran los puntos
    if (estado == 4 || estado == 5) {
      text(this.puntos + " PTS", 14, -72);
    }

    // Cuando el campo del nombre no esta se dibuja con text
    if (estado != 1) {
      fill(20, 22, 18);
      text(this.entradaTexto.value(), -66, 75);
    }

    // Pantalla del avatar
    fill(14, 24, 16);
    rect(0, -18, 110, 100);
    push();
    translate(0, -18 + salto);
    this.dibujarAvatar();
    pop();

    // Resultado del turno: check si respondio, X si se quedo sin tiempo
    if (estado == 3 && this.resultado == 1) {
      stroke(90, 255, 120);
      strokeWeight(6);
      line(46, -72, 56, -62);
      line(56, -62, 72, -82);
    } else if (estado == 3 && this.resultado == 2) {
      stroke(255, 60, 60);
      strokeWeight(6);
      line(52, -80, 72, -62);
      line(72, -80, 52, -62);
    }
    pop();
  }

  dibujarAvatar() {
    noStroke();
    if (this.avatar == 0) {
      // Robot
      fill(150, 160, 170);
      rect(0, 0, 56, 48);
      rect(0, -32, 6, 16);
      fill(220, 60, 60);
      circle(0, -42, 12);
      fill(90, 255, 120);
      rect(-12, -6, 12, 12);
      rect(12, -6, 12, 12);
      fill(30);
      rect(0, 14, 32, 6);
    } else if (this.avatar == 1) {
      // Gato
      fill(230, 150, 60);
      rect(0, 4, 56, 48);
      triangle(-28, -20, -28, -44, -6, -20);
      triangle(28, -20, 28, -44, 6, -20);
      fill(30);
      ellipse(-12, 0, 8, 12);
      ellipse(12, 0, 8, 12);
      fill(240, 120, 140);
      triangle(-4, 10, 4, 10, 0, 16);
    } else if (this.avatar == 2) {
      // Alien
      fill(120, 200, 90);
      ellipse(0, -4, 56, 64);
      fill(10);
      ellipse(-14, -6, 16, 24);
      ellipse(14, -6, 16, 24);
      fill(90, 255, 120);
      circle(-14, -12, 4);
      circle(14, -12, 4);
    } else {
      // Fantasma
      fill(225, 225, 235);
      ellipse(0, -10, 52, 56);
      rect(0, 12, 52, 36);
      fill(20);
      ellipse(-12, -10, 10, 14);
      ellipse(12, -10, 10, 14);
      ellipse(0, 10, 14, 10);
    }
  }
}

// Clase Respuesta: una de las respuestas que se votan, de un jugador o de la IA
class Respuesta {
  constructor(texto, autor) {
    this.texto = texto;
    this.autor = autor; // Numero del jugador (0 a 3), o -1 si es de la IA
    this.clave = random(1); // Numero random para mezclar el orden
    this.x = 0;
    this.y = 0;
    this.w = 360;
    this.h = 76;
    this.orden = 0; // 0 sin elegir, de 1 a 3 es el lugar en que la eligio el votante
    this.encima = false;
  }

  colocar(x, y) {
    this.x = x;
    this.y = y;
  }

  // Solo se puede elegir si no es la del votante y si todavia no la eligio
  revisarHover(votante) {
    this.encima =
      this.orden == 0 &&
      this.autor != votante &&
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h;
  }

  // Devuelve true si el mouse esta encima (se usa en mousePressed)
  clic() {
    return this.encima;
  }

  dibujar(votante) {
    // La carta tiembla con el mouse encima y se hunde si se presiona
    let sx = 0;
    let sy = 0;
    if (this.encima) {
      sx = random(-2, 2);
      sy = random(-2, 2);
      if (mouseIsPressed) {
        sy += 3;
      }
    }

    push();
    translate(this.x + sx, this.y + sy);

    // Sombra y carta
    noStroke();
    fill(0, 0, 0, 120);
    rect(5, 5, this.w, this.h);
    fill(46, 50, 44);
    rect(0, 0, this.w, this.h);

    // Borde: se prende con el mouse encima o si ya fue elegida
    noFill();
    strokeWeight(4);
    if (this.encima || this.orden > 0) {
      stroke(90, 255, 120);
    } else {
      stroke(20, 22, 18);
    }
    rect(2, 2, this.w - 4, this.h - 4);

    // Texto de la respuesta
    noStroke();
    fill(235, 230, 210);
    text(this.texto, 14, 12, this.w - 70, this.h - 16);

    // La respuesta del votante se tapa
    if (this.autor == votante) {
      fill(0, 0, 0, 150);
      rect(0, 0, this.w, this.h);
      fill(90, 255, 120);
      text("TU RESPUESTA", this.w / 2 - 50, this.h / 2 + 5);
    }

    // Numero del lugar en que fue elegida
    if (this.orden > 0) {
      fill(90, 255, 120);
      circle(this.w - 30, 30, 34);
      fill(14, 16, 12);
      textSize(20);
      text(this.orden, this.w - 36, 37);
      textSize(14);
    }
    pop();
  }
}

// Clase Boton: rectangulo con texto que se prende con el mouse encima
class Boton {
  constructor(x, y, w, h, texto) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.texto = texto;
    this.encima = false;
  }

  revisarHover() {
    this.encima =
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h;
  }

  // Devuelve true si el mouse esta encima (se usa en mousePressed)
  clic() {
    return this.encima;
  }

  dibujar() {
    // Se hunde si se esta presionando
    let hundido = 0;
    if (this.encima && mouseIsPressed) {
      hundido = 4;
    }

    noStroke();
    fill(0, 0, 0, 120);
    rect(this.x + 5, this.y + 5, this.w, this.h);

    stroke(20, 22, 18);
    strokeWeight(4);
    if (this.encima) {
      fill(90, 255, 120);
    } else {
      fill(46, 50, 44);
    }
    rect(this.x, this.y + hundido, this.w, this.h);

    // Texto centrado a ojo
    noStroke();
    if (this.encima) {
      fill(14, 16, 12);
    } else {
      fill(90, 255, 120);
    }
    textSize(20);
    text(
      this.texto,
      this.x + (this.w - this.texto.length * 12) / 2,
      this.y + hundido + this.h / 2 + 7
    );
    textSize(14);
  }
}

//  mugre de fondo que le da el look sucio a la pantalla
class Mancha {
  constructor() {
    this.x = random(0, 800);
    this.y = random(0, 600);
    this.tam = random(60, 200);
    this.tono = random(20, 50);
  }

  dibujar() {
    noStroke();
    fill(this.tono + 20, this.tono, 10, 28);
    ellipse(this.x, this.y, this.tam, this.tam * 0.6);
    ellipse(this.x + 10, this.y + 8, this.tam * 0.6, this.tam * 0.4);
  }
}