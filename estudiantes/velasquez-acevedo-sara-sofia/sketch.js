/*
Sara Sofía Velásquez
Ejercicio FINAL
Defecto de fábrica

INTERPRETACIÓN DEL PROYECTO

Defecto de fábrica es un videojuego que explora la desobediencia como una forma de pensamiento crítico.
La idea nace de cuestionar por qué normalmente relacionamos obedecer con hacer las cosas bien y desobedecer con cometer errores.

En este juego se invierte esa lógica.El jugador debe hacer lo contrario de las instrucciones de la fábrica para avanzar y ganar.

La fábrica representa un sistema que establece reglas y controla
el comportamiento de los juguetes.

El robot representa al jugador,quien tiene la posibilidad de cuestionar y desafiar esas órdenes.

La frase principal es:
"En esta fábrica ser diferente
es un acierto".

FUNCIONALIDADES

1. El juego tiene cuatro pantallas:
inicio, juego, victoria y derrota.

2. El jugador controla un robot
amarillo creado con la clase Jugador.

3. Los juguetes están construidos
con la clase Juguete y tienen
distintas formas, colores y movimientos.

4. Existen cinco niveles con órdenes
que el jugador debe desobedecer.

5. Cada nivel requiere tres aciertos,
excepto el nivel de espacio.

6. La dificultad aumenta porque
los juguetes se mueven más rápido
al avanzar de nivel.

7. El jugador tiene un tiempo límite
y puede acumular hasta tres errores.

8. Si completa los cinco niveles,
gana y aparece el mensaje:
"GANASTE, ERES UN DESAFIANTE".

9. Si acumula tres errores, pierde
y aparece el mensaje:
"DEJA DE SEGUIR LAS INSTRUCCIONES".

10. El jugador puede interactuar
mediante teclado o mouse.
También puede tocar los juguetes
desde una pantalla táctil.

HERRAMIENTAS DE PROGRAMACIÓN
setup()
draw()
Variables
Condicionales if
Ciclos for
Arreglos
Clases y objetos
Funciones
keyPressed()
mousePressed()
keyIsDown()
random()
dist()
translate() y rotate()
Figuras geométricas

REFERENTE CONCEPTUAL
There Is No Game: Wrong Dimension
Draw Me A Pixel, 2020.

Se tomó como referencia la idea
de cuestionar las instrucciones
para poder avanzar.Esta idea fue adaptada a una fábrica de juguetes con un robot,figuras geométricas y cinco niveles.

REFLEXIÓN PERSONAL

Este proyecto me permitió entender
que la desobediencia no siempre
representa algo negativo.A veces cuestionar una instrucción
puede ser una manera de pensardiferente, desarrollar creatividad
y tomar decisiones propias.
Mi intención es que el jugador experimente la contradicción entre
obedecer y ganar, y reflexione sobre las instrucciones que seguimos
en nuestra vida cotidiana.

DESCRIPCIÓN GENERAL

El jugador controla un robot amarillo
que debe desobedecer las órdenes.

El juego tiene cuatro pantallas:
0: Inicio
1: Juego
2: Victoria
3: Derrota

Cada nivel necesita tres aciertos,
excepto la orden de espacio.

Los juguetes se mueven más rápido
cada vez que se supera un nivel.

El jugador pierde con tres errores.

El jugador se mueve con las flechas
y selecciona juguetes cercanos con E.

También puede tocar los juguetes
con el mouse o una pantalla táctil.

Los dibujos se construyeron con
figuras geométricas de p5.js.
*/

// VARIABLES GENERALES
// Guardan la información del juego.

let juguetes = [];
let jugador;

let pantalla = 0;
let nivel = 0;
let puntos = 0;
let errores = 0;
let aciertosNivel = 0;

let tiempo = 0;
let limite = 1800;

// ARREGLO DE ÓRDENES
// Guarda las instrucciones de los niveles.

let ordenes = [
  "NO TOQUES LAS ESTRELLAS",
  "NO TOQUES LOS CIRCULOS",
  "NO PRESIONES ESPACIO",
  "NO TOQUES LOS TRIANGULOS",
  "NO TOQUES LOS CUADRADOS"
];

// SETUP
// Se ejecuta una sola vez.
// Configura el lienzo y crea los objetos.

function setup() {
  createCanvas(900, 600);

  rectMode(CENTER);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  jugador = new Jugador(450, 470);

  crearJuguetes();
}

