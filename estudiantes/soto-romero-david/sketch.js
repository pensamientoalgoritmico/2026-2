/**
 * Título: Fuera de la Ruta 
 * Autor: David Santiago Soto Romero
 *
 * INTERPRETACIÓN:
 * Juego de estética retro inspirado en Game Boy Advance (GBA) que simboliza la
 * diferencia entre dejarse llevar por el piloto automático y mantener el control
 * de las propias decisiones. Tras 10 segundos de inactividad, el entorno pasa a
 * escala de grises, suena 'miguel-ohara.mp3' y el personaje entra en Modo IA
 * explorando de forma autónoma y aleatoria los escenarios. Para recuperar el
 * control se debe presionar 'E' 6 veces y, al lograr zafarse 3 veces, aparece un
 * mensaje inspirador que recuerda que la IA debe ser manejada por la persona y no
 * tomar decisiones ni el control por ella.
 *
 * FUNCIONALIDADES:
 * - Lienzo de 800x800px con noSmooth() y retícula de 80px (10x10 celdas).
 * - Máquina de estados: "CONTROLES" (inicio, avanza con 'C'), "MENU" (pantalla
 *   de carga y botones Start, Options, Music y Exit), "JUGANDO", "PAUSA" ('F'
 *   para pausar, 'X' para reanudar) y "APAGADO" ('ESC' para apagar, 'Q' para
 *   encender y 'ENTER' para volver al menú).
 * - Navegación multidireccional entre 6 escenarios ('escenario-1.png' a
 *   'escenario-6.png').
 * - Movimiento con WASD, animaciones por dirección y colisiones sólidas.
 * - Bolsa interactiva con 'Z' en el escenario 1 ('bolsa-cerrada.png' /
 *   'bolsa-abierta.png'), 'casa-1.png' en el escenario 3 y dos 'casa-2.png' en
 *   el escenario 2, todas con colisión sólida.
 * - Control de audio con p5.sound ('M' para alternar 'Annihilate.mp3',
 *   userStartAudio() y getAudioContext() para desbloquear audio, y cambio a
 *   'miguel-ohara.mp3' en Modo IA).
 * - Modo IA por inactividad (10s): filtro GRAY, bloques aleatorios de máximo 15
 *   pasos por los escenarios, salida con 'E' 6 veces y mensaje inspirador al
 *   escapar 3 veces.
 *
 * REFERENCIAS:
 * - Librerías: p5.js y p5.sound.
 * - Recursos en carpeta JUGADOR/: 'controles.png', 'pausa.png',
 *   'pantalla-de-carga.png', 'start.png', 'options.png', 'music.png',
 *   'exit.png', 'escenario-1.png' a 'escenario-6.png', 'casa-1.png',
 *   'casa-2.png', 'bolsa-cerrada.png', 'bolsa-abierta.png', sprites del
 *   jugador, 'Annihilate.mp3' y 'miguel-ohara.mp3'.
 * - Inspiración: Estética portátil GBA y reflexión sobre el uso consciente
 *   de la inteligencia artificial.
 */

let GRID_SIZE = 80; // 10x10 celdas de 80x80px en un lienzo de 800x800px
let jugador;
let bolsa;

// Objetos de casas en los escenarios
let casa1Esc3;
let casa2Esc2Izq;
let casa2Esc2Der;

// El juego inicia directamente en la pantalla de CONTROLES
let estadoJuego = "CONTROLES"; 
let escenarioActual = 1;

// Pantallas e Interfaz
let imgPantallaCarga;
let imgPausa;
let imgControles;
let imgBotonStar;
let imgBotonOptions;
let imgBotonMusic;
let imgBotonExit;

// Escenarios
let imgEscenario1;
let imgEscenario2;
let imgEscenario3;
let imgEscenario4;
let imgEscenario5;
let imgEscenario6;

// Casas y Objetos
let imgCasa1;
let imgCasa2;
let imgBolsaCerrada;
let imgBolsaAbierta;

// Animaciones del Jugador
let animIzquierda = []; 
let animArriba = [];    
let animDerecha = [];   
let animAbajo = [];     

// Control de Música
let cancionNormal;
let cancionIA;
let musicaActiva = false;

