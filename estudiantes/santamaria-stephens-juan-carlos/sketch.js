/* =====================================================================
   ESTUDIANTE : Juan Carlos Santamaría      
   TÍTULO     : FUERA DE PANTALLA (Out of Canvas) - VERSIÓN COMPLETA
   ---------------------------------------------------------------------
   JUEGO:
     INICIO       -> la Mac 84 te invita a jugar.
     RESISTENCIA  -> cada clic, tecla o movimiento brusco del mouse
                     aumenta la "saturación": la pantalla vibra, se enoja,
                     lanza errores y suena áspera.
     SATURACION   -> al llegar a 100 aparece una pantalla fija de interrupción.
     MANDATO      -> aparece la instrucción: "suelta el mouse".
     FLORECIDA    -> si el jugador se queda quieto, el mundo real aparece
                     (amanecer, montañas, mar, luciérnagas) y florece un
                     mandala con un paisaje sonoro grave y meditativo.
                     Es lo opuesto a la RESISTENCIA: más quietud = más
                     belleza; clic, tecla o movimiento brusco = se cierra.
     DESARME      -> con el mandala completo y el jugador aún quieto, la
                     carcasa de la Mac 84 se desarma y sus piezas flotan
                     alrededor del mandala. Aparece la reflexión final.
     RETORNO      -> si el jugador toca durante el DESARME (o se calma sin
                     haber jugado, o pulsa R), la Mac se recompone, aparece
                     "TODO VUELVE AL INICIO" y la guía de etapas retrocede
                     hasta INICIO. Después el ciclo empieza de nuevo.
   Tecla R = reiniciar · Tecla M = silenciar (no cuentan como juego).
   ---------------------------------------------------------------------
   SISTEMA VISUAL (igual en todas las etapas):
     - Marco: barras rosa arriba y abajo (clase Marco) con título, etapa,
       pista de lo que hay que hacer y guía de los seis estados.
     - Dos mundos: el DIGITAL tiene fondo negro (INICIO, RESISTENCIA,
       SATURACION, RETORNO) y el REAL parte del azul profundo a negro
       (MANDATO, FLORECIDA, DESARME).
     - Tipografía: Impact para lo narrativo, Courier New para lo que dice
       el sistema (alertas y barras).
   ---------------------------------------------------------------------
   ORDEN DEL CÓDIGO: 1) variables y arreglos, 2) setup() y
   draw(), 3) eventos del mouse y del teclado, 4) clases.
   CLASES (todas con constructor, 3 o más métodos y 2 o más métodos de
   interacción marcados con [INTERACCIÓN]; no hay objetos sueltos):
     Sonido · Alerta · Mac · Ambiente · Petalo · Mandala · Desarme ·
     Marco · Juego
   VARIAS INSTANCIAS: hasta 10 Alertas a la vez (arreglo this.alertas),
   36 luciérnagas en Ambiente, 5 anillos de Pétalos en el Mandala
   (arreglo this.petalos) y 14 piezas de carcasa en Desarme.
   UNIVERSO VISUAL: una Macintosh 84 dibujada solo con rect(), circle(),
   triangle(), line() y arc(); paleta de la presentación (negro, rosa y cian)
   más las seis franjas del logo antiguo de Apple. Sin imágenes externas.
   ===================================================================== */

// ---------- VARIABLES Y ARREGLOS ----------
const ANCHO = 1280;
const ALTO = 720;
let escala = 1;
let desX = 0;
let desY = 0;

const NEGRO = [0, 0, 0];
const BLANCO = [248, 248, 248];
const ROSA = [255, 0, 153];
const CIAN = [92, 225, 230];
const VERDE = [97, 187, 70];
const AMARILLO = [253, 184, 39];
const NARANJA = [245, 130, 31];
const ROJO = [224, 58, 62];
const MORADO = [150, 61, 151];
const AZUL = [0, 157, 220];
const AZUL_PROF = [24, 0, 168];
const FRANJAS = [VERDE, AMARILLO, NARANJA, ROJO, MORADO, AZUL];
const CARCASA = [198, 206, 216];
const BISEL = [38, 43, 60];
const PANTALLA = [214, 230, 232];
const TINTA = [11, 27, 43];

// Tipografías: Impact para lo narrativo, Courier New para lo que dice el sistema
const TITULAR = 'Impact';
const SISTEMA = 'Courier New';

// Posiciones compartidas por todas las etapas (todas caben entre las barras del Marco)
const MAC_X = 640;
const MAC_Y = 390;
const MAC_S = 0.92;
const MAN_X = 640;
const MAN_Y = 360;
const MAN_S = 0.95;

const T_RETORNO = 180;               // 3 s que dura el retorno al inicio

const ERRORES = ['SISTEMA SATURADO', '¡DEJA DE TOCARME!', 'ERROR 1984: DEMASIADA ATENCIÓN',
  'ESTO NO ES UN JUEGO', 'NO HAY NADA QUE GANAR', 'MEMORIA AGOTADA', 'BASTA.', '¿QUÉ BUSCAS?'];

const PREGUNTAS = ['¿Por qué mi primer impulso frente a una pantalla es hacer clic, tocar y “resolver”?',
  '¿Qué pierdo cuando no tolero un minuto de inactividad?',
  '¿Es el sistema el que me retiene o soy yo quien no sabe soltarlo?',
  '¿Qué belleza aparece cuando renuncio a controlar?'];

// Arreglos paralelos: un dato por estado, en el mismo orden
const ESTADOS = ['INICIO', 'RESISTENCIA', 'SATURACION', 'MANDATO', 'FLORECIDA', 'DESARME', 'RETORNO'];
const ETAPAS = ['INICIO', 'ETAPA 1 · RESISTENCIA', 'ETAPA 1 · SATURACIÓN', 'ETAPA 2 · MANDATO',
  'ETAPA 3 · FLORECIDA', 'ETAPA 3 · DESARME', 'RETORNO AL INICIO'];
const PISTAS = ['SIN NIVELES · SIN PUNTOS · SIN VIDAS', 'LA PANTALLA SE RESISTE',
  'NO HAY NADA QUE HACER · ESPERA', 'NO TOQUES NADA · SUELTA EL MOUSE',
  'QUÉDATE QUIETO · SI TOCAS, LA FLOR SE CIERRA', 'SIGUE QUIETO · SI TOCAS, VUELVES AL INICIO',
  'VOLVIENDO AL INICIO'];