// FUNCIÓN PARA CREAR JUGUETES
// Utiliza dos ciclos for para crear
// 12 juguetes organizados en 3 filas
// y 4 columnas.

function crearJuguetes() {
  juguetes = [];

  for (let fila = 0; fila < 3; fila++) {
    for (let columna = 0; columna < 4; columna++) {

      let x = 140 + columna * 205;
      let y = 255 + fila * 105;

      juguetes.push(
        new Juguete(x, y, columna)
      );
    }
  }
}

// DRAW
// Se ejecuta constantemente.
// Utiliza condicionales para mostrar
// la pantalla correspondiente.

function draw() {

  if (pantalla === 0) {
    pantallaInicio();
  }

  if (pantalla === 1) {
    pantallaJuego();
  }

  if (pantalla === 2) {
    pantallaVictoria();
  }

  if (pantalla === 3) {
    pantallaDerrota();
  }
}

// CLASE JUGADOR
// Es el molde para crear el robot.
// Tiene posición, velocidad y
// comportamientos de movimiento,
// dibujo y selección.

class Jugador {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidad = 4;
  }

  // MOVER
  // keyIsDown detecta las flechas.
  // constrain evita que el robot
  // salga de los límites del juego.

  mover() {

    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidad;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidad;
    }

    if (keyIsDown(UP_ARROW)) {
      this.y -= this.velocidad;
    }

    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.velocidad;
    }

    this.x = constrain(this.x, 40, 860);
    this.y = constrain(this.y, 235, 470);
  }

  // MOSTRAR
  // Dibuja el robot amarillo
  // utilizando figuras geométricas.

  mostrar() {

    push();
    translate(this.x, this.y);

    stroke(60, 50, 75);
    strokeWeight(3);

    // Antena
    line(0, -28, 0, -42);

    fill(255, 130, 160);
    ellipse(0, -44, 12);

    // Cuerpo
    fill(255, 220, 110);
    rect(0, 0, 50, 50, 10);

    // Ojos
    fill(60, 50, 75);
    ellipse(-11, -6, 7, 9);
    ellipse(11, -6, 7, 9);

    // Boca
    noFill();
    arc(0, 7, 20, 12, 0, 180);

    // Brazos
    line(-25, 0, -35, 12);
    line(25, 0, 35, 12);

    // Piernas
    line(-12, 25, -12, 35);
    line(12, 25, 12, 35);

    pop();
  }

  // CERCA
  // dist calcula la distancia
  // entre el robot y un juguete.

  cerca(juguete) {

    let d = dist(
      this.x,
      this.y,
      juguete.x,
      juguete.y
    );

    return d < 75;
  }

  // SELECCIONAR
  // Permite interactuar con
  // los juguetes cercanos.
  // Busca el juguete disponible
  // más cercano al robot.

  seleccionar() {

    if (nivel === 2) {
      return;
    }

    let elegido = null;
    let menor = 75;

    for (let i = 0; i < juguetes.length; i++) {

      let d = dist(
        this.x,
        this.y,
        juguetes[i].x,
        juguetes[i].y
      );

      if (
        d < menor &&
        !juguetes[i].liberado
      ) {
        menor = d;
        elegido = juguetes[i];
      }
    }

    if (elegido !== null) {
      comprobar(elegido);
    }
  }
}

// CLASE JUGUETE
// Crea estrellas, círculos,
// triángulos y cuadrados.
// Cada juguete tiene movimiento,
// rotación y reacciones propias.

class Juguete {

  constructor(x, y, tipo) {

    this.x = x;
    this.y = y;
    this.tipo = tipo;

    // random genera movimientos distintos.
    this.velocidad = random(0.5, 1.5);
    this.direccion = random([-1, 1]);

    this.angulo = 0;
    this.giro = random(-1, 1);

    this.feliz = false;
    this.liberado = false;
  }

  // MOVER
  // Hace que los juguetes
  // se desplacen horizontalmente
  // y reboten en los límites.

  mover() {

    this.x += this.velocidad * this.direccion;

    if (this.x > 830) {
      this.x = 830;
      this.direccion = -1;
    }

    if (this.x < 70) {
      this.x = 70;
      this.direccion = 1;
    }
  }

  // GIRAR
  // Modifica el ángulo del juguete.

  girar() {
    this.angulo += this.giro;
  }

  // MOSTRAR
  // Dibuja cada juguete según su tipo.
  // translate y rotate permiten
  // mover y girar las figuras.