// Variables para el Modo IA por inactividad
let ultimoTiempoActividad = 0;
let tiempoLimiteInactividad = 10000; // 10 segundos
let modoIAActivo = false;
let contadorTeclaE = 0;
let golpesNecesariosIA = 6; // Lucha de 6 pulsaciones de 'E'
let pasosRestantesIA = 0;
let direccionIA = 0; // 0: Abajo, 1: Izquierda, 2: Arriba, 3: Derecha
let temporizadorIA = 0;

// Variables para el mensaje inspirador tras escapar 3 veces del Modo IA
let vecesEscapadoIA = 0;
let mostrarMensajeInspirador = false;
let mensajeInspiradorTexto =
  "La IA es una herramienta, no tu piloto.\n" +
  "No dejes que tome el control ni decida por ti:\n" +
  "tú eres quien la maneja y tú tomas tus propias decisiones.";

async function setup() {
  createCanvas(800, 800);
  noSmooth(); 
  outputVolume(1.0);

  // Carga de pantallas y botones
  imgPantallaCarga = await loadImage('JUGADOR/pantalla-de-carga.png');
  imgPausa = await loadImage('JUGADOR/pausa.png');
  imgControles = await loadImage('JUGADOR/controles.png');
  imgBotonStar = await loadImage('JUGADOR/start.png');
  imgBotonOptions = await loadImage('JUGADOR/options.png');
  imgBotonMusic = await loadImage('JUGADOR/music.png');
  imgBotonExit = await loadImage('JUGADOR/exit.png');

  // Carga de los 6 escenarios
  imgEscenario1 = await loadImage('JUGADOR/escenario-1.png');
  imgEscenario2 = await loadImage('JUGADOR/escenario-2.png');
  imgEscenario3 = await loadImage('JUGADOR/escenario-3.png');
  imgEscenario4 = await loadImage('JUGADOR/escenario-4.png');
  imgEscenario5 = await loadImage('JUGADOR/escenario-5.png');
  imgEscenario6 = await loadImage('JUGADOR/escenario-6.png');

  // Carga de casas y objetos
  imgCasa1 = await loadImage('JUGADOR/casa-1.png');
  imgCasa2 = await loadImage('JUGADOR/casa-2.png');
  imgBolsaCerrada = await loadImage('JUGADOR/bolsa-cerrada.png');
  imgBolsaAbierta = await loadImage('JUGADOR/bolsa-abierta.png');

  // Carga de sprites del jugador
  animIzquierda[0] = await loadImage('JUGADOR/jugador-1-1.png');
  animIzquierda[1] = await loadImage('JUGADOR/jugador-1-2.png');
  animIzquierda[2] = await loadImage('JUGADOR/jugador-1-3.png');

  animArriba[0] = await loadImage('JUGADOR/jugador-2-3.png');
  animArriba[1] = await loadImage('JUGADOR/jugador-2-1.png');
  animArriba[2] = await loadImage('JUGADOR/jugador-2-2.png');

  animDerecha[0] = await loadImage('JUGADOR/jugador-3-3.png');
  animDerecha[1] = await loadImage('JUGADOR/jugador-3-1.png');
  animDerecha[2] = await loadImage('JUGADOR/jugador-3-2.png');

  animAbajo[0] = await loadImage('JUGADOR/jugador-4-1.png');
  animAbajo[1] = await loadImage('JUGADOR/jugador-4-2.png');
  animAbajo[2] = await loadImage('JUGADOR/jugador-4-3.png');

  // Carga segura de la canción principal
  try {
    cancionNormal = loadSound('JUGADOR/Annihilate.mp3', () => {
      console.log("Canción principal cargada correctamente.");
    }, (err) => {
      console.log("Aviso: No se pudo cargar Annihilate.mp3.", err);
    });
  } catch (e) {
    console.log("Excepción al cargar Annihilate.mp3.");
  }

  // Carga segura de la canción del Modo IA
  try {
    cancionIA = loadSound('JUGADOR/miguel-ohara.mp3', () => {
      console.log("Canción del Modo IA cargada.");
    });
  } catch (e) {
    console.log("Error cargando canción del Modo IA.");
  }

  // Instanciación de entidades (cuadrícula 10x10 de 80x80px)
  jugador = new Player(2, 7);
  bolsa = new Bolsa(5, 7);

  // Casa 1 en el escenario 3: ampliada a 5x5 para cubrir lo negro abajo y a su izquierda
  casa1Esc3 = new Casa(imgCasa1, 1, 0, 5, 5);

  // Dos casas de tipo casa-2 en el escenario 2: alargadas verticalmente (4x5 desde gy = 0) para cubrir arriba y abajo
  casa2Esc2Izq = new Casa(imgCasa2, 1, 0, 4, 5);
  casa2Esc2Der = new Casa(imgCasa2, 5, 0, 4, 5);
  
  ultimoTiempoActividad = millis();
}

