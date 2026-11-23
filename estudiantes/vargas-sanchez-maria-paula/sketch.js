// MARÍA PAULA VARGAS SÁNCHEZ
// PENSAMIENTO ALGORÍTMICO

// ESPEJO · JUEGO DESOBEDIENTE
// "cuando creas que entendiste las reglas, cambiarán"

// ¿DE QUÉ TRATA?
// Usamos la tecnología como si nos obedeciera, pero cada interfaz tiene reglas que no escribimos nosotros, y esas reglas cambian sin aviso; una actualización mueve un botón, un feed reordena lo que vemos, un algoritmo decide qué mostrarnos según lo que hicimos ayer, y sin darnos cuenta, somos nosotros los que nos adaptamos.

// ESPEJO pone esa relación en un juego muy simple, llevar un círculo hasta un anillo, y cada vez que aprendes cómo responde el personaje,la regla cambia.

//    NIVELES
//    1 · confías: todo responde normal
//    2 · izquierda ↔ derecha, como un espejo de verdad
//    3 · todo al revés
//    4 · las flechas giran 90°
//    5 · la meta huye: el anillo se aleja cuando te acercas
//    6 · actualización: las reglas cambian solas cada 5 segundos
//    7 · del otro lado: las flechas dejan de servir, sigues al mouse en espejo

// MI INTERPRETACIÓN: El diseño "sin fricción" nos hace sentir en control justo cuando menos lo estamos. La obediencia de la tecnología es una ilusión en dos sentidos, no siempre hace lo que pedimos y, cuando lo hace, es porque ya aprendió de nosotros. Es por eso que en el juego no se puede perder, la única forma de avanzar es adaptarse, que es justo lo que el juego critica. Al final, el reflejo repite tu camino, dice "yo solo hacía lo que tú me enseñaste" y te muestra lo que aprendió de ti (tus tiempos, tus teclas, tus cruces) para preguntarte quién obedecía a quién.

// SONIDO: En cada movimiento el juego toca una nota según tu altura en la pantalla (más arriba, más aguda). Tu recorrido es también una melodía que el espejo escucha.

// FRICCIÓN: cognitiva y motora. Rompe el mapeo natural flecha → dirección y obliga a desaprender lo que ya era automático.

// DESOBEDIENCIA: El personaje no hace lo que pides, la interfaz no explica sus reglas (la pista llega tarde a propósito) y el juego se niega a ser solo un juego, al final te devuelve la responsabilidad.

// ESTADOS (5)
// inicio → instrucciones → jugando (7 niveles) → cierre → reflexion
// R en la reflexión vuelve al inicio.

// CONTROLES
// Cualquier tecla · avanza entre pantallas
// Flechas · mueven tu círculo (cada nivel traduce las flechas de otra forma)
// Mouse · en el nivel 7 tu círculo sigue al mouse, en espejo
// Clic · rompe los fragmentos del espejo (se vuelven a armar solos)
// R · vuelve a empezar desde la reflexión

// REFERENTES
// Dan Graham · Present Continuous Past(s) · 1974 · el reflejo como memoria, te ves a ti mismo con retraso.
// Daniel Rozin · Wooden Mirror · 1999 · un espejo hecho de fragmentos y de código (los triángulos del fondo).
// Arvi Teikari (Hempuli) · Baba Is You · 2019 · reglas que cambian; aquí al revés, no las cambias tú, cambian solas.

// ARCHIVOS ADJUNTOS
// Sonidos
// nota0 a nota7 · escala pentatónica que suena al moverte
// nivel · pasar de nivel · cruce · atravesar el espejo
// cerca · acercarte al anillo · romper · romper un fragmento
// pista · aparece una pista · voz · habla el reflejo
// actualizacion · el nivel 6 cambia sus reglas
// letra · la frase final se escribe · final · llega la reflexión
// Tipografías
// (sans-serif para la voz del juego, serif itálica para la voz del reflejo, monospace para las instrucciones).


// CLASES

// CLASE JUGADOR · el círculo rojo
class Jugador {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diametro = 40;
    this.velocidad = 3.5;

    this.arriba = false;
    this.abajo = false;
    this.izquierda = false;
    this.derecha = false;