  mostrar() {

    push();

    translate(this.x, this.y);
    rotate(this.angulo);

    stroke(60, 50, 75);
    strokeWeight(3);

    // TIPO 0: ESTRELLA ROSADA

    if (this.tipo === 0) {

      fill(255, 145, 180);

      beginShape();

      for (let i = 0; i < 10; i++) {

        let ang = i * 36 - 90;
        let radio = 30;

        if (i % 2 === 1) {
          radio = 15;
        }

        vertex(
          cos(ang) * radio,
          sin(ang) * radio
        );
      }

      endShape(CLOSE);
    }

    // TIPO 1: CÍRCULO AMARILLO

    if (this.tipo === 1) {
      fill(255, 220, 110);
      ellipse(0, 0, 55);
    }

    // TIPO 2: TRIÁNGULO AZUL

    if (this.tipo === 2) {

      fill(120, 195, 255);

      triangle(
        0, -30,
        -30, 25,
        30, 25
      );
    }

    // TIPO 3: CUADRADO VERDE

    if (this.tipo === 3) {
      fill(140, 220, 160);
      rect(0, 0, 55, 55, 8);
    }

    // CARAS DE LOS JUGUETES

    noStroke();
    fill(60, 50, 75);

    ellipse(-9, -5, 6, 7);
    ellipse(9, -5, 6, 7);

    noFill();
    stroke(60, 50, 75);
    strokeWeight(2);

    // Cuando son liberados, sonríen.
    if (this.feliz) {
      arc(0, 5, 22, 17, 0, 180);
    } else {
      line(-7, 9, 7, 9);
    }

    // Marca del juguete liberado.
    if (this.liberado) {

      noStroke();
      fill(255, 240, 100);
      ellipse(0, -40, 12);
    }

    pop();
  }

  // TOCAR
  // Detecta si el mouse o el dedo
  // selecciona un juguete.

  tocar() {

    let d = dist(
      mouseX,
      mouseY,
      this.x,
      this.y
    );

    return d < 30;
  }

  // SALTAR
  // Los juguetes reaccionan
  // cuando se presiona espacio.

  saltar() {
    this.y -= 15;
    this.feliz = true;
  }

  // LIBERAR
  // Cambia el estado del juguete
  // después de una respuesta correcta.

  liberar() {
    this.feliz = true;
    this.liberado = true;
  }
}

// DIBUJAR FÁBRICA
// Construye el escenario mediante
// rectángulos, líneas y círculos.
// El fondo cambia ligeramente de color
// según los puntos acumulados.

function dibujarFabrica() {

  background(
    195 + puntos * 3,
    190 + puntos * 3,
    195 + puntos * 4
  );

  noStroke();

  // Pared
  fill(220, 210, 205);
  rect(450, 330, 900, 400);

  stroke(185, 175, 175);
  strokeWeight(3);

  line(0, 210, 900, 210);
  line(0, 360, 900, 360);

  // Ventanas
  fill(145, 205, 230);
  stroke(70, 65, 75);
  strokeWeight(4);

  rect(160, 285, 150, 100, 8);
  rect(450, 285, 150, 100, 8);
  rect(740, 285, 150, 100, 8);

  line(160, 235, 160, 335);
  line(450, 235, 450, 335);
  line(740, 235, 740, 335);

  // Tuberías
  stroke(120);
  strokeWeight(12);

  line(0, 225, 280, 225);
  line(280, 225, 280, 380);

  line(900, 225, 620, 225);
  line(620, 225, 620, 380);

  // Columnas
  noStroke();
  fill(140, 135, 145);

  rect(35, 375, 70, 330);
  rect(865, 375, 70, 330);

  // Máquinas
  fill(110, 110, 125);

  rect(105, 450, 110, 110, 10);
  rect(795, 450, 110, 110, 10);

  // Botones de las máquinas
  fill(255, 110, 120);
  ellipse(85, 425, 20);

  fill(255, 215, 100);
  ellipse(120, 425, 20);

  fill(140, 220, 160);
  ellipse(775, 425, 20);

  fill(120, 195, 255);
  ellipse(810, 425, 20);

  // Cinta transportadora
  fill(65, 65, 75);
  rect(450, 555, 900, 90);

  fill(125, 125, 135);
  rect(450, 520, 900, 18);

  for (let i = 0; i < 12; i++) {

    fill(100, 100, 110);
    ellipse(i * 80, 560, 25);
  }

  // Luces
  noStroke();

  fill(255, 120, 140);
  ellipse(380, 205, 18);

  fill(255, 220, 110);
  ellipse(450, 205, 18);

  fill(140, 220, 160);
  ellipse(520, 205, 18);
}