// Motivos del retorno: 0 = tocó durante el desarme, 1 = se calmó sin jugar, 2 = tecla R
const TEXTOS_RETORNO = ['TOCASTE LA PANTALLA. LA MAC SE RECOMPUSO.',
  'LA MAC SE CALMÓ. EL JUEGO ESPERA.',
  'REINICIO MANUAL. TODO EMPIEZA DE NUEVO.'];

let juego;

// ---------- FUNCIONES AUXILIARES ----------
function rel(c, a) { fill(c[0], c[1], c[2], a === undefined ? 255 : a); }
function tra(c, a) { stroke(c[0], c[1], c[2], a === undefined ? 255 : a); }
function tope(v, a, b) { return map(v, a, b, a, b, true); }
function mezclar(c1, c2, t) {
  return [map(t, 0, 1, c1[0], c2[0], true), map(t, 0, 1, c1[1], c2[1], true), map(t, 0, 1, c1[2], c2[2], true)];
}

// ---------- BUCLE PRINCIPAL Y EVENTOS ----------
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  calcularEscala();
  juego = new Juego();
}

function draw() {
  juego.actualizar();
  juego.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcularEscala();
}

function calcularEscala() {          // el juego se diseña en 1280x720 y se ajusta a la ventana
  escala = min(width / ANCHO, height / ALTO);
  desX = (width - ANCHO * escala) / 2;
  desY = (height - ALTO * escala) / 2;
}

function mousePressed() { juego.alPresionarMouse(); return false; }
function keyPressed() {
  juego.alPresionarTecla(key);
  if (key === ' ') return false;
}

// =====================================================================
// CLASE Sonido: fricción con onda cuadrada y calma con ondas sinusoidales
// (p5.sound). La onda cuadrada es la RESISTENCIA; las dos sinusoidales
// graves (una nota y su quinta) son el paisaje meditativo.
// =====================================================================
class Sonido {
  constructor() {
    this.listo = false;
    this.silenciado = false;
    this.osc = null;
    this.grave = null;
    this.quinta = null;
    this.golpe = 0;
  }

  // [INTERACCIÓN] El audio solo arranca con el primer gesto del jugador
  iniciar() {
    if (this.listo || typeof p5.Oscillator === 'undefined' || typeof userStartAudio === 'undefined') return;
    userStartAudio();
    this.osc = new p5.Oscillator('square');
    this.osc.amp(0);
    this.osc.start();
    this.grave = new p5.Oscillator('sine');
    this.grave.freq(82.4);
    this.grave.amp(0);
    this.grave.start();
    this.quinta = new p5.Oscillator('sine');
    this.quinta.freq(123.5);
    this.quinta.amp(0);
    this.quinta.start();
    this.listo = true;
  }

  // [INTERACCIÓN] Cada clic o tecla dispara un pitido agudo
  pulso(fuerza) {
    this.golpe = max(this.golpe, fuerza);
  }

  // [INTERACCIÓN] Tecla M
  alternarSilencio() {
    this.silenciado = !this.silenciado;
  }

  actualizar(saturacion, calma) {
    if (!this.listo) return;
    this.golpe = max(0, this.golpe - 0.1);
    const v = this.silenciado ? 0 : map(saturacion, 0, 100, 0, 0.03) + 0.07 * this.golpe;
    this.osc.amp(v, 0.02);
    this.osc.freq(map(saturacion, 0, 100, 700, 2200) + 500 * this.golpe * random());
    const m = this.silenciado ? 0 : 0.1 * calma;                 // la calma sube con la luz del amanecer
    this.grave.amp(m, 0.6);
    this.quinta.amp(m * 0.6, 0.6);
    this.grave.freq(82.4 + 1.2 * sin(frameCount * 0.01));        // respiración lenta
    this.quinta.freq(123.5 + 1.8 * sin(frameCount * 0.013 + 1));
  }
}

// =====================================================================
// CLASE Alerta: cuadro de error estilo Mac 84
// =====================================================================
class Alerta {
  constructor(msg, x, y) {
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.t = 0;                              // frames de vida
    this.vida = floor(random(90, 190));
    this.w = max(320, msg.length * 15 + 130);
    this.h = 104;
    this.cerrada = false;
  }

  actualizar() { this.t++; }

  viva() { return !this.cerrada && this.t < this.vida; }

  // [INTERACCIÓN] Huye del cursor: más rápido cuanto más cerca (dist + map)
  huirDelCursor(mx, my) {
    const d = dist(mx, my, this.x, this.y);
    if (d < 220) {
      const f = map(d, 0, 220, 3.5, 0);
      this.x = tope(this.x + ((this.x - mx) / (d + 1)) * f, 140, ANCHO - 140);
      this.y = tope(this.y + ((this.y - my) / (d + 1)) * f, 140, ALTO - 90);
    }
  }

  // [INTERACCIÓN] Clic sobre el botón OK: se cierra (y el juego lanza más)
  alClic(mx, my) {
    if (abs(mx - (this.x + this.w / 2 - 50)) < 30 && abs(my - (this.y + this.h / 2 - 22)) < 14) {
      this.cerrada = true;
      return true;
    }
    return false;
  }

  display() {
    const a = 255 * tope((this.vida - this.t) / 15, 0, 1);
    push();
    translate(this.x, this.y);
    textFont(SISTEMA);
    textStyle(BOLD);
    textSize(26);
    noStroke();
    rel(NEGRO, a);
    rect(7, 7, this.w, this.h);                       // sombra dura
    strokeWeight(3);
    tra(NEGRO, a);
    rel(BLANCO, a);
    rect(0, 0, this.w, this.h);                       // cuerpo
    strokeWeight(1.5);
    for (let i = 0; i < 5; i++) line(-this.w / 2 + 6, -this.h / 2 + 7 + i * 3.5, this.w / 2 - 6, -this.h / 2 + 7 + i * 3.5);
    noStroke();
    rel(NEGRO, a);
    circle(-this.w / 2 + 48, 8, 36);                  // bomba
    rect(-this.w / 2 + 62, -12, 4, 12);
    rel(AMARILLO, a);
    triangle(-this.w / 2 + 64, -26, -this.w / 2 + 56, -14, -this.w / 2 + 72, -14);
    rel(NEGRO, a);
    textAlign(LEFT, CENTER);
    text(this.msg, -this.w / 2 + 80, -6);
    textAlign(CENTER, CENTER);
    strokeWeight(3);
    tra(NEGRO, a);
    rel(BLANCO, a);
    rect(this.w / 2 - 50, this.h / 2 - 22, 60, 24, 10);   // botón OK
    noStroke();
    rel(NEGRO, a);
    textSize(22);
    text('OK', this.w / 2 - 50, this.h / 2 - 22);
    textStyle(NORMAL);
    pop();
  }
}

