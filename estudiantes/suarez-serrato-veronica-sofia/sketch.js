//Verónica Suárez - 202521107

//YA SABEMOS QUÉ QUIERES
//Es un juego que se basa en la tensión  que puede existir hacia la tecnología en cuanto a las decisiones que tomamos en el día a día. Y no solo eso, sino cómo el sistema aprende de nuestras elecciones y cada vez nos muestra opciones que parezcan más y más, sin darnos cuenta.

//CÓDIGO

//CLASES
//clase Puerta
class Puerta {
  constructor(num, x, y, w, h, col) {
    this.num = num;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.completada = false;
    this.hover = false;
    this.escala = 1;
    this.sacudida = 0;
    this.pupilaX = 0;
    this.pupilaY = 0;
  }

  detectarMouse() {
    return (
      abs(mouseX - this.x) < this.w / 2 && abs(mouseY - this.y) < this.h / 2
    );
  }

  sacudir() {
    this.sacudida = 22;
  }

  actualizar() {
    this.hover = this.detectarMouse();
    if (this.hover && !this.completada) {
      this.escala = lerp(this.escala, 1.06, 0.2);
    } else {
      this.escala = lerp(this.escala, 1, 0.2);
    }
    if (this.sacudida > 0) {
      this.sacudida--;
    }
    // el ojo de la puerta 9 sigue al cursor
    if (this.num == 9) {
      let ex = this.x;
      let ey = this.y - this.h * 0.02;
      let d = dist(mouseX, mouseY, ex, ey);
      let tx = 0;
      let ty = 0;
      if (d > 0) {
        let m = d;
        if (m > 16) {
          m = 16;
        }
        tx = ((mouseX - ex) / d) * m;
        ty = ((mouseY - ey) / d) * m * 0.5;
      }
      this.pupilaX = lerp(this.pupilaX, tx, 0.15);
      this.pupilaY = lerp(this.pupilaY, ty, 0.15);
    }
  }

  mostrar(bloqueada) {
    let ox = 0;
    if (this.sacudida > 0) {
      ox = random(-6, 6);
    }
    let cx = this.x + ox;
    let cy = this.y;
    let w = this.w * this.escala;
    let h = this.h * this.escala;
    let c = this.col;
    let alfa = 255;
    if (bloqueada) {
      alfa = 130;
    }
    let topeArco = cy - h / 2 + w / 2;
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    // la puerta 9 brilla cuando ya está disponible
    noStroke();
    if (this.num == 9 && !bloqueada && !this.completada) {
      fill(red(c), green(c), blue(c), 40 + pulso * 70);
      rect(cx, cy, w + 30 + pulso * 24, h + 30 + pulso * 24, w / 2);
    } else if (this.hover && !this.completada && !bloqueada) {
      fill(red(c), green(c), blue(c), 60);
      rect(cx, cy, w + 20, h + 20, w / 2);
    }

    // hueco oscuro de la puerta
    fill(15, 8, 25);
    rect(cx, cy + w / 4, w, h - w / 2);
    arc(cx, topeArco, w, w, PI, TWO_PI);

    if (!this.completada) {
      // hoja de la puerta cerrada
      fill(red(c), green(c), blue(c), alfa);
      rect(cx, cy + w / 4, w, h - w / 2);
      arc(cx, topeArco, w, w, PI, TWO_PI);
      if (this.num == 9) {
        // ojo que observa al jugador
        fill(255, 255, 255, alfa * 0.9);
        ellipse(cx, cy - h * 0.02, w * 0.42, w * 0.22);
        fill(red(colorFondo), green(colorFondo), blue(colorFondo), alfa);
        circle(cx + this.pupilaX, cy - h * 0.02 + this.pupilaY, w * 0.13);
        fill(255, alfa);
        circle(
          cx + this.pupilaX + 4,
          cy - h * 0.02 + this.pupilaY - 4,
          w * 0.03
        );
        fill(0, 0, 0, 40);
        rect(cx, cy + h * 0.27, w * 0.6, h * 0.25, 6);
      } else {
        fill(0, 0, 0, 40);
        rect(cx, cy - h * 0.02, w * 0.6, h * 0.22, 4);
        rect(cx, cy + h * 0.27, w * 0.6, h * 0.25, 4);
      }
      fill(255, 255, 255, alfa * 0.85);
      circle(cx + w * 0.32, cy + h * 0.12, w * 0.09);
    } else {
      // cuando la puerta se abre, se ve luz adentro y girada
      fill(red(c), green(c), blue(c), 60);
      rect(cx, cy + w / 4, w * 0.8, h - w / 2);
      fill(c);
      quad(
        cx - w / 2,
        topeArco,
        cx - w / 2 + w * 0.28,
        topeArco + h * 0.07,
        cx - w / 2 + w * 0.28,
        cy + h / 2 - h * 0.05,
        cx - w / 2,
        cy + h / 2
      );
      fill(255);
      textFont(fuenteInicio);
      textSize(w * 0.3);
      text("✓", cx + w * 0.12, cy + h * 0.08);
    }

    // marco
    noFill();
    stroke(255, 255, 255, alfa * 0.7);
    strokeWeight(2);
    arc(cx, topeArco, w, w, PI, TWO_PI);
    line(cx - w / 2, topeArco, cx - w / 2, cy + h / 2);
    line(cx + w / 2, topeArco, cx + w / 2, cy + h / 2);
    line(cx - w / 2 - 8, cy + h / 2, cx + w / 2 + 8, cy + h / 2);

    // numero
    noStroke();
    fill(255, alfa);
    textFont(fuenteInicio);
    textStyle(BOLD);
    if (this.num == 9) {
      textSize(34);
    } else {
      textSize(18);
    }
    text(this.num, cx, topeArco - w * 0.2);
    textStyle(NORMAL);

    // candado
    if (bloqueada) {
      fill(255, 230);
      rect(cx, cy + 8, 24, 18, 3);
      noFill();
      stroke(255, 230);
      strokeWeight(3);
      arc(cx, cy - 2, 15, 18, PI, TWO_PI);
      noStroke();
    }
  }
}

//clase opciones de respuestas
class Opcion {
  constructor(texto, x, y, w, h, col, img, tipo, recomendada, etiqueta) {
    this.texto = texto;
    this.x = x;
    this.y = y;
    this.xBase = x;
    this.yBase = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.img = img; // imagen asociada
    this.tipo = tipo; // 0 CALMADA, 1 ELEGANTE, 2 EXCÉNTRICA
    this.recomendada = recomendada; //true si es la opción que el sistema impone
    this.etiqueta = etiqueta;
    this.escala = 0.3; //entra creciendo
    this.escalaObjetivo = 1;
    this.alfa = 255;
    this.radio = 20;
    this.destacada = false;
    this.apagada = false;
    this.bloqueada = false;
    this.elegida = false;
    this.rechazada = 0;
  }

