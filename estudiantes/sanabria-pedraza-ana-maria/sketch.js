// Entrega final Ana Maria Sanabria
// 99.99%
// Referentes
// Infinity Rooms (Yayoi Kusama)
// Alicia en el país de las maravillas
// Backrooms

// SONIDOS SALA 1 Y 2

let sonidoSala1;
let sonidoSala2;

// PANTALLAS

// 0 = portada
// 1 = sala 1
// 2 = sala 2

let pantalla = 0;

// OBJETOS

let forma1;
let forma2;
let forma3;
let forma4;
let forma5;
let forma6;
let forma7;
let forma8;
let forma9;
let forma10;

// PUERTA

let puertaX = 300;
let puertaY = 250;

let puertaW = 110;
let puertaH = 180;

let puertaVelX = 0;
let puertaVelY = 0;

// INTENTOOS

let intentosPuerta = 0;

// QUE NO CUENTE EL MISMO INTENTO

let estabaCerca = false;

// cuando cambia a true la puerta deja de //escapar

let puertaDisponible = false;

// la dificultad aumenta progresivamente

let dificultad = 1;

// mensaje de la 1 sala

let mensaje = "";

// mensaje de la 2 sala

let mensajeSala2 = "";

// PRELOAD

function preload() {
  sonidoSala1 = loadSound("assets/sonido sala 1.mp3");

  sonidoSala2 = loadSound("assets/sonido sala 2.mp3");
}

// SETUP

function setup() {
  createCanvas(600, 500);

  textAlign(CENTER, CENTER);

  rectMode(CENTER);

  textFont("Courier New");

  // OBJETOS GIGANTES

  // ojo

  forma1 = new Forma(
    80,
    90,
    115,
    color(255, 46, 147),
    color(0, 185, 255),
    0,
    ""
  );

  // flor

  forma2 = new Forma(
    220,
    90,
    110,
    color(255, 230, 0),
    color(255, 46, 147),
    1,
    "CASI"
  );

  // boca

  forma3 = new Forma(
    470,
    85,
    125,
    color(255, 46, 147),
    color(255, 107, 26),
    2,
    ""
  );

  // espiral

  forma4 = new Forma(
    530,
    220,
    125,
    color(255, 107, 26),
    color(255, 230, 0),
    3,
    "99.99%"
  );

  // sol cara

  forma5 = new Forma(
    85,
    350,
    125,
    color(255, 230, 0),
    color(255, 46, 147),
    4,
    "SAL"
  );

  // mano

  forma6 = new Forma(
    215,
    405,
    120,
    color(255, 107, 26),
    color(0, 185, 255),
    5,
    "OPRIMEME"
  );

  // cara rara

  forma7 = new Forma(
    420,
    395,
    120,
    color(0, 185, 255),
    color(255, 46, 147),
    6,
    "OTRA VEZ"
  );

  // rectangulo

  forma8 = new Forma(
    540,
    380,
    100,
    color(255, 46, 147),
    color(255, 230, 0),
    7,
    "SALIDA"
  );

  // estrella

  forma9 = new Forma(
    300,
    120,
    105,
    color(0, 185, 255),
    color(255, 107, 26),
    8,
    "POR AQUÍ"
  );

  // cartel fake

  forma10 = new Forma(
    310,
    360,
    125,
    color(255, 46, 147),
    color(255, 230, 0),
    9,
    "SALIDA"
  );
}

// DRAW