// =====================================================================
// CLASE Mac: el personaje (solo rect, circle y triangle)
// =====================================================================
class Mac {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.px = 0;              // posición de las pupilas
    this.py = 0;
    this.sobresalto = 0;
    this.cara = 'feliz';
    this.rojo = 0;            // 0..1 qué tan roja está de rabia
  }

  // [INTERACCIÓN] Las pupilas siguen al cursor (map con límites)
  seguirCursor(mx, my) {
    this.px += (map(mx - this.x, -400, 400, -11, 11, true) - this.px) * 0.25;
    this.py += (map(my - this.y, -400, 400, -9, 9, true) - this.py) * 0.25;
  }

  // [INTERACCIÓN] Cada clic abre los ojos de golpe
  sobresaltar() { this.sobresalto = 1; }

  actualizar(cara, rojo) {
    this.cara = cara;
    this.rojo = rojo;
    this.sobresalto = max(0, this.sobresalto - 0.05);
  }

  display() {
    const parpadeo = frameCount % 230 < 10 ? 0.1 : 1;       // parpadeo cada ~4 s
    push();
    translate(this.x, this.y);
    scale(this.s);
    tra(TINTA);
    strokeWeight(3);
    rel(mezclar(CARCASA, ROSA, this.rojo * 0.55));
    rect(0, -35, 400, 430, 36);                              // cabeza
    rel(mezclar(CARCASA, ROSA, this.rojo * 0.4));
    rect(0, 243, 430, 46, 12);                               // base
    rel(BISEL);
    rect(0, -72, 318, 268, 22);                              // bisel
    noStroke();
    rel(mezclar(PANTALLA, ROJO, this.rojo));
    rect(0, -72, 290, 240, 12);                              // pantalla
    rel(BLANCO);
    rect(0, -182, 290, 20);                                  // barra de menú
    for (let k = 0; k < 6; k++) {                            // insignia de seis franjas
      rel(FRANJAS[(k + (this.cara === 'enojado' ? floor(frameCount / 7) : 0)) % 6]);
      rect(-125, 165 + (k - 2.5) * 6.2, 64, 6.2);
    }
    rel(BISEL);
    rect(45, 165, 130, 12, 5);                               // ranura del disquete
    for (let i = -1; i <= 1; i += 2) {                       // ojos
      push();
      translate(62 * i, -70);
      scale(1, parpadeo);
      tra(TINTA);
      strokeWeight(4);
      rel(BLANCO);
      circle(0, 0, 78);
      noStroke();
      rel(this.cara === 'enojado' ? ROJO : TINTA);
      circle(this.px, this.py, (this.cara === 'enojado' ? 20 : 30) + 10 * this.sobresalto);
      pop();
      if (this.cara === 'enojado') {                         // cejas furiosas (triángulos)
        rel(ROJO);                                           // el lado interior baja: ceño fruncido
        triangle(62 * i + 46 * i, -134, 62 * i - 46 * i, -134, 62 * i - 46 * i, -96 + 16 * max(this.rojo, 0.4));
      }
    }
    noFill();
    tra(TINTA);
    strokeWeight(7);
    if (this.cara === 'enojado') {                           // boca de dientes apretados
      for (let i = 0; i < 5; i++) line(-50 + i * 20, i % 2 === 0 ? -8 : 8, -30 + i * 20, i % 2 === 0 ? 8 : -8 + random(-2, 2));
    } else if (this.cara === 'feliz') {
      arc(0, -6, 96, 52, 0.15, PI - 0.15);                   // sonrisa
    }
    pop();
  }
}

// =====================================================================
// CLASE Ambiente: el mundo "real" que aparece al soltar el mouse
// (amanecer, montañas, mar y luciérnagas). Con luz = 0 es idéntico al
// fondo del MANDATO (azul profundo a negro), así no hay saltos.
// =====================================================================
class Ambiente {
  constructor() {
    this.luz = 0;                          // 0 = noche digital, 1 = amanecer
    this.n = 36;                           // cantidad de luciérnagas
    this.lx = [];                          // posiciones y fases en arreglos paralelos
    this.ly = [];
    this.lf = [];
    for (let i = 0; i < this.n; i++) {
      this.lx.push(random(ANCHO));
      this.ly.push(random(ALTO * 0.3, ALTO));
      this.lf.push(random(TWO_PI));
    }
  }

  // La luz sube con la calma y baja con el ruido
  actualizar(calma) {
    this.luz += (calma - this.luz) * 0.02;
    for (let i = 0; i < this.n; i++) {
      this.lf[i] += 0.03;
      this.lx[i] += sin(this.lf[i] * 0.7 + i) * 0.6;
      this.ly[i] += cos(this.lf[i] * 0.5 + i * 2) * 0.4;
      this.lx[i] = tope(this.lx[i], 0, ANCHO);
      this.ly[i] = tope(this.ly[i], ALTO * 0.3, ALTO);
    }
  }

  // [INTERACCIÓN] Con el mouse quieto o lento, las luciérnagas se acercan al cursor
  atraer(mx, my) {
    for (let i = 0; i < this.n; i++) {
      const d = dist(mx, my, this.lx[i], this.ly[i]);
      if (d < 260) {
        const f = map(d, 0, 260, 0.9, 0);
        this.lx[i] += ((mx - this.lx[i]) / (d + 1)) * f;
        this.ly[i] += ((my - this.ly[i]) / (d + 1)) * f;
      }
    }
  }

  // [INTERACCIÓN] Un clic o tecla las dispersa y apaga la luz un poco
  espantar() {
    for (let i = 0; i < this.n; i++) {
      this.lx[i] = tope(this.lx[i] + random(-160, 160), 0, ANCHO);
      this.ly[i] = tope(this.ly[i] + random(-120, 120), ALTO * 0.3, ALTO);
    }
    this.luz = max(0, this.luz - 0.25);
  }

