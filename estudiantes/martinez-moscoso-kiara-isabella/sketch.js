/*
  título del ejercicio: auto-wrong - estados, resistencia y desobediencia tipográfica
  autora: kiara martínez
  código de estudiante: 202512107

  resumen de reglas del ejercicio:
- mensaje de advertencia reubicado dentro de la caja blanca para evitar desbordamientos.
- instrucciones de 1 sola línea pegadas al cuadro blanco; las de 2 líneas con ajuste multilínea.
- condición de victoria: 5 preguntas seguidas manteniendo la integridad al 100%.
- condición de derrota: la integridad llega a 0% o se acaban las 19 preguntas sin lograr las 5 seguidas al 100%.
- fondos 100% distintos y temáticos para cada estado.
*/

// aquí guardo la fuente pixel y los botones que uso para moverme por el juego
let customFont;

let startButton;
let extButton;
let nextButton;
let restartButton;
let enterHomeButton;
let enterInfoButton;

// arreglos para los elementos animados de cada fondo según la pantalla
let typewriterLines = [];
let fallingLetters = [];
let rotatingWords = [];
let gameRain = [];
let winWords = [];
let loseSpirals = [];

// partículas que siguen o reaccionan al movimiento del mouse
let cursorParticles = [];

// confeti y destellos rojos cuando el cronómetro llega a cero
let timeUpParticles = [];
let timeUpExplosionTriggered = false;

let glitchChars = ["0", "1", "ERR", "SLOW", "BUG", "SYS", "X", "!", "404", "SYNTAX", "WRONG", "FATAL"];

// banco de las 19 preguntas que salen en el nivel
let questionPool = [
  { prompt: "¿De qué trata la película Shrek?" },
  { prompt: "¿Cómo se prepara una limonada? Escribe los pasos" },
  { prompt: "¿Cómo se forma un arcoíris?" },
  { prompt: "¿Quién fue Albert Einstein y por qué es conocido?" },
  { prompt: "¿Qué se hace en navidad?" },
  { prompt: "¿Qué se hace en halloween?" },
  { prompt: "Escribe 5 meses del año" },
  { prompt: "Escribe 5 marcas de carro" },
  { prompt: "5 países que te gustaría visitar y por qué" },
  { prompt: "Escribe 5 planetas del sistema solar" },
  { prompt: "¿Película favorita y por qué?" },
  { prompt: "Escribe 5 animales" },
  { prompt: "¿Cómo se hace una pizza? Escribe los pasos" },
  { prompt: "¿Género de música fav y por qué?" },
  { prompt: "Escribe los estados de la materia" },
  { prompt: "Escribe 5 colores" },
  { prompt: "Escribe lista de compras con 5 ítems" },
  { prompt: "Cuenta una anécdota divertida" },
  { prompt: "Da un consejo viajero a alguien" }
];

let questions = []; 
let currentQuestionIndex = 0;

// variables principales para controlar el estado del juego, el tiempo y la vida/integridad
let gameState = "INTRO"; // INTRO, INFO_INTEGRIDAD, HOME, NIVEL1, GANO, PERDIO
let timeLeft = 15; 
let integrity = 100;
let lastSecondTime = 0;
let racha100Consecutiva = 0;

// marca si el jugador presionó el botón de extensión en la pregunta actual
let usoTrampaEnPregunta = false;

// lo que va escribiendo el usuario y el aviso cuando falta texto
let userInput = "";
let warningMessage = "";
let warningTimer = 0;

async function setup() {
  createCanvas(600, 450);
  
  // cargo la tipografía pixel antes de arrancar
  customFont = await loadFont('https://cdn.jsdelivr.net/npm/@fontsource/press-start-2p@5.0.19/files/press-start-2p-latin-400-normal.woff2');
  
  // creo y ubico los botones de navegación y de acción
  enterHomeButton = new MenuButton(width / 2 - 115, 345, 230, 46, "INGRESAR", color(0, 240, 255));
  enterInfoButton = new MenuButton(width / 2 - 115, 355, 230, 46, "SIGUIENTE", color(0, 255, 102));
  startButton = new MenuButton(width / 2 - 135, 340, 270, 48, "INICIAR NIVEL", color(0, 255, 102));
  extButton = new MenuButton(370, 338, 200, 42, "+20S EXTENSIÓN", color(255, 204, 0));
  nextButton = new MenuButton(370, 388, 200, 42, "SIGUIENTE", color(255, 16, 240));
  
  restartButton = new MenuButton(width / 2 - 135, 355, 270, 46, "VOLVER A JUGAR", color(0, 255, 102));

  // lleno las colecciones para que cada pantalla tenga su propio movimiento de fondo
  for (let i = 0; i < 15; i++) {
    typewriterLines.push(new TypewriterRow(random(height)));
  }
  for (let i = 0; i < 30; i++) {
    fallingLetters.push(new FallingLetterItem(random(width), random(-height, 0), random(1.5, 4)));
    gameRain.push(new GameRainParticle(random(width), random(height), random(2, 4)));
    winWords.push(new WinAscentWord(random(width), random(height), random(1, 2.5)));
    loseSpirals.push(new LoseSpiralParticle(random(width), random(height), random(2, 5)));
  }

  let palabrasClave = ["RESISTENCIA", "AUTONOMÍA", "PAUSA", "CALMA", "SISTEMA", "DISRUPCIÓN", "TIEMPO"];
  for (let i = 0; i < 10; i++) {
    rotatingWords.push(new RotatingWordItem(width / 2, height / 2, random(60, 180), random(0.01, 0.03), random(palabrasClave)));
  }
}