function draw() {
  // PORTADA

  if (pantalla == 0) {
    portada();
  }

  // SALA 1
  else if (pantalla == 1) {
    background(10);

    dibujarCuarto();

    // la puerta se dibuja antes
    // para que los objetos puedan taparla

    moverPuerta();

    dibujarPuerta();

    // COMPORTAMIENTO 1 SE MUEVEN SOLOS

    forma1.mover();
    forma2.mover();
    forma3.mover();
    forma4.mover();
    forma5.mover();
    forma6.mover();
    forma7.mover();
    forma8.mover();
    forma9.mover();
    forma10.mover();

    // COMPORTAMIENTO 2 REACCIONAN AL MOUSE

    forma1.reaccionarMouse();
    forma2.reaccionarMouse();
    forma3.reaccionarMouse();
    forma4.reaccionarMouse();
    forma5.reaccionarMouse();
    forma6.reaccionarMouse();
    forma7.reaccionarMouse();
    forma8.reaccionarMouse();
    forma9.reaccionarMouse();
    forma10.reaccionarMouse();

    // dibujo los objetos

    forma1.mostrar();
    forma2.mostrar();
    forma3.mostrar();
    forma4.mostrar();
    forma5.mostrar();
    forma6.mostrar();
    forma7.mostrar();
    forma8.mostrar();
    forma9.mostrar();
    forma10.mostrar();

    // MENSAJE

    noStroke();

    fill(255, 46, 147);

    textFont("Courier New");

    textSize(22);

    text(mensaje, width / 2, 35);
  }

  // SALA 2
  else if (pantalla == 2) {
    dibujarSala2();
  }
}

// PORTADA

function portada() {
  background(10);

  // ojo

  noStroke();

  fill(255, 46, 147);

  ellipse(80, 80, 120, 70);

  fill(255, 230, 0);

  ellipse(80, 80, 75, 42);

  fill(0, 185, 255);

  ellipse(80, 80, 35, 35);

  fill(10);

  ellipse(80, 80, 15, 15);

  // flor

  fill(255, 230, 0);

  ellipse(510, 85, 45, 45);
  ellipse(555, 85, 45, 45);
  ellipse(532, 62, 45, 45);
  ellipse(532, 108, 45, 45);

  fill(255, 46, 147);

  ellipse(532, 85, 38, 38);

  fill(0, 185, 255);

  ellipse(532, 85, 15, 15);

  // círculos  de abajo

  fill(0, 185, 255);

  ellipse(70, 420, 90, 90);

  fill(255, 46, 147);

  ellipse(70, 420, 55, 55);

  fill(255, 230, 0);

  ellipse(70, 420, 22, 22);

  // estrella

  fill(255, 107, 26);

  ellipse(535, 410, 70, 70);

  triangle(535, 350, 520, 390, 550, 390);

  triangle(535, 470, 520, 430, 550, 430);

  triangle(475, 410, 515, 395, 515, 425);

  triangle(595, 410, 555, 395, 555, 425);

  // nombre

  noStroke();

  fill(255, 46, 147);

  textFont("Courier New");

  textSize(70);

  text("99.99%", width / 2, 185);

  fill(0, 185, 255);

  textSize(16);

  text("UN JUEGO SOBRE INTENTAR SALIR", width / 2, 245);

  // botón iniciar

  stroke(255, 230, 0);

  strokeWeight(3);

  fill(10);

  rect(width / 2, 330, 170, 60, 8);

  noStroke();

  fill(255, 230, 0);

  textSize(22);

  text("INICIAR", width / 2, 330);

  fill(255, 107, 26);

  textSize(12);

  text("¿VAS A PODER SALIR?", width / 2, 385);
}

// SALA 2