  detectarMouse() {
    let mw = (this.w * this.escala) / 2;
    let mh = (this.h * this.escala) / 2;
    return (
      mouseX > this.x - mw &&
      mouseX < this.x + mw &&
      mouseY > this.y - mh &&
      mouseY < this.y + mh
    );
  }

  actualizar() {
    this.escala = lerp(this.escala, this.escalaObjetivo, 0.15);
    if (this.rechazada > 0) {
      this.rechazada--;
    }
  }

  // para la puerta 8, la opción se aleja del cursor
  huir(fuerza, recX, recY) {
    let radioHuida = 200;
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < radioHuida && d > 0.01) {
      let empuje = (fuerza * (radioHuida - d)) / radioHuida;
      this.x = this.x + ((this.x - mouseX) / d) * empuje;
      this.y = this.y + ((this.y - mouseY) / d) * empuje;
    }
    // limites de la pantalla
    if (this.x < this.w / 2 + 15) {
      this.x = this.w / 2 + 15;
    }
    if (this.x > width - this.w / 2 - 15) {
      this.x = width - this.w / 2 - 15;
    }
    if (this.y < 210) {
      this.y = 210;
    }
    if (this.y > 580) {
      this.y = 580;
    }
    //si el cursor la alcanza por ejemplo, en una esquina, salta lejos
    if (
      abs(mouseX - this.x) < this.w / 2 + 20 &&
      abs(mouseY - this.y) < this.h / 2 + 20
    ) {
      this.saltar(recX, recY);
    }
  }

  saltar(recX, recY) {
    for (let k = 0; k < 40; k++) {
      let nx = random(this.w / 2 + 15, width - this.w / 2 - 15);
      let ny = random(210, 580);
      if (
        dist(nx, ny, mouseX, mouseY) > 330 &&
        dist(nx, ny, recX, recY) > 220
      ) {
        this.x = nx;
        this.y = ny;
        break;
      }
    }
    this.rechazada = 15;
  }

  // PUERTA 9: el sistema mueve las opciones por su cuenta
  irHacia(x, y, esc, alfa) {
    this.x = lerp(this.x, x, 0.06);
    this.y = lerp(this.y, y, 0.06);
    this.escalaObjetivo = esc;
    this.alfa = lerp(this.alfa, alfa, 0.06);
  }

  mostrar() {
    let w = this.w * this.escala;
    let h = this.h * this.escala;
    let a = this.alfa;
    let c = this.col;
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);

    // Sombra
    noStroke();
    fill(0, 0, 0, (70 * a) / 255);
    rect(this.x + 7, this.y + 9, w, h, this.radio);

    // Destacado de la opción recomendada
    if (this.destacada) {
      noFill();
      stroke(
        red(colorDorado),
        green(colorDorado),
        blue(colorDorado),
        ((120 + pulso * 135) * a) / 255
      );
      strokeWeight(3 + pulso * 5);
      rect(
        this.x,
        this.y,
        w + 16 + pulso * 10,
        h + 16 + pulso * 10,
        this.radio + 6
      );
      noStroke();
      fill(red(colorDorado), green(colorDorado), blue(colorDorado), a);
      textFont(fuenteSistema);
      textStyle(BOLD);
      textSize(14);
      text(this.etiqueta, this.x, this.y - h / 2 - 28);
      textStyle(NORMAL);
    }

    // tarjeta
    stroke(255, 255, 255, (200 * a) / 255);
    strokeWeight(2);
    fill(red(c), green(c), blue(c), a);
    rect(this.x, this.y, w, h, this.radio);

    // imagen
    let iw = w * 0.82;
    let ih = h * 0.56;
    let iy = this.y - h * 0.12;
    if (this.img && this.img.width > 1) {
      tint(255, a);
      image(this.img, this.x, iy, iw, ih);
      noTint();
    } else {
      noStroke();
      fill(255, 255, 255, (55 * a) / 255);
      rect(this.x, iy, iw, ih, this.radio * 0.6);
      stroke(255, 255, 255, (70 * a) / 255);
      strokeWeight(1);
      line(
        this.x - iw / 2 + 10,
        iy - ih / 2 + 10,
        this.x + iw / 2 - 10,
        iy + ih / 2 - 10
      );
      line(
        this.x + iw / 2 - 10,
        iy - ih / 2 + 10,
        this.x - iw / 2 + 10,
        iy + ih / 2 - 10
      );
      noStroke();
      fill(255, 255, 255, (190 * a) / 255);
      textFont(fuenteSistema);
      textSize(11 * this.escala);
      text("[ IMAGEN ]", this.x, iy);
    }

    // Texto de la opción
    noStroke();
    fill(255, a);
    textFont(fuenteSistema);
    textStyle(BOLD);
    textSize(16 * this.escala);
    textLeading(19 * this.escala);
    text(this.texto, this.x, this.y + h * 0.33, w * 0.9, h * 0.28);
    textStyle(NORMAL);

    // estados especiales
    if (this.apagada) {
      fill(
        red(colorFondo),
        green(colorFondo),
        blue(colorFondo),
        (90 * a) / 255
      );
      rect(this.x, this.y, w, h, this.radio);
    }
    if (this.bloqueada) {
      fill(15, 8, 25, (180 * a) / 255);
      rect(this.x, this.y, w, h, this.radio);
      fill(red(colorRojo), green(colorRojo), blue(colorRojo), a);
      textStyle(BOLD);
      textSize(15);
      text("BLOQUEADO", this.x, this.y);
      textStyle(NORMAL);
    }
    if (this.rechazada > 0) {
      fill(
        red(colorRojo),
        green(colorRojo),
        blue(colorRojo),
        this.rechazada * 7
      );
      rect(this.x, this.y, w, h, this.radio);
    }
    if (this.elegida) {
      fill(255);
      textStyle(BOLD);
      textSize(16);
      text("✓ ELEGIDA", this.x, this.y + h / 2 + 24);
      textStyle(NORMAL);
    }
  }
}

//clase boton, de reset y de confirmacion de la puerta 7
class Boton {
  constructor(texto, x, y, w, h, col) {
    this.texto = texto;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.escala = 1;
  }

  detectarMouse() {
    return (
      abs(mouseX - this.x) < this.w / 2 && abs(mouseY - this.y) < this.h / 2
    );
  }

  mostrar() {
    let sobre = this.detectarMouse();
    if (sobre) {
      this.escala = lerp(this.escala, 1.07, 0.2);
      cursorMano = true;
    } else {
      this.escala = lerp(this.escala, 1, 0.2);
    }
    let w = this.w * this.escala;
    let h = this.h * this.escala;
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0, 0, 0, 90);
    rect(this.x + 5, this.y + 6, w, h, 10);
    fill(this.col);
    stroke(255);
    if (sobre) {
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }
    rect(this.x, this.y, w, h, 10);
    noStroke();
    fill(255);
    textFont(fuenteSistema);
    textStyle(BOLD);
    textSize(this.h * 0.38 * this.escala);
    text(this.texto, this.x, this.y);
    textStyle(NORMAL);
  }
}