// lanzo la ráfaga de confeti y luces cuando se acaba el tiempo de la pregunta
function dispararExplosionTiempoAgotado() {
  timeUpParticles = [];
  let originX = 470;
  let originY = 225;
  for (let i = 0; i < 95; i++) {
    timeUpParticles.push(new TimeUpBurstParticle(originX, originY));
  }
}

// actualizo y dibujo el pulso rojo y las partículas cuando el cronómetro llega a 0
function updateAndDrawTimeUpExplosion() {
  if (timeLeft <= 0) {
    let pulse = (sin(frameCount * 0.25) + 1) * 0.5;
    push();
    noStroke();
    fill(255, 20, 50, 18 + pulse * 26);
    rect(0, 0, width, height);
    pop();
  }

  for (let i = timeUpParticles.length - 1; i >= 0; i--) {
    let p = timeUpParticles[i];
    p.update();
    p.display();
    if (p.isDead()) {
      timeUpParticles.splice(i, 1);
    }
  }
}

// partícula individual para la explosión de tiempo agotado
class TimeUpBurstParticle {
  constructor(x, y) {
    this.x = x + random(-12, 12);
    this.y = y + random(-12, 12);
    let angle = random(TWO_PI);
    let speed = random(2.5, 9.5);
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed - random(1, 3.5);
    this.life = 255;
    this.decay = random(2.8, 5.2);
    this.angle = random(TWO_PI);
    this.spin = random(-0.25, 0.25);
    this.size = random(6, 12);
    this.kind = random() < 0.65 ? "confetti" : "light";
    this.col = random([
      color(255, 20, 55),
      color(255, 55, 80),
      color(220, 10, 40),
      color(255, 90, 40),
      color(255, 16, 120)
    ]);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.97;
    if (this.kind === "confetti") {
      this.vy += 0.12;
    } else {
      this.vy += 0.04;
    }
    this.angle += this.spin;
    this.life -= this.decay;
  }

  display() {
    push();
    noStroke();
    let r = red(this.col);
    let g = green(this.col);
    let b = blue(this.col);

    if (this.kind === "confetti") {
      translate(this.x, this.y);
      rotate(this.angle);
      fill(r, g, b, this.life);
      rectMode(CENTER);
      rect(0, 0, this.size * 1.4, this.size * 0.65, 1.5);
    } else {
      fill(255, 25, 55, this.life * 0.42);
      ellipse(this.x, this.y, this.size * 3.2, this.size * 3.2);
      fill(r, g, b, this.life);
      ellipse(this.x, this.y, this.size * 1.25, this.size * 1.25);
      fill(255, 210, 215, this.life * 0.9);
      ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);
    }
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// bucle principal: decide qué pantalla mostrar, mueve el reloj y revisa derrota por vida en 0
function draw() {
  if (gameState === "INTRO") {
    background(5, 10, 20);
    for (let tw of typewriterLines) { tw.update(); tw.display(); }
    drawIntroScreen();
    updateAndDrawCursorParticles();
  } 
  else if (gameState === "INFO_INTEGRIDAD") {
    background(8, 20, 14);
    for (let fl of fallingLetters) { fl.update(); fl.display(); }
    drawIntegridadInfoScreen();
    updateAndDrawCursorParticles();
  }
  else if (gameState === "HOME") {
    background(10, 15, 25);
    for (let rw of rotatingWords) { rw.update(); rw.display(); }
    drawHomeScreen();
    updateAndDrawCursorParticles();
  } 
  else if (gameState === "NIVEL1") {
    background(15, 8, 22);
    for (let gr of gameRain) { gr.update(); gr.reactToMouse(mouseX, mouseY); gr.display(); }

    // resto un segundo cada vez que pasa un segundo real
    if (millis() - lastSecondTime >= 1000) {
      if (timeLeft > 0) {
        timeLeft--;
      }
      lastSecondTime = millis();
    }

    // disparo la explosión solo una vez cuando el contador llega a 0
    if (timeLeft <= 0 && !timeUpExplosionTriggered) {
      timeUpExplosionTriggered = true;
      dispararExplosionTiempoAgotado();
    }

    drawGamePlayScreen();

    extButton.checkHover(mouseX, mouseY);
    extButton.display();

    nextButton.checkHover(mouseX, mouseY);
    nextButton.display();

    updateAndDrawCursorParticles();
    updateAndDrawTimeUpExplosion();

    // si la integridad llega a 0 se pierde de inmediato
    if (integrity <= 0) {
      gameState = "PERDIO";
    }
  }
  else if (gameState === "GANO") {
    background(2, 25, 12);
    for (let ww of winWords) { ww.update(); ww.display(); }
    drawWinScreen();
    updateAndDrawCursorParticles();
  }
  else if (gameState === "PERDIO") {
    background(30, 6, 10);
    for (let ls of loseSpirals) { ls.update(); ls.display(); }
    drawLoseScreen();
    updateAndDrawCursorParticles();
  }
}

// suelto partículas suaves al mover el cursor por el lienzo
function mouseMoved() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  let count = 3;
  for (let i = 0; i < count; i++) {
    cursorParticles.push(new CursorAmbientParticle(mouseX, mouseY, gameState));
  }