function dibujarSala2() {
  // fondo claro

  background(245);

  // CUARTO CON PROFUNDIDAD

  stroke(205);

  strokeWeight(2);

  // pared pequeña del fondo

  noFill();

  rect(width / 2, 235, 180, 130);

  // líneas desde las esquinas hasta la pared // del fondo

  line(0, 0, 210, 170);

  line(width, 0, 390, 170);

  line(0, height, 210, 300);

  line(width, height, 390, 300);

  // LÍNEAS DEL PISO

  stroke(220);

  strokeWeight(1);

  line(80, height, 235, 300);

  line(180, height, 265, 300);

  line(420, height, 335, 300);

  line(520, height, 365, 300);

  // línea del fondo

  line(210, 300, 390, 300);

  // línea del techo

  line(210, 170, 390, 170);

  // SILLA SOLA

  stroke(175);

  strokeWeight(3);

  fill(238);

  // asiento

  rect(width / 2, 320, 65, 14, 3);

  // respaldo

  rect(width / 2, 286, 55, 50, 3);

  // patas

  line(width / 2 - 22, 327, width / 2 - 28, 365);

  line(width / 2 + 22, 327, width / 2 + 28, 365);

  // MATACHITO / JUGADOR

  noStroke();

  fill(80);

  // cabeza

  ellipse(mouseX, mouseY - 15, 16, 16);

  // cuerpo

  rect(mouseX, mouseY + 5, 14, 28, 5);

  // brazos

  stroke(80);

  strokeWeight(3);

  line(mouseX - 6, mouseY, mouseX - 15, mouseY + 10);

  line(mouseX + 6, mouseY, mouseX + 15, mouseY + 10);

  // piernas

  line(mouseX - 4, mouseY + 18, mouseX - 9, mouseY + 32);

  line(mouseX + 4, mouseY + 18, mouseX + 9, mouseY + 32);

  // TEXTO

  noStroke();

  fill(70);

  textFont("Courier New");

  textSize(24);

  text("LLEGASTE", width / 2, 95);

  textSize(16);

  text("¿Y AHORA?", width / 2, 130);

  // mensaje si decide quedarse

  fill(120);

  textSize(14);

  text(mensajeSala2, width / 2, 205);

  // BOTÓN VOLVER

  stroke(140);

  strokeWeight(2);

  fill(245);

  rect(220, 420, 125, 50, 5);

  noStroke();

  fill(70);

  textSize(16);

  text("VOLVER", 220, 420);

  // BOTÓN QUEDARME

  stroke(140);

  strokeWeight(2);

  fill(245);

  rect(380, 420, 125, 50, 5);

  noStroke();

  fill(70);

  text("QUEDARME", 380, 420);
}

// CLASE FORMA

class Forma {
  constructor(x, y, tam, color1, color2, tipo, palabra) {
    this.x = x;
    this.y = y;

    this.tam = tam;

    this.tamActual = tam;

    this.color1 = color1;
    this.color2 = color2;

    this.tipo = tipo;

    this.palabra = palabra;

    this.velX = random(-1, 1);

    this.velY = random(-1, 1);
  }

  // MOSTRAR

  mostrar() {
    noStroke();

    // 0 - OJO

    if (this.tipo == 0) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual * 1.4, this.tamActual * 0.8);

      fill(255, 230, 0);

