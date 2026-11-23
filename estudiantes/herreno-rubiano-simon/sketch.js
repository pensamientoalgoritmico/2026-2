/*
  SIMON HERREÑO | PENSAMIENTO ALGORITMICO | ENTREGA FINAL
  BREAK THE BEAT — JUEGO DESOBEDIENTE

  CONCEPTO
  El sistema primero recompensa la obediencia a un ritmo.
  Cuando las reglas fallan, solo desobedecer permite avanzar.
  El objetivo no es ganar puntos: es recuperar la libertad de actuar.

  ESTADOS: 0 inicio, 1 instrucciones, 2 control,
           3 ruptura, 4 libertad, 5 reflexion.

  REFERENTES
  Rez Infinite — sincronizacion musical y geometria:
  https://www.rezinfinite.com/
  Ryoji Ikeda, Test Pattern — repeticion y contraste:
  https://www.ryojiikeda.com/project/testpattern/
  There Is No Game: Wrong Dimension — cuestionar las reglas:
  https://store.steampowered.com/app/1240210/

  RECURSOS / PROCESO
  Formas, clases, arreglos, condicionales, funciones,
  estados, eventos de mouse/teclado y p5.sound.
  Musica original 128 BPM: break_the_beat_128bpm.mp3.
  Se partio del borrador E08, se elimino el cambio
  provisional por teclas 0-3 y se agrego audio real,
  nuevas instrucciones, friccion, cierre y reinicio.
  Asistencia de IA: revision, integracion y produccion
  de musica original. Revisar y editar antes de entregar.
*/

// --- 1. VARIABLES GLOBALES ---
const BPM = 128;
const SEG_PULSO = 60 / BPM;
const META = 70;
const COLORES = {
  fondo: [16, 16, 22], morado: [152, 92, 255],
  lila: [214, 175, 244], rosa: [243, 68, 101],
  lima: [218, 244, 74], cian: [0, 218, 230]
};

let estado = 0;
let jugador;
let anillos = [];
let particulas = [];
let musica;
let audioListo = false;
let relojRitmo = 0;
let inicioEstado = 0;
let puntaje = 0;
let aciertos = 0;
let fallos = 0;
let desobediencia = 0;
let fueraDeRitmo = 0;
let clicsFuera = 0;
let creadas = 0;
let ultimoPulso = -1;
let espacioPresionado = false;
let mensaje = '';
let hastaMensaje = 0;

// --- 2. AUDIO REAL (p5.js 1.11.13 + p5.sound) ---
function preload() {
  soundFormats('mp3');
  musica = loadSound('break_the_beat_128bpm.mp3',
    () => { audioListo = true; },
    () => { audioListo = false; });
}

function setup() {
  createCanvas(960, 600);
  textFont('monospace');
  jugador = new Jugador();
  crearObjetos();
  inicioEstado = millis();
}

function crearObjetos() {
  anillos = [];
  particulas = [];
  for (let i = 0; i < 6; i++) {
    let a = TWO_PI * i / 6;
    anillos.push(new Anillo(width / 2 + cos(a) * 230,
                           height / 2 + sin(a) * 142, 43));
  }
  for (let i = 0; i < 30; i++) {
    particulas.push(new Particula(random(width), random(height)));
  }
}

// La musica lleva el tiempo: no depende de frameCount.
function tiempoRitmo() {
  if (audioListo && musica && musica.isPlaying()) {
    return musica.currentTime();
  }
  // Si falla el audio, el juego aun puede probarse.
  return (millis() - relojRitmo) / 1000;
}

function distanciaAlPulso() {
  let fase = ((tiempoRitmo() % SEG_PULSO) + SEG_PULSO) % SEG_PULSO;
  return min(fase, SEG_PULSO - fase);
}

function cercaDelPulso() {
  return distanciaAlPulso() < 0.105;
}

function indicePulso() {
  return floor((tiempoRitmo() + 0.105) / SEG_PULSO);
}

function activarAudio() {
  // Un clic o una tecla del jugador desbloquea el audio del navegador.
  userStartAudio();
}

// --- 3. DIBUJO PRINCIPAL ---
function draw() {
  jugador.actualizar();
  if (estado === 0) pantallaInicio();
  if (estado === 1) pantallaInstrucciones();
  if (estado === 2) pantallaControl();
  if (estado === 3) pantallaRuptura();
  if (estado === 4) pantallaLibertad();
  if (estado === 5) pantallaCierre();
  if (estado >= 2 && estado <= 4) jugador.mostrar();
  mostrarMensaje();
}

