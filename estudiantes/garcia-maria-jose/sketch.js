
//María José García
// Ejercicio: E08 — ERROR. / El botón que no sirve

// CONCEPTO:
// Una interfaz que exige una acción, pero no coopera con quien intenta
// realizarla. El sistema parece tener el control y trata al usuario con indiferencia e incluso con agresividad.

// INTERPRETACIÓN: ERROR nace de la frustración de usar una interfaz que no hace lo que uno espera. Normalmente estamos acostumbrados a que los botones respondan, las páginas nos obedezcan y la tecnología facilite las cosas. En este caso quise invertir esa relación: el sistema da órdenes, se burla del usuario, pone obstáculos y parece disfrutar cuando uno intenta controlarlo. La idea es que el usuario termine cuestionándose si realmente es él quien está manejando la interfaz.

//ESTADOS:
  // 0. BOOT: bienvenida al sistema. Parece que todo está funcionando.
  // 1. ERROR: el usuario intenta interactuar, pero el sistema no coopera.
  // 2. SYSTEM FAILURE: el sistema revela que sigue teniendo el control.

// JUGADOR:
// El jugador está representado por un cursor personalizado. Se mueve con el mouse y es la manera en que el usuario interactúa con los botones. Decidí que no fuera un personaje humano porque quería mantener la sensación de estar dentro de una interfaz o sistema operativo.

// REFERENTES:
  //- Matrix (1999): tomé el verde sobre negro, la estética de terminal, el ambiente digital y la sensación de estar dentro de un sistema. No busco copiar la película, sino usar esos elementos para construir mi propia interfaz y atmósfera.
  //- Teclados antiguos: tomé la forma de las teclas gruesas, sus sombras,bordes redondeados y la sensación de que se hunden al presionarlas.(como los botones del sistema).

// RECURSOS:
  //- Tipografía: Ertip.ttf, cargada desde la carpeta assets.
  //- Las demás formas, fondos, líneas, botones, cursor y efectos son creados directamente con p5.js.
  //- No se utilizan imágenes externas ni audios en esta versión.

// AUTORREGULACIÓN:
// Quise trabajar con clases, objetos, arreglos, condicionales, ciclos, eventos del mouse, variables, random() y millis(), que son herramientas que hemos visto durante el semestre. La parte que más estoy explorando es organizar las interacciones en clases y manejar el cambio de pantallas.



let fuente;

let botones = [];
let jugador;

let estado = 0;
// 0 = inicio, 1 = interacción, 2 = pantalla final

let pantallaRoja = false;
let inicioTemblor = 0;
let duracionEfecto = 260;
let intensidadTemblor = 9;

let mensajeActual = "";
let tiempoMensaje = 0;


// CARGA DE RECURSOS

function preload() {
  // Cargo la tipografía personalizada desde assets.
  fuente = loadFont("assets/Ertip.ttf");
}


// CONFIGURACIÓN INICIAL

function setup() {
  createCanvas(700, 600);

  textFont(fuente);
  textAlign(CENTER, CENTER);

  // El jugador es el cursor que representa al usuario.
  jugador = new Jugador();

  crearBotones();
}


// CREACIÓN DE OBJETOS

function crearBotones() {

  // Vacío el arreglo para no acumular botones de otras pantallas.
  botones = [];

  // ESTADO 0: BOOT
  if (estado === 0) {

    // Botón para entrar al sistema.
    botones.push(
      new Boton(350, 390, 220, 75,
      "INICIAR", "inicio")
    );

  }

  // ESTADO 1: ERROR
  if (estado === 1) {

    // Botón principal: escapa cuando el jugador intenta pulsarlo.
    botones.push(
      new Boton(350, 290, 230, 82,
      "PRESS", "principal")
    );

    // Los botones secundarios parecen funcionar, pero responden
    // con mensajes provocadores del sistema.
    botones.push(
      new Boton(165, 420, 190, 62,
      "MATRIX", "falsa", "TE SALISTE DE LA MATRIX.")
    );

    botones.push(
      new Boton(365, 420, 190, 62,
      "ERROR", "falsa", "EL ERROR ERES TU.")
    );

    botones.push(
      new Boton(165, 495, 190, 62,
      "WHY?", "falsa", "¿NO ENTIENDES?")
    );

    botones.push(
      new Boton(365, 495, 190, 62,
      "STOP", "falsa", "DEJA DE TOCAR.")
    );

    // Botón provisional para poder llegar a la pantalla final.
    // En la versión definitiva la transición podría ocurrir por
    // el comportamiento del jugador o por una condición del sistema.
    botones.push(
      new Boton(570, 555, 130, 45,
      "CONTINUAR", "continuar")
    );

  }

  // ESTADO 2: SYSTEM FAILURE
  if (estado === 2) {

    // Permite reiniciar la experiencia.
    botones.push(
      new Boton(350, 455, 230, 75,
      "RESTART", "reiniciar")
    );

  }
}


// DIBUJO PRINCIPAL