      ellipse(this.x, this.y, this.tamActual, this.tamActual * 0.55);

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.45);

      fill(10);

      ellipse(this.x, this.y, this.tamActual * 0.2);
    }

    // 1 - FLOR
    else if (this.tipo == 1) {
      fill(this.color1);

      ellipse(this.x - this.tamActual * 0.3, this.y, this.tamActual * 0.55);

      ellipse(this.x + this.tamActual * 0.3, this.y, this.tamActual * 0.55);

      ellipse(this.x, this.y - this.tamActual * 0.3, this.tamActual * 0.55);

      ellipse(this.x, this.y + this.tamActual * 0.3, this.tamActual * 0.55);

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.55);

      fill(0, 185, 255);

      ellipse(this.x, this.y, this.tamActual * 0.22);
    }

    // 2 - BOCA
    else if (this.tipo == 2) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual * 1.4, this.tamActual * 0.8);

      fill(10);

      ellipse(this.x, this.y, this.tamActual, this.tamActual * 0.32);

      fill(this.color2);

      ellipse(
        this.x,
        this.y + this.tamActual * 0.12,
        this.tamActual * 0.6,
        this.tamActual * 0.2
      );
    }

    // 3 - ESPIRAL
    else if (this.tipo == 3) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual);

      fill(this.color2);

      ellipse(this.x + this.tamActual * 0.08, this.y, this.tamActual * 0.75);

      fill(255, 46, 147);

      ellipse(this.x, this.y + this.tamActual * 0.05, this.tamActual * 0.5);

      fill(10);

      ellipse(this.x + this.tamActual * 0.05, this.y, this.tamActual * 0.25);
    }

    // 4 - SOL / CARA
    else if (this.tipo == 4) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual * 1.2);

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.75);

      fill(10);

      ellipse(
        this.x - this.tamActual * 0.15,
        this.y - this.tamActual * 0.08,
        this.tamActual * 0.12
      );

      ellipse(
        this.x + this.tamActual * 0.15,
        this.y - this.tamActual * 0.08,
        this.tamActual * 0.12
      );

      fill(0, 185, 255);

      ellipse(
        this.x,
        this.y + this.tamActual * 0.18,
        this.tamActual * 0.25,
        this.tamActual * 0.1
      );
    }

    // 5 - MANO
    else if (this.tipo == 5) {
      fill(this.color1);

      rect(this.x, this.y, this.tamActual * 0.55, this.tamActual * 0.7, 25);

      rect(
        this.x - this.tamActual * 0.23,
        this.y - this.tamActual * 0.42,
        this.tamActual * 0.13,
        this.tamActual * 0.55,
        10
      );

      rect(
        this.x - this.tamActual * 0.08,
        this.y - this.tamActual * 0.5,
        this.tamActual * 0.13,
        this.tamActual * 0.65,
        10
      );

      rect(
        this.x + this.tamActual * 0.08,
        this.y - this.tamActual * 0.48,
        this.tamActual * 0.13,
        this.tamActual * 0.62,
        10
      );

      rect(
        this.x + this.tamActual * 0.23,
        this.y - this.tamActual * 0.38,
        this.tamActual * 0.13,
        this.tamActual * 0.5,
        10
      );

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.25);
    }

    // 6 - CARA RARA
    else if (this.tipo == 6) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual);

      fill(this.color2);

      ellipse(
        this.x - this.tamActual * 0.2,
        this.y - this.tamActual * 0.1,
        this.tamActual * 0.28
      );

      fill(255, 230, 0);

      ellipse(
        this.x + this.tamActual * 0.2,
        this.y - this.tamActual * 0.1,
        this.tamActual * 0.18
      );

      fill(10);

      ellipse(
        this.x - this.tamActual * 0.2,
        this.y - this.tamActual * 0.1,
        this.tamActual * 0.1
      );

      ellipse(
        this.x + this.tamActual * 0.2,
        this.y - this.tamActual * 0.1,
        this.tamActual * 0.07
      );

      fill(255, 107, 26);

      ellipse(
        this.x,
        this.y + this.tamActual * 0.23,
        this.tamActual * 0.4,
        this.tamActual * 0.16
      );
    }

    // 7 - RECTANGULO
    else if (this.tipo == 7) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual);

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.7);

      fill(0, 185, 255);

      ellipse(this.x, this.y, this.tamActual * 0.43);

      fill(10);

      ellipse(this.x, this.y, this.tamActual * 0.2);
    }

    // 8 - ESTRELLA
    else if (this.tipo == 8) {
      fill(this.color1);

      ellipse(this.x, this.y, this.tamActual * 0.7);

      triangle(
        this.x,
        this.y - this.tamActual * 0.65,
        this.x - this.tamActual * 0.18,
        this.y - this.tamActual * 0.2,
        this.x + this.tamActual * 0.18,
        this.y - this.tamActual * 0.2
      );

      triangle(
        this.x,
        this.y + this.tamActual * 0.65,
        this.x - this.tamActual * 0.18,
        this.y + this.tamActual * 0.2,
        this.x + this.tamActual * 0.18,
        this.y + this.tamActual * 0.2
      );

      triangle(
        this.x - this.tamActual * 0.65,
        this.y,
        this.x - this.tamActual * 0.2,
        this.y - this.tamActual * 0.18,
        this.x - this.tamActual * 0.2,
        this.y + this.tamActual * 0.18
      );

      triangle(
        this.x + this.tamActual * 0.65,
        this.y,
        this.x + this.tamActual * 0.2,
        this.y - this.tamActual * 0.18,
        this.x + this.tamActual * 0.2,
        this.y + this.tamActual * 0.18
      );

      fill(this.color2);

      ellipse(this.x, this.y, this.tamActual * 0.35);
    }

    // 9 - CARTEL FAKE
    else if (this.tipo == 9) {
      fill(this.color1);

      rect(this.x, this.y, this.tamActual * 1.3, this.tamActual * 0.65, 10);

      fill(10);

      rect(this.x, this.y, this.tamActual * 1.05, this.tamActual * 0.43, 5);
    }

    // PALABRAS

    if (this.palabra != "") {
      fill(255);

      textFont("Courier New");

      textSize(this.tamActual * 0.14);

      text(this.palabra, this.x, this.y);
    }
  }

  // COMPORTAMIENTO 1
  // SE MUEVEN SOLOS

  mover() {
    this.x = this.x + this.velX;

    this.y = this.y + this.velY;

    if (this.x < 40 || this.x > width - 40) {
      this.velX = this.velX * -1;
    }

    if (this.y < 60 || this.y > height - 40) {
      this.velY = this.velY * -1;
    }
  }

  // COMPORTAMIENTO 2 REACCIONAN AL MOUSE

  reaccionarMouse() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    if (d < 110) {
      this.tamActual = this.tam * 1.4;

      if (mouseX < this.x) {
        this.x = this.x - 1;
      } else {
        this.x = this.x + 1;
      }

      if (mouseY < this.y) {
        this.y = this.y - 1;
      } else {
        this.y = this.y + 1;
      }
    } else {
      this.tamActual = this.tam;
    }
  }

  // COMPORTAMIENTO 3
  // REACCIONAN AL CLIC

  reaccionarClick() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    if (d < this.tamActual / 2) {
      this.x = random(60, width - 60);

      this.y = random(70, height - 60);

      mensaje = "HAZLO OTRA VEZ";
    }
  }
}

