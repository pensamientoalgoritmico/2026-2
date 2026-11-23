
/* ==========================================================================
   TITULO: Tiempo Muerto – Entrega Final
   ESTUDIANTE: Irene Ospina Cuellar
   CURSO: Laboratorio Dos: Pensamiento Algorítmico (DISO-2311)

   INTERPRETACIÓN Y MENSAJE:
   "La pausa forzada es el único lugar donde todavía piensas."
   El juego cuestiona la prisa y el automatismo digital. Mover el mouse tiene
   un costo físico: llena la barra lateral, vuelve pesado el cursor y congela
   la pantalla si te aceleras, premiando el autocontrol y la paciencia.

   REFERENCIAS:
   1. osu!: Anillos concéntricos que se encogen para marcar el ritmo de clic.
   2. League of Legends (UI): Paleta azul noche y dorado con marcos finos.
   ========================================================================== */

// Estados: "INTRO", "TUTORIAL", "LISTO", "JUGANDO", "GANASTE"
let estado = "INTRO";

let jugador;
let puntos = [];
let cantidadPuntos = 4;

// Marcadores y modos
let puntaje = 0;
let tiempoSegundos = 0;
let bloqueosTotales = 0;
let modoInfinito = false;

// Control del tutorial guiado (pasos 0, 1 y 2)
let pasoTutorial = 0;
let timerTutorial = 0;

// Paleta de colores
let colFondo;
let colDorado;
let colAzulLuz;
let colMarfil;

function setup() {
  createCanvas(800, 500);

  colFondo   = color(8, 18, 36);     // #081224
  colDorado  = color(200, 170, 110); // #C8AA6E
  colAzulLuz = color(111, 163, 255); // #6FA3FF
  colMarfil  = color(240, 230, 210); // #F0E6D2

  jugador = new Jugador(width / 2, height / 2);

  for (let i = 0; i < cantidadPuntos; i++) {
    puntos.push(new Punto());
  }
}

function draw() {
  background(colFondo);

  // Marco exterior dorado
  stroke(colDorado);
  strokeWeight(2);
  noFill();
  rect(12, 12, width - 24, height - 24);

  switch (estado) {
    case "INTRO":
      pantallaIntro();
      break;

    case "TUTORIAL":
      pantallaTutorial();
      break;

    case "LISTO":
      pantallaComencemos();
      break;

    case "JUGANDO":
      pantallaJuego();
      break;

    case "GANASTE":
      pantallaVictoria();
      break;
  }
}

// ==========================================================================
// 1. PANTALLA DE BIENVENIDA
// ==========================================================================
function pantallaIntro() {
  cursor();
  textAlign(CENTER, CENTER);

  fill(colDorado);
  noStroke();
  textSize(36);
  text("TIEMPO MUERTO", width / 2, height / 2 - 95);

  fill(colMarfil);
  textSize(15);
  text("«La pausa forzada es el único lugar donde todavía piensas.»", width / 2, height / 2 - 40);

  fill(colAzulLuz);
  textSize(13);
  text("Alcanza 100 puntos administrando tu calma.", width / 2, height / 2 + 10);
  text("Si mueves el mouse sin control, el sistema se saturará y te detendrá.", width / 2, height / 2 + 32);

  dibujarBoton(width / 2 - 115, height / 2 + 85, 230, 42, "COMENZAR TUTORIAL");
}

// ==========================================================================
// 2. PANTALLA TUTORIAL GUIADO (Ralentizada y con flechas)
// ==========================================================================
function pantallaTutorial() {
  noCursor();

  // Ralentizamos los anillos (factor 0.25) para que el jugador lea tranquilo
  for (let i = 0; i < puntos.length; i++) {
    puntos[i].update(0.25);
    puntos[i].display();
  }

  jugador.update();
  jugador.display();
  dibujarHUD();

  if (jugador.congelado) {
    dibujarAvisoCongelamiento();
  }

  // Capa suave para resaltar las flechas explicativas
  fill(8, 18, 36, 110);
  noStroke();
  rect(14, 14, width - 28, height - 28);

  timerTutorial++;

  // Paso 0: Explicar los círculos estilo osu!
  if (pasoTutorial === 0) {
    let p = puntos[0];
    dibujarFlechaGuia(p.x, p.y - 85, p.x, p.y - 35, "Oprime cuando el círculo se cierre");
    if (timerTutorial > 240) { // ~4 segundos
      pasoTutorial = 1;
      timerTutorial = 0;
    }
  }
  // Paso 1: Explicar el marcador de puntos
  else if (pasoTutorial === 1) {
    dibujarFlechaGuia(170, 85, 95, 48, "Aquí se refleja tu puntaje");
    if (timerTutorial > 210) {
      pasoTutorial = 2;
      timerTutorial = 0;
    }
  }
  // Paso 2: Explicar la barra de congelamiento
  else if (pasoTutorial === 2) {
    dibujarFlechaGuia(width - 210, 210, width - 65, 210, "Cuidado: si te mueves mucho te congelas");
    if (timerTutorial > 240) {
      estado = "LISTO"; // Pasa al aviso de inicio real
    }
  }

  // Texto discreto abajo para saltar si ya sabe jugar
  fill(colMarfil);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text("Presiona ESPACIO para saltar tutorial", width / 2, height - 22);
}