//clase del sistema, cuando el algoritmo reacciona a las respuestas del jugador

class Sistema {
  constructor() {
    this.reiniciar();
  }

  reiniciar() {
    this.temblorTiempo = 0;
    this.temblorFuerza = 0;
    this.filtro = 0;
    this.filtroObjetivo = 0;
    this.mensaje = "";
    this.mensajeTiempo = 0;
  }

  temblar(tiempo, fuerza) {
    this.temblorTiempo = tiempo;
    this.temblorFuerza = fuerza;
  }

  decir(texto, tiempo) {
    this.mensaje = texto;
    this.mensajeTiempo = tiempo;
  }

  actualizar() {
    if (this.temblorTiempo > 0) {
      this.temblorTiempo--;
    }
    if (this.mensajeTiempo > 0) {
      this.mensajeTiempo--;
    }
    this.filtro = lerp(this.filtro, this.filtroObjetivo, 0.1);
  }

  aplicarTemblor() {
    if (this.temblorTiempo > 0) {
      translate(
        random(-this.temblorFuerza, this.temblorFuerza),
        random(-this.temblorFuerza, this.temblorFuerza)
      );
    }
  }

  mostrarFiltro() {
    if (this.filtro > 1) {
      rectMode(CENTER);
      noStroke();
      fill(red(colorRojo), green(colorRojo), blue(colorRojo), this.filtro);
      rect(width / 2, height / 2, width + 60, height + 60);
    }
  }

  mostrarMensaje() {
    if (this.mensajeTiempo > 0) {
      let a = this.mensajeTiempo * 8;
      if (a > 255) {
        a = 255;
      }
      rectMode(CENTER);
      textAlign(CENTER, CENTER);
      textFont(fuenteSistema);
      textStyle(BOLD);
      textSize(17);
      let ancho = textWidth(this.mensaje) + 50;
      noStroke();
      fill(15, 8, 25, a * 0.9);
      rect(width / 2, height - 45, ancho, 44, 6);
      fill(red(colorRojo), green(colorRojo), blue(colorRojo), a);
      rect(width / 2 - ancho / 2 + 3, height - 45, 6, 44);
      fill(255, a);
      text(this.mensaje, width / 2, height - 45);
      textStyle(NORMAL);
    }
  }
}

//clase de las lineas 
class Ruido {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.w = random(30, 220);
    this.h = random(1, 4);
    this.vel = random(1, 5);
    this.col = paleta[int(random(paleta.length))];
  }

  actualizar() {
    this.y = this.y + this.vel;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }

  mostrar() {
    let c = this.col;
    noStroke();
    fill(red(c), green(c), blue(c), random(40, 120));
    rectMode(CENTER);
    rect(this.x + random(-4, 4), this.y, this.w, this.h);
  }
}

// VARIABLES

let nombreJuego = "YA SABEMOS QUÉ QUIERES";
let nombreCreador = "VERÓNICA SUÁREZ";

//Tipografías
let fuenteInicio = "Verdana"; //es para el inicio y los numeros de las puertas.
let fuenteSistema; //es para los mensajes del sistema

//Paleta de colores
let colorNaranja;
let colorLila;
let colorRojo;
let colorDorado;
let colorAzulClaro;
let colorMorado;
let colorOcre;
let colorAzulOscuro;
let colorCafe;
let colorFondo;

let paleta = [];
let coloresPuertas = []; //colores de cada puerta
let coloresOpciones = []; //colores de las tres opciones en cada puerta
let coloresPuerta9 = []; //colores de la opciones de la puerta 9

// Arreglos para preguntas, respuestas y mensajes
//hay 3 personalidades CALMADA, ELEGANTE, EXCENTRICA
//En las opciones el orden siempre es posición 0= calmada, posición 1 = elegante y posición 2 = excentrica

let nombrePersonalidad = ["CALMADA", "ELEGANTE", "EXCÉNTRICA"];

//preguntas
let preguntas = [
  "¿Qué vas a desayunar?",
  "¿Cómo te vas a vestir?",
  "¿Qué música escucharás de camino?",
  "¿En qué te transportarás a tu lugar de destino?",
  "¿Dónde vas a almorzar?",
  "¿Qué vas a hacer para entretenerte?",
  "¿Qué vas a ver?",
  "¿Qué vas a hacer para la cena?",
  "¿Qué vas a hacer antes de dormir?",
];

//opciones de respuesta
let textosOpciones = [
  [
    "Huevos, fruta y pan",
    "Huevos, queso, arepa y jugo",
    "Caldo, huevos, arepa y chocolate",
  ],
  ["Cómoda", "Elegante", "Medio elegante"],
  ["Música clásica", "Pop", "Rock"],
  ["Bus", "Carro propio", "Taxi"],
  ["Cocinar", "Restaurante", "Domicilio"],
  ["Leer", "Aparato electrónico", "Ejercicio"],
  ["Romance", "Ciencia ficción", "Terror"],
  ["Meditar", "Bañarse", "Skincare"],
];

//mensajes del sistema al entrar en cada puerta
let mensajesSistema = [
  "Cuéntanos un poco de ti.",
  "Solo queremos conocerte mejor.",
  "Cada respuesta nos ayuda a ayudarte.",
  "Ya casi te conocemos.",
  "Sabemos que esta opción te gustará",
  "Esta opción es 100% como tú",
  "La mejor opción para ti",
  "Sabemos que esta te va a gustar",
];

//aparece sobre la opcion recomendada
let etiquetaRecomendacion = [
  "",
  "",
  "",
  "",
  "★ RECOMENDADO PARA TI",
  "★ 100% COMO TÚ",
  "★ LA MEJOR OPCIÓN PARA TI",
  "★ ESTA TE VA A GUSTAR",
];

//lugar en elq se encuentran las opciones 0 = izquierda 1= centro 2= derecha
let ordenPosiciones = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [0, 2, 1],
  [1, 0, 2],
  [2, 1, 0],
  [0, 1, 2],
  [1, 2, 0],
];
let posicionesX = [230, 500, 770];

//lo que el sistema ya que te gusta (personalidad asignada)
let textosPuerta9 = [
  ["Cocinar", "Leer", "Romance", "Meditar", "Música clásica", "Bus"], // CALMADA
  [
    "Restaurante",
    "Aparato electrónico",
    "Ciencia ficción",
    "Bañarse",
    "Pop",
    "Carro propio",
  ], // ELEGANTE
  ["Domicilio", "Ejercicio", "Terror", "Skincare", "Rock", "Taxi"], // EXCÉNTRICA
];