// PANTALLA 0: INICIO
// Presenta el título, el concepto
// y el botón para comenzar.
// Se pasa al juego con espacio
// o haciendo clic en el botón.

function pantallaInicio() {

  background(151, 211, 245);

  noStroke();

  // Sol
  fill(255, 230, 120);
  ellipse(100, 100, 90);

  // Nubes
  fill(255);
  ellipse(200, 130, 120, 45);
  ellipse(700, 120, 130, 45);

  // Exterior de la fábrica
  fill(180, 170, 190);
  rect(450, 410, 650, 280, 15);

  // Chimeneas
  fill(125, 115, 145);
  rect(250, 280, 60, 130);
  rect(650, 280, 60, 130);

  // Puerta
  fill(255, 220, 110);
  rect(450, 430, 130, 180, 10);

  // Ventanas
  fill(145, 205, 230);
  rect(300, 390, 100, 90, 10);
  rect(600, 390, 100, 90, 10);

  // Jardín
  fill(145, 205, 150);
  rect(450, 570, 900, 60);

  // Título
  stroke(60, 50, 75);
  strokeWeight(4);

  fill(255, 220, 110);
  textStyle(BOLD);
  textSize(65);

  text("DEFECTO", 450, 85);
  text("DE FABRICA", 450, 150);

  // Frase conceptual
  textStyle(NORMAL);
  noStroke();

  fill(60, 50, 75);
  textSize(20);

  text(
    "En esta fábrica ser diferente es un acierto",
    450,
    220
  );

  // Robot
  jugador.x = 450;
  jugador.y = 410;
  jugador.mostrar();

  // Botón de inicio
  stroke(60, 50, 75);
  strokeWeight(3);

  fill(255, 240, 210);
  rect(450, 540, 340, 60, 15);

  noStroke();
  fill(60, 50, 75);
  textSize(22);

  text("PRESIONA ESPACIO", 450, 540);
}

// PANTALLA 1: JUEGO
// Muestra las órdenes, los juguetes,
// el robot, los puntos y los errores.
// Actualiza los movimientos.
// Controla el tiempo de cada nivel.

function pantallaJuego() {

  dibujarFabrica();

  // Contador del tiempo
  tiempo++;

  // 1800 fotogramas equivalen
  // aproximadamente a 30 segundos
  // si el juego funciona a 60 FPS.
  limite = 1800;

  // Si se acaba el tiempo,
  // el jugador acumula un error.
  if (tiempo >= limite) {

    errores++;
    tiempo = 0;

    if (errores >= 3) {
      pantalla = 3;
      return;
    }
  }

  // Panel superior
  noStroke();

  fill(255, 240, 215);
  rect(450, 60, 850, 90, 15);

  fill(60, 50, 75);
  textSize(25);

  text("DEFECTO DE FABRICA", 450, 35);

  textSize(17);

  text("PUNTOS: " + puntos, 130, 80);
  text("ERRORES: " + errores + "/3", 330, 80);
  text("NIVEL: " + (nivel + 1), 570, 80);

  // Convertir fotogramas a segundos.
  let segundos = ceil(
    (limite - tiempo) / 60
  );

  text("TIEMPO: " + segundos, 755, 80);

  // Orden de la fábrica
  stroke(60, 50, 75);
  strokeWeight(3);

  fill(255, 220, 110);
  rect(450, 145, 580, 65, 15);

  noStroke();
  fill(60, 50, 75);
  textSize(25);

  text(ordenes[nivel], 450, 145);

  // Ciclo que actualiza los juguetes.
  for (let i = 0; i < juguetes.length; i++) {

    juguetes[i].mover();
    juguetes[i].girar();
    juguetes[i].mostrar();
  }

  // Movimiento del robot
  jugador.mover();
  jugador.mostrar();

  // Detectar juguetes cercanos.
  for (let i = 0; i < juguetes.length; i++) {

    if (
      jugador.cerca(juguetes[i]) &&
      !juguetes[i].liberado
    ) {

      noFill();
      stroke(255, 230, 100);
      strokeWeight(3);

      ellipse(
        juguetes[i].x,
        juguetes[i].y,
        75
      );
    }
  }

  noStroke();
  fill(60, 50, 75);
  textSize(16);

  // El nivel 3 necesita
  // solamente un acierto.
  if (nivel === 2) {

    text(
      "ACIERTOS DEL NIVEL: " +
      aciertosNivel + "/1",
      450,
      475
    );

    text(
      "¡DESOBEDECE PRESIONANDO ESPACIO!",
      450,
      495
    );

    // Botón para pantalla táctil
    stroke(60, 50, 75);
    strokeWeight(3);

    fill(255, 220, 110);
    rect(450, 550, 200, 45, 10);

    noStroke();
    fill(60, 50, 75);
    textSize(19);

    text("ESPACIO", 450, 550);

  } else {

    // Los demás niveles
    // necesitan tres aciertos.
    text(
      "ACIERTOS DEL NIVEL: " +
      aciertosNivel + "/3",
      450,
      475
    );

    text(
      "FLECHAS: MOVER | E: ELEGIR | CLIC: TOCAR",
      450,
      495
    );
  }
}