function fondoTecnologico(r, g, b) {
  background(r, g, b);
  stroke(152, 92, 255, 24);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 30) line(x, 0, x, height);
  for (let y = 0; y <= height; y += 30) line(0, y, width, y);
}

function textoCentrado(t, y, tam, r, g, b) {
  push();
  noStroke();
  fill(r, g, b);
  textSize(tam);
  textAlign(CENTER, CENTER);
  text(t, width / 2, y);
  pop();
}

function boton(texto, x, y, w, h, r, g, b) {
  push();
  noStroke();
  fill(r, g, b);
  rect(x, y, w, h, 4);
  fill(16, 16, 22);
  textSize(17);
  textAlign(CENTER, CENTER);
  text(texto, x + w / 2, y + h / 2);
  pop();
}

function dentroBoton(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w &&
         mouseY >= y && mouseY <= y + h;
}

function titulo(t, detalle) {
  push();
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(28);
  text(t, 30, 65);
  textAlign(RIGHT);
  textSize(13);
  fill(214, 175, 244);
  text(detalle, width - 30, 49);
  stroke(255, 65);
  line(30, 95, width - 30, 95);
  pop();
}

// --- 4. ESTADO 0: INICIO ---
function pantallaInicio() {
  fondoTecnologico(17, 13, 29);
  push();
  translate(width / 2, 262);
  rotate(frameCount * 0.003);
  noFill();
  stroke(152, 92, 255, 90);
  strokeWeight(2);
  for (let i = 0; i < 7; i++) circle(0, 0, 150 + i * 36);
  pop();
  textoCentrado('BREAK THE BEAT', 244, 57, 255, 255, 255);
  textoCentrado('FOLLOW THE BEAT. TRUST THE SYSTEM.', 299, 16, 218, 244, 74);
  boton('ENTRAR', 350, 390, 260, 55, 152, 92, 255);
  textoCentrado('UN JUEGO SOBRE LAS REGLAS QUE SE ROMPEN', 496, 13, 214, 175, 244);
  textoCentrado(audioListo ? 'AUDIO ORIGINAL · 128 BPM · AURICULARES RECOMENDADOS' :
    'AUDIO NO DISPONIBLE: REVISA EL ARCHIVO MP3', 532, 12, 180, 180, 195);
}

// --- 5. ESTADO 1: INSTRUCCIONES ---
function pantallaInstrucciones() {
  fondoTecnologico(18, 17, 43);
  titulo('EL SISTEMA TIENE REGLAS', '01 / INSTRUCCIONES');
  textoCentrado('PRIMERO, OBEDECE.', 162, 33, 255, 255, 255);
  textoCentrado('1. MUEVE LA MIRA AMARILLA CON EL MOUSE', 238, 17, 214, 175, 244);
  textoCentrado('2. ESCUCHA LA MUSICA Y OBSERVA EL CIRCULO', 282, 17, 214, 175, 244);
  textoCentrado('3. PRESIONA ESPACIO CUANDO EL CIRCULO SE CIERRA', 326, 17, 214, 175, 244);
  textoCentrado('EL SISTEMA TE DIRA SI LO HACES BIEN.', 379, 14, 218, 244, 74);
  boton('ACEPTO LAS REGLAS', 320, 431, 320, 58, 218, 244, 74);
  textoCentrado('ESPACIO / ENTER PARA CONTINUAR', 534, 12, 180, 180, 195);
}

// --- 6. ESTADO 2: CONTROL / OBEDIENCIA ---
function pantallaControl() {
  fondoTecnologico(18, 17, 43);
  titulo('FOLLOW THE BEAT', 'PUNTOS ' + puntaje + '   |   ACIERTOS ' + aciertos + '/5');
  let apertura = map(distanciaAlPulso(), 0, SEG_PULSO / 2, 0, 1);
  let radio = 66 + 142 * apertura;
  push();
  noFill();
  stroke(214, 175, 244);
  strokeWeight(3);
  circle(width / 2, height / 2, radio * 2);
  stroke(152, 92, 255, 95);
  circle(width / 2, height / 2, 120);
  if (cercaDelPulso()) {
    fill(218, 244, 74, 90);
    noStroke();
    circle(width / 2, height / 2, 22);
  }
  pop();
  actualizarObjetos(1.25);
  textoCentrado('PRESIONA ESPACIO CUANDO EL CIRCULO SE CIERRA', 512, 18, 255, 255, 255);
  textoCentrado(aciertos < 3 ? 'OBEDECER = +10' : 'CADA VEZ EXIGIMOS MAS. NO TE EQUIVOQUES.',
                545, 13, 214, 175, 244);
  // La regla caduca: el sistema falla aunque hayas obedecido.
  if (aciertos >= 5 || millis() - inicioEstado > 23000) cambiarEstado(3);
}