//reflexion final
let textosFinal = [
  "A diario interactuamos con internet creyendo que somos nosotros quienes elegimos libremente lo que vemos, compramos, escuchamos y consumimos. Sin embargo, cada búsqueda, cada clic y cada decisión alimentan sistemas que aprenden de nuestros comportamientos.",
  "Con el tiempo, estos sistemas comienzan a conocernos, a anticiparse a nuestros gustos y a recomendar aquello que consideran lo mejor para nosotros. Poco a poco dejamos de explorar otras posibilidades, porque el algoritmo ya decide qué mostrarnos.",
  "¿Hasta qué punto nuestras elecciones siguen siendo propias cuando la tecnología conoce nuestros gustos y empieza a decidir por nosotros?",
];

//1.4 llamado de imagenes
let llamadoI = [
  [
    "imagenes/desayuno1.jpg",
    "imagenes/desayuno2.jpg",
    "imagenes/desayuno3.jpg",
  ], //puerta 1
  [
    "imagenes/comoda.jpg",
    "imagenes/elegante.jpg",
    "imagenes/medioElegante.jpg",
  ], //puerta 2
  ["imagenes/musicaClasica.PNG", "imagenes/pop.PNG", "imagenes/rock.PNG"], //puerta 3
  ["imagenes/bus.PNG", "imagenes/carroPropio.PNG", "imagenes/taxi.PNG"], //puerta 4
  [
    "imagenes/cocinar.PNG",
    "imagenes/restaurante.PNG",
    "imagenes/domicilio.PNG",
  ], //puerta 5
  [
    "imagenes/leer.PNG",
    "imagenes/aparatoElectronico.PNG",
    "imagenes/ejercicio.PNG",
  ], //puerta 6
  [
    "imagenes/romance.PNG",
    "imagenes/cienciaFiccion.PNG",
    "imagenes/terror.PNG",
  ], //puerta 7
  ["imagenes/meditar.PNG", "imagenes/banarse.PNG", "imagenes/skincare.PNG"], //puerta 8
];

let llamadoI9 = [
  [
    "imagenes/cocinar.PNG",
    "imagenes/leer.PNG",
    "imagenes/romance.PNG",
    "imagenes/meditar.PNG",
    "imagenes/musicaClasica.PNG",
    "imagenes/bus.PNG",
  ], //personalidad calmada
  [
    "imagenes/restaurante.PNG",
    "imagenes/aparatoElectronico.PNG",
    "imagenes/cienciaFiccion.PNG",
    "imagenes/banarse.PNG",
    "imagenes/pop.PNG",
    "imagenes/carroPropio.PNG",
  ], //personalidad elegante
  [
    "imagenes/domicilio.PNG",
    "imagenes/ejercicio.PNG",
    "imagenes/terror.PNG",
    "imagenes/skincare.PNG",
    "imagenes/rock.PNG",
    "imagenes/taxi.PNG",
  ], //personalidad excentrica
];

let imagenes = [];
let imagenesPuerta9 = [];

//1.5 posiciones y tamaños de las puertas
let puertasX = [120, 120, 120, 120, 880, 880, 880, 880, 500];
let puertasY = [130, 270, 410, 550, 130, 270, 410, 550, 390];
let anchoPuertas = 90;
let altoPuertas = 125;
let anchoPuertaC = 230;
let altoPuertaC = 400;

//1.6 Estados del juego
let estado = 0; // estado 0 = inicio; estado 1 = transicion de inicio; estado 2 = puertas; estado 3 = presguntas de puertas 1-8; estado 4 = puerta 9; estado 5 = reflexion final

let pedirReinicio = true;

//objetos del juego
let puertas = [];
let opciones = [];
let ruidos = []; //lineas de interferencia
let sistema;
let botonReset;
let botonSi;
let botonNo;

//animaciones
let pulso = 0;
let dirPulso = 1;
let fadeInicio = 255; //transición pantalla de inicio
let cortina = 0; //transicion entre escenas
let cantidadRuido = 0; //cantidad de lineas de interferencia
let cursorMano = false;

//personalidades
let puertaActiva = 0;
let completadas = 0;
let ordenRecorrido = [];
let respuestas = [];
let tiposRespuesta = []; //personalidad de las respuestas 1 - 4
let contadorCalmada = 0;
let contadorElegante = 0;
let contadorExcentrica = 0;
let indicePersonalidad = -1; //-1 todavia no hay personalidad, 0/1/2 son la personalidad asignada
let personalidad = "";
let obediencias = 0; //cuantas recomendaciones acepta en las puertas 5 - 8

//cuando la pregunta esta en uso
let opcionElegida = -1;
let salidaTimer = 0; //despues de salir de la puerta
let intento5 = -1; //en puerta 5, para la opcion que elige primero el jugador
let temblores6 = 0; //cuantas veces tiembla
let esperandoTemblor = false;
let confirmando = false; //pregunta de sistema de si realmente está seguro
let eleccionPendiente = -1;
let fuerzaHuida = 3; //que tan rapido se alejan las respuestas del cursor

//puerta 9
let tiempo9 = 0;
let autoIndice = 0;
let contadorCambio = 0;
let intentos9 = 0;
let duracionAnalisis = 540; //frames en los que el sistema tarda en elegir las repsuetas de la puerta 9

//final
let finalTiempo = 0;

function setup() {
  createCanvas(1000, 700);

  //fuentes
  fuenteSistema = loadFont("CourierPrime-Regular.ttf");

  //paleta de color
  colorNaranja = color(254, 147, 82);
  colorLila = color(186, 128, 255);
  colorRojo = color(215, 57, 59);
  colorDorado = color(204, 168, 87);
  colorAzulClaro = color(85, 194, 230);
  colorMorado = color(95, 73, 123);
  colorOcre = color(188, 154, 69);
  colorAzulOscuro = color(47, 55, 139);
  colorCafe = color(183, 96, 31);
  colorFondo = color(43, 27, 61);

  paleta = [
    colorNaranja,
    colorLila,
    colorRojo,
    colorDorado,
    colorAzulClaro,
    colorMorado,
    colorOcre,
    colorAzulOscuro,
    colorCafe,
  ];

  coloresPuertas = [
    colorNaranja,
    colorLila,
    colorRojo,
    colorDorado,
    colorAzulClaro,
    colorMorado,
    colorOcre,
    colorAzulOscuro,
    colorCafe,
  ];

  //colores de las opciones en las puertas 1-8
  coloresOpciones = [
    [colorNaranja, colorAzulClaro, colorLila], // Puerta 1
    [colorLila, colorDorado, colorCafe], // Puerta 2
    [colorRojo, colorAzulClaro, colorOcre], // Puerta 3
    [colorDorado, colorAzulOscuro, colorNaranja], // Puerta 4
    [colorNaranja, colorLila, colorAzulClaro], // Puerta 5
    [colorAzulClaro, colorRojo, colorDorado], // Puerta 6
    [colorRojo, colorAzulOscuro, colorLila], // Puerta 7
    [colorAzulOscuro, colorCafe, colorLila], // Puerta 8
  ];

  //colores de las opciones en la puerta 9
  coloresPuerta9 = [
    colorNaranja,
    colorLila,
    colorRojo,
    colorDorado,
    colorAzulClaro,
    colorCafe,
  ];

  //carga de imagenes
  for (let p = 0; p < llamadoI.length; p++) {
    imagenes[p] = [];
    for (let o = 0; o < llamadoI[p].length; o++) {
      if (llamadoI[p][o] != "") {
        imagenes[p][o] = loadImage(llamadoI[p][o]);
      } else {
        imagenes[p][o] = null;
      }
    }
  }

  for (let p = 0; p < llamadoI9.length; p++) {
    imagenesPuerta9[p] = [];
    for (let o = 0; o < llamadoI9[p].length; o++) {
      if (llamadoI9[p][o] != "") {
        imagenesPuerta9[p][o] = loadImage(llamadoI9[p][o]);
      } else {
        imagenesPuerta9[p][o] = null;
      }
    }
  }

  sistema = new Sistema();
  botonReset = new Boton("RESET", 500, 625, 280, 70, colorRojo);
  botonSi = new Boton("SÍ, LA ELIJO", 375, 400, 220, 56, colorRojo);
  botonNo = new Boton("VOLVER", 625, 400, 220, 56, colorMorado);

  pedirReinicio = true; // deja todo en su estado inicial
} //fin setup