    this.anteriorX = x;
    this.anteriorY = y;
  }

  leerTeclas() {
    this.arriba = keyIsDown(UP_ARROW);
    this.abajo = keyIsDown(DOWN_ARROW);
    this.izquierda = keyIsDown(LEFT_ARROW);
    this.derecha = keyIsDown(RIGHT_ARROW);
  }

  mover() {
    this.anteriorX = this.x;
    this.anteriorY = this.y;

    if (nivel === nivelMax) {
      this.moverConMouse();
    } else {
      this.leerTeclas();
      this.moverConFlechas();
    }

    this.limitar();
  }

  // Aquí vive la desobediencia: cada nivel traduce las flechas distinto
  moverConFlechas() {
    let dx = 0;
    let dy = 0;
    if (this.izquierda) {
      dx = dx - this.velocidad;
    }
    if (this.derecha) {
      dx = dx + this.velocidad;
    }
    if (this.arriba) {
      dy = dy - this.velocidad;
    }
    if (this.abajo) {
      dy = dy + this.velocidad;
    }

    let regla = reglaDelNivel();

    if (regla === 1) {
      // Regla 1 · normal
      this.x = this.x + dx;
      this.y = this.y + dy;
    } else if (regla === 2) {
      // Regla 2 · izquierda ↔ derecha, como un espejo de verdad
      this.x = this.x - dx;
      this.y = this.y + dy;
    } else if (regla === 3) {
      // Regla 3 · todo al revés
      this.x = this.x - dx;
      this.y = this.y - dy;
    } else if (regla === 4) {
      // Regla 4 · las flechas giran 90°, ya no hay lógica de espejo
      this.x = this.x - dy;
      this.y = this.y + dx;
    }
  }

  // Nivel 7 · las flechas dejan de servir, sigues al mouse en espejo
  moverConMouse() {
    let objetivoX = width - mouseX;
    let objetivoY = mouseY;
    this.x = this.x + (objetivoX - this.x) * 0.2;
    this.y = this.y + (objetivoY - this.y) * 0.2;
  }

  limitar() {
    let radio = this.diametro / 2;
    this.x = constrain(this.x, radio, width - radio);
    this.y = constrain(this.y, radio, height - radio);
  }

  seEstaMoviendo() {
    return dist(this.x, this.y, this.anteriorX, this.anteriorY) > 0.5;
  }

  mostrar() {
    noStroke();
    // En el último nivel tomas el color del reflejo, ya no sabes quién copia a quién
    if (nivel === nivelMax) {
      fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
    } else {
      fill(colorTu[0], colorTu[1], colorTu[2]);
    }
    circle(this.x, this.y, this.diametro);
  }
}

// CLASE REFLEJO · el negativo del círculo rojo, la voz del sistema
class Reflejo {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.diametro = 40;
    this.yaHablo = false;
  }

  // Se ubica simétrico al jugador respecto al eje
  seguir(j, e) {
    this.x = e.x + (e.x - j.x);
    this.y = j.y;
  }

  // Cada nivel se ve un poco más
  mostrar() {
    let opacidad = map(nivel, 1, nivelMax, 30, 220);
    noFill();
    stroke(colorReflejo[0], colorReflejo[1], colorReflejo[2], opacidad);
    strokeWeight(2);
    circle(this.x, this.y, this.diametro);
  }

  mostrarCompleto() {
    noStroke();
    fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
    circle(this.x, this.y, this.diametro);
  }

  // Cada nivel habla más. En el nivel 1 solo susurra si te acercas al eje
  hablar(j, e) {
    let frase = frasesReflejo[nivel];
    let opacidad = 255;

    if (nivel === 1) {
      let distanciaAlEje = abs(j.x - e.x);
      if (distanciaAlEje > 120) {
        return;
      }
      opacidad = map(distanciaAlEje, 0, 120, 255, 0);
    } else {
      // Desde el nivel 2 habla un segundo después de empezar el nivel
      if (framesEnNivel < 60) {
        return;
      }
      opacidad = min(255, (framesEnNivel - 60) * 6);
    }

    // Suena una sola vez por nivel, cuando empieza a hablar
    if (!this.yaHablo) {
      sonar(sonidoVoz);
      this.yaHablo = true;
    }

    noStroke();
    fill(colorReflejo[0], colorReflejo[1], colorReflejo[2], opacidad);
    textAlign(CENTER, TOP);
    textFont("serif");
    textStyle(ITALIC);
    textSize(16);
    text(frase, this.x, this.y + this.diametro / 2 + 8);
  }
}

// CLASE EJE · la superficie del espejo, divide el lienzo en dos
class Eje {
  constructor(x) {
    this.x = x;
    this.temblor = 0;
    this.ladoAnterior = "izquierda";
  }

  // Si el jugador cambia de lado, el eje tiembla, suena y cuenta el cruce
  detectarCruce(j) {
    let ladoActual = "izquierda";
    if (j.x > this.x) {
      ladoActual = "derecha";
    }
    if (ladoActual !== this.ladoAnterior) {
      if (this.temblor < 2) {
        sonar(sonidoCruce);
      }
      this.temblor = 6;
      crucesEje++;
    }
    this.ladoAnterior = ladoActual;
    this.temblar();
  }

  temblar() {
    this.temblor = this.temblor - 0.3;
    if (this.temblor < 0) {
      this.temblor = 0;
    }
  }

  mostrar() {
    stroke(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
    strokeWeight(1.5);
    for (let y = 0; y < height; y = y + 14) {
      let corrimiento = random(-this.temblor, this.temblor);
      line(this.x + corrimiento, y, this.x + corrimiento, y + 6);
    }
  }
}

// CLASE ANILLO · la meta, siempre del otro lado del eje
class Anillo {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.diametro = 60;
    this.pulso = 0;
    this.direccion = 1;
    this.avisado = false;
  }

  pulsar() {
    this.pulso = this.pulso + 0.3 * this.direccion;
    if (this.pulso > 8 || this.pulso < 0) {
      this.direccion = this.direccion * -1;
    }
  }

  // Aparece en la mitad opuesta a donde está el jugador, hay que cruzar
  reubicar(xJugador, xEje) {
    if (xJugador < xEje) {
      this.x = random(xEje + 80, width - 60);
    } else {
      this.x = random(60, xEje - 80);
    }
    this.y = random(130, height - 80);
    this.avisado = false;
  }