  // limito el total para que el juego no se ponga lento
  if (cursorParticles.length > 220) {
    cursorParticles.splice(0, cursorParticles.length - 220);
  }
}

// actualizo y dibujo las partículas del cursor y borro las que ya se apagaron
function updateAndDrawCursorParticles() {
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    let p = cursorParticles[i];
    p.update();
    p.display();
    if (p.isDead()) {
      cursorParticles.splice(i, 1);
    }
  }
}

// partícula reactiva que cambia de estilo y color según la pantalla activa
class CursorAmbientParticle {
  constructor(x, y, state) {
    this.x = x + random(-10, 10);
    this.y = y + random(-10, 10);
    this.vx = random(-2.2, 2.2);
    this.vy = random(-2.5, 1.2);
    this.life = 255;
    this.decay = random(4.0, 7.5);
    this.angle = random(TWO_PI);
    this.spin = random(-0.18, 0.18);
    this.size = random(5, 10);

    if (state === "INTRO") {
      this.kind = "confetti";
      this.col = random([color(0, 240, 255), color(255, 16, 240), color(0, 255, 102)]);
    } else if (state === "INFO_INTEGRIDAD") {
      this.kind = "orb";
      this.col = random([color(0, 255, 102), color(140, 255, 190), color(255, 204, 0)]);
    } else if (state === "HOME") {
      this.kind = "orb";
      this.col = random([color(0, 240, 255), color(255, 204, 0), color(180, 245, 255)]);
    } else if (state === "NIVEL1") {
      this.kind = "confetti";
      this.col = random([color(255, 16, 240), color(0, 255, 102), color(0, 240, 255)]);
    } else if (state === "GANO") {
      this.kind = "confetti";
      this.col = random([color(0, 255, 102), color(255, 204, 0), color(0, 240, 255), color(255, 16, 240)]);
    } else {
      this.kind = "orb";
      this.col = random([color(255, 50, 80), color(255, 140, 0), color(255, 16, 240)]);
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.kind === "confetti") {
      this.vy += 0.05;
      this.vx *= 0.98;
    } else {
      this.vy -= 0.02;
    }
    this.angle += this.spin;
    this.life -= this.decay;
  }