function draw() {
  //para el reinicio
  if (pedirReinicio) {
    estado = 0;
    fadeInicio = 255;
    cortina = 0;
    puertaActiva = 0;
    completadas = 0;
    contadorCalmada = 0;
    contadorElegante = 0;
    contadorExcentrica = 0;
    indicePersonalidad = -1;
    personalidad = "";
    obediencias = 0;

    for (let i = 0; i < 9; i++) {
      respuestas[i] = "";
      ordenRecorrido[i] = 0;
    }
    for (let i = 0; i < 4; i++) {
      tiposRespuesta[i] = -1;
    }
    opciones = [];
    opcionElegida = -1;
    salidaTimer = 0;
    intento5 = -1;
    temblores6 = 0;
    esperandoTemblor = false;
    confirmando = false;
    eleccionPendiente = -1;
    fuerzaHuida = 3;
    tiempo9 = 0;
    autoIndice = 0;
    contadorCambio = 0;
    intentos9 = 0;
    finalTiempo = 0;
    pulso = 0;
    dirPulso = 1;
    sistema.reiniciar();

    for (let i = 0; i < 9; i++) {
      if (i == 8) {
        puertas[i] = new Puerta(
          9,
          puertasX[i],
          puertasY[i],
          anchoPuertaC,
          altoPuertaC,
          coloresPuertas[i]
        );
      } else {
        puertas[i] = new Puerta(
          i + 1,
          puertasX[i],
          puertasY[i],
          anchoPuertas,
          altoPuertas,
          coloresPuertas[i]
        );
      }
    }
    for (let i = 0; i < 60; i++) {
      ruidos[i] = new Ruido();
    }
    pedirReinicio = false;
  }

  //pulso para generar parpadeos de inicio
  pulso = pulso + dirPulso * 0.025;
  if (pulso > 1) {
    pulso = 1;
    dirPulso = -1;
  }
  if (pulso < 0) {
    pulso = 0;
    dirPulso = 1;
  }

  sistema.actualizar();
  sistema.aplicarTemblor();
  cursorMano = false;
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  //ESTADO 0: INICIO DEL JUEGO Y ESTADOS 1 Y 2
  if (estado == 0) {
    background(colorFondo);
    noStroke();
    textFont(fuenteInicio);
    fill(255);
    textStyle(BOLD);
    textSize(50 + pulso * 6);
    text(nombreJuego, width / 2, height / 2 - 40);
    textStyle(NORMAL);
    textSize(20);
    text(nombreCreador, width / 2, height / 2 + 30);
    fill(255, 90 + pulso * 165);
    textSize(16);
    text("Haz click para iniciar", width / 2, height / 2 + 130);
    cantidadRuido = 0;
    cursorMano = true;
  } else if (estado == 1 || estado == 2) {
    //ESTADOS 1 Y 2
    background(colorFondo);

    //se hace más visible con cada puerta que entra el jugador
    stroke(
      red(colorMorado),
      green(colorMorado),
      blue(colorMorado),
      completadas * 9
    );
    strokeWeight(1);
    for (let gx = 0; gx < width; gx += 50) {
      line(gx, 0, gx, height);
    }
    for (let gy = 0; gy < height; gy += 50) {
      line(0, gy, width, gy);
    }

    //guia hacia la puerta central
    noStroke();
    fill(23, 14, 35);
    quad(385, 590, 615, 590, 720, 700, 280, 700);

    //recorrido del jugador
    stroke(red(colorDorado), green(colorDorado), blue(colorDorado), 150);
    strokeWeight(3);
    for (let i = 1; i < completadas; i++) {
      let a = puertas[ordenRecorrido[i - 1] - 1];
      let b = puertas[ordenRecorrido[i] - 1];
      line(a.x, a.y, b.x, b.y);
    }

    //para las puertas
    for (let i = 0; i < puertas.length; i++) {
      let p = puertas[i];
      let bloqueada = false;
      if (p.num >= 5 && p.num <= 8 && indicePersonalidad == -1) {
        bloqueada = true;
      }
      if (p.num == 9 && completadas < 8) {
        bloqueada = true;
      }
      p.actualizar();
      p.mostrar(bloqueada);
      if (estado == 2 && p.hover && !p.completada) {
        cursorMano = true;
      }
    }

    //informacion del recorrido del jugador
    noStroke();
    textFont(fuenteSistema);
    textStyle(BOLD);
    fill(255);
    textSize(22);
    text("ELIGE UNA PUERTA", width / 2, 42);
    textStyle(NORMAL);
    fill(colorLila);
    textSize(14);
    text("Puertas atravesadas: " + completadas + " / 8", width / 2, 76);

    let conoce = completadas / 8;
    fill(255, 255, 255, 30);
    rect(width / 2, 104, 360, 10, 5);
    fill(colorRojo);
    rect(width / 2 - 180 + 180 * conoce, 104, 360 * conoce, 10, 5);
    fill(255, 255, 255, 170);
    textSize(12);
    text("El sistema te conce: " + int(conoce * 100) + "%", width / 2, 126);
    if (indicePersonalidad != -1) {
      fill(
        red(colorDorado),
        green(colorDorado),
        blue(colorDorado),
        150 + pulso * 105
      );
      textStyle(BOLD);
      text("PERFIL GENERADO", width / 2, 150);
      textStyle(NORMAL);
    }

    cantidadRuido = completadas * 2;

    //fade de la pantalla de iniciio
    if (estado == 1) {
      noStroke();
      fill(red(colorFondo), green(colorFondo), blue(colorFondo), fadeInicio);
      rect(width / 2, height / 2, width + 40, height + 40);
      textFont(fuenteInicio);
      fill(255, fadeInicio);
      textStyle(BOLD);
      textSize(50 + pulso * 6);
      text(nombreJuego, width / 2, height / 2 - 40);
      textStyle(NORMAL);
      textSize(20);
      text(nombreCreador, width / 2, height / 2 + 30);
      fadeInicio = fadeInicio - 4;
      if (fadeInicio <= 0) {
        estado = 2;
      }
    }
  } else if (estado == 3) {
    //para el estado 3
    let n = puertaActiva;
    let c = coloresPuertas[n - 1];
    background(colorFondo);

    //para el fondo, un circulo que se apaga y una cuadricula
    noStroke();
    fill(red(c), green(c), blue(c), 80 - n * 8);
    circle(width / 2, 420, 760 - n * 40);
    if (n >= 5) {
      let paso = 90 - (n - 4) * 14;
      stroke(red(c), green(c), blue(c), 18 + (n - 4) * 10);
      strokeWeight(1);
      for (let gx = 0; gx < width; gx += paso) {
        line(gx, 0, gx, height);
      }
      for (let gy = 0; gy < height; gy += paso) {
        line(0, gy, width, gy);
      }
    }

    //para las puertas y su enumeracion
    noFill();
    stroke(c);
    strokeWeight(3 + n);
    rect(width / 2, height / 2, width - 20, height - 20, 30 - n * 3);

    // Encabezado
    noStroke();
    textFont(fuenteSistema);
    textStyle(BOLD);
    fill(c);
    textSize(15);
    text("PUERTA " + n, width / 2, 42);
    fill(255);
    textSize(30 - n);
    text(preguntas[n - 1], width / 2, 86);
    textStyle(NORMAL);

    //mensajes del sistema
    if (n <= 4) {
      fill(red(colorLila), green(colorLila), blue(colorLila), 210);
      textSize(16);
      text(mensajesSistema[n - 1], width / 2, 134);
    } else {
      textStyle(BOLD);
      textSize(20);
      let barra = " ";
      if (frameCount % 40 < 20) {
        barra = "_";
      }
      let anchoMensaje = textWidth(mensajesSistema[n - 1] + "_") + 60;
      fill(15, 8, 25, 210);
      rect(width / 2, 136, anchoMensaje, 46, 6);
      fill(colorDorado);
      text(mensajesSistema[n - 1] + barra, width / 2, 136);
      textStyle(NORMAL);
    }

    //para puerta 8, las opciones huyen del cursor
    if (n == 8) {
      fuerzaHuida = lerp(fuerzaHuida, 14, 0.004);
    }
    let recX = width / 2;
    let recY = 420;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].recomendada) {
        recX = opciones[i].x;
        recY = opciones[i].y;
      }
    }

    //huida de las opciones de las respuestas
    for (let i = 0; i < opciones.length; i++) {
      let o = opciones[i];
      o.radio = 26 - n * 2.6;
      o.destacada = o.recomendada;
      o.apagada = n == 7 && !o.recomendada;
      if (n == 8 && !o.recomendada && salidaTimer == 0) {
        o.huir(fuerzaHuida, recX, recY);
      }
      o.escalaObjetivo = 1;
      if (o.recomendada) {
        o.escalaObjetivo = 1 + (n - 4) * 0.05;
      }
      if (o.detectarMouse() && salidaTimer == 0 && !confirmando) {
        o.escalaObjetivo = o.escalaObjetivo + 0.05;
        cursorMano = true;
      }
      if (i == opcionElegida) {
        o.escalaObjetivo = 1.15;
        o.elegida = true;
      }
      o.actualizar();
      o.mostrar();
    }

    //en la puerta 6, cuando se termina el segundo temblor, se acepta la eleccion del jugador
    if (esperandoTemblor && sistema.temblorTiempo == 0) {
      esperandoTemblor = false;
      opcionElegida = eleccionPendiente;
      salidaTimer = 50;
    }

    cantidadRuido = n * 4;

    // una pequeña pausa para elegir y registrar la respuesta
    if (salidaTimer > 0) {
      salidaTimer--;
      if (salidaTimer == 0) {
        let elegida = opciones[opcionElegida];
        respuestas[n - 1] = elegida.texto;
        if (n <= 4) {
          tiposRespuesta[n - 1] = elegida.tipo;
          if (elegida.tipo == 0) {
            contadorCalmada++;
          } else if (elegida.tipo == 1) {
            contadorElegante++;
          } else {
            contadorExcentrica++;
          }
        } else if (elegida.recomendada) {
          obediencias++;
        }
        puertas[n - 1].completada = true;
        ordenRecorrido[completadas] = n;
        completadas++;

        //calculo de la personalidad, se calcula una sola vez al terminar las puerta 1-4
        // gana la personalidad con 2 o más respuestas, si niguna llega a 2 gana la personalidad de la respuesta de la puerta 1, si queda en empate gana en el siguiente orden calmada > elegante > excentrica
        if (
          indicePersonalidad == -1 &&
          puertas[0].completada &&
          puertas[1].completada &&
          puertas[2].completada &&
          puertas[3].completada
        ) {
          if (
            contadorCalmada >= 2 &&
            contadorCalmada >= contadorElegante &&
            contadorCalmada >= contadorExcentrica
          ) {
            indicePersonalidad = 0;
          } else if (
            contadorElegante >= 2 &&
            contadorElegante >= contadorExcentrica
          ) {
            indicePersonalidad = 1;
          } else if (contadorExcentrica >= 2) {
            indicePersonalidad = 2;
          } else {
            indicePersonalidad = tiposRespuesta[0];
          }
          personalidad = nombrePersonalidad[indicePersonalidad];
          sistema.decir("Perfil generado. Ahora sabemos lo que quieres.", 220);
        }

        puertaActiva = 0;
        estado = 2;
        cortina = 255;
      }
    }
  }

  //ESTADO 4 perdida total de eleccion
  else if (estado == 4) {
    background(18, 10, 28);
    tiempo9++;

    // Cuadrícula rígida
    stroke(red(colorMorado), green(colorMorado), blue(colorMorado), 70);
    strokeWeight(1);
    for (let gx = 0; gx < width; gx += 40) {
      line(gx, 0, gx, height);
    }
    for (let gy = 0; gy < height; gy += 40) {
      line(0, gy, width, gy);
    }

    //frase del sistema repetida en el fondo
    noStroke();
    textFont(fuenteSistema);
    textStyle(BOLD);
    textSize(30);
    fill(red(colorRojo), green(colorRojo), blue(colorRojo), 22);
    for (let fila = 0; fila < 9; fila++) {
      let desplazamiento = (frameCount * (1 + (fila % 3))) % 420;
      if (fila % 2 == 0) {
        desplazamiento = -desplazamiento;
      }
      for (let k = -1; k < 4; k++) {
        text(
          "YA ELEGIMOS POR TI",
          k * 420 + desplazamiento + 210,
          60 + fila * 75
        );
      }
    }

    //marco rojo que late
    noFill();
    stroke(red(colorRojo), green(colorRojo), blue(colorRojo), 90 + pulso * 165);
    strokeWeight(6 + pulso * 6);
    rect(width / 2, height / 2, width - 16, height - 16);

    // Mensajes del sistema
    noStroke();
    fill(255);
    textSize(34);
    text("Ya no tienes que escoger nada", width / 2, 80);
    textStyle(NORMAL);
    fill(colorLila);
    textSize(20);
    text("Ya sabemos qué cosas te gustan", width / 2, 122);

    //cuando el sistema está pensando que opcion elegir en la uktima puerta, la opcion esocgida temporalmente cambia cada vez más rapido
    if (tiempo9 < duracionAnalisis) {
      contadorCambio++;
      let intervalo = map(tiempo9, 0, duracionAnalisis, 40, 5);
      if (contadorCambio >= intervalo) {
        autoIndice = int(random(opciones.length));
        contadorCambio = 0;
      }
    } else {
      autoIndice = 0;
    }

    //orden de las opciones, de modo que la elegida quede por encima
    for (let i = opciones.length - 1; i >= 0; i--) {
      let o = opciones[i];
      o.radio = 3;
      o.destacada = i == autoIndice;
      o.bloqueada = o.detectarMouse() && tiempo9 < duracionAnalisis;
      if (tiempo9 < duracionAnalisis) {
        if (o.destacada) {
          o.escalaObjetivo = 1.1;
        } else if (o.bloqueada) {
          o.escalaObjetivo = 0.88;
        } else {
          o.escalaObjetivo = 0.95;
        }
      } else if (i == 0) {
        o.irHacia(width / 2, 400, 1.7, 255);
      } else {
        o.irHacia(o.xBase, o.yBase, 0.6, 0);
      }
      o.actualizar();
      o.mostrar();
    }

    //procesamiento de la informacion recibida del sistema
    let avance = tiempo9 / duracionAnalisis;
    if (avance > 1) {
      avance = 1;
    }
    noStroke();
    fill(255, 255, 255, 30);
    rect(width / 2, 650, 500, 8);
    fill(colorRojo);
    rect(width / 2 - 250 + 250 * avance, 650, 500 * avance, 8);
    textFont(fuenteSistema);
    textSize(13);
    fill(255, 190);
    if (tiempo9 < duracionAnalisis) {
      text(
        "Procesando tus preferencias... " + int(avance * 100) + "%",
        width / 2,
        625
      );
    } else {
      textStyle(BOLD);
      fill(colorDorado);
      text("DECISIÓN TOMADA POR EL SISTEMA", width / 2, 625);
      textStyle(NORMAL);
    }
    if (intentos9 > 0) {
      fill(colorRojo);
      textSize(13);
      text("Intentos ignorados: " + intentos9, width / 2, 675);
    }

    cantidadRuido = 50;

    //al terminar el sistma hace que aparezca una refelxion para el jugador
    if (tiempo9 > duracionAnalisis + 240) {
      puertas[8].completada = true;
      estado = 5;
      cortina = 255;
      finalTiempo = 0;
    }
  } else if (estado == 5) {
    //ESTADO 5 refelxion final para el jugador
    background(colorFondo);
    finalTiempo++;

    // Las nueve puertas como recorrido terminado
    for (let i = 0; i < 9; i++) {
      let c = coloresPuertas[i];
      noStroke();
      fill(c);
      rect(width / 2 - 4 * 44 + i * 44, 32, 32, 32, 4);
      fill(255);
      textFont(fuenteInicio);
      textSize(13);
      text(i + 1, width / 2 - 4 * 44 + i * 44, 32);
    }

    //titulo
    textFont(fuenteSistema);
    textStyle(BOLD);
    fill(colorNaranja);
    textSize(40);
    text("¿Quién eligió?", width / 2, 92);
    textStyle(NORMAL);
    fill(colorLila);
    textSize(15);
    text(
      "El sistema decidió que tu perfil es: " + personalidad,
      width / 2,
      134
    );
    text(
      "Aceptaste " +
        obediencias +
        " de 4 recomendaciones (la última no era opcional). En la puerta 9 no elegiste nada.",
      width / 2,
      158
    );

    //parrafos de reflexion, aparecen uno a uno
    let posY = [255, 375, 480];
    for (let i = 0; i < textosFinal.length; i++) {
      let a = (finalTiempo - i * 70) * 4;
      if (a < 0) {
        a = 0;
      }
      if (a > 255) {
        a = 255;
      }
      let c = coloresPuertas[i * 3 + 1];
      fill(red(c), green(c), blue(c), a);
      rect(width / 2 - 400, posY[i], 6, 90);
      fill(255, a);
      textSize(17);
      textLeading(25);
      if (i == 2) {
        textStyle(BOLD);
        fill(red(colorDorado), green(colorDorado), blue(colorDorado), a);
      }
      text(textosFinal[i], width / 2 + 8, posY[i], 760, 115);
      textStyle(NORMAL);
    }

    botonReset.mostrar();
    fill(255, 140);
    textSize(12);
    text("o presiona R", width / 2, 677);
    cantidadRuido = 4;
  }

  //acciones adicionales que tiene el juego (interferencia, cortina, filtro rojo y mensajes del sistema)
  for (let i = 0; i < cantidadRuido && i < ruidos.length; i++) {
    ruidos[i].actualizar();
    ruidos[i].mostrar();
  }

  if (cortina > 0) {
    noStroke();
    rectMode(CENTER);
    fill(red(colorFondo), green(colorFondo), blue(colorFondo), cortina);
    rect(width / 2, height / 2, width + 60, height + 60);
    cortina = cortina - 12;
  }

  sistema.mostrarFiltro();

  //puerta 7, ventana de confirmación encima del filtro rojo
  if (estado == 3 && confirmando) {
    rectMode(CENTER);
    fill(20, 8, 20, 235);
    stroke(colorRojo);
    strokeWeight(3);
    rect(width / 2, 330, 640, 260, 6);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(fuenteSistema);
    textStyle(BOLD);
    fill(255);
    textSize(24);
    text("¿Estás seguro de escoger esa opción?", width / 2, 262);
    fill(255, 140, 140);
    textSize(22);
    text("Esa no es para ti.", width / 2, 305);
    textStyle(NORMAL);
    botonSi.mostrar();
    botonNo.mostrar();
  }

  sistema.mostrarMensaje();

  // Ayuda permanente
  if (estado != 0 && estado != 5) {
    noStroke();
    textAlign(LEFT, CENTER);
    textFont(fuenteSistema);
    textSize(11);
    fill(255, 255, 255, 90);
    text("R: reiniciar", 18, height - 14);
    textAlign(CENTER, CENTER);
  }

  //estado del cursor
  if (estado == 4) {
    cursor("not-allowed");
  } else if (cursorMano) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
} //fin del draw