// CUARTO

function dibujarCuarto() {
  stroke(0, 185, 255);

  strokeWeight(2);

  line(0, 0, 180, 140);

  line(width, 0, 420, 140);

  line(0, height, 180, 340);

  line(width, height, 420, 340);

  noFill();

  stroke(255, 46, 147);

  strokeWeight(3);

  rect(width / 2, 240, 240, 200);
}

// PUERTA

function dibujarPuerta() {
  stroke(255, 230, 0);

  strokeWeight(5);

  fill(15);

  rect(puertaX, puertaY, puertaW, puertaH, 8);

  stroke(255, 46, 147);

  strokeWeight(3);

  fill(25);

  rect(puertaX, puertaY, puertaW - 18, puertaH - 18, 5);

  noStroke();

  fill(0, 185, 255);

  textFont("Courier New");

  textSize(16);

  text("SALIDA", puertaX, puertaY - 55);

  fill(255, 107, 26);

  ellipse(puertaX + 28, puertaY + 15, 12, 12);
}

// MOVIMIENTO DE LA PUERTA

function moverPuerta() {
  let d = dist(mouseX, mouseY, puertaX, puertaY);

  // cuento intentos

  if (d < 80 && estabaCerca == false) {
    intentosPuerta = intentosPuerta + 1;

    // ahora aumenta más lento porque hay más // intentos

    dificultad = dificultad + 0.1;

    estabaCerca = true;

    mensaje = "99.99%";
  }

  // cuando me alejo permito otro intento

  if (d > 120) {
    estabaCerca = false;
  }

  // después de 18 intentos deja de escapar

  if (intentosPuerta >= 18) {
    puertaDisponible = true;
  }

  // mientras no está disponible

  if (puertaDisponible == false) {
    if (d < 170) {
      // mensajes según los intentos

      if (intentosPuerta < 4) {
        mensaje = "CASI";
      } else if (intentosPuerta < 8) {
        mensaje = "YA CASI";
      } else if (intentosPuerta < 12) {
        mensaje = "99.99%";
      } else if (intentosPuerta < 16) {
        mensaje = "OTRA VEZ";
      } else {
        mensaje = "SIGUE";
      }

      // se escapa del mouse

      if (mouseX < puertaX) {
        puertaVelX = 2.3 * dificultad;
      } else {
        puertaVelX = -2.3 * dificultad;
      }

      if (mouseY < puertaY) {
        puertaVelY = 1.8 * dificultad;
      } else {
        puertaVelY = -1.8 * dificultad;
      }

      // se hace más pequeña

      if (puertaW > 50) {
        puertaW = puertaW - 0.18;

        puertaH = puertaH - 0.25;
      }
    } else {
      puertaVelX = puertaVelX * 0.93;

      puertaVelY = puertaVelY * 0.93;
    }
  }

  // si ya está disponible deja de moverse
  else {
    puertaVelX = 0;

    puertaVelY = 0;
  }

  // se actualiza la posición

  puertaX = puertaX + puertaVelX;

  puertaY = puertaY + puertaVelY;

  // no deja que salga del canvas

  if (puertaX < 70) {
    puertaX = 70;

    puertaVelX = puertaVelX * -1;
  }

  if (puertaX > width - 70) {
    puertaX = width - 70;

    puertaVelX = puertaVelX * -1;
  }

  if (puertaY < 110) {
    puertaY = 110;

    puertaVelY = puertaVelY * -1;
  }

  if (puertaY > height - 110) {
    puertaY = height - 110;

    puertaVelY = puertaVelY * -1;
  }
}