  // Nivel 5 · la meta huye cuando te acercas, pero se cansa en las esquinas, es más lenta así que se puede acorralar
  huir(j) {
    let d = dist(this.x, this.y, j.x, j.y);
    if (d < 170 && d > 0) {
      this.x = this.x + ((this.x - j.x) / d) * 2.4;
      this.y = this.y + ((this.y - j.y) / d) * 2.4;
    }
    // No puede cruzar el espejo ni salirse del lienzo
    if (this.x > eje.x) {
      this.x = constrain(this.x, eje.x + 40, width - 35);
    } else {
      this.x = constrain(this.x, 35, eje.x - 40);
    }
    this.y = constrain(this.y, 110, height - 35);
  }

  // Suena una campanita la primera vez que te acercas
  avisarCercania(j) {
    if (!this.avisado && dist(this.x, this.y, j.x, j.y) < 130) {
      sonar(sonidoCerca);
      this.avisado = true;
    }
  }

  alcanzado(j) {
    return dist(this.x, this.y, j.x, j.y) < this.diametro / 2;
  }

  mostrar(tinta) {
    noFill();
    stroke(tinta[0], tinta[1], tinta[2]);
    strokeWeight(5);
    circle(this.x, this.y, this.diametro + this.pulso);
  }
}

// CLASE FRAGMENTO · triángulos de espejo roto que giran
class Fragmento {
  constructor() {
    this.angulo = random(TWO_PI);
    this.velocidadGiro = random(-0.01, 0.01);
    this.giroExtra = 0;
    this.reubicar();
  }

  reubicar() {
    this.tamano = random(20, 50);
    this.x = random(this.tamano, width - this.tamano);
    this.y = random(this.tamano, height - this.tamano);

    this.x1 = random(-this.tamano, 0);
    this.y1 = random(-this.tamano, 0);
    this.x2 = random(0, this.tamano);
    this.y2 = random(-this.tamano / 2, this.tamano / 2);
    this.x3 = random(-this.tamano / 2, this.tamano / 2);
    this.y3 = random(0, this.tamano);
  }

  girar() {
    this.angulo = this.angulo + this.velocidadGiro + this.giroExtra;
    this.giroExtra = this.giroExtra * 0.95;
  }

  // Se alejan del jugador y giran más rápido cuando pasa cerca
  reaccionar(j) {
    let d = dist(this.x, this.y, j.x, j.y);
    if (d < 110) {
      let fuerza = map(d, 0, 110, 0.06, 0);
      this.x = this.x + (this.x - j.x) * fuerza;
      this.y = this.y + (this.y - j.y) * fuerza;
      this.giroExtra = 0.08;
    }
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  sacudir() {
    this.giroExtra = random(0.15, 0.3);
  }

  estaBajoMouse() {
    return dist(mouseX, mouseY, this.x, this.y) < this.tamano / 2 + 6;
  }

  // Puedes tocar el escenario, pero no cambia nada, el espejo se rearma
  romper() {
    if (this.estaBajoMouse()) {
      lanzarChispas(this.x, this.y, 10);
      this.reubicar();
      this.giroExtra = 0.2;
      fragmentosRotos++;
      sonar(sonidoRomper);
    }
  }

  mostrar(tinta) {
    // El mouse hace brillar el fragmento que tiene encima
    let relleno = 30;
    let borde = 90;
    if (estado === "jugando" && this.estaBajoMouse()) {
      relleno = 90;
      borde = 220;
    }
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    fill(tinta[0], tinta[1], tinta[2], relleno);
    stroke(tinta[0], tinta[1], tinta[2], borde);
    strokeWeight(1);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    pop();
  }
}

// CLASE HUELLA · puntos que deja el jugador y se desvanecen
class Huella {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.opacidad = 0;
  }

  colocar(x, y) {
    this.x = x;
    this.y = y;
    this.opacidad = 160;
  }

  desvanecer() {
    if (this.opacidad > 0) {
      this.opacidad = this.opacidad - 1.5;
    }
  }

  mostrar() {
    if (this.opacidad > 0) {
      noStroke();
      fill(colorNiebla[0], colorNiebla[1], colorNiebla[2], this.opacidad);
      circle(this.x, this.y, 6);
    }
  }
}

// CLASE CHISPA · astillas de vidrio que saltan al llegar al anillo o al romper un fragmento, y se desvanecen
class Chispa {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    let angulo = random(TWO_PI);
    let rapidez = random(2, 7);
    this.vx = cos(angulo) * rapidez;
    this.vy = sin(angulo) * rapidez;
    this.angulo = random(TWO_PI);
    this.giro = random(-0.3, 0.3);
    this.tamano = random(4, 10);
    this.vida = 255;
    // Unas son del jugador (naranjas) y otras del reflejo (rojas)
    if (random() < 0.5) {
      this.color = colorTu;
    } else {
      this.color = colorReflejo;
    }
  }

  mover() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    this.vx = this.vx * 0.94;
    this.vy = this.vy * 0.94;
    this.angulo = this.angulo + this.giro;
    this.vida = this.vida - 6;
  }

  estaViva() {
    return this.vida > 0;
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.vida);
    triangle(-this.tamano, this.tamano / 2, this.tamano, 0, -this.tamano / 2, -this.tamano);
    pop();
  }
}