// ==========================================================================
// 3. PANTALLA DE TRANSICIÓN: "AHORA COMENCEMOS DE VERDAD"
// ==========================================================================
function pantallaComencemos() {
  cursor();
  textAlign(CENTER, CENTER);

  fill(colDorado);
  noStroke();
  textSize(28);
  text("AHORA COMENCEMOS DE VERDAD", width / 2, height / 2 - 45);

  fill(colMarfil);
  textSize(14);
  text("Marcadores en cero. Mantén la calma y llega a 100 puntos.", width / 2, height / 2 + 5);

  dibujarBoton(width / 2 - 95, height / 2 + 55, 190, 42, "INICIAR PARTIDA");
}

// ==========================================================================
// 4. PANTALLA DE JUEGO REAL
// ==========================================================================
function pantallaJuego() {
  noCursor();

  // Cronómetro ascendente
  if (frameCount % 60 === 0 && !jugador.congelado) {
    tiempoSegundos++;

    // Cada 15 segundos añade un punto extra (máximo 7) para subir dificultad
    if (tiempoSegundos % 15 === 0 && puntos.length < 7) {
      puntos.push(new Punto());
    }
  }

  // Actualizar y dibujar los objetivos
  for (let i = 0; i < puntos.length; i++) {
    puntos[i].update(1.0); // Velocidad normal
    puntos[i].display();
  }

  // Actualizar y dibujar al jugador
  jugador.update();
  jugador.display();

  // Interfaz superior y barra lateral
  dibujarHUD();

  // Si llena la barra al 100%, sale la pantalla de congelamiento total
  if (jugador.congelado) {
    dibujarAvisoCongelamiento();
  }

  // Si no está en modo infinito y llega a 100 puntos, gana
  if (!modoInfinito && puntaje >= 100) {
    estado = "GANASTE";
  }
}

// ==========================================================================
// 5. PANTALLA DE VICTORIA (100 PUNTOS) Y OPCIÓN DE RÉCORD INFINITO
// ==========================================================================
function pantallaVictoria() {
  cursor();
  textAlign(CENTER, CENTER);

  fill(colDorado);
  noStroke();
  textSize(28);
  text("EXCELENTE, TU PACIENCIA DIO FRUTOS", width / 2, height / 2 - 110);

  fill(colMarfil);
  textSize(15);
  text("Dominaste tu impulso en lugar de dejar que la prisa te controlara.", width / 2, height / 2 - 60);

  // Resumen de logros
  fill(colAzulLuz);
  textSize(15);
  text("Puntaje logrado: " + puntaje + " puntos", width / 2, height / 2 - 10);
  text("Tiempo logrado: " + tiempoSegundos + " segundos", width / 2, height / 2 + 18);
  text("Veces congelado: " + bloqueosTotales, width / 2, height / 2 + 46);

  // Botón 1: Seguir jugando sin límite (Rompe tu récord)
  dibujarBoton(width / 2 - 205, height / 2 + 100, 190, 42, "ROMPE TU RÉCORD");

  // Botón 2: Reiniciar desde cero
  dibujarBoton(width / 2 + 15, height / 2 + 100, 190, 42, "VOLVER AL INICIO");
}

// ==========================================================================
// CLASE JUGADOR (Cursor con resistencia e inercia)
// ==========================================================================
class Jugador {
  constructor(tempX, tempY) {
    this.x = tempX;
    this.y = tempY;
    this.barra = 0; // 0 a 100
    this.congelado = false;
    this.cuentaCongelado = 0;
  }