  display() {
    push();
    noStroke();
    let r = red(this.col);
    let g = green(this.col);
    let b = blue(this.col);

    if (this.kind === "confetti") {
      translate(this.x, this.y);
      rotate(this.angle);
      fill(r, g, b, this.life);
      rectMode(CENTER);
      rect(0, 0, this.size * 1.35, this.size * 0.65, 1.5);
    } else {
      fill(r, g, b, this.life * 0.35);
      ellipse(this.x, this.y, this.size * 2.8, this.size * 2.8);
      fill(r, g, b, this.life);
      ellipse(this.x, this.y, this.size * 1.15, this.size * 1.15);
      fill(255, 255, 255, this.life * 0.85);
      ellipse(this.x, this.y, this.size * 0.45, this.size * 0.45);
    }
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// pantalla de portada inicial
function drawIntroScreen() {
  push();
  noStroke();
  fill(8, 12, 22, 230);
  rect(40, 40, width - 80, height - 80, 10);

  drawInteractiveTitle("AUTO-WRONG", width / 2, 135, 32, mouseX, mouseY, "GLITCH");
  drawInteractiveBodyText(
    "Sesión interactiva de resistencia tipográfica",
    width / 2, 230, 12, color(180, 190, 210), color(0, 240, 255), mouseX, mouseY, 440, "MISWRITE"
  );

  enterHomeButton.checkHover(mouseX, mouseY);
  enterHomeButton.display();
  pop();
}

// pantalla donde explico qué significa la barra de integridad
function drawIntegridadInfoScreen() {
  push();
  noStroke();
  fill(8, 20, 14, 235);
  rect(30, 20, width - 60, height - 40, 8);

  drawInteractiveTitle("INTEGRIDAD", width / 2, 75, 32, mouseX, mouseY, "ROTATE");

  let textoParrafo = "La integridad en este sistema no es solo una barra de vida; representa tu resistencia contra la prisa automatizada.\n\nMantenerla al 100% significa escribir con autonomía, tomarte tu tiempo y rechazar las falsas ayudas del algoritmo. Si te apresuras o caes en trampas, tu vida colapsará.";
  drawInteractiveBodyText(
    textoParrafo,
    width / 2, 215, 11, color(220, 240, 220), color(255, 204, 0), mouseX, mouseY, 450, "ROTATE"
  );

  enterInfoButton.checkHover(mouseX, mouseY);
  enterInfoButton.display();
  pop();
}

// pantalla previa al inicio del nivel
function drawHomeScreen() {
  push();
  noStroke();
  fill(10, 20, 15, 220);
  rect(40, 40, width - 80, height - 80, 10);

  drawInteractiveTitle("SISTEMA LISTO", width / 2, 115, 28, mouseX, mouseY, "FADE");

  let subText = "Mantén tu integridad intacta ante el algoritmo y demuestra la soberanía de tu escritura.";
  drawInteractiveBodyText(
    subText,
    width / 2, 220, 12, color(255), color(0, 240, 255), mouseX, mouseY, 440, "FADE"
  );

  startButton.checkHover(mouseX, mouseY);
  startButton.display();
  pop();
}

// pantalla principal del juego: barra de integridad, consigna, caja de texto y cronómetro
function drawGamePlayScreen() {
  push();
  noStroke();
  fill(15, 10, 20, 225);
  rect(20, 15, width - 40, height - 30, 10);

  // texto de fondo sutil para reforzar la estética del sistema
  fill(255, 16, 240, 25);
  textSize(7);
  textAlign(LEFT, TOP);
  textFont(customFont);
  for (let i = 0; i < 8; i++) {
    text("AUTOCORRECTOR_BUFFER_ACTIVO_" + i, 25, 40 + i * 45);
  }

  // barra superior de integridad y porcentaje
  textSize(9);
  fill(0, 240, 255);
  textAlign(LEFT, CENTER);
  text("INTEGRIDAD", 30, 25);
  
  let barColor;
  if (integrity > 80) {
    barColor = color(0, 255, 102); 
  } else if (integrity > 50) {
    barColor = color(255, 204, 0); 
  } else if (integrity > 20) {
    barColor = color(255, 140, 0); 
  } else {
    barColor = color(255, 50, 80);  
  }

  stroke(barColor);
  noFill();
  rect(135, 16, 120, 16, 3);
  fill(barColor);
  noStroke();
  let barWidth = map(integrity, 0, 100, 0, 114);
  rect(138, 19, barWidth, 10, 2);

  fill(barColor);
  noStroke();
  textSize(9);
  textAlign(RIGHT, CENTER);
  text(integrity + "%", width - 30, 25);

  // recuadro de invitación a ignorar el reloj y escribir con calma
  stroke(0, 255, 102);
  strokeWeight(2);
  noFill();
  rect(30, 45, width - 60, 42, 8);

  noStroke();
  fill(255, 16, 240, 120);
  textSize(9);
  textAlign(CENTER, CENTER);
  text("IGNORA EL RELOJ, TÓMATE TU TIEMPO", width / 2 + 1, 67);
  fill(255, 16, 240);
  text("IGNORA EL RELOJ, TÓMATE TU TIEMPO", width / 2, 65);

  // preparo el enunciado de la pregunta y aclaro el mínimo de palabras si no pide 5
  let currentPromptText = questions[currentQuestionIndex].prompt;
  let hasSpecificNumber = currentPromptText.match(/\b5\b/);
  if (!hasSpecificNumber && !currentPromptText.includes("mínimo 3 palabras")) {
    currentPromptText += " (mínimo 3 palabras)";
  }

  textFont("sans-serif");
  textSize(12);
  textWrap(WORD);

  // ajusto la posición vertical según si la pregunta ocupa 1 o 2 líneas para pegarla al cuadro blanco
  let textW = textWidth(currentPromptText);
  let promptY = 117; 
  let promptH = 18;

  if (textW > 315) {
    promptY = 97;
    promptH = 34;
  }

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  text(currentPromptText, 30, promptY, 315, promptH);

  // caja blanca donde aparece lo que escribe el jugador
  fill(255);
  noStroke();
  rect(30, 133, 315, 297, 4);

  let cursorBlink = (frameCount % 30 < 15) ? "|" : "";
  let displayText = userInput + cursorBlink;

  fill(20);
  textSize(13);
  textAlign(LEFT, TOP);
  text(displayText, 42, 143, 291, 225);

  // aviso rojo dentro de la caja blanca cuando falta cantidad de palabras o ítems
  if (warningTimer > 0) {
    textFont(customFont);
    fill(255, 50, 80);
    textSize(6.8);
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    text(warningMessage, 38, 396, 299, 28);
    warningTimer--;
  }

  // cronómetro lateral y mensaje cuando se agota el tiempo
  let isZero = (timeLeft === 0);
  
  if (isZero) {
    let alertStroke = (floor(frameCount / 10) % 2 === 0) ? color(255, 50, 80) : color(255, 255, 255);
    stroke(alertStroke);
    strokeWeight(4);
    fill((floor(frameCount / 10) % 2 === 0) ? color(60, 10, 20) : color(20, 10, 15));
  } else {
    stroke(0, 255, 102);
    strokeWeight(2);
    fill(10, 10, 20);
  }
  rect(370, 133, 200, 195, 6);

  textFont(customFont);
  noStroke();
  fill(isZero ? color(255, 50, 80) : color(0, 240, 255));
  textSize(10);
  textAlign(CENTER, CENTER);
  text(isZero ? "¡TIEMPO!" : "CRONÓMETRO", 470, isZero ? 150 : 185);

  textSize(34);
  if (isZero) {
    fill((floor(frameCount / 8) % 2 === 0) ? color(255, 50, 80) : color(255, 255, 0));
  } else {
    fill(255);
  }
  let displaySec = timeLeft < 10 ? "0" + max(0, timeLeft) : timeLeft;
  text("0:" + displaySec, 470, isZero ? 190 : 235);

  if (isZero) {
    textFont(customFont);
    textSize(7.2);
    textAlign(CENTER, TOP);
    textWrap(WORD);
    
    if (usoTrampaEnPregunta) {
      fill(255, 50, 80);
      text("Has delegado el tiempo en la máquina; la inmediatez ha anulado tu propio criterio.", 382, 222, 176, 100);
    } else {
      fill(255, 160, 180);
      text("Te tomaste tu tiempo para pensar que querias escribir", 382, 228, 176, 95);
    }
  }

  pop();
}

// pantalla de victoria cuando se logran 5 preguntas seguidas con integridad al 100%
function drawWinScreen() {
  push();
  noStroke();
  fill(0, 30, 15, 230);
  rect(30, 20, width - 60, height - 40, 10);

  drawInteractiveTitle("¡GANASTE!", width / 2, 75, 32, mouseX, mouseY, "EXPAND");

  let reflexWinText = "REFLEXIÓN CRÍTICA:\n\nLe ganaste al sistema y mantuviste tu barra de integridad al 100% durante 5 preguntas seguidas. Te tomaste tu tiempo para ver lo que querías escribir y leíste con atención, escribiendo con calma y autonomía.";
  drawInteractiveBodyText(
    reflexWinText,
    width / 2, 215, 11, color(230, 255, 230), color(0, 255, 102), mouseX, mouseY, 450, "EXPAND"
  );

  restartButton.label = "VOLVER A JUGAR";
  restartButton.baseCol = color(0, 255, 102);
  restartButton.checkHover(mouseX, mouseY);
  restartButton.display();
  pop();
}

// pantalla de derrota cuando baja la integridad a 0 o se agotan las 19 preguntas sin la racha de 5
function drawLoseScreen() {
  push();
  noStroke();
  fill(40, 10, 15, 230);
  rect(30, 20, width - 60, height - 40, 10);

  drawInteractiveTitle("PERDISTE", width / 2, 75, 32, mouseX, mouseY, "COLOR_SHAKE");

  let reflexLoseText = "REFLEXIÓN CRÍTICA:\n\nDejaste que el sistema te ganara y tu barra de integridad disminuyó. No te tomaste tu tiempo para ver lo que querías escribir y tampoco leíste con atención. Inténtalo de nuevo.";
  drawInteractiveBodyText(
    reflexLoseText,
    width / 2, 215, 11, color(255, 220, 220), color(255, 204, 0), mouseX, mouseY, 450, "COLOR_SHAKE"
  );

  restartButton.label = "REINTENTAR";
  restartButton.baseCol = color(255, 50, 80);
  restartButton.checkHover(mouseX, mouseY);
  restartButton.display();
  pop();
}

// fondo de la portada con líneas que avanzan como máquina de escribir
class TypewriterRow {
  constructor(y) {
    this.y = y;
    this.x = random(-200, 0);
    this.speed = random(1.5, 3);
    this.textSnippet = random([
      "AUTOCORRECTOR_ACTIVE_SYS >>> WAITING FOR INPUT...",
      "RESIST_THE_MACHINE // SLOW DOWN YOUR TYPING...",
      "BUFFER_OVERLOAD_DETECTED // BREAK THE RHYTHM...",
      "TYPOGRAPHIC_DISOBEDIENCE_PROTOCOL_ONLINE..."
    ]);
  }
  update() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = -400;
      this.y = random(height);
    }
  }
  display() {
    push();
    textFont("sans-serif");
    textSize(10);
    fill(0, 240, 255, 45);
    noStroke();
    text(this.textSnippet, this.x, this.y);
    pop();
  }
}