// CLASE FRASE · texto que se escribe letra por letra
class Frase {
  constructor(contenido, x, y, tamano) {
    this.contenido = contenido;
    this.x = x;
    this.y = y;
    this.tamano = tamano;
    this.letrasVisibles = 0;
  }

  reiniciar() {
    this.letrasVisibles = 0;
  }

  escribir() {
    if (frameCount % 3 === 0 && this.letrasVisibles < this.contenido.length) {
      // Cada letra suena como una tecla, excepto los espacios
      if (this.contenido[this.letrasVisibles] !== " ") {
        sonar(sonidoLetra);
      }
      this.letrasVisibles++;
    }
  }

  termino() {
    return this.letrasVisibles >= this.contenido.length;
  }

  mostrar() {
    let visible = "";
    for (let i = 0; i < this.letrasVisibles; i++) {
      visible = visible + this.contenido[i];
    }

    noStroke();
    fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
    textAlign(CENTER, CENTER);
    textFont("sans-serif");
    textStyle(BOLD);
    textSize(this.tamano);
    text(visible, this.x, this.y);
  }
}


// VARIABLES GLOBALES

// PALETA · blanco y negro como el vidrio de un espejo.
// Solo dos colores rompen el gris: el jugador (naranja) y el reflejo (rojo).
let colorVidrio = [238, 238, 234];
let colorAzogue = [17, 18, 22];
let colorNiebla = [128, 133, 141];
let colorTu = [255, 75, 43];
let colorReflejo = [230, 25, 45];

// ESTADO Y NIVEL
// estados: "inicio", "instrucciones", "jugando", "cierre", "reflexion"
let estado = "inicio";
let nivel = 1;
let nivelMax = 7;
let framesEnNivel = 0;
let framesEnEstado = 0;
let segundosPista = 20;

// Nivel 6 · actualización: la regla cambia sola cada 5 segundos
let reglaActual = 1;
let segundosEntreActualizaciones = 5;
let actualizaciones = 0;
let framesAvisoActualizacion = 0;

// Destello blanco al pasar de nivel
let destello = 0;

// MODO PRUEBA
let modoPrueba = false;

// OBJETOS
let jugador;
let reflejo;
let eje;
let anillo;
let fraseFinal;

// Fragmentos
let fragmentos = [];
let cantidadFragmentos = 16;

// Chispas
let chispas = [];

// Huellas
let huellas = [];
let cantidadHuellas = 40;
let indiceHuella = 0;

// Recorrido · todo lo que haces queda guardado
let recorrido = [];
let maxRecorrido = 3000;

// Cierre · el reflejo repite tu recorrido
let indiceFinal = 0;
let pasoFinal = 1;

// LO QUE EL ESPEJO APRENDE DE TI (se muestra en la reflexión)
let segundosPorNivel = [];
let crucesEje = 0;
let teclasPresionadas = 0;
let fragmentosRotos = 0;
let alturaBarras = 0;

// TEXTOS
let frasesReflejo = ["", "...", "¿lo notaste?", "te estás adaptando", "aprendo de ti", "¿por qué la persigues?", "me actualicé por ti", "te estoy mirando"];
let pistas = ["", "", "→  es  ←", "↑  es  ↓", "↑  es  →", "acorrálala en una esquina", "las reglas cambian cada 5 segundos", "estás del otro lado"];
let preguntas = [
  "¿el juego te desobedecía, o tú aprendiste a obedecerlo?",
  "¿cuántas interfaces cambiaron hoy sus reglas sin avisarte?",
  "¿qué le estás enseñando a las máquinas que te miran?"
];

// SONIDOS
let sonidosNotas = [];
let sonidoCerca;
let sonidoPista;
let sonidoVoz;
let sonidoActualizacion;
let sonidoCruce;
let sonidoNivel;
let sonidoRomper;
let sonidoLetra;
let sonidoFinal;
let audioActivo = false;


// SETUP
function setup() {
  createCanvas(800, 600);

  // Los sonidos cargan aparte, así el juego arranca aunque no carguen
  
  cargarSonidos();

  eje = new Eje(width / 2);

  jugador = new Jugador(width / 4, height / 2);
  reflejo = new Reflejo();

  anillo = new Anillo();
  anillo.reubicar(jugador.x, eje.x);

  fraseFinal = new Frase("YO SOLO HACÍA LO QUE TÚ ME ENSEÑASTE.", width / 2, height / 2, 32);

  for (let i = 0; i < cantidadFragmentos; i++) {
    fragmentos[i] = new Fragmento();
  }

  for (let i = 0; i < cantidadHuellas; i++) {
    huellas[i] = new Huella();
  }
}


// DRAW
function draw() {
  if (estado === "inicio") {
    pantallaInicio();
  } else if (estado === "instrucciones") {
    pantallaInstrucciones();
  } else if (estado === "jugando") {
    pantallaJuego();
  } else if (estado === "cierre") {
    pantallaCierre();
  } else if (estado === "reflexion") {
    pantallaReflexion();
  }
  framesEnEstado++;
}


// FUNCIONES