  update() {
    let distMouse = dist(mouseX, mouseY, pmouseX, pmouseY);

    if (!this.congelado) {
      if (distMouse > 1.0) {
        this.barra += distMouse * 0.025; // Sube según qué tanto se mueve
      } else {
        this.barra -= 0.18; // Baja al quedarse quieto
      }

      this.barra = constrain(this.barra, 0, 100);

      // Si llega al tope se congela por completo
      if (this.barra >= 100) {
        this.congelado = true;
        this.cuentaCongelado = 180; // ~3 segundos
        if (estado === "JUGANDO") {
          bloqueosTotales++;
        }
      }
    } else {
      // Solo descongela si el usuario suelta el mouse
      if (distMouse < 1.0) {
        this.cuentaCongelado--;
        this.barra = map(this.cuentaCongelado, 180, 0, 100, 0);
      } else {
        this.cuentaCongelado = min(this.cuentaCongelado + 1, 240);
      }

      if (this.cuentaCongelado <= 0) {
        this.congelado = false;
        this.barra = 0;
      }
    }

    // Pesadez progresiva del cursor
    let agilidad = map(this.barra, 0, 100, 0.45, 0.08);
    this.x += (mouseX - this.x) * agilidad;
    this.y += (mouseY - this.y) * agilidad;
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(colMarfil);
    stroke(colFondo);
    strokeWeight(1.5);
    triangle(0, 0, 0, 18, 14, 12);
    pop();
  }

  // Evalúa clic sobre un círculo
  tocar(unPunto) {
    if (this.congelado) return false;

    let d = dist(this.x, this.y, unPunto.x, unPunto.y);
    if (d < unPunto.tamBase + 12) {
      unPunto.reiniciar();
      this.barra += 2;
      return true;
    }
    return false;
  }
}

// ==========================================================================
// CLASE PUNTO (Objetivos rítmicos estilo osu!)
// ==========================================================================
class Punto {
  constructor() {
    this.reiniciar();
  }

  reiniciar() {
    this.x = random(80, width - 160);
    this.y = random(80, height - 80);
    this.tamBase = 22;
    this.radioAnillo = 65;
    this.velocidadAnillo = random(0.45, 0.75);
  }

  // factorVelocidad permite ralentizarlos durante el tutorial
  update(factorVelocidad) {
    this.radioAnillo -= this.velocidadAnillo * factorVelocidad;
    if (this.radioAnillo <= this.tamBase / 2) {
      this.reiniciar();
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // Anillo exterior que se cierra
    noFill();
    stroke(colAzulLuz);
    strokeWeight(2);
    circle(0, 0, this.radioAnillo * 2);

    // Centro dorado
    fill(colDorado);
    noStroke();
    circle(0, 0, this.tamBase);

    fill(colMarfil);
    circle(0, 0, this.tamBase * 0.4);

    pop();
  }
}

// ==========================================================================
// ELEMENTOS VISUALES DE APOYO (HUD, Botones y Flechas del tutorial)
// ==========================================================================
function dibujarHUD() {
  fill(colMarfil);
  noStroke();
  textSize(16);

  // Puntaje arriba a la izquierda
  textAlign(LEFT, TOP);
  if (modoInfinito) {
    text("PUNTOS: " + puntaje + " (RÉCORD)", 30, 25);
  } else {
    text("PUNTOS: " + puntaje + " / 100", 30, 25);
  }

  // Tiempo arriba al centro
  textAlign(CENTER, TOP);
  text("TIEMPO: " + tiempoSegundos + "s", width / 2, 25);

  // Barra de congelamiento a la derecha
  let altoBarra = 320;
  let anchoBarra = 24;
  let posXBarra = width - 55;
  let posYBarra = 70;

  stroke(colDorado);
  strokeWeight(2);
  noFill();
  rect(posXBarra, posYBarra, anchoBarra, altoBarra);

  let altoLleno = map(jugador.barra, 0, 100, 0, altoBarra);
  fill(colDorado);
  noStroke();
  rect(posXBarra, posYBarra + altoBarra - altoLleno, anchoBarra, altoLleno);

  fill(colMarfil);
  textSize(10);
  textAlign(CENTER, TOP);
  text("CONGELA", posXBarra + anchoBarra / 2, posYBarra + altoBarra + 8);
}

function dibujarAvisoCongelamiento() {
  fill(8, 18, 36, 220);
  noStroke();
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  fill(colDorado);
  textSize(22);
  text("SATURACIÓN DEL SISTEMA", width / 2, height / 2 - 25);

  fill(colMarfil);
  textSize(14);
  text("La máquina no responderá a tu prisa.", width / 2, height / 2 + 12);
  text("Suelta el mouse y quédate quieto para continuar.", width / 2, height / 2 + 34);
}

function dibujarFlechaGuia(xTexto, yTexto, xPunta, yPunta, mensaje) {
  // Línea y punta de flecha
  stroke(colDorado);
  strokeWeight(2);
  line(xTexto, yTexto + 12, xPunta, yPunta);

  fill(colDorado);
  noStroke();
  circle(xPunta, yPunta, 8);

  // Caja de texto explicativo
  fill(8, 18, 36, 230);
  stroke(colDorado);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(xTexto, yTexto, textWidth(mensaje) + 24, 28, 4);
  rectMode(CORNER);

  fill(colMarfil);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text(mensaje, xTexto, yTexto);
}

function dibujarBoton(bx, by, bw, bh, etiqueta) {
  if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
    fill(colDorado);
    rect(bx, by, bw, bh);
    fill(colFondo);
  } else {
    noFill();
    stroke(colDorado);
    strokeWeight(1.5);
    rect(bx, by, bw, bh);
    fill(colDorado);
    noStroke();
  }
  textAlign(CENTER, CENTER);
  textSize(13);
  text(etiqueta, bx + bw / 2, by + bh / 2);
}