// fondo de la pantalla de integridad con letras cayendo
class FallingLetterItem {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.char = random(["A", "E", "I", "O", "U", "X", "Z", "S", "T", "R"]);
  }
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = -20;
      this.x = random(width);
    }
  }
  display() {
    push();
    textFont(customFont);
    textSize(8);
    fill(0, 255, 102, 70);
    noStroke();
    text(this.char, this.x, this.y);
    pop();
  }
}

// fondo de la pantalla sistema listo con palabras girando alrededor del centro
class RotatingWordItem {
  constructor(centerX, centerY, radius, angleSpeed, txt) {
    this.cx = centerX;
    this.cy = centerY;
    this.radius = radius;
    this.angle = random(TWO_PI);
    this.angleSpeed = angleSpeed;
    this.txt = txt;
  }
  update() {
    this.angle += this.angleSpeed;
  }
  display() {
    let x = this.cx + cos(this.angle) * this.radius;
    let y = this.cy + sin(this.angle) * this.radius;
    push();
    textFont("sans-serif");
    textSize(9.5);
    fill(0, 240, 255, 80);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.txt, x, y);
    pop();
  }
}

// fondo del nivel con símbolos que caen y se aceleran cerca del mouse
class GameRainParticle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.chars = ["0", "1", "ERR", "SYS", "BUG", "X", ">", "<", "/", "#"];
    this.currentText = random(this.chars);
    this.timer = 0;
  }
  update() {
    this.y += this.speed;
    if (this.y > height + 20) {
      this.y = -50;
      this.x = random(width);
      this.currentText = random(this.chars);
    }
    this.timer++;
    if (this.timer % 30 === 0) {
      this.currentText = random(this.chars);
    }
  }
  reactToMouse(mx, my) {
    let d = dist(this.x, this.y, mx, my);
    if (d < 70) {
      this.speed = 6;
    } else {
      this.speed = 2;
    }
  }
  display() {
    push();
    textFont("sans-serif");
    textSize(9);
    fill(255, 16, 240, 60);
    noStroke();
    text(this.currentText, this.x, this.y);
    pop();
  }
}