// ESTADO 1 · INICIO
function pantallaInicio() {
  background(colorAzogue[0], colorAzogue[1], colorAzogue[2]);
  cursor(CROSS);

  for (let i = 0; i < fragmentos.length; i++) {
    fragmentos[i].girar();
    fragmentos[i].mostrar(colorVidrio);
  }

  eje.temblar();
  eje.mostrar();

  // Título ESPEJO
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("sans-serif");
  textStyle(BOLD);
  textSize(110);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
  text("ESPEJO", width / 2, 220);

  // Su reflejo, volteado de arriba a abajo con scale(1, -1)
  push();
  translate(width / 2, 318);
  scale(1, -1);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2], 40);
  text("ESPEJO", 0, 0);
  pop();

  // El jugador y el reflejo siguen al mouse, uno a cada lado del eje
  fill(colorTu[0], colorTu[1], colorTu[2]);
  circle(mouseX, 420, 22);
  fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
  circle(width - mouseX, 420, 22);

  textFont("monospace");
  textStyle(NORMAL);
  textSize(14);
  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  text("cuando creas que entendiste las reglas, cambiarán", width / 2, 490);
  parpadeo("presiona cualquier tecla", width / 2, 525);
}

// ESTADO 2 · INSTRUCCIONES
function pantallaInstrucciones() {
  background(colorAzogue[0], colorAzogue[1], colorAzogue[2]);
  cursor(ARROW);

  for (let i = 0; i < fragmentos.length; i++) {
    fragmentos[i].girar();
    fragmentos[i].mostrar(colorVidrio);
  }

  // Título
  noStroke();
  textAlign(CENTER, TOP);
  textFont("sans-serif");
  textStyle(BOLD);
  textSize(48);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
  text("LAS REGLAS (POR AHORA)", width / 2, 40);

  // Esquema
  let yEsquema = 190;
  let vaiven = sin(frameCount * 0.04) * 40;

  stroke(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  strokeWeight(1.5);
  for (let y = 120; y < 260; y = y + 14) {
    line(width / 2, y, width / 2, y + 6);
  }

  noStroke();
  fill(colorTu[0], colorTu[1], colorTu[2]);
  circle(230 + vaiven, yEsquema, 40);

  noFill();
  stroke(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
  strokeWeight(2);
  circle(width - 230 - vaiven, yEsquema, 40);

  anillo.pulsar();
  stroke(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
  strokeWeight(5);
  circle(660, yEsquema - 40, 60 + anillo.pulso);

  noStroke();
  textFont("monospace");
  textStyle(NORMAL);
  textSize(12);
  textAlign(CENTER, TOP);
  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  text("tú", 230, yEsquema + 34);
  text("el espejo", width / 2, 268);
  text("tu reflejo", width - 230, yEsquema + 34);
  text("la meta", 660, yEsquema - 4);

  // Reglas, en el lenguaje del espejo
  let reglas = [
    "1   Mueve tu círculo con las flechas hasta el anillo.",
    "2   El anillo siempre está del otro lado del espejo, tendrás que cruzarlo.",
    "3   Tu reflejo te sigue. No lo controlas, pero te está mirando.",
    "4   No puedes perder el juego, solo tienes que adaptarte a él.",
    "5   ¿Te perdiste? Espera, el espejo te dará una pista.",
  ];
  textAlign(LEFT, TOP);
  textSize(14);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
  for (let i = 0; i < reglas.length; i++) {
    text(reglas[i], 90, 310 + i * 28);
  }

  textAlign(CENTER, CENTER);
  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  parpadeo("presiona cualquier tecla para entrar al espejo", width / 2, 540);
}

// ESTADO 3 · JUEGO
function pantallaJuego() {
  // El fondo se oscurece nivel a nivel, del vidrio al azogue
  let r = map(nivel, 1, nivelMax, colorVidrio[0], colorAzogue[0]);
  let g = map(nivel, 1, nivelMax, colorVidrio[1], colorAzogue[1]);
  let b = map(nivel, 1, nivelMax, colorVidrio[2], colorAzogue[2]);
  background(r, g, b);

  let tinta = colorTinta();

  // Fragmentos
  for (let i = 0; i < fragmentos.length; i++) {
    fragmentos[i].girar();
    fragmentos[i].reaccionar(jugador);
    fragmentos[i].mostrar(tinta);
  }

  // Eje
  eje.detectarCruce(jugador);
  eje.mostrar();

  // Huellas
  for (let i = 0; i < huellas.length; i++) {
    huellas[i].desvanecer();
    huellas[i].mostrar();
  }

  // Nivel 6 · las reglas se actualizan solas
  if (nivel === 6) {
    actualizarReglas();
  }

  // Anillo
  if (nivel === 5) {
    anillo.huir(jugador);
  }
  anillo.pulsar();
  anillo.avisarCercania(jugador);
  anillo.mostrar(tinta);

  // Jugador
  jugador.mover();
  jugador.mostrar();

  // Cada 4 frames en movimiento, una huella y un punto del recorrido
  if (jugador.seEstaMoviendo() && frameCount % 4 === 0) {
    huellas[indiceHuella].colocar(jugador.x, jugador.y);
    indiceHuella++;
    if (indiceHuella >= cantidadHuellas) {
      indiceHuella = 0;
    }

    if (recorrido.length < maxRecorrido) {
      recorrido.push([jugador.x, jugador.y]);
    }
  }

  // Cada 12 frames en movimiento suena una nota, más arriba, más aguda
  if (jugador.seEstaMoviendo() && frameCount % 12 === 0) {
    let indiceNota = floor(map(jugador.y, height, 0, 0, 8));
    indiceNota = constrain(indiceNota, 0, 7);
    sonar(sonidosNotas[indiceNota]);
  }

  // Reflejo
  reflejo.seguir(jugador, eje);
  reflejo.mostrar();
  reflejo.hablar(jugador, eje);

  // Chispas
  for (let i = chispas.length - 1; i >= 0; i--) {
    chispas[i].mover();
    chispas[i].mostrar();
    if (!chispas[i].estaViva()) {
      chispas.splice(i, 1);
    }
  }

  // ¿Llegó al anillo?
  if (anillo.alcanzado(jugador)) {
    lanzarChispas(anillo.x, anillo.y, 30);
    pasarDeNivel();
  }

  actualizarCursor();
  dibujarInterfaz(tinta);

  // Destello blanco que se apaga al pasar de nivel
  if (destello > 0) {
    noStroke();
    fill(255, destello);
    rect(0, 0, width, height);
    destello = destello - 12;
  }

  framesEnNivel++;
}

// ESTADO 4 · CIERRE
function pantallaCierre() {
  background(colorAzogue[0], colorAzogue[1], colorAzogue[2]);
  cursor(ARROW);
  eje.temblar();
  eje.mostrar();

  // El reflejo te dibuja de memoria, una línea roja en espejo
  noFill();
  stroke(colorReflejo[0], colorReflejo[1], colorReflejo[2], 170);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < indiceFinal && i < recorrido.length; i++) {
    vertex(eje.x + (eje.x - recorrido[i][0]), recorrido[i][1]);
  }
  endShape();
  noStroke();

  if (indiceFinal < recorrido.length) {
    // 1 · El reflejo repite tu camino, punto por punto
    reflejo.x = eje.x + (eje.x - recorrido[indiceFinal][0]);
    reflejo.y = recorrido[indiceFinal][1];
    reflejo.mostrarCompleto();
    indiceFinal = indiceFinal + pasoFinal;
  } else {
    // 2 · Se acerca al centro y te habla
    reflejo.x = lerp(reflejo.x, eje.x, 0.1);
    reflejo.y = lerp(reflejo.y, height / 2 + 70, 0.1);
    reflejo.mostrarCompleto();
    fraseFinal.escribir();
    fraseFinal.mostrar();

    if (fraseFinal.termino()) {
      textAlign(CENTER, CENTER);
      textFont("monospace");
      textStyle(NORMAL);
      textSize(14);
      fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
      parpadeo("presiona cualquier tecla para ver lo que aprendí de ti", width / 2, height - 50);
    }
  }
}

// ESTADO 5 · REFLEXIÓN
// El espejo te devuelve tus propios datos, como lo hace un algoritmo.
// Las líneas aparecen una a una (una cada segundo).
function pantallaReflexion() {
  background(colorAzogue[0], colorAzogue[1], colorAzogue[2]);
  cursor(ARROW);

  noFill();
  stroke(colorReflejo[0], colorReflejo[1], colorReflejo[2], 30);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < recorrido.length; i++) {
    vertex(eje.x + (eje.x - recorrido[i][0]), recorrido[i][1]);
  }
  endShape();
  noStroke();

  let paso = floor(framesEnEstado / 60);

  // Título
  textAlign(CENTER, TOP);
  textFont("sans-serif");
  textStyle(BOLD);
  textSize(34);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
  text("LO QUE EL ESPEJO APRENDIÓ DE TI", width / 2, 36);

  // Tu curva de adaptación es una barra por nivel
  dibujarBarras();

  textFont("monospace");
  textStyle(NORMAL);
  textSize(14);
  textAlign(CENTER, TOP);
  fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);

  if (paso >= 2) {
    text(fraseAdaptacion(), width / 2, 300);
  }

  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  if (paso >= 3) {
    text("cruzaste el espejo " + veces(crucesEje) + " · presionaste " + teclasPresionadas + " teclas", width / 2, 335);
  }
  if (paso >= 4) {
    text("el reflejo guardó " + recorrido.length + " de tus pasos. los repitió todos.", width / 2, 360);
  }
  if (paso >= 5) {
    text(fraseFragmentos(), width / 2, 385);
  }
  if (paso >= 6 && actualizaciones > 0) {
    text("el espejo se actualizó " + veces(actualizaciones) + " sin pedirte permiso.", width / 2, 410);
  }

  // Las preguntas, en la voz del reflejo
  textFont("serif");
  textStyle(ITALIC);
  textSize(19);
  fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
  for (let i = 0; i < preguntas.length; i++) {
    if (paso >= 8 + i * 2) {
      text(preguntas[i], width / 2, 450 + i * 32);
    }
  }

  if (paso >= 14) {
    textFont("monospace");
    textStyle(NORMAL);
    textSize(14);
    fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
    parpadeo("presiona R para volver a mirarte", width / 2, height - 30);
  }
}