// PANTALLA 2: VICTORIA
// Aparece cuando se completan
// los cinco niveles.
// Muestra colores y confeti
// para representar la liberación.

function pantallaVictoria() {

  background(155, 220, 245);

  noStroke();

  fill(255, 230, 120);
  ellipse(100, 100, 100);

  fill(145, 220, 160);
  rect(450, 560, 900, 80);

  // Confeti
  for (let i = 0; i < 30; i++) {

    fill(
      100 + (i * 25) % 155,
      120 + (i * 40) % 135,
      130 + (i * 15) % 125
    );

    ellipse(
      (i * 73) % 900,
      (i * 47) % 450,
      10
    );
  }

  // Panel de victoria
  fill(255, 240, 205);
  rect(450, 275, 750, 310, 25);

  fill(60, 50, 75);
  textStyle(BOLD);
  textSize(48);

  text("¡GANASTE!", 450, 195);
  text("ERES UN DESAFIANTE", 450, 255);

  textStyle(NORMAL);
  textSize(24);

  text("LIBERASTE A LOS JUGUETES", 450, 320);
  text("PUNTOS: " + puntos, 450, 355);

  // Robot celebrando
  jugador.x = 450;
  jugador.y = 425;
  jugador.mostrar();

  // Botón de reinicio
  fill(255, 220, 110);
  stroke(60, 50, 75);
  strokeWeight(3);

  rect(450, 530, 350, 65, 15);

  noStroke();
  fill(60, 50, 75);
  textSize(22);

  text("ESPACIO PARA REINICIAR", 450, 530);
}

// PANTALLA 3: DERROTA
// Aparece cuando el jugador
// acumula tres errores.
// Los colores oscuros representan
// que la fábrica mantiene el control.

function pantallaDerrota() {

  background(65, 65, 80);

  noStroke();

  // Fábrica oscura
  fill(95, 95, 110);
  rect(450, 420, 650, 280, 15);

  fill(55, 55, 70);
  rect(250, 280, 60, 130);
  rect(650, 280, 60, 130);

  fill(255, 90, 110);
  rect(450, 420, 130, 180, 10);

  fill(120, 40, 60);
  rect(300, 390, 100, 90, 10);
  rect(600, 390, 100, 90, 10);

  fill(45, 45, 60);
  rect(450, 570, 900, 60);

  // Mensaje de derrota
  fill(255, 120, 140);
  textStyle(BOLD);
  textSize(55);

  text("¡PERDISTE!", 450, 125);

  textStyle(NORMAL);
  fill(255);
  textSize(35);

  text("DEJA DE SEGUIR", 450, 210);
  text("LAS INSTRUCCIONES", 450, 255);

  textSize(22);
  text("PUNTOS: " + puntos, 450, 320);

  // Robot
  jugador.x = 450;
  jugador.y = 410;
  jugador.mostrar();

  // Botón para volver a jugar
  fill(255, 220, 110);
  stroke(60, 50, 75);
  strokeWeight(3);

  rect(450, 530, 350, 65, 15);

  noStroke();
  fill(60, 50, 75);
  textSize(22);

  text("INTENTAR OTRA VEZ", 450, 530);
}

// COMPROBAR RESPUESTAS
// Esta función utiliza condicionales
// para determinar si el jugador
// desobedeció correctamente.
// También permite la interacción
// entre Jugador y Juguete.