  display() {
    noStroke();
    for (let y = 0; y < ALTO; y += 8) {                      // cielo: degradado con for
      const noche = mezclar(AZUL_PROF, NEGRO, y / ALTO);
      const alba = mezclar(AZUL_PROF, ROSA, y / ALTO);       // horizonte rosa, cielo azul profundo
      rel(mezclar(noche, alba, this.luz * 0.85));
      rect(ANCHO / 2, y + 4, ANCHO, 8);
    }
    const aparece = tope(this.luz * 3, 0, 1);                // montañas y mar aparecen con la luz
    rel(AMARILLO, 200 * this.luz);                           // sol que sube
    circle(ANCHO / 2, map(this.luz, 0, 1, 560, 330), 150 + 40 * this.luz);
    rel(mezclar(NEGRO, AZUL_PROF, 0.4 + this.luz * 0.3), 255 * aparece);    // montañas (triángulos)
    triangle(-80, 560, 220, 330, 520, 560);
    triangle(300, 560, 640, 280, 980, 560);
    triangle(820, 560, 1100, 360, 1380, 560);
    rel(mezclar(AZUL_PROF, AZUL, this.luz), 255 * aparece);                 // mar
    rect(ANCHO / 2, 640, ANCHO, 160);
    tra(BLANCO, 90 * this.luz);                              // olas (líneas)
    strokeWeight(3);
    for (let i = 0; i < 9; i++) {
      const y = 580 + i * 17;
      const o = sin(frameCount * 0.03 + i) * 30;
      line(80 + i * 40 + o, y, 260 + i * 40 + o, y);
      line(700 - i * 30 - o, y + 6, 880 - i * 30 - o, y + 6);
    }
    noStroke();
    for (let i = 0; i < this.n; i++) {                       // luciérnagas
      const brillo = 80 + 175 * abs(sin(this.lf[i]));
      rel(AMARILLO, brillo * (0.3 + 0.7 * this.luz));
      circle(this.lx[i], this.ly[i], 7);
      rel(AMARILLO, brillo * 0.2);
      circle(this.lx[i], this.ly[i], 20);
    }
  }
}

// =====================================================================
// CLASE Petalo: unidad del mandala (triángulo + círculo en la punta)
// Su posición es relativa al centro del mandala.
// =====================================================================
class Petalo {
  constructor(radio, ang, largo, color) {
    this.radio = radio;                    // distancia desde el centro del mandala
    this.ang = ang;
    this.largo = largo;
    this.ancho = largo * 0.22;
    this.color = color;
    this.abierto = 0;                      // 0 = cerrado, 1 = abierto
    this.objetivo = 0;
    this.temblor = 0;
  }

  // [INTERACCIÓN] El mandala le dice cuánto debe abrirse (0 a 1)
  abrir(v) {
    this.objetivo = tope(v, 0, 1);
  }

  // [INTERACCIÓN] Si el cursor (en coordenadas locales) pasa cerca de la punta, tiembla
  estremecer(lx, ly) {
    const L = this.radio + this.largo * this.abierto;
    const d = dist(lx, ly, cos(this.ang) * L, sin(this.ang) * L);
    if (d < 70) this.temblor = max(this.temblor, map(d, 0, 70, 1, 0.2));
  }

  actualizar() {
    this.abierto += (this.objetivo - this.abierto) * 0.04;
    this.temblor = max(0, this.temblor - 0.03);
  }

  display() {
    if (this.abierto < 0.02) return;
    const L = this.largo * this.abierto;
    const w = this.ancho * this.abierto;
    push();
    translate(cos(this.ang) * this.radio, sin(this.ang) * this.radio);
    rotate(this.ang + sin(frameCount * 0.5) * 0.12 * this.temblor);
    noStroke();
    rel(this.color, 190);
    triangle(0, -w, L, 0, 0, w);                         // cuerpo del pétalo
    rel(BLANCO, 160);
    circle(L * 0.85, 0, w * 0.9 + 6 * this.temblor);     // punta
    tra(TINTA, 120);
    strokeWeight(2);
    line(0, 0, L * 0.8, 0);                              // nervadura
    pop();
  }
}

// =====================================================================
// CLASE Mandala: anillos de pétalos que florecen con la quietud
// VARIAS INSTANCIAS: arreglo this.petalos (5 anillos)
// =====================================================================
class Mandala {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.rot = 0;
    this.floracion = 0;                    // 0 a 1: cuántos anillos están abiertos
    this.anillos = 5;
    this.petalos = [];
    const colores = [ROSA, CIAN, AMARILLO, VERDE, MORADO, NARANJA];
    for (let a = 0; a < this.anillos; a++) {
      const cant = 8 + a * 4;
      for (let i = 0; i < cant; i++) {
        this.petalos.push(new Petalo(40 + a * 42, (TWO_PI / cant) * i + a * 0.2, 60 + a * 12, colores[(a + i) % 6]));
      }
    }
  }

  // La floración crece con la calma (de adentro hacia afuera)
  actualizar(calma) {
    this.floracion = tope(this.floracion + (calma > 0.5 ? 0.0025 : -0.004), 0, 1);
    this.rot += 0.002 + 0.004 * this.floracion;
    let k = 0;
    for (let a = 0; a < this.anillos; a++) {
      const cant = 8 + a * 4;
      for (let i = 0; i < cant; i++) {
        this.petalos[k].abrir(this.floracion * this.anillos - a);
        this.petalos[k].actualizar();
        k++;
      }
    }
  }

  // [INTERACCIÓN] El cursor se pasa a coordenadas locales (deshaciendo giro y escala)
  sentirCursor(mx, my) {
    const dx = (mx - this.x) / this.s;
    const dy = (my - this.y) / this.s;
    const lx = dx * cos(-this.rot) - dy * sin(-this.rot);
    const ly = dx * sin(-this.rot) + dy * cos(-this.rot);
    for (let i = 0; i < this.petalos.length; i++) this.petalos[i].estremecer(lx, ly);
  }

  // [INTERACCIÓN] Un clic cierra de golpe parte del mandala: la calma se rompe
  cerrar(fuerza) {
    this.floracion = max(0, this.floracion - (fuerza === undefined ? 0.3 : fuerza));
  }

  florecio() { return this.floracion >= 0.99; }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.s * (1 + 0.025 * sin(frameCount * 0.03)));   // respira
    rotate(this.rot);
    for (let i = 0; i < this.petalos.length; i++) this.petalos[i].display();
    noStroke();
    rel(ROSA, 230);
    circle(0, 0, 54 + 10 * this.floracion);                   // centro
    rel(CIAN);
    circle(0, 0, 26);
    rel(BLANCO);
    circle(0, 0, 8);
    noFill();
    tra(BLANCO, 120 * this.floracion);
    strokeWeight(3);
    arc(0, 0, 130, 130, 0, PI * 1.5);                         // aro delicado
    pop();
  }
}