// REINICIO DE LA SALA 1

function reiniciarSala1() {
  puertaX = 300;
  puertaY = 250;

  puertaW = 110;
  puertaH = 180;

  puertaVelX = 0;
  puertaVelY = 0;

  intentosPuerta = 0;

  estabaCerca = false;

  puertaDisponible = false;

  dificultad = 1;

  mensaje = "";
}

// CLIC

function mousePressed() {
  // PORTADA

  if (pantalla == 0) {
    if (mouseX > 215 && mouseX < 385 && mouseY > 300 && mouseY < 360) {
      userStartAudio();

      if (sonidoSala1.isPlaying() == false) {
        sonidoSala1.play();
      }

      pantalla = 1;
    }
  }

  // SALA 1
  else if (pantalla == 1) {
    forma1.reaccionarClick();
    forma2.reaccionarClick();
    forma3.reaccionarClick();
    forma4.reaccionarClick();
    forma5.reaccionarClick();
    forma6.reaccionarClick();
    forma7.reaccionarClick();
    forma8.reaccionarClick();
    forma9.reaccionarClick();
    forma10.reaccionarClick();

    // distancia hasta la puerta

    let dPuerta = dist(mouseX, mouseY, puertaX, puertaY);

    // después de 18 intentos hago clic y entro

    if (puertaDisponible == true && dPuerta < puertaW / 2) {
      // se para sonido sala 1

      sonidoSala1.stop();

      // empiezo sonido sala 2

      if (sonidoSala2.isPlaying() == false) {
        sonidoSala2.play();
      }

      mensajeSala2 = "";

      pantalla = 2;
    }
  }

  // SALA 2
  else if (pantalla == 2) {
    // VOLVER

    if (mouseX > 157 && mouseX < 283 && mouseY > 395 && mouseY < 445) {
      // se para sonido sala 2

      sonidoSala2.stop();

      // reinicio sala 1

      reiniciarSala1();

      // se vuelve a ponerr el sonido sala 1

      if (sonidoSala1.isPlaying() == false) {
        sonidoSala1.play();
      }

      pantalla = 1;
    }

    // QUEDARME
    else if (mouseX > 317 && mouseX < 443 && mouseY > 395 && mouseY < 445) {
      mensajeSala2 = "NO HAY NADA MÁS";
    }
  }
}