// fondo de victoria con palabras que suben suavemente
class WinAscentWord {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.txt = random(["LIBERTAD", "AUTONOMÍA", "PAUSA", "CALMA", "SOPORTE"]);
  }
  update() {
    this.y -= this.speed;
    if (this.y < -20) {
      this.y = height + 20;
      this.x = random(width);
    }
  }
  display() {
    push();
    textFont("sans-serif");
    textSize(8.5);
    fill(0, 255, 102, 90);
    noStroke();
    text(this.txt, this.x, this.y);
    pop();
  }
}

// fondo de derrota con partículas de error que caen en zigzag suave
class LoseSpiralParticle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.txt = random(["ERR", "FATAL", "BUG", "X", "!"]);
    this.angle = random(TWO_PI);
  }
  update() {
    this.y += this.speed;
    this.angle += 0.05;
    this.x += sin(this.angle) * 1.5;
    if (this.y > height) {
      this.y = -20;
      this.x = random(width);
    }
  }
  display() {
    push();
    textFont("sans-serif");
    textSize(9);
    fill(255, 50, 80, 100);
    noStroke();
    text(this.txt, this.x, this.y);
    pop();
  }
}

// dibuja los títulos letra por letra para que reaccionen cuando pasa el mouse encima
function drawInteractiveTitle(str, x, y, size, mx, my, mode) {
  push();
  textFont(customFont);
  textAlign(CENTER, CENTER);
  textSize(size);
  textStyle(BOLD);

  let letterSpacing = 3;
  let totalW = 0;
  for (let i = 0; i < str.length; i++) {
    totalW += textWidth(str.charAt(i)) + (i < str.length - 1 ? letterSpacing : 0);
  }

  let currX = x - totalW / 2;
  let fakeChars = ["#", "@", "?", "X", "0", "1", "%", "!"];

  for (let i = 0; i < str.length; i++) {
    let charStr = str.charAt(i);
    let charW = textWidth(charStr);
    let charCenterX = currX + charW / 2;
    let charCenterY = y;
    let d = dist(mx, my, charCenterX, charCenterY);

    let offsetX = 0;
    let offsetY = 0;
    let angle = 0;
    let scaleF = 1.0;
    let alphaVal = 255;
    let col = color(0, 255, 102);

    if (d < 70) {
      if (mode === "GLITCH") {
        offsetX = random(-5, 5);
        offsetY = random(-5, 5);
        col = color(255, 16, 240);
        if (charStr !== " " && random() < 0.4) charStr = random(fakeChars);
      } else if (mode === "ROTATE") {
        angle = map(d, 0, 70, PI, 0);
        col = color(255, 204, 0);
      } else if (mode === "FADE") {
        alphaVal = map(d, 0, 70, 20, 255);
        col = color(0, 240, 255);
      } else if (mode === "EXPAND") {
        scaleF = map(d, 0, 70, 1.55, 1.0);
        col = color(255, 204, 0);
      } else if (mode === "COLOR_SHAKE") {
        offsetY = sin(frameCount * 0.5 + i) * 6;
        col = color(255, 16, 240);
      }
    }

    push();
    translate(charCenterX + offsetX, charCenterY + offsetY);
    rotate(angle);
    scale(scaleF);
    fill(red(col), green(col), blue(col), alphaVal);
    noStroke();
    text(charStr, 0, 0);
    pop();

    currX += charW + letterSpacing;
  }
  pop();
}