function comprobar(juguete) {

  if (pantalla !== 1 || nivel === 2) {
    return;
  }

  // Evitar seleccionar dos veces
  // el mismo juguete liberado.
  if (juguete.liberado) {
    return;
  }

  let tipoCorrecto = -1;

  // Nivel 1: estrellas
  if (nivel === 0) {
    tipoCorrecto = 0;
  }

  // Nivel 2: círculos
  if (nivel === 1) {
    tipoCorrecto = 1;
  }

  // Nivel 4: triángulos
  if (nivel === 3) {
    tipoCorrecto = 2;
  }

  // Nivel 5: cuadrados
  if (nivel === 4) {
    tipoCorrecto = 3;
  }

  // Si la respuesta es correcta,
  // el juguete se libera
  // y el jugador gana puntos.
  if (juguete.tipo === tipoCorrecto) {

    juguete.liberar();

    puntos++;
    aciertosNivel++;

    if (aciertosNivel >= 3) {
      siguienteNivel();
    }

  } else {

    // Si es incorrecta,
    // aumenta el contador de errores.
    errores++;

    if (errores >= 3) {
      pantalla = 3;
    }
  }
}

// SIGUIENTE NIVEL
// Aumenta la dificultad sumando
// velocidad a todos los juguetes.
// Reinicia el tiempo y los aciertos.
// Si termina el nivel 5,
// cambia a la pantalla de victoria.

function siguienteNivel() {

  nivel++;
  aciertosNivel = 0;
  tiempo = 0;

  for (let i = 0; i < juguetes.length; i++) {

    juguetes[i].velocidad += 1;

    juguetes[i].liberado = false;
    juguetes[i].feliz = false;
  }

  if (nivel >= 5) {
    pantalla = 2;
  }
}

// MOUSEPRESSED
// Detecta los clics o toques.
// Permite iniciar, reiniciar
// y seleccionar juguetes.
// También permite presionar
// el botón de espacio en iPad.

function mousePressed() {

  // Pantalla inicial
  if (pantalla === 0) {

    if (
      mouseX > 280 &&
      mouseX < 620 &&
      mouseY > 510 &&
      mouseY < 575
    ) {
      iniciarJuego();
    }
  }

  // Pantallas de victoria o derrota
  else if (pantalla === 2 || pantalla === 3) {

    if (
      mouseX > 275 &&
      mouseX < 625 &&
      mouseY > 495 &&
      mouseY < 565
    ) {
      iniciarJuego();
    }
  }

  // Pantalla del juego
  else if (pantalla === 1) {

    // Nivel de espacio
    if (nivel === 2) {

      if (
        mouseX > 350 &&
        mouseX < 550 &&
        mouseY > 525 &&
        mouseY < 575
      ) {
        accionEspacio();
      }

    } else {

      // Selección de juguetes
      for (let i = 0; i < juguetes.length; i++) {

        if (juguetes[i].tocar()) {
          comprobar(juguetes[i]);
          break;
        }
      }
    }
  }
}

// KEYPRESSED
// Detecta cuando el jugador
// presiona una tecla.
// Espacio sirve para comenzar,
// reiniciar o superar el nivel 3.
// La tecla E permite seleccionar
// juguetes cercanos al robot.

function keyPressed() {

  // Barra espaciadora
  if (key === " ") {

    if (
      pantalla === 0 ||
      pantalla === 2 ||
      pantalla === 3
    ) {

      iniciarJuego();

    } else if (
      pantalla === 1 &&
      nivel === 2
    ) {

      accionEspacio();
    }
  }

  // Tecla E
  if (key === "e" || key === "E") {

    if (pantalla === 1) {
      jugador.seleccionar();
    }
  }

  // Evita que las flechas
  // desplacen la página.
  if (
    key === " " ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW
  ) {
    return false;
  }
}

// ACCIÓN ESPACIO
// Permite superar el nivel 3
// haciendo lo contrario de la orden
// "NO PRESIONES ESPACIO".
// Los juguetes reaccionan
// saltando y sonriendo.

function accionEspacio() {

  if (pantalla === 1 && nivel === 2) {

    for (let i = 0; i < juguetes.length; i++) {
      juguetes[i].saltar();
    }

    puntos++;
    siguienteNivel();
  }
}

// INICIAR JUEGO
// Reinicia todas las variables,
// devuelve el robot a su posición
// y crea nuevamente los juguetes.
// Cambia a la pantalla de juego.

function iniciarJuego() {

  pantalla = 1;

  puntos = 0;
  nivel = 0;
  errores = 0;
  aciertosNivel = 0;
  tiempo = 0;

  jugador.x = 450;
  jugador.y = 470;

  crearJuguetes();
}