function draw() {

  // Cada estado tiene una pantalla y ambientación diferente.
  if (estado === 0) {
    pantallaInicio();
  }

  if (estado === 1) {
    pantallaInteraccion();
  }

  if (estado === 2) {
    pantallaFinal();
  }

  // Actualizo y dibujo todos los botones de la pantalla actual.
  for (let i = 0; i < botones.length; i++) {
    botones[i].actualizar();
    botones[i].dibujar();
  }

  // El jugador permanece presente en las tres pantallas.
  jugador.actualizar();
  jugador.dibujar();

}


// PANTALLA 1: BOOT

function pantallaInicio() {

  background(3, 8, 4);

  // Líneas de fondo para dar la sensación de terminal.
  dibujarTerminal();

  noStroke();

  fill(0, 255, 65);
  textSize(48);
  text("ERROR.", width / 2, 135);

  fill(204, 255, 204);
  textSize(17);
  text("EL SISTEMA NO FALLA.", width / 2, 195);

  fill(0, 180, 45);
  textSize(13);
  text("INICIANDO PROTOCOLO DE USUARIO...", width / 2, 275);

  fill(0, 255, 65);
  textSize(14);
  text("> PRESIONA PARA CONTINUAR", width / 2, 330);

  fill(0, 100, 30);
  textSize(11);
  text("CONEXION ESTABLECIDA // USUARIO DETECTADO",
       width / 2, 530);

}


// PANTALLA 2: INTERACCIÓN

function pantallaInteraccion() {

  // Cuando se intenta pulsar PRESS, la pantalla se pone roja
  // durante unos milisegundos y se activa el temblor.
  let efectoActivo =
    pantallaRoja &&
    millis() - inicioTemblor < duracionEfecto;

  if (efectoActivo) {
    background(150, 0, 12);
  } else {
    pantallaRoja = false;
    background(3, 8, 4);
  }

  push();

  // El movimiento aleatorio genera el temblor de la interfaz.
  if (efectoActivo) {
    translate(
      random(-intensidadTemblor, intensidadTemblor),
      random(-intensidadTemblor, intensidadTemblor)
    );
  }

  dibujarTerminal();

  noStroke();

  fill(0, 255, 65);
  textSize(39);
  text("ERROR.", width / 2, 75);

  fill(204, 255, 204);
  textSize(15);
  text("HAZ CLIC EN EL BOTON.", width / 2, 140);

  fill(0, 150, 35);
  textSize(12);
  text("INTENTA HACER LO QUE TE DIGO.", width / 2, 180);

  // Cuando se presiona una tecla falsa aparece su mensaje.
  // El mensaje desaparece después de un tiempo.
  if (
    mensajeActual !== "" &&
    millis() - tiempoMensaje < 1500
  ) {
    fill(0, 255, 65);
    textSize(17);
    text(mensajeActual, width / 2, 220);

  } else if (millis() - tiempoMensaje >= 1500) {
    mensajeActual = "";
  }

  pop();

}


// PANTALLA 3: SYSTEM FAILURE

function pantallaFinal() {

  background(2, 2, 3);

  // Líneas rojas para cambiar la estética de la terminal
  // y mostrar que el sistema está en un estado diferente.
  stroke(100, 0, 0);
  strokeWeight(1);

  for (let y = 20; y < height; y += 35) {
    line(0, y, width, y);
  }

  noStroke();

  fill(255, 0, 30);
  textSize(39);
  text("SYSTEM FAILURE", width / 2, 145);

  fill(255, 100, 100);
  textSize(16);
  text("CREES QUE HAS TOMADO EL CONTROL.", width / 2, 230);

  fill(255, 0, 30);
  textSize(20);
  text("PERO EL ERROR ERES TU.", width / 2, 300);

  fill(160, 160, 160);
  textSize(13);
  text("NO EXISTE UNA SALIDA DEL SISTEMA.", width / 2, 365);

  fill(255, 0, 30);
  textSize(12);
  text("SESSION TERMINATED // CONTROL RETAINED",
       width / 2, 535);

}


// FONDO DE TERMINAL

function dibujarTerminal() {

  // Líneas verticales inspiradas en la estética de terminales.
  stroke(0, 48, 15);
  strokeWeight(1);

  for (let x = 20; x < width; x += 35) {
    line(x, 0, x, height);
  }

}


// CLASE JUGADOR

class Jugador {

  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.tamano = 22;
  }

  actualizar() {

    // El jugador sigue la posición del mouse.
    this.x = mouseX;
    this.y = mouseY;

  }

  dibujar() {

    // El cursor personalizado representa al usuario
    // dentro de la interfaz.
    noFill();

    stroke(0, 255, 65);
    strokeWeight(2);

    ellipse(this.x, this.y, this.tamano, this.tamano);

    // Cruz que ayuda a identificar el centro del cursor.
    line(
      this.x - 7, this.y,
      this.x + 7, this.y
    );

    line(
      this.x, this.y - 7,
      this.x, this.y + 7
    );

  }

  // Revisa si el jugador está encima de algún objeto
  // y, si lo está, activa la interacción correspondiente.
  interactuar(listaObjetos) {

    for (let i = 0; i < listaObjetos.length; i++) {

      if (listaObjetos[i].contiene(this.x, this.y)) {

        // El botón responde según su tipo.
        listaObjetos[i].pulsar();

        break;

      }

    }

  }

}