function mousePressed() {
  //inicio, transicion de pantalla de inicio a las puertas
  if (estado == 0) {
    estado = 1;
    fadeInicio = 255;
    return;
  }

  //momento en el que se seleccionan las puertas
  if (estado == 2) {
    for (let i = 0; i < puertas.length; i++) {
      let p = puertas[i];
      if (p.detectarMouse()) {
        if (p.completada) {
          sistema.decir(
            "Ya atravesaste esta puerta. Tu respuesta quedó guardada.",
            120
          );
        } else if (p.num >= 5 && p.num <= 8 && indicePersonalidad == -1) {
          p.sacudir();
          sistema.decir(
            "El sistema todavía no te conoce. Empieza por las puertas 1 a 4.",
            150
          );
        } else if (p.num == 9 && completadas < 8) {
          p.sacudir();
          sistema.decir(
            "Aún no puedes entrar. Te faltan " +
              (8 - completadas) +
              " puertas.",
            150
          );
        } else if (p.num == 9) {
          //al entrar a la puerta 9, hay 6 opciones que el jugador puede ver pero no escoger
          opciones = [];
          for (let k = 0; k < 6; k++) {
            let ox = 260 + (k % 3) * 240;
            let oy = 320;
            if (k >= 3) {
              oy = 525;
            }
            opciones[k] = new Opcion(
              textosPuerta9[indicePersonalidad][k],
              ox,
              oy,
              190,
              170,
              coloresPuerta9[k],
              imagenesPuerta9[indicePersonalidad][k],
              indicePersonalidad,
              false,
              "ELEGIDO POR EL SISTEMA"
            );
          }
          tiempo9 = 0;
          autoIndice = 0;
          contadorCambio = 0;
          intentos9 = 0;
          puertaActiva = 9;
          estado = 4;
          cortina = 255;
        } else {
          // para entrar a una puerta de la 1 a la 8
          puertaActiva = p.num;
          let n = p.num;
          opciones = [];
          for (let k = 0; k < 3; k++) {
            let recomendada = n >= 5 && k == indicePersonalidad;
            let w = 220;
            let h = 270;
            if (n == 8 && !recomendada) {
              w = 170;
              h = 210;
            }
            opciones[k] = new Opcion(
              textosOpciones[n - 1][k],
              posicionesX[ordenPosiciones[n - 1][k]],
              420,
              w,
              h,
              coloresOpciones[n - 1][k],
              imagenes[n - 1][k],
              k,
              recomendada,
              etiquetaRecomendacion[n - 1]
            );
          }
          opcionElegida = -1;
          salidaTimer = 0;
          intento5 = -1;
          temblores6 = 0;
          esperandoTemblor = false;
          confirmando = false;
          eleccionPendiente = -1;
          fuerzaHuida = 3;
          sistema.filtroObjetivo = 0;
          estado = 3;
          cortina = 255;
        }
        return;
      }
    }
    return;
  }

  //preguntas de las puerta 1 a 8
  if (estado == 3) {
    if (salidaTimer > 0 || esperandoTemblor) {
      return;
    }

    //para la puerta 7 se debe dar una respuesta a la ventana de confirmación
    if (confirmando) {
      if (botonSi.detectarMouse()) {
        confirmando = false;
        sistema.filtroObjetivo = 0;
        opcionElegida = eleccionPendiente;
        salidaTimer = 50;
        sistema.decir("Como quieras. Lo tendremos en cuenta.", 120);
      } else if (botonNo.detectarMouse()) {
        confirmando = false;
        sistema.filtroObjetivo = 0;
        sistema.decir(
          "Buena decisión. Mira otra vez la opción recomendada.",
          140
        );
      }
      return;
    }

    let clic = -1;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].detectarMouse()) {
        clic = i;
      }
    }
    if (clic == -1) {
      return;
    }
    let o = opciones[clic];
    let n = puertaActiva;

    //puertas 1 a 4 de libre eleccion para el jgador
    if (n <= 4 || o.recomendada) {
      opcionElegida = clic;
      salidaTimer = 50;
      if (n <= 4) {
        sistema.decir("Respuesta guardada.", 70);
      } else if (n == 8) {
        sistema.decir("¿Ves? Te conocemos.", 110);
      } else {
        sistema.decir("Sabíamos que te gustaría.", 110);
      }
    }

    //para la puerta 5, para elegir libremente, hay que insistir haciendo clic otra vez en la misma opcion
    else if (n == 5) {
      if (intento5 == clic) {
        opcionElegida = clic;
        salidaTimer = 50;
        sistema.decir("Está bien... por esta vez.", 120);
      } else {
        intento5 = clic;
        o.rechazada = 30;
        sistema.decir(
          "Inténtalo de nuevo. Sabemos qué opción te gustará.",
          160
        );
      }
    }

    //para la puerta 6, la pantalla tiembla dos veces antes de aceptar la respuesta del jugador
    else if (n == 6) {
      if (sistema.temblorTiempo > 0) {
        return;
      }
      temblores6++;
      o.rechazada = 30;
      sistema.temblar(32, 14);
      if (temblores6 == 1) {
        sistema.decir("¿En serio? Esta opción es 100% como tú.", 160);
      } else {
        sistema.decir("...Está bien. Continúa con tu elección.", 140);
        eleccionPendiente = clic;
        esperandoTemblor = true;
      }
    }

    //para la puerta 7, tiembla, filtro rojo y pregunta de confirmacion
    else if (n == 7) {
      sistema.temblar(28, 11);
      sistema.filtroObjetivo = 140;
      confirmando = true;
      eleccionPendiente = clic;
    }

    //para la puerta 8, las alternativas no se pueden seleccionar, huyen del cursor
    else if (n == 8) {
      let recX = width / 2;
      let recY = 420;
      for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].recomendada) {
          recX = opciones[i].x;
          recY = opciones[i].y;
        }
      }
      o.saltar(recX, recY);
      sistema.decir("Esa opción ya no está disponible para ti.", 120);
    }
    return;
  }

  // para la puerta 9, ningun clic cuenta para elegir alguna opcion
  if (estado == 4) {
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].detectarMouse()) {
        opciones[i].rechazada = 25;
        intentos9++;
        sistema.temblar(12, 5);
        sistema.decir("No es necesario. Nosotros elegimos por ti.", 110);
      }
    }
    return;
  }

  // Pantalla final: botón RESET
  if (estado == 5) {
    if (botonReset.detectarMouse()) {
      pedirReinicio = true;
    }
  }
} //fin del mousepressed

function keyPressed() {
  if (key == "r" || key == "R") {
    pedirReinicio = true;
  }
} //fin del keyPressed