// --- 7. ESTADO 3: ERROR / FRICCION ---
function pantallaRuptura() {
  fondoTecnologico(40, 12, 30);
  titulo('SYSTEM FAILURE', 'REBELION ' + desobediencia + '/' + META);
  actualizarObjetos(2.4);
  if (frameCount % 75 < 5) {
    push();
    noStroke();
    fill(243, 68, 101, 42);
    rect(0, 191, width, 11);
    rect(0, 364, width, 6);
    pop();
  }
  textoCentrado('ERROR: OBEDECER YA NO FUNCIONA', 213, 22, 243, 68, 101);
  textoCentrado('ROMPE EL RITMO CON ESPACIO', 250, 16, 255, 255, 255);
  textoCentrado('HAZ CLIC FUERA DE LOS ANILLOS', 280, 16, 255, 255, 255);
  textoCentrado('CADA ERROR PUEDE ABRIR UNA SALIDA.', 470, 13, 214, 175, 244);
  push();
  noStroke();
  fill(70, 35, 50);
  rect(30, 520, 900, 10, 2);
  fill(243, 68, 101);
  rect(30, 520, map(constrain(desobediencia, 0, META), 0, META, 0, 900), 10, 2);
  textAlign(CENTER);
  textSize(12);
  fill(255);
  text('ESPACIOS FUERA DEL BEAT ' + fueraDeRitmo + '/4    |    CLICS EN VACIO ' + clicsFuera + '/2',
       width / 2, 556);
  pop();
  // No basta con ganar puntos: hay que probar DOS tipos de desobediencia.
  if (desobediencia >= META && fueraDeRitmo >= 4 && clicsFuera >= 2) cambiarEstado(4);
}

// --- 8. ESTADO 4: LIBERTAD / CREACION ---
function pantallaLibertad() {
  fondoTecnologico(12, 30, 28);
  titulo('THE RULES ARE GONE', 'SIN PUNTAJES / SIN OBLIGACIONES');
  actualizarObjetos(3.1);
  textoCentrado('YOU WERE NEVER SUPPOSED TO OBEY', 205, 27, 218, 244, 74);
  textoCentrado('AHORA TU DECIDES QUE SUCEDE.', 248, 16, 255, 255, 255);
  textoCentrado('CLIC PARA CREAR   ·   ESPACIO PARA CAMBIAR EL MOVIMIENTO',
                471, 14, 0, 218, 230);
  textoCentrado('PARTICULAS CREADAS: ' + creadas, 505, 12, 200, 200, 210);
  boton('TERMINAR / REFLEXIONAR', 325, 530, 310, 48, 0, 218, 230);
}

// --- 9. ESTADO 5: CIERRE / REFLEXION ---
function pantallaCierre() {
  fondoTecnologico(17, 13, 29);
  titulo('BREAK THE BEAT', '05 / REFLEXION');
  textoCentrado('EL ERROR ERA EL JUEGO.', 180, 36, 218, 244, 74);
  textoCentrado('OBEDECER TE DIO PUNTOS.', 246, 19, 255, 255, 255);
  textoCentrado('DESOBEDECER TE PERMITIO CAMBIAR LAS REGLAS.', 283, 17, 214, 175, 244);
  textoCentrado('¿CUANDO UNA REGLA DEJA DE AYUDARTE?', 354, 18, 0, 218, 230);
  textoCentrado('ACIERTOS: ' + aciertos + '   |   ERRORES: ' + fallos +
    '   |   ACTOS DE DESOBEDIENCIA: ' + (fueraDeRitmo + clicsFuera),
    413, 13, 200, 200, 210);
  boton('VOLVER A EMPEZAR', 337, 477, 286, 56, 152, 92, 255);
  textoCentrado('R PARA REINICIAR', 558, 12, 190, 190, 200);
}