function draw() {
  background(20);

  if (estadoJuego === "CONTROLES") {
    if (imgControles) {
      image(imgControles, 0, 0, width, height);
    }
    
    fill(255);
    noStroke();
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text("Presiona 'C' para continuar", width / 2, height - 15);
    
    ultimoTiempoActividad = millis();

  } else if (estadoJuego === "MENU") {
    if (imgPantallaCarga) {
      image(imgPantallaCarga, 0, 0, width, height);
    }

    // Cada botón encaja dentro de uno de los 4 recuadros blancos del fondo
    let bWidth = 264;
    let bHeight = 88;
    let bX = (width - bWidth) / 2; // Centrado exacto en X (268px)
    let yInicio = 350;
    let separacion = 100; // 100px entre cada uno de los 4 cuadros

    if (imgBotonStar) image(imgBotonStar, bX, yInicio, bWidth, bHeight);
    if (imgBotonOptions) image(imgBotonOptions, bX, yInicio + separacion, bWidth, bHeight);
    if (imgBotonMusic) image(imgBotonMusic, bX, yInicio + separacion * 2, bWidth, bHeight);
    if (imgBotonExit) image(imgBotonExit, bX, yInicio + separacion * 3, bWidth, bHeight);

    ultimoTiempoActividad = millis();

  } else if (estadoJuego === "PAUSA") {
    if (imgPausa) {
      image(imgPausa, 0, 0, width, height);
    }
    ultimoTiempoActividad = millis();

  } else if (estadoJuego === "JUGANDO") {
    
    // --- LÓGICA DE DETECCIÓN Y CAMBIO AL MODO IA ---
    if (mostrarMensajeInspirador) {
      ultimoTiempoActividad = millis();
    } else if (!modoIAActivo) {
      if (millis() - ultimoTiempoActividad > tiempoLimiteInactividad) {
        modoIAActivo = true;
        contadorTeclaE = 0;
        pasosRestantesIA = 0;
        elegirNuevaRutaIA();

        if (cancionNormal && cancionNormal.isPlaying()) {
          cancionNormal.pause();
        }
        if (cancionIA && cancionIA.isLoaded()) {
          cancionIA.loop();
        }
      }
    } else {
      if (millis() - temporizadorIA > 180) {
        ejecutarMovimientoIA();
        temporizadorIA = millis();
      }
    }

    // Renderizar escenario activo (1 al 6)
    let imgFondoActual;
    if (escenarioActual === 1) imgFondoActual = imgEscenario1;
    else if (escenarioActual === 2) imgFondoActual = imgEscenario2;
    else if (escenarioActual === 3) imgFondoActual = imgEscenario3;
    else if (escenarioActual === 4) imgFondoActual = imgEscenario4;
    else if (escenarioActual === 5) imgFondoActual = imgEscenario5;
    else if (escenarioActual === 6) imgFondoActual = imgEscenario6;

    if (imgFondoActual) {
      image(imgFondoActual, 0, 0, width, height);
    }
    
    drawGridGuides();

    // Dibujar objetos y casas según el escenario actual
    if (escenarioActual === 1) {
      bolsa.display();
    } else if (escenarioActual === 2) {
      casa2Esc2Izq.display();
      casa2Esc2Der.display();
    } else if (escenarioActual === 3) {
      casa1Esc3.display();
    }

    jugador.display();

    // Filtro visual e interfaz según el modo activo
    if (modoIAActivo) {
      filter(GRAY); 
      
      fill(255, 0, 0);
      noStroke();
      textSize(18);
      textAlign(CENTER, TOP);
      text(`MODO IA ACTIVADO - LUCHA CON 'E' (${contadorTeclaE}/${golpesNecesariosIA})`, width / 2, 18);
    } else {
      fill(255);
      noStroke();
      textSize(14);
      textAlign(LEFT, TOP);
      text(`Escenario: ${escenarioActual} | Escapes IA: ${vecesEscapadoIA}/3 | ${musicaActiva ? "Música: ON ('M')" : "Música: OFF ('M')"} | Pausa ('F')`, 20, 15);
    }

    // Recuadro con mensaje inspirador al escapar 3 veces del Modo IA
    if (mostrarMensajeInspirador) {
      dibujarMensajeInspirador();
    }

  } else if (estadoJuego === "APAGADO") {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Juego Apagado.\nPresiona 'Q' para encender o 'ENTER' para el menú.", width / 2, height / 2);
    ultimoTiempoActividad = millis();
  }
}