// =====================================================================
// CLASE Desarme: la carcasa de la Mac 84 se desarma después de la
// Florecida. Sus 14 piezas (rect y circle) salen de la posición que
// tenían en la Mac y flotan alrededor del mandala.
// VARIAS INSTANCIAS: arreglos paralelos (una entrada por pieza)
// =====================================================================
class Desarme {
  constructor(x, y, s) {
    this.x = x;                            // centro y escala de la Mac original
    this.y = y;
    this.s = s;
    this.progreso = 0;                     // 0 = Mac armada, 1 = totalmente desarmada
    this.objetivo = 0;
    this.interrumpido = false;
    this.n = 0;
    this.tipo = [];                        // 'R' rect con borde, 'r' rect liso, 'o' ojo
    this.hx = [];                          // posición de reposo dentro de la Mac
    this.hy = [];
    this.w = [];
    this.h = [];
    this.col = [];
    this.dx = [];                          // destino flotando alrededor del mandala
    this.dy = [];
    this.giro = [];
    this.fase = [];
    this.jx = [];                          // desplazamiento por caricia o recomposición
    this.jy = [];
    this.px = [];                          // posición actual en pantalla
    this.py = [];
    this.agregar('R', 0, -35, 400, 430, CARCASA);          // cabeza
    this.agregar('R', 0, 243, 430, 46, CARCASA);           // base
    this.agregar('R', 0, -72, 318, 268, BISEL);            // bisel
    this.agregar('r', 0, -72, 290, 240, PANTALLA);         // pantalla
    this.agregar('r', 0, -182, 290, 20, BLANCO);           // barra de menú
    for (let k = 0; k < 6; k++) this.agregar('r', -125, 165 + (k - 2.5) * 6.2, 64, 6.2, FRANJAS[k]);   // franjas
    this.agregar('r', 45, 165, 130, 12, BISEL);            // ranura del disquete
    this.agregar('o', -62, -70, 78, 78, BLANCO);           // ojo izquierdo
    this.agregar('o', 62, -70, 78, 78, BLANCO);            // ojo derecho
  }

  agregar(tipo, hx, hy, w, h, color) {
    const a = random(TWO_PI);
    const r = random(330, 470);
    this.tipo.push(tipo);
    this.hx.push(hx);
    this.hy.push(hy);
    this.w.push(w);
    this.h.push(h);
    this.col.push(color);
    this.dx.push(tope(ANCHO / 2 + cos(a) * r * 1.3, 70, ANCHO - 70));
    this.dy.push(tope(ALTO / 2 + sin(a) * r * 0.7, 110, ALTO - 110));   // siempre entre las barras del Marco
    this.giro.push(random(-0.9, 0.9));
    this.fase.push(random(TWO_PI));
    this.jx.push(0);
    this.jy.push(0);
    this.px.push(this.x + hx * this.s);
    this.py.push(this.y + hy * this.s);
    this.n++;
  }

  // Empieza a desarmarse
  iniciar() {
    this.objetivo = 1;
    this.interrumpido = false;
  }

  // Avanza el desarme y calcula la posición de cada pieza
  actualizar() {
    if (this.objetivo > this.progreso) this.progreso = min(this.objetivo, this.progreso + 0.0035);   // ~5 s en desarmarse
    else this.progreso = max(this.objetivo, this.progreso - 0.02);                                    // vuelve rápido
    const e = this.progreso * this.progreso * (3 - 2 * this.progreso);
    for (let i = 0; i < this.n; i++) {
      this.fase[i] += 0.02;
      this.jx[i] *= 0.97;
      this.jy[i] *= 0.97;
      const hx = this.x + this.hx[i] * this.s;
      const hy = this.y + this.hy[i] * this.s;
      this.px[i] = lerp(hx, this.dx[i], e) + this.jx[i] + sin(this.fase[i]) * 14 * e;
      this.py[i] = lerp(hy, this.dy[i], e) + this.jy[i] + cos(this.fase[i] * 0.8) * 10 * e;
    }
  }

  // [INTERACCIÓN] Movimiento lento del mouse: las piezas se acercan al cursor como una caricia
  rozar(mx, my) {
    if (this.progreso < 0.3) return;
    for (let i = 0; i < this.n; i++) {
      const d = dist(mx, my, this.px[i], this.py[i]);
      if (d < 200) {
        const f = map(d, 0, 200, 2.2, 0);
        this.jx[i] = tope(this.jx[i] + ((mx - this.px[i]) / (d + 1)) * f, -120, 120);
        this.jy[i] = tope(this.jy[i] + ((my - this.py[i]) / (d + 1)) * f, -120, 120);
      }
    }
  }

  // [INTERACCIÓN] Un clic, tecla o movimiento brusco: las piezas regresan de golpe a la Mac
  recomponer() {
    this.objetivo = 0;
    this.interrumpido = true;
    for (let i = 0; i < this.n; i++) {
      this.jx[i] += random(-60, 60);
      this.jy[i] += random(-60, 60);
    }
  }

  completo() { return this.progreso >= 0.995; }

  vuelto() { return this.interrumpido && this.progreso <= 0.005; }

  display() {
    if (this.progreso <= 0.005) return;
    const e = this.progreso * this.progreso * (3 - 2 * this.progreso);
    const esc = this.s * (1 - 0.55 * e);                          // las piezas se encogen al alejarse
    const a = (255 - 120 * e) * tope(this.progreso * 8, 0, 1);    // aparece como un fantasma y se desarma
    for (let i = 0; i < this.n; i++) {
      push();
      translate(this.px[i], this.py[i]);
      rotate(this.giro[i] * e + sin(this.fase[i] * 0.5) * 0.15 * e);
      if (this.tipo[i] === 'o') {
        tra(TINTA, a);
        strokeWeight(4);
        rel(BLANCO, a);
        circle(0, 0, this.w[i] * esc);
        noStroke();
        rel(TINTA, a);
        circle(0, 0, 30 * esc);                                   // pupila
      } else if (this.tipo[i] === 'R') {
        tra(TINTA, a);
        strokeWeight(3);
        rel(this.col[i], a);
        rect(0, 0, this.w[i] * esc, this.h[i] * esc, 14 * esc);
      } else {
        noStroke();
        rel(this.col[i], a);
        rect(0, 0, this.w[i] * esc, this.h[i] * esc);
      }
      pop();
    }
  }
}