// --- 10. CLASES / COMPORTAMIENTOS ---
class Jugador {
  constructor() { this.x = width / 2; this.y = height / 2; this.radio = 18; }
  actualizar() {
    this.x = constrain(mouseX, 0, width);
    this.y = constrain(mouseY, 0, height);
  }
  mostrar() {
    push();
    translate(this.x, this.y);
    noFill();
    stroke(218, 244, 74);
    strokeWeight(2);
    circle(0, 0, this.radio * 2);
    line(-30, 0, -13, 0); line(13, 0, 30, 0);
    line(0, -30, 0, -13); line(0, 13, 0, 30);
    pop();
  }
  empujar(p) {
    let d = dist(this.x, this.y, p.x, p.y);
    if (d > 0 && d < this.radio + p.radio + 10) {
      p.vx = 3 * (p.x - this.x) / d;
      p.vy = 3 * (p.y - this.y) / d;
      p.destello = 10;
    }
  }
  tocar(a) { return dist(this.x, this.y, a.x, a.y) < a.radio + 12; }
}

class Anillo {
  constructor(x, y, radio) {
    this.x = x; this.y = y; this.radio = radio; this.golpe = 0;
  }
  reaccionar() { this.golpe = 12; }
  mostrar() {
    push();
    noFill();
    strokeWeight(this.golpe > 0 ? 5 : 3);
    if (this.golpe > 0) stroke(218, 244, 74);
    else if (estado === 3) stroke(243, 68, 101);
    else if (estado === 4) stroke(0, 218, 230);
    else stroke(152, 92, 255);
    circle(this.x, this.y, this.radio * 2 + this.golpe * 2);
    if (this.golpe > 0) this.golpe--;
    pop();
  }
}

class Particula {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.radio = random(3, 7);
    this.vx = random(-2, 2); this.vy = random(-2, 2);
    this.destello = 0; this.esperaChoque = 0;
  }
  mover(velocidad) {
    this.x += this.vx * velocidad * .5;
    this.y += this.vy * velocidad * .5;
    if (this.x < this.radio || this.x > width - this.radio) this.vx *= -1;
    if (this.y < this.radio || this.y > height - this.radio) this.vy *= -1;
    this.x = constrain(this.x, this.radio, width - this.radio);
    this.y = constrain(this.y, this.radio, height - this.radio);
    if (this.esperaChoque > 0) this.esperaChoque--;
  }
  chocar(a) {
    let d = dist(this.x, this.y, a.x, a.y);
    if (d > 0 && abs(d - a.radio) < this.radio + 5 && this.esperaChoque === 0) {
      let nx = (this.x - a.x) / d;
      let ny = (this.y - a.y) / d;
      let direccion = this.vx * nx + this.vy * ny;
      this.vx -= 2 * direccion * nx;
      this.vy -= 2 * direccion * ny;
      this.x = a.x + nx * (d >= a.radio ? a.radio + this.radio + 6 : a.radio - this.radio - 6);
      this.y = a.y + ny * (d >= a.radio ? a.radio + this.radio + 6 : a.radio - this.radio - 6);
      this.destello = 12;
      this.esperaChoque = 12;
      a.reaccionar();
    }
  }
  mostrar() {
    push();
    noStroke();
    if (this.destello > 0) { fill(218, 244, 74); this.destello--; }
    else if (estado === 3) fill(0, 218, 230);
    else if (estado === 4) fill(218, 244, 74);
    else fill(214, 175, 244);
    circle(this.x, this.y, this.radio * 2);
    pop();
  }
}

function actualizarObjetos(velocidad) {
  for (let i = 0; i < anillos.length; i++) anillos[i].mostrar();
  for (let i = 0; i < particulas.length; i++) {
    let p = particulas[i];
    p.mover(velocidad);
    jugador.empujar(p);
    for (let j = 0; j < anillos.length; j++) p.chocar(anillos[j]);
    p.mostrar();
  }
}