// Dibuja el recuadro inspirador al lograr zafarse 3 veces del Modo IA
function dibujarMensajeInspirador() {
  push();
  fill(0, 0, 0, 185);
  noStroke();
  rect(0, 0, width, height);

  let boxW = 680;
  let boxH = 260;
  let boxX = (width - boxW) / 2;
  let boxY = (height - boxH) / 2;

  fill(22, 14, 42);
  stroke(168, 255, 96);
  strokeWeight(4);
  rect(boxX, boxY, boxW, boxH, 12);

  fill(255, 232, 102);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text("¡TOMASTE EL CONTROL (3/3 ESCAPES)!", width / 2, boxY + 24);

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(mensajeInspiradorTexto, width / 2, boxY + 132);

  fill(168, 255, 96);
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text("Presiona 'C' o 'ENTER' para seguir jugando", width / 2, boxY + boxH - 18);
  pop();
}

// Elige una dirección aleatoria y un bloque de entre 1 y 15 movimientos máximo
function elegirNuevaRutaIA() {
  direccionIA = floor(random(4));
  pasosRestantesIA = floor(random(1, 16)); // Máximo 15 pasos por bloque
}

// Movimiento autónomo aleatorio de la IA por todos los escenarios
function ejecutarMovimientoIA() {
  if (pasosRestantesIA <= 0) {
    elegirNuevaRutaIA();
  }

  let prevGx = jugador.gx;
  let prevGy = jugador.gy;
  let prevEsc = escenarioActual;

  if (direccionIA === 0) jugador.move(0, 1, animAbajo);
  else if (direccionIA === 1) jugador.move(-1, 0, animIzquierda);
  else if (direccionIA === 2) jugador.move(0, -1, animArriba);
  else if (direccionIA === 3) jugador.move(1, 0, animDerecha);

  // Si la IA chocó con un borde sin salida o con una casa, cambia de rumbo inmediatamente
  if (jugador.gx === prevGx && jugador.gy === prevGy && escenarioActual === prevEsc) {
    elegirNuevaRutaIA();
  } else {
    pasosRestantesIA--;
  }
}

function drawGridGuides() {
  stroke(220, 220, 215, 60);
  strokeWeight(1);
  for (let x = 0; x < width; x += GRID_SIZE) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += GRID_SIZE) {
    line(0, y, width, y);
  }
}