// =====================================================================
// CLASE Marco: las barras rosa que unifican todas las etapas.
// Arriba: título y etapa. Abajo: pista, guía de los seis estados y teclas.
// En el RETORNO la guía retrocede de DESARME a INICIO.
// =====================================================================
class Marco {
  constructor() {
    this.alto = 40;
    this.flash = 0;                        // destello cuando el jugador hace algo
    this.sobre = -1;                       // segmento de la guía bajo el cursor
  }

  actualizar() {
    this.flash = max(0, this.flash - 0.12);
  }

  // [INTERACCIÓN] Cada clic o tecla hace destellar las barras
  destellar() {
    this.flash = 1;
  }

  // [INTERACCIÓN] Si el cursor está sobre un segmento de la guía, se muestra su nombre
  senalar(mx, my) {
    this.sobre = -1;
    if (my < ALTO - this.alto) return;
    for (let i = 0; i < 6; i++) {
      if (abs(mx - this.xSegmento(i)) < 24) this.sobre = i;
    }
  }

  xSegmento(i) { return ANCHO / 2 + (i - 2.5) * 52; }

  // idx: segmento actual (0 a 5) · retorno: true mientras la guía retrocede
  display(idx, etapa, pista, retorno) {
    const yTop = this.alto / 2;
    const yBot = ALTO - this.alto / 2;
    noStroke();
    rel(mezclar(ROSA, BLANCO, this.flash * 0.6));
    rect(ANCHO / 2, yTop, ANCHO, this.alto);                      // barra superior
    rect(ANCHO / 2, yBot, ANCHO, this.alto);                      // barra inferior
    rel(AZUL_PROF);
    textFont(TITULAR);
    textSize(24);
    textAlign(LEFT, CENTER);
    text('FUERA DE LA PANTALLA', 24, yTop + 1);
    textAlign(RIGHT, CENTER);
    text(etapa, ANCHO - 24, yTop + 1);
    textFont(SISTEMA);
    textStyle(BOLD);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(pista, 24, yBot);
    textAlign(RIGHT, CENTER);
    text('[R] REINICIAR · [M] SONIDO', ANCHO - 24, yBot);
    for (let i = 0; i < 6; i++) {                                 // guía de los seis estados
      const actual = i === idx;
      if (actual) rel(retorno ? CIAN : BLANCO);
      else if (i < idx) rel(AZUL_PROF);
      else rel(mezclar(ROSA, NEGRO, 0.4));
      rect(this.xSegmento(i), yBot, 40, actual ? 18 : 10, 2);
    }
    textAlign(CENTER, CENTER);
    if (this.sobre >= 0) {                                        // nombre del segmento señalado
      const x = this.xSegmento(this.sobre);
      rel(NEGRO, 230);
      rect(x, ALTO - this.alto - 18, 130, 24, 6);
      rel(BLANCO);
      textSize(14);
      text(ESTADOS[this.sobre], x, ALTO - this.alto - 18);
    }
    textStyle(NORMAL);
  }
}

// =====================================================================
// CLASE Juego: gestión de estados y escenas
// =====================================================================
class Juego {
  constructor() {
    this.sonido = new Sonido();
    this.mac = new Mac(MAC_X, MAC_Y, MAC_S);
    this.marco = new Marco();
    this.crearEscenas();
    this.alertas = [];
    this.estado = 'INICIO';            // INICIO, RESISTENCIA, SATURACION, MANDATO, FLORECIDA, DESARME, RETORNO
    this.saturacion = 0;               // 0 a 100
    this.ultimoFrameInput = 0;         // frameCount del último evento del jugador
    this.frameEstado = 0;              // frame en que se entró al estado actual
    this.tFlor = 0;                    // frames con el mandala completamente abierto
    this.motivo = 0;                   // por qué se vuelve al inicio (ver TEXTOS_RETORNO)
    this.fundido = 0;                  // 1 = negro total, baja solo (transiciones suaves)
    this.sacudida = 0;
    this.mx = ANCHO / 2;
    this.my = ALTO / 2;
  }

  // Las tres escenas del mundo real se crean siempre igual (al empezar y en cada retorno)
  crearEscenas() {
    this.ambiente = new Ambiente();
    this.mandala = new Mandala(MAN_X, MAN_Y, MAN_S);
    this.desarme = new Desarme(MAC_X, MAC_Y, MAC_S);
  }

  // ----- ciclo -----
  actualizar() {
    this.mx = (mouseX - desX) / escala;
    this.my = (mouseY - desY) / escala;
    const d = dist(mouseX, mouseY, pmouseX, pmouseY);            // movimiento brusco = input
    if (d > 4) this.registrarInput('mov', d);

    this.sacudida *= 0.88;
    this.fundido = max(0, this.fundido - 0.05);
    this.marco.actualizar();
    const conCursor = this.estado === 'INICIO' || this.estado === 'RESISTENCIA' || this.estado === 'RETORNO';
    this.marco.senalar(conCursor ? this.mx : -1000, conCursor ? this.my : -1000);
    const sinInput = frameCount - this.ultimoFrameInput;         // frames de quietud

    if (this.estado === 'RESISTENCIA') {
      if (sinInput > 24) this.saturacion = max(0, this.saturacion - 0.05);
      if (this.saturacion >= 100) this.cambiarEstado('SATURACION');
      else if (sinInput > 210 && this.saturacion >= 18) this.cambiarEstado('MANDATO');   // ~3.5 s quieto
      else if (sinInput > 330) this.iniciarRetorno(1);           // se calmó sin jugar: vuelve al inicio
    } else if (this.estado === 'SATURACION' && frameCount - this.frameEstado > 240) {      // 4 s colgado
      this.saturacion = 0;
      this.cambiarEstado('MANDATO');
    } else if (this.estado === 'MANDATO' && sinInput > 300 && frameCount - this.frameEstado > 300) {
      this.cambiarEstado('FLORECIDA');                           // ~5 s sin tocar el mouse
    } else if (this.estado === 'RETORNO' && frameCount - this.frameEstado > T_RETORNO) {
      this.cambiarEstado('INICIO');                              // terminó el retorno: empieza de nuevo
    }

    if (this.estado === 'FLORECIDA' || this.estado === 'DESARME') {
      const calma = tope(sinInput / 180, 0, 1);                  // 3 s quieto = calma total
      this.ambiente.actualizar(calma);
      this.mandala.actualizar(calma);
      if (d < 12) {                                              // movimiento lento = caricia
        this.ambiente.atraer(this.mx, this.my);
        this.mandala.sentirCursor(this.mx, this.my);
        if (this.estado === 'DESARME') this.desarme.rozar(this.mx, this.my);
      }
      if (this.estado === 'FLORECIDA') {
        this.tFlor = this.mandala.florecio() ? this.tFlor + 1 : 0;
        if (this.tFlor > 300) {                                  // ~5 s con el mandala completo
          this.cambiarEstado('DESARME');
          this.desarme.iniciar();
        }
      } else {
        this.desarme.actualizar();
        if (this.desarme.vuelto()) this.iniciarRetorno(0);       // la Mac se recompuso: vuelta al inicio
      }
    }

    for (let i = 0; i < this.alertas.length; i++) {
      this.alertas[i].actualizar();
      if (this.estado === 'RESISTENCIA') this.alertas[i].huirDelCursor(this.mx, this.my);
    }
    const vivas = [];
    for (let i = 0; i < this.alertas.length; i++) if (this.alertas[i].viva()) vivas.push(this.alertas[i]);
    this.alertas = vivas;

    let cara = 'feliz';
    if (this.estado === 'RESISTENCIA') cara = 'enojado';
    const flash = this.estado === 'RESISTENCIA' ? (frameCount % 12 < 6 ? this.saturacion / 100 : 0) : 0;
    this.mac.actualizar(cara, flash);
    this.mac.seguirCursor(this.mx, this.my);
    const enCalma = this.estado === 'FLORECIDA' || this.estado === 'DESARME';
    this.sonido.actualizar(this.estado === 'RESISTENCIA' ? this.saturacion : 0, enCalma ? this.ambiente.luz : 0);

    // cursor(): flecha, reloj durante la saturación y oculto en el Mandato, la Florecida y el Desarme
    if (this.estado === 'SATURACION') cursor(WAIT);
    else if (this.estado === 'MANDATO' || enCalma) noCursor();
    else cursor(ARROW);
  }