// Barras con los segundos que tardaste en cada nivel
function dibujarBarras() {
  let base = 250;
  let altoMax = 130;
  let anchoBarra = 48;
  let separacion = 92;
  let xInicial = width / 2 - separacion * 3;

  // El segundo más largo define la escala
  let maximo = 1;
  for (let i = 0; i < segundosPorNivel.length; i++) {
    maximo = max(maximo, segundosPorNivel[i]);
  }

  // Las barras crecen poco a poco
  alturaBarras = lerp(alturaBarras, 1, 0.05);

  for (let i = 0; i < nivelMax; i++) {
    let x = xInicial + i * separacion;

    noStroke();
    textAlign(CENTER, TOP);
    textFont("monospace");
    textStyle(NORMAL);
    textSize(12);
    fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
    text("nivel " + (i + 1), x, base + 8);

    if (i < segundosPorNivel.length) {
      let alto = map(segundosPorNivel[i], 0, maximo, 4, altoMax) * alturaBarras;

      if (i === nivelMax - 1) {
        fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
      } else {
        fill(colorTu[0], colorTu[1], colorTu[2]);
      }
      rect(x - anchoBarra / 2, base - alto, anchoBarra, alto);

      fill(colorVidrio[0], colorVidrio[1], colorVidrio[2]);
      textAlign(CENTER, BOTTOM);
      text(formatoTiempo(segundosPorNivel[i]), x, base - alto - 6);
    } else {

      stroke(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
      strokeWeight(1);
      line(x - anchoBarra / 2, base, x + anchoBarra / 2, base);
    }
  }
}

function fraseAdaptacion() {
  if (segundosPorNivel.length < 4) {
    return "no terminaste de jugar, pero el espejo igual tomó nota.";
  }
  if (segundosPorNivel[3] < segundosPorNivel[1]) {
    return "cada regla nueva te costó menos. no la entendiste: te acostumbraste.";
  } else {
    return "algunas reglas te costaron más, pero seguiste. nunca hubo otra opción.";
  }
}

function fraseFragmentos() {
  if (fragmentosRotos === 0) {
    return "nunca tocaste el espejo. ¿sabías que podías?";
  } else if (fragmentosRotos === 1) {
    return "rompiste 1 fragmento. el espejo se volvió a armar sin preguntarte.";
  } else {
    return "rompiste " + fragmentosRotos + " fragmentos. el espejo se volvió a armar sin preguntarte.";
  }
}

// 1 → "1 vez", 3 → "3 veces"
function veces(n) {
  if (n === 1) {
    return "1 vez";
  }
  return n + " veces";
}

// 75 segundos → "1:15"
function formatoTiempo(segundos) {
  let s = round(segundos);
  let minutos = floor(s / 60);
  let resto = s % 60;
  return minutos + ":" + nf(resto, 2);
}

// Texto que aparece y desaparece
function parpadeo(mensaje, x, y) {
  let opacidad = map(sin(frameCount * 0.06), -1, 1, 70, 255);
  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2], opacidad);
  noStroke();
  text(mensaje, x, y);
}