function keyPressed() {
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }

  if (estadoJuego === "JUGANDO") {
    if (mostrarMensajeInspirador) {
      if (key === 'c' || key === 'C' || keyCode === ENTER || key === 'Enter') {
        mostrarMensajeInspirador = false;
        ultimoTiempoActividad = millis();
      }
      return;
    }

    // Lucha contra el Modo IA: requiere presionar 'E' 6 veces seguidas
    if (modoIAActivo) {
      if (key === 'e' || key === 'E') {
        contadorTeclaE++;
        if (contadorTeclaE >= golpesNecesariosIA) {
          modoIAActivo = false;
          contadorTeclaE = 0;
          vecesEscapadoIA++;
          ultimoTiempoActividad = millis();

          if (vecesEscapadoIA >= 3) {
            mostrarMensajeInspirador = true;
          }

          if (cancionIA && cancionIA.isPlaying()) {
            cancionIA.stop();
          }
          if (musicaActiva && cancionNormal && cancionNormal.isLoaded()) {
            cancionNormal.loop();
          }
        }
      } else {
        contadorTeclaE = 0;
      }
      return; 
    }

    // Registrar actividad con teclas del jugador
    if (key === 'w' || key === 'W' || key === 's' || key === 'S' || 
        key === 'a' || key === 'A' || key === 'd' || key === 'D' || 
        key === 'z' || key === 'Z') {
      ultimoTiempoActividad = millis();
    }
  }

  // Activar / Desactivar música general con la tecla 'M'
  if (key === 'm' || key === 'M') {
    if (typeof getAudioContext === 'function' && getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }

    if (!modoIAActivo && cancionNormal && cancionNormal.isLoaded()) {
      if (musicaActiva) {
        cancionNormal.pause();
        musicaActiva = false;
      } else {
        cancionNormal.setVolume(1.0);
        cancionNormal.loop();
        musicaActiva = true;
      }
    }
    return;
  }

  // Volver a la pantalla de inicio (Menú) con ENTER
  if (keyCode === ENTER || key === 'Enter') {
    estadoJuego = "MENU";
    ultimoTiempoActividad = millis();
    return;
  }

  // --- TRANSICIONES DE ESTADOS ---
  if (estadoJuego === "CONTROLES") {
    if (key === 'c' || key === 'C') {
      estadoJuego = "MENU";
      ultimoTiempoActividad = millis();
    } else if (keyCode === ESCAPE) {
      estadoJuego = "APAGADO";
      return false;
    }
  }
  else if (estadoJuego === "MENU") {
    if (key === 'c' || key === 'C') {
      estadoJuego = "JUGANDO";
      ultimoTiempoActividad = millis();
    } else if (key === 'o' || key === 'O') {
      estadoJuego = "CONTROLES";
    } else if (keyCode === ESCAPE) {
      estadoJuego = "APAGADO";
      return false; 
    }
  } 
  else if (estadoJuego === "PAUSA") {
    if (key === 'x' || key === 'X') {
      estadoJuego = "JUGANDO";
      ultimoTiempoActividad = millis();
    } else if (keyCode === ESCAPE) {
      estadoJuego = "APAGADO";
      return false;
    }
  }
  else if (estadoJuego === "JUGANDO") {
    if (key === 'w' || key === 'W') {
      jugador.move(0, -1, animArriba);     
    } else if (key === 's' || key === 'S') {
      jugador.move(0, 1, animAbajo);       
    } else if (key === 'a' || key === 'A') {
      jugador.move(-1, 0, animIzquierda);  
    } else if (key === 'd' || key === 'D') {
      jugador.move(1, 0, animDerecha);     
    } else if (key === 'z' || key === 'Z') {
      if (escenarioActual === 1 && bolsa) {
        bolsa.interactuar(jugador);
      }
    } else if (key === 'f' || key === 'F') {
      estadoJuego = "PAUSA";
    } else if (keyCode === ESCAPE) {
      estadoJuego = "APAGADO";
      return false;
    }
  } 
  else if (estadoJuego === "APAGADO") {
    if (key === 'q' || key === 'Q') {
      estadoJuego = "MENU";
      ultimoTiempoActividad = millis();
    }
  }
}

function keyReleased() {
  if (estadoJuego === "JUGANDO" && !modoIAActivo) {
    if (key === 'w' || key === 'W' || key === 's' || key === 'S' || 
        key === 'a' || key === 'A' || key === 'd' || key === 'D') {
      jugador.detener();
    }
  }
}

// ==========================================
// CLASE 1: PLAYER
// ==========================================
class Player {
  constructor(gx, gy) {
    this.gx = gx; 
    this.gy = gy; 
    this.dirAnimacion = animAbajo; 
    this.frameIndex = 0;           
    this.stepToggle = 1;           
  }

  display() {
    let px = this.gx * GRID_SIZE;
    let py = this.gy * GRID_SIZE;

    let imgActual = this.dirAnimacion[this.frameIndex];
    if (imgActual) {
      image(imgActual, px, py, GRID_SIZE, GRID_SIZE);
    }
  }