  display() {
    background(0);
    push();
    translate(desX, desY);
    scale(escala);
    noStroke();
    if (this.estado === 'SATURACION') {
      this.dibujarSaturacion();                         // pantalla detenida, sin aleatoriedad
    } else {
      push();
      if (this.sacudida > 0.5) {                        // vibración caótica (el Marco no vibra)
        translate(ANCHO / 2, ALTO / 2);
        rotate(random(-1, 1) * this.sacudida * 0.0021);
        translate(-ANCHO / 2 + random(-this.sacudida, this.sacudida), -ALTO / 2 + random(-this.sacudida, this.sacudida));
      }
      if (this.estado === 'DESARME') this.dibujarDesarme();
      else if (this.estado === 'FLORECIDA') this.dibujarFlorecida();
      else if (this.estado === 'MANDATO') this.dibujarMandato();
      else if (this.estado === 'RETORNO') this.dibujarRetorno();
      else this.dibujarJuego();
      for (let i = 0; i < this.alertas.length; i++) this.alertas[i].display();
      pop();
    }
    if (this.fundido > 0.01) {                          // fundido desde negro en las transiciones suaves
      noStroke();
      rel(NEGRO, 255 * this.fundido);
      rect(ANCHO / 2, ALTO / 2, ANCHO, ALTO);
    }
    this.dibujarMarco();
    pop();
  }

  dibujarMarco() {
    const i = ESTADOS.indexOf(this.estado);
    let idx = min(i, 5);
    let retorno = false;
    if (this.estado === 'RETORNO') {                    // la guía retrocede de DESARME a INICIO
      const p = tope((frameCount - this.frameEstado) / T_RETORNO, 0, 1);
      idx = round(5 * (1 - p));
      retorno = true;
    }
    this.marco.display(idx, ETAPAS[i], PISTAS[i], retorno);
  }

  dibujarJuego() {
    const s = this.saturacion / 100;
    if (this.estado === 'RESISTENCIA') {                // fondo de fricción
      noStroke();
      rel(random() < 0.5 ? ROJO : ROSA, 150 * (frameCount % 12 < 6 ? s : 0));
      rect(ANCHO / 2, ALTO / 2, ANCHO, ALTO);
      for (let i = 0; i < floor(s * 12); i++) {
        rel(random([ROJO, AMARILLO, AZUL, ROSA, CIAN, BLANCO]), random(70, 190));
        rect(random(ANCHO), random(ALTO), random(80, 520), random(3, 18));
      }
    }
    textFont(TITULAR);
    textSize(68);
    rel(ROSA);
    text('FUERA DE LA PANTALLA', ANCHO / 2 + random(-2, 2) * s * 3, 104);
    this.mac.display();
    if (this.estado === 'INICIO') {
      textFont(TITULAR);
      textSize(28);
      rel(CIAN, 140 + 115 * abs((frameCount % 120) / 60 - 1));
      text('HAZ CLIC. PRESIONA TECLAS. JUEGA.', ANCHO / 2, 660);
    }
  }

  dibujarSaturacion() {
    // Las franjas tienen posiciones y tamaños fijos para que esta escena
    // no cambie aleatoriamente en cada fotograma.
    noStroke();
    rel(ROSA);
    rect(ANCHO / 2, 180, ANCHO, 4);
    rel(CIAN);
    rect(ANCHO / 2, 270, 760, 3);
    rel(BLANCO);
    rect(ANCHO / 2, 360, 980, 2);
    rel(ROSA);
    rect(ANCHO / 2, 450, 640, 4);
    textFont(TITULAR);
    textSize(64);
    rel(BLANCO);
    text('SISTEMA CONGELADO', ANCHO / 2, 540);
  }

  dibujarMandato() {
    noStroke();
    for (let y = 0; y < ALTO; y += 8) {                 // degradado hecho con un for
      rel(mezclar(AZUL_PROF, NEGRO, y / ALTO));
      rect(ANCHO / 2, y + 4, ANCHO, 8);
    }
    const vib = this.sacudida * 0.1;
    textFont(TITULAR);
    textSize(58);
    rel(ROSA);
    text('PARA CONTINUAR,', ANCHO / 2 + random(-vib, vib), 245);
    textSize(110);
    rel(BLANCO);
    text('SUELTA EL MOUSE.', ANCHO / 2 + random(-vib, vib), 325);
    textSize(32);
    rel(CIAN);
    text('ALÉJATE 2 METROS DE LA PANTALLA, MIRA POR LA VENTANA DURANTE 20 SEGUNDOS O TOCA UN OBJETO ORGÁNICO EN TU ENTORNO REAL.', ANCHO / 2, 450, 860, 120);
  }

  dibujarFlorecida() {
    this.ambiente.display();
    this.mandala.display();
  }