// INTERFAZ DEL JUEGO
function dibujarInterfaz(tinta) {
  noStroke();

  // Nivel
  textAlign(LEFT, TOP);
  textFont("sans-serif");
  textStyle(BOLD);
  textSize(48);
  fill(tinta[0], tinta[1], tinta[2]);
  text("NIVEL " + nivel, 28, 22);

  // Instrucción solo en el nivel 1, después nadie te explica nada
  textFont("monospace");
  textStyle(NORMAL);
  textSize(14);
  fill(colorNiebla[0], colorNiebla[1], colorNiebla[2]);
  if (nivel === 1) {
    text("usa las flechas para llegar al anillo", 28, 82);
  }

  // Pista tardía solo si llevas más de 20s en el nivel
  if (framesEnNivel > 60 * segundosPista && pistas[nivel] !== "") {
    if (framesEnNivel === 60 * segundosPista + 1) {
      sonar(sonidoPista);
    }
    textAlign(RIGHT, BOTTOM);
    text(pistas[nivel], width - 28, height - 24);
  }

  // Nivel 6 · aviso de "actualizando" con una barrita que se llena
  if (framesAvisoActualizacion > 0) {
    let progreso = map(framesAvisoActualizacion, 60, 0, 0, 160);
    textAlign(CENTER, TOP);
    textSize(14);
    fill(tinta[0], tinta[1], tinta[2]);
    text("actualizando reglas...", width / 2, 30);
    noFill();
    stroke(tinta[0], tinta[1], tinta[2]);
    strokeWeight(1);
    rect(width / 2 - 80, 54, 160, 6);
    noStroke();
    fill(colorReflejo[0], colorReflejo[1], colorReflejo[2]);
    rect(width / 2 - 80, 54, progreso, 6);
    framesAvisoActualizacion--;
  }

  if (modoPrueba) {
    textAlign(LEFT, BOTTOM);
    textSize(11);
    fill(colorNiebla[0], colorNiebla[1], colorNiebla[2], 140);
    text("modo prueba: N siguiente nivel · F cierre", 28, height - 24);
  }
}

// Tinta oscura en los niveles claros, clara en los oscuros
function colorTinta() {
  if (nivel <= 4) {
    return colorAzogue;
  } else {
    return colorVidrio;
  }
}