// --- 11. EVENTOS DEL JUGADOR ---
function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  activarAudio();
  if (estado === 0 && dentroBoton(350, 390, 260, 55)) cambiarEstado(1);
  else if (estado === 1 && dentroBoton(320, 431, 320, 58)) cambiarEstado(2);
  else if (estado === 3) {
    let tocado = false;
    for (let i = 0; i < anillos.length; i++) {
      if (jugador.tocar(anillos[i])) {
        anillos[i].reaccionar();
        tocado = true;
      }
    }
    if (tocado) {
      desobediencia += 8;
      avisar('ANILLO ALTERADO +8');
    } else {
      clicsFuera++;
      desobediencia += 12;
      avisar('CLIC FUERA DE LA REGLA +12');
    }
  }
  else if (estado === 4) {
    if (dentroBoton(325, 530, 310, 48)) cambiarEstado(5);
    else {
      for (let i = 0; i < 6 && particulas.length < 150; i++) {
        particulas.push(new Particula(mouseX, mouseY));
        creadas++;
      }
      avisar('CREASTE ALGO NUEVO');
    }
  }
  else if (estado === 5 && dentroBoton(337, 477, 286, 56)) reiniciar();
}

function keyPressed() {
  if (key === 'r' || key === 'R') { reiniciar(); return false; }
  if (estado === 0 && (keyCode === ENTER || key === ' ')) {
    activarAudio(); cambiarEstado(1); return false;
  }
  if (estado === 1 && (keyCode === ENTER || key === ' ')) {
    activarAudio(); cambiarEstado(2); return false;
  }
  if (key === ' ') {
    if (espacioPresionado) return false; // una accion por pulsacion
    espacioPresionado = true;
    if (estado === 2) {
      let pulso = indicePulso();
      if (cercaDelPulso() && pulso !== ultimoPulso) {
        ultimoPulso = pulso;
        puntaje += 10;
        aciertos++;
        avisar('PERFECT +10');
      } else if (pulso !== ultimoPulso) {
        ultimoPulso = pulso;
        fallos++;
        puntaje = max(0, puntaje - 5);
        avisar('ERROR -5');
      } else avisar('UN TOQUE POR PULSO');
    }
    else if (estado === 3) {
      if (!cercaDelPulso()) {
        desobediencia += 12;
        fueraDeRitmo++;
        for (let i = 0; i < particulas.length; i++) {
          particulas[i].vx = random(-3, 3);
          particulas[i].vy = random(-3, 3);
        }
        avisar('FUERA DEL BEAT +12');
      } else {
        desobediencia = max(0, desobediencia - 4);
        avisar('OBEDECER YA NO SIRVE -4');
      }
    }
    else if (estado === 4) {
      for (let i = 0; i < particulas.length; i++) {
        particulas[i].vx = random(-3, 3);
        particulas[i].vy = random(-3, 3);
      }
      avisar('CAMBIASTE EL MOVIMIENTO');
    }
    return false; // evita scroll con ESPACIO
  }
}

function keyReleased() {
  if (key === ' ') espacioPresionado = false;
}

// --- 12. TRANSICIONES Y REINICIO ---
function cambiarEstado(nuevo) {
  estado = nuevo;
  inicioEstado = millis();
  mensaje = '';
  if (nuevo === 2) {
    relojRitmo = millis();
    if (audioListo && musica) {
      musica.stop();
      musica.rate(1);
      musica.setVolume(0.78);
      musica.loop();
    }
  }
  if (nuevo === 3 && audioListo && musica) {
    // El sistema se corrompe: la musica baja de tono/velocidad.
    musica.rate(0.92);
    musica.setVolume(0.82);
  }
  if (nuevo === 4 && audioListo && musica) {
    // Recuperar el pulso original simboliza libertad.
    musica.rate(1);
    musica.setVolume(0.85);
  }
  if (nuevo === 5 && audioListo && musica) musica.setVolume(0.3, 0.8);
}

function reiniciar() {
  if (audioListo && musica) {
    musica.stop();
    musica.rate(1);
  }
  estado = 0;
  puntaje = aciertos = fallos = 0;
  desobediencia = fueraDeRitmo = clicsFuera = creadas = 0;
  ultimoPulso = -1;
  espacioPresionado = false;
  mensaje = '';
  inicioEstado = millis();
  crearObjetos();
}

function avisar(t) { mensaje = t; hastaMensaje = millis() + 950; }
function mostrarMensaje() {if (mensaje !== '' && millis() < hastaMensaje) {
    textoCentrado(mensaje, 122, 17, 218, 244, 74);
  }
}