  dibujarDesarme() {
    const p = this.desarme.progreso;
    const txt = tope((p - 0.6) / 0.4, 0, 1);              // el texto aparece al final del desarme
    this.ambiente.display();
    this.mandala.display();
    this.desarme.display();
    noStroke();
    rel(NEGRO, 150 * txt);                                // franjas oscuras para leer el texto
    rect(ANCHO / 2, 95, ANCHO, 110);
    rect(ANCHO / 2, 636, ANCHO, 84);
    textFont(TITULAR);
    textSize(44);
    rel(ROSA, 255 * txt);
    text('ABURRIRSE ES UN ACTO DE RESISTENCIA', ANCHO / 2, 84);
    textSize(24);
    rel(CIAN, 255 * txt);
    text('DEBERÍAMOS ABURRIRNOS MUCHO MÁS', ANCHO / 2, 126);
    const t = frameCount - this.frameEstado;              // una pregunta nueva cada 5 s
    const fase = (t % 300) / 300;
    const a = tope(sin(fase * PI) * 2.5, 0, 1) * txt;
    textSize(28);
    rel(BLANCO, 255 * a);
    text(PREGUNTAS[floor(t / 300) % PREGUNTAS.length].toUpperCase(), ANCHO / 2, 636, 1100, 70);
  }

  // Misma composición que el INICIO (título arriba, Mac al centro, texto abajo)
  // para que el regreso se sienta como volver a la casilla de salida.
  dibujarRetorno() {
    textFont(TITULAR);
    textSize(68);
    rel(ROSA);
    text('TODO VUELVE AL INICIO', ANCHO / 2, 104);
    this.mac.display();
    textSize(28);
    rel(CIAN, 140 + 115 * abs((frameCount % 120) / 60 - 1));
    text(TEXTOS_RETORNO[this.motivo], ANCHO / 2, 660);
  }

  // ----- eventos del jugador -----
  // [INTERACCIÓN]
  alPresionarMouse() {
    this.sonido.iniciar();
    for (let i = 0; i < this.alertas.length; i++) {      // cerrar una alerta lanza dos más
      if (this.alertas[i].alClic(this.mx, this.my)) { this.lanzarAlerta(); this.lanzarAlerta(); }
    }
    this.mac.sobresaltar();
    this.registrarInput('clic', 1);
  }

  // [INTERACCIÓN]
  alPresionarTecla(k) {
    this.sonido.iniciar();
    if (k === 'm' || k === 'M') { this.sonido.alternarSilencio(); return; }
    if (k === 'r' || k === 'R') { this.reiniciar(); return; }
    this.registrarInput('tecla', 1);
  }

  // [INTERACCIÓN] Punto único por donde pasa todo input: sube la saturación
  registrarInput(tipo, mag) {
    if (this.estado === 'RETORNO') return;                      // durante el retorno el sistema no escucha
    if (this.estado === 'INICIO' && tipo === 'mov') return;     // mover el mouse no empieza el juego
    if (tipo !== 'mov') this.marco.destellar();                 // las barras destellan con cada clic o tecla

    if (this.estado === 'FLORECIDA') {                          // en la Florecida el ruido rompe la calma
      if (tipo === 'mov' && mag <= 12) return;                  // movimiento lento = caricia, no rompe la calma
      this.ultimoFrameInput = frameCount;
      this.tFlor = 0;
      if (tipo === 'mov') {
        this.mandala.cerrar(0.03);                              // movimiento brusco: cierra un poco
      } else {
        this.mandala.cerrar();                                  // clic o tecla: cierra de golpe
        this.ambiente.espantar();
        this.sacudida = max(this.sacudida, 4);
      }
      return;
    }

    if (this.estado === 'DESARME') {                            // en el Desarme el ruido recompone la Mac
      if (tipo === 'mov' && mag <= 12) return;
      this.ultimoFrameInput = frameCount;
      this.desarme.recomponer();
      if (tipo === 'mov') {
        this.mandala.cerrar(0.03);
      } else {
        this.mandala.cerrar();
        this.ambiente.espantar();
        this.sacudida = max(this.sacudida, 8);
      }
      return;
    }

    this.ultimoFrameInput = frameCount;
    if (this.estado === 'INICIO') this.cambiarEstado('RESISTENCIA');
    if (this.estado === 'MANDATO') { this.sacudida = max(this.sacudida, 6); return; }
    if (this.estado === 'SATURACION') return;
    let inc = min(mag, 40) * 0.012;                              // movimiento
    if (tipo === 'clic') inc = 9;
    if (tipo === 'tecla') inc = 5;
    this.saturacion = tope(this.saturacion + inc, 0, 100);
    if (tipo !== 'mov') {
      this.sacudida = max(this.sacudida, 10 + this.saturacion * 0.25);
      this.sonido.pulso(1);
      if (random() < 0.35 + this.saturacion / 200) this.lanzarAlerta();
    }
  }

  cambiarEstado(nuevo) {
    this.estado = nuevo;
    this.frameEstado = frameCount;
    if (nuevo === 'FLORECIDA') this.tFlor = 0;
    if (nuevo === 'MANDATO' || nuevo === 'FLORECIDA' || nuevo === 'DESARME' || nuevo === 'RETORNO') this.alertas = [];
    // Las entradas bruscas (RESISTENCIA, SATURACION) y el INICIO no llevan fundido: las demás sí
    if (nuevo !== 'RESISTENCIA' && nuevo !== 'SATURACION' && nuevo !== 'INICIO') this.fundido = 1;
  }

  lanzarAlerta() {
    if (this.alertas.length >= 10) this.alertas.shift();
    this.alertas.push(new Alerta(random(ERRORES), random(150, 1130), random(150, 620)));
  }

  // Vuelta al inicio con aviso claro: se limpia todo, la Mac se muestra feliz y la
  // guía de etapas retrocede durante T_RETORNO fotogramas antes de entrar en INICIO.
  // motivo: 0 = tocó durante el desarme · 1 = se calmó sin jugar · 2 = tecla R
  iniciarRetorno(motivo) {
    this.motivo = motivo;
    this.saturacion = 0;
    this.alertas = [];
    this.sacudida = 0;
    this.tFlor = 0;
    this.ultimoFrameInput = frameCount;
    this.crearEscenas();
    this.cambiarEstado('RETORNO');
  }

  reiniciar() {
    if (this.estado === 'INICIO' || this.estado === 'RETORNO') return;   // ya está volviendo al inicio
    this.iniciarRetorno(2);
  }
}