// ==========================================================================
// INTERACCIÓN DE CLICS Y TECLADO
// ==========================================================================
function reiniciarPartidaReal(infinito) {
  puntaje = 0;
  tiempoSegundos = 0;
  bloqueosTotales = 0;
  modoInfinito = infinito;
  jugador.barra = 0;
  jugador.congelado = false;

  // Volvemos a 4 círculos iniciales
  puntos = [];
  for (let i = 0; i < 4; i++) {
    puntos.push(new Punto());
  }
}

function mousePressed() {
  // Clic en INTRO -> va al Tutorial
  if (estado === "INTRO") {
    let bx = width / 2 - 115;
    let by = height / 2 + 85;
    if (mouseX > bx && mouseX < bx + 230 && mouseY > by && mouseY < by + 42) {
      pasoTutorial = 0;
      timerTutorial = 0;
      puntaje = 0;
      jugador.barra = 0;
      jugador.congelado = false;
      estado = "TUTORIAL";
    }
    return;
  }

  // Clic en TUTORIAL -> permite practicar explotando círculos
  if (estado === "TUTORIAL") {
    for (let i = 0; i < puntos.length; i++) {
      if (jugador.tocar(puntos[i])) {
        puntaje++;
        break;
      }
    }
    return;
  }

  // Clic en LISTO -> inicia el juego real en cero
  if (estado === "LISTO") {
    let bx = width / 2 - 95;
    let by = height / 2 + 55;
    if (mouseX > bx && mouseX < bx + 190 && mouseY > by && mouseY < by + 42) {
      reiniciarPartidaReal(false);
      estado = "JUGANDO";
    }
    return;
  }

  // Clic en JUGANDO -> suma puntos
  if (estado === "JUGANDO") {
    for (let i = 0; i < puntos.length; i++) {
      if (jugador.tocar(puntos[i])) {
        puntaje++;
        break;
      }
    }
    return;
  }

  // Clic en GANASTE -> elegir modo infinito o volver al inicio
  if (estado === "GANASTE") {
    // Botón "ROMPE TU RÉCORD" (modo infinito sin tope de 100)
    let bx1 = width / 2 - 205;
    let by1 = height / 2 + 100;
    if (mouseX > bx1 && mouseX < bx1 + 190 && mouseY > by1 && mouseY < by1 + 42) {
      modoInfinito = true;
      estado = "JUGANDO";
      return;
    }

    // Botón "VOLVER AL INICIO"
    let bx2 = width / 2 + 15;
    let by2 = height / 2 + 100;
    if (mouseX > bx2 && mouseX < bx2 + 190 && mouseY > by2 && mouseY < by2 + 42) {
      reiniciarPartidaReal(false);
      estado = "INTRO";
      return;
    }
  }
}

function keyPressed() {
  // Permite saltar el tutorial con espacio
  if (estado === "TUTORIAL" && key === ' ') {
    estado = "LISTO";
  }
}