// CLASE BOTÓN

class Boton {

  constructor(x, y, w, h, etiqueta, tipo, mensaje = "") {

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.etiqueta = etiqueta;
    this.tipo = tipo;
    this.mensaje = mensaje;

    this.brillo = false;
    this.presionado = false;
    this.tiempoPresionado = 0;

    this.titilar = false;
    this.ultimoTitileo = 0;

  }

  actualizar() {

    // Detecto si el jugador está encima del botón.
    this.brillo = this.contiene(mouseX, mouseY);

    // Cuando el mouse está encima, las letras y el borde titilan.
    if (
      this.brillo &&
      millis() - this.ultimoTitileo > 150
    ) {

      this.titilar = !this.titilar;
      this.ultimoTitileo = millis();

    }

    // El botón vuelve a su posición después de hundirse.
    if (
      this.presionado &&
      millis() - this.tiempoPresionado > 130
    ) {

      this.presionado = false;

    }

  }

  // Comprueba si una posición está dentro del área del botón.
  // Esto permite saber si el jugador está interactuando con él.
  contiene(x, y) {

    return (
      x > this.x - this.w / 2 &&
      x < this.x + this.w / 2 &&
      y > this.y - this.h / 2 &&
      y < this.y + this.h / 2
    );

  }

  dibujar() {

    rectMode(CENTER);
    noStroke();

    // Cuando se presiona, el botón se hunde un poco.
    let hundimiento = this.presionado ? 5 : 0;

    // Base gruesa que le da volumen a la tecla.
    fill(0, 65, 20);
    rect(
      this.x, this.y + 8,
      this.w, this.h, 13
    );

    // Sombra debajo de la superficie.
    fill(0, 15, 5);
    rect(
      this.x, this.y + 4,
      this.w - 4, this.h - 4, 12
    );

    // La superficie cambia de brillo al acercarse el cursor.
    if (this.brillo) {
      fill(0, this.titilar ? 125 : 75, 28);
    } else {
      fill(12, 28, 16);
    }

    rect(
      this.x,
      this.y - 3 + hundimiento,
      this.w - 6,
      this.h - 8,
      11
    );

    // Borde verde luminoso.
    noFill();

    if (this.brillo) {
      stroke(0, 255, 65);
      strokeWeight(this.titilar ? 3.5 : 2);
    } else {
      stroke(0, 143, 17);
      strokeWeight(1.5);
    }

    rect(
      this.x,
      this.y - 3 + hundimiento,
      this.w - 6,
      this.h - 8,
      11
    );

    // Texto de cada tecla.
    noStroke();

    if (this.brillo && this.titilar) {
      fill(204, 255, 204);
    } else {
      fill(0, 255, 65);
    }

    // El botón principal tiene un texto más grande.
    if (this.tipo === "principal") {
      textSize(30);
    } else {
      textSize(15);
    }

    text(
      this.etiqueta,
      this.x,
      this.y - 3 + hundimiento
    );

  }

  // RESPUESTA DE LOS BOTONES

  pulsar() {

    // Botón de inicio: lleva al estado de interacción.
    if (this.tipo === "inicio") {
      cambiarEstado(1);
    }

    // Botón principal: se escapa de la posición del cursor.
    // También activa el fondo rojo y el temblor de pantalla.
    if (this.tipo === "principal") {

      this.x = random(130, width - 130);
      this.y = random(245, 350);

      pantallaRoja = true;
      inicioTemblor = millis();

    }

    // Botones falsos: se hunden y muestran un mensaje.
    if (this.tipo === "falsa") {

      this.presionado = true;
      this.tiempoPresionado = millis();

      mensajeActual = this.mensaje;
      tiempoMensaje = millis();

    }

    // Botón provisional para pasar a la pantalla final.
    if (this.tipo === "continuar") {
      cambiarEstado(2);
    }

    // Reinicia toda la experiencia.
    if (this.tipo === "reiniciar") {
      cambiarEstado(0);
    }

  }

}


// CAMBIAR ENTRE ESTADOS

function cambiarEstado(nuevoEstado) {

  estado = nuevoEstado;

  // Limpio los mensajes y efectos de la pantalla anterior.
  mensajeActual = "";
  pantallaRoja = false;

  // Creo los botones correspondientes al nuevo estado.
  crearBotones();

}


// EVENTO DEL MOUSE

function mousePressed() {

  // El jugador es quien realiza la interacción.
  // Se revisa si su posición coincide con algún botón.
  jugador.interactuar(botones);

}


// FIN DEL PROGRAMA