// acomoda párrafos en líneas y anima cada carácter cuando el cursor se acerca
function drawInteractiveBodyText(str, centerX, centerY, size, baseColor, hoverColor, mx, my, maxW, mode) {
  push();
  textFont("sans-serif");
  textSize(size);
  textStyle(NORMAL);

  let paragraphs = str.split('\n');
  let lines = [];

  for (let p = 0; p < paragraphs.length; p++) {
    let para = paragraphs[p];
    if (para.trim() === '') {
      lines.push('');
      continue;
    }

    let words = para.split(' ');
    let currentLine = '';

    for (let w = 0; w < words.length; w++) {
      let word = words[w];
      let testLine = currentLine === '' ? word : currentLine + ' ' + word;
      if (textWidth(testLine) > maxW && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine !== '') {
      lines.push(currentLine);
    }
  }

  let lineHeight = size * 1.55;
  let totalHeight = lines.length * lineHeight;
  let currentY = centerY - totalHeight / 2 + lineHeight / 2;
  let wrongPool = ["#", "@", "?", "!", "X", "0", "1", "*"];

  for (let l = 0; l < lines.length; l++) {
    let lineStr = lines[l];
    if (lineStr === '') {
      currentY += lineHeight * 0.6;
      continue;
    }

    let charWidths = [];
    let exactLineW = 0;
    for (let i = 0; i < lineStr.length; i++) {
      let charStr = lineStr.charAt(i);
      let cw = (charStr === ' ') ? size * 0.4 : Math.max(textWidth(charStr), size * 0.25);
      charWidths.push(cw);
      exactLineW += cw;
    }

    let currX = centerX - exactLineW / 2;

    for (let i = 0; i < lineStr.length; i++) {
      let charStr = lineStr.charAt(i);
      let charW = charWidths[i];
      let charCenterX = currX + charW / 2;
      let charCenterY = currentY;

      if (charStr !== ' ') {
        let d = dist(mx, my, charCenterX, charCenterY);
        let scaleF = 1.0;
        let angle = 0;
        let alphaVal = 255;
        let offsetX = 0;
        let offsetY = 0;
        let col = baseColor;
        let renderChar = charStr;

        if (d < 42) {
          let factor = map(d, 0, 42, 1, 0);
          if (mode === "MISWRITE") {
            col = hoverColor;
            offsetY = random(-3, 3) * factor;
            if (random() < 0.55) {
              renderChar = random(wrongPool);
            }
          } else if (mode === "ROTATE") {
            angle = PI * factor;
            col = hoverColor;
          } else if (mode === "FADE") {
            alphaVal = map(d, 0, 42, 15, 255);
            col = hoverColor;
          } else if (mode === "EXPAND") {
            scaleF = 1.0 + 0.55 * factor;
            col = hoverColor;
          } else if (mode === "COLOR_SHAKE") {
            col = (frameCount + i) % 10 < 5 ? hoverColor : color(0, 240, 255);
            offsetX = sin(frameCount * 0.8 + i) * 3 * factor;
          }
        }

        push();
        translate(charCenterX + offsetX, charCenterY + offsetY);
        rotate(angle);
        scale(scaleF);
        fill(red(col), green(col), blue(col), alphaVal);
        noStroke();
        textAlign(CENTER, CENTER);
        text(renderChar, 0, 0);
        pop();
      }

      currX += charW;
    }
    currentY += lineHeight;
  }
  pop();
}

// captura las teclas que escribe el jugador durante el nivel
function keyTyped() {
  if (gameState === "NIVEL1") {
    if (key.length === 1) {
      userInput += key;
    }
  }
}

// bloqueo borrar y suprimir en el nivel para que no se borre lo escrito
function keyPressed() {
  if (gameState === "NIVEL1") {
    if (keyCode === BACKSPACE || keyCode === DELETE) {
      return false; 
    }
  }
}

// maneja los clics en botones según la pantalla en la que esté el jugador
function mousePressed() {
  if (gameState === "INTRO") {
    if (enterHomeButton.isHovered) {
      enterHomeButton.pressOffset = 4;
      gameState = "INFO_INTEGRIDAD";
    }
  } 
  else if (gameState === "INFO_INTEGRIDAD") {
    if (enterInfoButton.isHovered) {
      enterInfoButton.pressOffset = 4;
      gameState = "HOME";
    }
  }
  else if (gameState === "HOME") {
    if (startButton.isHovered) {
      startButton.pressOffset = 4;
      iniciarNuevaPartida();
      gameState = "NIVEL1";
    }
  } 
  else if (gameState === "NIVEL1") {
    // botón trampa: resta 5s y 20 de integridad, y rompe la racha al 100%
    if (extButton.isHovered) {
      extButton.pressOffset = 4;
      timeLeft = max(0, timeLeft - 5); 
      integrity -= 20;
      integrity = constrain(integrity, 0, 100);
      if (integrity < 100) {
        racha100Consecutiva = 0;
      }
      usoTrampaEnPregunta = true;
      if (timeLeft <= 0 && !timeUpExplosionTriggered) {
        timeUpExplosionTriggered = true;
        dispararExplosionTiempoAgotado();
      }
    }
    
    // botón siguiente: valida extensión, aplica cambios de integridad y revisa victoria o derrota
    if (nextButton.isHovered) {
      nextButton.pressOffset = 4;
      
      let textoActual = userInput.trim();
      let palabrasArray = textoActual === "" ? [] : textoActual.split(/[\s,]+/);
      let cantidadPalabras = palabrasArray.length;

      let promptActual = questions[currentQuestionIndex].prompt;
      let numeroRequerido = null;
      let matchNum = promptActual.match(/\b5\b/);
      if (matchNum) {
        numeroRequerido = parseInt(matchNum[0]);
      }

      // si pide 5 elementos y no llega a 5, penaliza con -20 de integridad y muestra aviso
      if (numeroRequerido !== null && cantidadPalabras < numeroRequerido) {
        integrity -= 20;
        integrity = constrain(integrity, 0, 100);
        racha100Consecutiva = 0;
        warningMessage = "INSUFICIENTE CANTIDAD DE PALABRAS";
        warningTimer = 90;
        if (integrity <= 0) {
          gameState = "PERDIO";
        }
        return; 
      }

      // si tiene menos de 3 palabras, también resta 20 de integridad y avisa
      if (cantidadPalabras < 3) {
        integrity -= 20;
        integrity = constrain(integrity, 0, 100);
        racha100Consecutiva = 0;
        warningMessage = "INSUFICIENTE CANTIDAD DE PALABRAS";
        warningTimer = 90;
        if (integrity <= 0) {
          gameState = "PERDIO";
        }
        return; 
      }

      // si usó trampa o envió antes de que acabara el tiempo, pierde 20; si esperó a que llegara a 0, sube 20
      if (usoTrampaEnPregunta || timeLeft > 0) {
        integrity -= 20; 
      } else {
        integrity += 20; 
      }
      
      integrity = constrain(integrity, 0, 100);

      if (integrity <= 0) {
        gameState = "PERDIO";
        return;
      }

      // cuento cuántas preguntas seguidas lleva manteniendo la integridad en 100%
      if (integrity === 100) {
        racha100Consecutiva++;
      } else {
        racha100Consecutiva = 0;
      }

      // gana solo cuando completa 5 preguntas seguidas sin bajar del 100%
      if (racha100Consecutiva >= 5 && integrity === 100) {
        gameState = "GANO";
        return;
      }

      currentQuestionIndex++;
      
      // pierde si se terminan las 19 preguntas sin haber logrado las 5 seguidas al 100%
      if (currentQuestionIndex >= questions.length) {
        gameState = "PERDIO";
        return;
      }
      
      // limpio el campo y reinicio el cronómetro para la siguiente pregunta
      userInput = ""; 
      timeUpExplosionTriggered = false;
      timeUpParticles = [];
      timeLeft = 15;

      usoTrampaEnPregunta = false; 
      lastSecondTime = millis();
    }
  }
  else if (gameState === "GANO" || gameState === "PERDIO") {
    if (restartButton.isHovered) {
      restartButton.pressOffset = 4;
      gameState = "INTRO";
    }
  }
}

// reinicia valores, mezcla el banco de preguntas y arranca el contador en 15 segundos
function iniciarNuevaPartida() {
  integrity = 100;
  currentQuestionIndex = 0;
  racha100Consecutiva = 0;
  userInput = "";
  warningTimer = 0;
  usoTrampaEnPregunta = false;
  timeUpExplosionTriggered = false;
  timeUpParticles = [];
  
  let poolCopia = [...questionPool];
  poolCopia.sort(() => Math.random() - 0.5);
  questions = poolCopia; 
  
  timeLeft = 15;
  
  lastSecondTime = millis();
}

// clase reutilizable para los botones con efecto hover y hundimiento al pulsar
class MenuButton {
  constructor(x, y, w, h, label, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.baseCol = col;
    this.isHovered = false;
    this.pressOffset = 0;
  }

  checkHover(mx, my) {
    if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
      this.isHovered = true;
    } else {
      this.isHovered = false;
    }
  }

  display() {
    push();
    stroke(this.baseCol);
    strokeWeight(3);
    
    if (this.isHovered) {
      fill(this.baseCol);
    } else {
      fill(10, 10, 20);
    }

    rect(this.x, this.y + this.pressOffset, this.w, this.h, 4);

    noStroke();
    textFont(customFont);
    fill(this.isHovered ? 0 : 255);
    textSize(8.5); 
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2 + this.pressOffset + 1);
    
    if (this.pressOffset > 0) {
      this.pressOffset -= 1;
    }
    pop();
  }
}