  move(dx, dy, nuevaAnimacion) {
    let nuevoGx = this.gx + dx;
    let nuevoGy = this.gy + dy;
    let maxCols = (width / GRID_SIZE) - 1; 
    let maxRows = (height / GRID_SIZE) - 1; 

    // Verificar colisiones sólidas según el escenario actual
    if (escenarioActual === 1) {
      if (bolsa && bolsa.esSolidoEn(nuevoGx, nuevoGy)) return;
    } else if (escenarioActual === 2) {
      if (casa2Esc2Izq && casa2Esc2Izq.esSolidoEn(nuevoGx, nuevoGy)) return;
      if (casa2Esc2Der && casa2Esc2Der.esSolidoEn(nuevoGx, nuevoGy)) return;
    } else if (escenarioActual === 3) {
      if (casa1Esc3 && casa1Esc3.esSolidoEn(nuevoGx, nuevoGy)) return;
    }

    // --- NAVEGACIÓN ENTRE LOS 6 ESCENARIOS ---
    if (escenarioActual === 1) {
      if (nuevoGx < 0) {
        escenarioActual = 2; 
        nuevoGx = maxCols;   
      } else if (nuevoGx > maxCols) {
        escenarioActual = 3; 
        nuevoGx = 0;         
      } else if (nuevoGy < 0) {
        escenarioActual = 5;
        nuevoGy = maxRows;
      }
    } 
    else if (escenarioActual === 2) {
      if (nuevoGx > maxCols) {
        escenarioActual = 1; 
        nuevoGx = 0;         
      }
    } 
    else if (escenarioActual === 3) {
      if (nuevoGx < 0) {
        escenarioActual = 1; 
        nuevoGx = maxCols;   
      } else if (nuevoGy < 0) {
        escenarioActual = 4; 
        nuevoGy = maxRows;
      }
    }
    else if (escenarioActual === 4) {
      if (nuevoGx < 0) {
        escenarioActual = 5; 
        nuevoGx = maxCols;
      } else if (nuevoGy > maxRows) {
        escenarioActual = 3; 
        nuevoGy = 0;
      }
    }
    else if (escenarioActual === 5) {
      if (nuevoGx < 0) {
        escenarioActual = 6; 
        nuevoGx = maxCols;
      } else if (nuevoGx > maxCols) {
        escenarioActual = 4; 
        nuevoGx = 0;
      } else if (nuevoGy > maxRows) {
        escenarioActual = 1; 
        nuevoGy = 0;
      }
    }
    else if (escenarioActual === 6) {
      if (nuevoGx > maxCols) {
        escenarioActual = 5; 
        nuevoGx = 0;
      }
    }

    if (this.dirAnimacion !== nuevaAnimacion) {
      this.dirAnimacion = nuevaAnimacion;
      this.stepToggle = 1;
      this.frameIndex = this.stepToggle;
    } else {
      if (this.frameIndex === 0) {
        this.stepToggle = (this.stepToggle === 1) ? 2 : 1;
        this.frameIndex = this.stepToggle;
      } else {
        this.frameIndex = 0;
      }
    }

    this.gx = constrain(nuevoGx, 0, maxCols);
    this.gy = constrain(nuevoGy, 0, maxRows);
  }

  detener() {
    this.frameIndex = 0;
  }
}

// ==========================================
// CLASE 2: CASA (CON COLISIÓN SÓLIDA)
// ==========================================
class Casa {
  constructor(img, gx, gy, anchoCeldas, altoCeldas) {
    this.img = img;
    this.gx = gx;
    this.gy = gy;
    this.ancho = anchoCeldas;
    this.alto = altoCeldas;
  }

  display() {
    if (this.img) {
      image(
        this.img,
        this.gx * GRID_SIZE,
        this.gy * GRID_SIZE,
        this.ancho * GRID_SIZE,
        this.alto * GRID_SIZE
      );
    }
  }

  esSolidoEn(targetGx, targetGy) {
    return (
      targetGx >= this.gx &&
      targetGx < this.gx + this.ancho &&
      targetGy >= this.gy &&
      targetGy < this.gy + this.alto
    );
  }
}

// ==========================================
// CLASE 3: BOLSA
// ==========================================
class Bolsa {
  constructor(gx, gy) {
    this.gx = gx; 
    this.gy = gy; 
    this.abierta = false; 
  }

  display() {
    let px = this.gx * GRID_SIZE;
    let py = this.gy * GRID_SIZE;

    let imgActual = this.abierta ? imgBolsaAbierta : imgBolsaCerrada;

    if (imgActual) {
      image(imgActual, px, py, GRID_SIZE, GRID_SIZE);
    } else {
      fill(139, 69, 19);
      rect(px, py, GRID_SIZE, GRID_SIZE);
    }
  }

  esSolidoEn(targetGx, targetGy) {
    return (targetGx === this.gx && targetGy === this.gy);
  }

  interactuar(jugadorRef) {
    let distanciaX = abs(jugadorRef.gx - this.gx);
    let distanciaY = abs(jugadorRef.gy - this.gy);

    if ((distanciaX + distanciaY) === 1 || (distanciaX === 0 && distanciaY === 0)) {
      this.abierta = true; 
    }
  }
}