function actualizarCursor() {
  if (nivel === nivelMax) {
    cursor(CROSS);
    return;
  }
  let sobreFragmento = false;
  for (let i = 0; i < fragmentos.length; i++) {
    if (fragmentos[i].estaBajoMouse()) {
      sobreFragmento = true;
    }
  }
  if (sobreFragmento) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// Qué traducción de las flechas usa cada nivel
function reglaDelNivel() {
  if (nivel <= 4) {
    return nivel;
  } else if (nivel === 5) {
    // Las flechas vuelven a obedecerte... pero la meta huye
    return 1;
  } else {
    // Nivel 6 · la regla que haya instalado la última actualización
    return reglaActual;
  }
}

// Nivel 6 · cada 5 segundos se instala una regla nueva, sin preguntar
function actualizarReglas() {
  if (framesEnNivel > 0 && framesEnNivel % (60 * segundosEntreActualizaciones) === 0) {
    let nueva = reglaActual;
    while (nueva === reglaActual) {
      nueva = floor(random(1, 5));
    }
    reglaActual = nueva;
    actualizaciones++;
    framesAvisoActualizacion = 60;
    sonar(sonidoActualizacion);
  }
}

// Crea varias chispas en un punto
function lanzarChispas(x, y, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    chispas.push(new Chispa(x, y));
  }
}

// SONIDO
async function cargarSonidos() {
  sonidoCruce = await loadSound("sonidos/cruce.wav");
  sonidoNivel = await loadSound("sonidos/nivel.wav");
  sonidoRomper = await loadSound("sonidos/romper.wav");
  sonidoLetra = await loadSound("sonidos/letra.wav");
  sonidoFinal = await loadSound("sonidos/final.wav");
  sonidoCerca = await loadSound("sonidos/cerca.wav");
  sonidoPista = await loadSound("sonidos/pista.wav");
  sonidoVoz = await loadSound("sonidos/voz.wav");
  sonidoActualizacion = await loadSound("sonidos/actualizacion.wav");
  // Las 8 notas de la escala, nota0.wav (grave) a nota7.wav (aguda)
  for (let i = 0; i < 8; i++) {
    sonidosNotas[i] = await loadSound("sonidos/nota" + i + ".wav");
  }
}

// Reproduce un sonido solo si ya se activó el audio y si ya cargó
function sonar(sonido) {
  if (audioActivo && sonido) {
    sonido.play();
  }
}

// Los navegadores solo dejan sonar el audio después de una tecla o un clic
function activarAudio() {
  if (!audioActivo) {
    userStartAudio();
    audioActivo = true;
  }
}

// CAMBIOS DE NIVEL Y DE ESTADO
function cambiarEstado(nuevo) {
  estado = nuevo;
  framesEnEstado = 0;
}

function pasarDeNivel() {
  // Guarda cuánto tardaste en este nivel
  segundosPorNivel.push(framesEnNivel / 60);

  if (nivel < nivelMax) {
    nivel++;
    framesEnNivel = 0;
    anillo.reubicar(jugador.x, eje.x);
    reflejo.yaHablo = false;
    reglaActual = 1;
    framesAvisoActualizacion = 0;
    destello = 120;
    sonar(sonidoNivel);

    for (let i = 0; i < fragmentos.length; i++) {
      fragmentos[i].sacudir();
    }
  } else {
    irAlCierre();
  }
}

function irAlCierre() {
  cambiarEstado("cierre");
  indiceFinal = 0;
  fraseFinal.reiniciar();
  sonar(sonidoNivel);

  // El reflejo repite tu camino en unos 5 segundos, sin importar su largo
  pasoFinal = ceil(recorrido.length / 300);
  if (pasoFinal < 1) {
    pasoFinal = 1;
  }
}

function irALaReflexion() {
  cambiarEstado("reflexion");
  alturaBarras = 0;
  sonar(sonidoFinal);
}

// Vuelve todo a como estaba al principio
function reiniciar() {
  cambiarEstado("inicio");
  nivel = 1;
  framesEnNivel = 0;
  recorrido = [];
  indiceHuella = 0;
  for (let i = 0; i < huellas.length; i++) {
    huellas[i] = new Huella();
  }
  segundosPorNivel = [];
  crucesEje = 0;
  teclasPresionadas = 0;
  fragmentosRotos = 0;
  actualizaciones = 0;
  reglaActual = 1;
  framesAvisoActualizacion = 0;
  destello = 0;
  chispas = [];
  reflejo.yaHablo = false;

  jugador = new Jugador(width / 4, height / 2);
  eje.ladoAnterior = "izquierda";
  anillo.reubicar(jugador.x, eje.x);
}


// EVENTOS DEL TECLADO Y DEL MOUSE
function keyPressed() {
  activarAudio();

  if (estado === "inicio") {
    cambiarEstado("instrucciones");
    sonar(sonidoCruce);
  } else if (estado === "instrucciones") {
    cambiarEstado("jugando");
    framesEnNivel = 0;
    sonar(sonidoNivel);
  } else if (estado === "jugando") {
    teclasPresionadas++;

    if (modoPrueba) {
      if (key === "n" || key === "N") {
        pasarDeNivel();
      }
      if (key === "f" || key === "F") {
        irAlCierre();
      }
    }
  } else if (estado === "cierre") {
    // Solo se avanza cuando el reflejo terminó de hablar
    if (indiceFinal >= recorrido.length && fraseFinal.termino()) {
      irALaReflexion();
    }
  } else if (estado === "reflexion") {
    if (key === "r" || key === "R") {
      reiniciar();
    }
  }

  // Evita que las flechas muevan la página
  return false;
}

function mousePressed() {
  activarAudio();

  if (estado === "jugando") {
    for (let i = 0; i < fragmentos.length; i++) {
      fragmentos[i].romper();
    }
  }
}
