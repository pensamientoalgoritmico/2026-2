

// Nombre: Isabella Acosta Cortes
// Proyecto: E07 - La oveja negra
//Este juego lo hice inspirado en mi experiencia en el colegio, como me sentiacon todas las reglas que me parecian inecesarias y como me sentia al ser algo diferente a mis companeros por diversas razones, el proposito del juego es mostrar que ser diferente no tiene nada de malo y que buscar ser igual a los demas es perderse a uno mismo.
// El primer nivel lo hice inspirado en las multiples veces que me hicieron firmar observador por llevar cosas que no fueran del uniforma o por no llevar cosas como la corbata o las medias de malla que eran muy incomodas para mi. por eso como que la persigue el uniforme de la "regla".
//En el segundo nivel no me inspire en algun situacion en si sino mas bien en esa sensacion que tenia a diario de quere salirme del salon por como me sneti de fuera de lugar.
//En el tercer nivel me inspire en lo que pasabe en las clases de deprotes, no era una regla como tal que la ninas no pudieran jugar futbol pero no existia el equipo femenino y todas las ninas estaban en volley, yo intente estar en futbol pero mis companeros me hacian sentir como si yo no perteneciera ahi y termine cambiandome a volley pero era horrible, fue un deporte que nunca me gusto, ademas que se burlaban de mi poruqe jugaba horrible.
// CONTROLES:
// Flechas: moverse
// ESPACIO: empujar personajes
// X: patear el balón
// R: reiniciar
//
// CLASES:
// Personaje
// ObjetoSalon
// Balon
// Profesor
//
// ESTADOS:
// 1. Salón original.
// 2. Presentación del cuarto de deportes.
// 3. Mensajes y cuenta regresiva.
// 4. Juego de voleibol y fútbol.
// 5. Pantalla final.
//
// El movimiento se controla con keyPressed() y keyReleased().


let canvasJuego;
let jugador;
let grupo = []; // NPC originales del primer salón: no se modifican en deportes.
let grupoVolley = [];
let grupoFutbol = [];
let objetos = [];

let felicidad = 10;
let felicidadDeporte = 10;
let felicidadQuietudFrames = 0;
let tiempoExtra = 0;
let golMarcado = false;
let mensajeGolFrames = 0;
let golHabilitadoPorProtagonista = false;
let caos = 0;
let victoria = false;
let derrota = false;
let empujar = false;

let estado = 0;

let salonX = 155;
let salonY = 160;
let salonAncho = 1160;
let salonAlto = 730;

// Movimiento con teclado
let izquierda = false;
let derecha = false;
let arriba = false;
let abajo = false;

// Segundo estado
let contadorTiempo = 0;
let tiempoJuego = 7200;
let tiempoQuieto = 0;

let balonVolley;
let balonFutbol;
let profesor;

let patear = false;
let direccionJugadorX = 1;
let direccionJugadorY = 0;

let cuentaRegresiva = 0;
let setMensaje = 0;
let bloqueMensaje = 0;
let portada;
let instruccionesImagen;

// SEGUNDO JUEGO: RECOLECCIÓN EN EL SALÓN
let tiempoSalon = 60 * 60;
let introSalonFrames = 0;
let salonEnJuego = false;
let ultimoConteoSalon = 0;

// PRIMER JUEGO: PERSECUCIÓN DEL UNIFORME
let prendasGrises = [];
let outfitRojo;
let tiempoRopa = 50 * 60;
let puntosRopa = 0;
let felicidadRopa = 10;
let introRopaFrames = 0;
let secuenciaRopaFrames = 0;
let direccionRopa = {x: 1, y: 0};
let velocidadRopa = 5.2;
let ropaInicializada = false;
let ultimoGolpeRopa = 0;
let ultimoPaseVolley = 0;
let ultimoPaseFutbol = 0;

async function setup() {
  portada = await loadImage("portada_oveja_negra.png");
  instruccionesImagen = await loadImage("instrucciones_panel.png");

  canvasJuego = createCanvas(1470, 1050);
  canvasJuego.elt.setAttribute('tabindex', '0');
  canvasJuego.elt.style.outline = 'none';
  canvasJuego.elt.style.display = 'block';
  frameRate(60);

  window.addEventListener('keydown', function(e) {
    if (estado !== 4) return;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','A','d','D','w','W','s','S'].includes(e.key)) {
      e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') izquierda = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') derecha = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') arriba = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') abajo = true;
    }
  }, {passive:false});
  window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') izquierda = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') derecha = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') arriba = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') abajo = false;
  });
  rectMode(CENTER);
  textFont('Impact');
  angleMode(DEGREES);

  jugador = new Personaje(1160, 810, "protagonista");

  // PERSONAJES DEL PRIMER SALÓN
  

  grupo.push(new Personaje(270, 290, "mujer"));
  grupo.push(new Personaje(270, 440, "mujer"));
  grupo.push(new Personaje(270, 590, "mujer"));
  grupo.push(new Personaje(270, 740, "mujer"));

  grupo.push(new Personaje(480, 365, "hombre"));
  grupo.push(new Personaje(480, 520, "hombre"));
  grupo.push(new Personaje(480, 675, "hombre"));
  grupo.push(new Personaje(480, 820, "hombre"));

  grupo.push(new Personaje(700, 285, "mujer"));
  grupo.push(new Personaje(700, 440, "mujer"));
  grupo.push(new Personaje(700, 590, "hombre"));
  grupo.push(new Personaje(700, 740, "hombre"));

  grupo.push(new Personaje(920, 365, "mujer"));
  grupo.push(new Personaje(920, 520, "hombre"));
  grupo.push(new Personaje(920, 675, "mujer"));
  grupo.push(new Personaje(920, 820, "hombre"));

  grupo.push(new Personaje(1130, 285, "hombre"));
  grupo.push(new Personaje(1130, 440, "mujer"));
  grupo.push(new Personaje(1130, 590, "hombre"));

  // FORMACIONES DEPORTIVAS INDEPENDIENTES.
  // Voleibol: 11 NPC, seis en el equipo superior y cinco en el inferior.
  // La protagonista completa el equipo inferior (seis integrantes).
  let puestosVolley = [
    [220, 300], [350, 300], [480, 300],
    [220, 405], [350, 405], [480, 405],
    [220, 625], [350, 625], [480, 625],
    [285, 735], [425, 735]
  ];
  for (let i = 0; i < puestosVolley.length; i++) {
    let n = new Personaje(puestosVolley[i][0], puestosVolley[i][1], "mujer");
    n.puestoX = n.x; n.puestoY = n.y; n.equipoDeporte = i < 6 ? "volleyArriba" : "volleyAbajo";
    grupoVolley.push(n);
  }

  // Fútbol: diez NPC distribuidos en dos líneas dentro de su propia cancha.
  let puestosFutbol = [
    [800, 300], [920, 300], [1040, 300], [1160, 300], [1280, 300],
    [800, 710], [920, 710], [1040, 710], [1160, 710], [1280, 710]
  ];
  for (let i = 0; i < puestosFutbol.length; i++) {
    let n = new Personaje(puestosFutbol[i][0], puestosFutbol[i][1], "hombre");
    n.puestoX = n.x; n.puestoY = n.y; n.equipoDeporte = "futbol";
    grupoFutbol.push(n);
  }

  // OBJETOS DEL PRIMER SALÓN

  objetos.push(new ObjetoSalon(380, 350, "cuaderno"));
  objetos.push(new ObjetoSalon(600, 650, "lapiz"));
  objetos.push(new ObjetoSalon(820, 330, "manzana"));
  objetos.push(new ObjetoSalon(1050, 700, "tijeras"));
  objetos.push(new ObjetoSalon(390, 800, "lapiz"));
  objetos.push(new ObjetoSalon(780, 850, "cuaderno"));
  objetos.push(new ObjetoSalon(1000, 480, "manzana"));

  // BALONES DEL SEGUNDO ESTADO

  balonVolley = new Balon(580, 700, "volley");
  balonFutbol = new Balon(1080, 600, "futbol");

  // PROFESOR

  profesor = new Profesor(1120, 370);
  iniciarJuegoRopa();
}


function dibujarEscenaActual() {
  if (estado === 0) {
    background(0);
    let escala = min(width / portada.width, height / portada.height);
    let anchoPortada = portada.width * escala;
    let altoPortada = portada.height * escala;
    image(portada, (width - anchoPortada) / 2, (height - altoPortada) / 2, anchoPortada, altoPortada);
    return;
  }
  if (estado === 1) { dibujarPresentacionRopa(); return; }
  if (estado === 2) { dibujarInstruccionesRopa(); return; }
  if (estado === 3) { dibujarInstruccionesRopaDos(); return; }
  if (estado === 4) { dibujarJuegoRopa(); return; }
  if (estado === 5) dibujarSalonOriginal();
  if (estado === 6) dibujarPresentacionDeportes();
  if (estado === 7) dibujarMensajes();
  if (estado === 8) dibujarCuentaRegresiva();
  if (estado === 9) dibujarJuegoDeportes();
  if (estado === 10) dibujarFinalDeportes();
  if (estado === 11) dibujarFinalRopa();
}

// HUD GLOBAL: se dibuja una sola vez encima de todos los niveles.
let ayudaAbierta = false;

function draw() {
  dibujarEscenaActual();
  if (estado !== 0) {
    // Primero se dibuja el panel para que no tape el HUD ni el reloj.
    if (ayudaAbierta) dibujarPanelInstrucciones();
    dibujarHUDGlobal();
  }
}

// --------------------------------------------------
// PRIMER JUEGO: EL UNIFORME DE LAS REGLAS
// --------------------------------------------------

function iniciarJuegoRopa() {
  jugador.x = 260; jugador.y = 475;
  jugador.xAnterior = jugador.x; jugador.yAnterior = jugador.y;
  felicidadRopa = 10; puntosRopa = 0; tiempoRopa = 50 * 60;
  prendasGrises = [
    {x: 650, y: 300, vx: 0, vy: 0, proximo: 0, tipo: "camisa"},
    {x: 930, y: 650, vx: 0, vy: 0, proximo: 35, tipo: "falda"},
    {x: 520, y: 760, vx: 0, vy: 0, proximo: 70, tipo: "corbata"}
  ];
  outfitRojo = {x: 1050, y: 420, vx: 7, vy: -6};
  secuenciaRopaFrames = 0; ultimoGolpeRopa = 0; ropaInicializada = true;
  izquierda = derecha = arriba = abajo = false;
}

function dibujarPresentacionRopa() {
  dibujarEscenaRopaBase();
  dibujarProtagonistaRopa(260, 475, true);
  dibujarPrenda(650, 300, "camisa", 125);
  dibujarPrenda(520, 570, "falda", 125);
  dibujarPrenda(900, 365, "corbata", 125);
  dibujarPrenda(900, 620, "outfit", 125);
  dibujarInterfazRopa();
  introRopaFrames++;
  if (introRopaFrames >= 60) { estado = 2; secuenciaRopaFrames = 0; }
}

function dibujarInstruccionesRopa() {
  dibujarEscenaRopaBase();
  dibujarProtagonistaRopa(260, 475, true);
  dibujarPrenda(650, 300, "camisa", 125);
  dibujarPrenda(520, 570, "falda", 125);
  dibujarPrenda(900, 365, "corbata", 125);
  dibujarPrenda(900, 620, "outfit", 125);
  // Velo gris translúcido, igual al PDF.
  noStroke(); fill(105, 105, 105, 185); rect(735, 525, 1170, 730);
  let bloque = floor(secuenciaRopaFrames / 36);
  // Los bloques se van sumando hasta formar la composición completa.
  if (bloque >= 0) textoBloqueRopa("NO DEJES", 315, 205, 46, [25,25,25], [125,0,0], -9, 300, 82);
  if (bloque >= 1) textoBloqueRopa("QUE", 480, 425, 48, [25,25,25], [235,235,235], 0, 190, 75);
  if (bloque >= 2) textoLibreRopa("EL UNIFORME", 870, 315, 65, [125,0,0], 23);
  if (bloque >= 3) textoBloqueRopa("DE LAS REGLAS", 895, 680, 49, [125,0,0], [235,235,235], 11, 420, 82);
  if (bloque >= 4) textoBloqueRopa("EL GRIS", 965, 770, 34, [235,235,235], [125,0,0], 9, 230, 62);
  dibujarInterfazRopa();
  if (secuenciaRopaFrames >= 180) { estado = 3; secuenciaRopaFrames = 0; }
  else secuenciaRopaFrames++;
}

function dibujarInstruccionesRopaDos() {
  dibujarEscenaRopaBase();
  dibujarProtagonistaRopa(260, 475, true);
  dibujarPrenda(650, 300, "camisa", 125);
  dibujarPrenda(520, 570, "falda", 125);
  dibujarPrenda(900, 365, "corbata", 125);
  dibujarPrenda(900, 620, "outfit", 125);
  noStroke(); fill(105, 105, 105, 185); rect(735, 525, 1170, 730);
  let bloque = floor(secuenciaRopaFrames / 36);
  if (bloque >= 0) textoBloqueRopa("SELECCIONA", 735, 265, 48, [125,0,0], [235,235,235], 0, 330, 76);
  if (bloque >= 1) textoBloqueRopa("EL QUE", 455, 500, 48, [25,25,25], [125,0,0], -8, 220, 78);
  if (bloque >= 2) { push(); textFont('Impact'); textStyle(BOLD); textSize(76); fill(25); textAlign(CENTER,CENTER); text('SI ES',1080,485); pop(); }
  if (bloque >= 3) textoLibreRopa("DE TU ESTILO", 620, 680, 76, [125,0,0], -18);
  if (bloque >= 4) textoBloqueRopa("(EL ROJO)", 650, 790, 35, [125,0,0], [235,235,235], -14, 230, 62);
  dibujarInterfazRopa();
  if (secuenciaRopaFrames >= 180) { estado = 4; secuenciaRopaFrames = 0; }
  else secuenciaRopaFrames++;
}

function textoBloqueRopa(txt, x, y, tam, colorTexto, colorBloque, ang, w, h) {
  push(); translate(x, y); rotate(ang); rectMode(CENTER); noStroke(); fill(...colorBloque); rect(0, 0, w, h);
  fill(...colorTexto); textFont('Impact'); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(tam); text(txt, 0, 0); pop();
}

function textoLibreRopa(txt, x, y, tam, colorTexto, ang) {
  push(); translate(x, y); rotate(ang); noStroke(); fill(...colorTexto);
  textFont('Impact'); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(tam);
  text(txt, 0, 0); pop();
}

function dibujarJuegoRopa() {
  felicidad = felicidadRopa;
  dibujarEscenaRopaBase();
  // Temporizador: 50 segundos reales a 60 fps.
  tiempoRopa--;
  // Lee las flechas directamente en cada fotograma. Esto evita que el
  // movimiento dependa de que keyPressed haya conservado el foco del canvas.
  let izq = izquierda || keyIsDown(LEFT_ARROW) || keyIsDown(65);
  let der = derecha || keyIsDown(RIGHT_ARROW) || keyIsDown(68);
  let arr = arriba || keyIsDown(UP_ARROW) || keyIsDown(87);
  let aba = abajo || keyIsDown(DOWN_ARROW) || keyIsDown(83);
  let jx = (der ? 1 : 0) - (izq ? 1 : 0);
  let jy = (aba ? 1 : 0) - (arr ? 1 : 0);
  if (jx || jy) {
    let m = sqrt(jx*jx + jy*jy);
    jugador.x += (jx / m) * 6;
    jugador.y += (jy / m) * 6;
  }
  jugador.x = constrain(jugador.x, salonX+45, salonX+salonAncho-45);
  jugador.y = constrain(jugador.y, salonY+55, salonY+salonAlto-55);

  // Tres prendas grises persiguen desde ángulos distintos y con pausas variables.
  for (let i=0; i<prendasGrises.length; i++) {
    let p = prendasGrises[i];
    if (frameCount >= p.proximo) {
      let a = atan2(jugador.y-p.y, jugador.x-p.x) + random(-32,32);
      let v = random(1.35, 2.25);
      p.vx = cos(a)*v; p.vy = sin(a)*v;
      p.proximo = frameCount + floor(random(28, 78));
    }
    p.x += p.vx; p.y += p.vy;
    if (p.x < salonX+35 || p.x > salonX+salonAncho-35) p.vx *= -1;
    if (p.y < salonY+45 || p.y > salonY+salonAlto-45) p.vy *= -1;
    p.x = constrain(p.x, salonX+35, salonX+salonAncho-35); p.y = constrain(p.y, salonY+45, salonY+salonAlto-45);
    dibujarPrenda(p.x, p.y, p.tipo, 90);
    if (dist(jugador.x,jugador.y,p.x,p.y) < 58 && frameCount-ultimoGolpeRopa > 50) {
      felicidadRopa = max(0, felicidadRopa-1); felicidad = felicidadRopa; ultimoGolpeRopa = frameCount;
    }
  }
  // Outfit rojo: movimiento rápido, errático y con rebotes.
  outfitRojo.x += outfitRojo.vx; outfitRojo.y += outfitRojo.vy;
  if (random() < 0.075) { let a=random(0,360); outfitRojo.vx=cos(a)*random(6.5,9); outfitRojo.vy=sin(a)*random(6.5,9); }
  if (outfitRojo.x < salonX+65 || outfitRojo.x > salonX+salonAncho-65) outfitRojo.vx *= -1;
  if (outfitRojo.y < salonY+65 || outfitRojo.y > salonY+salonAlto-65) outfitRojo.vy *= -1;
  outfitRojo.x=constrain(outfitRojo.x,salonX+65,salonX+salonAncho-65); outfitRojo.y=constrain(outfitRojo.y,salonY+65,salonY+salonAlto-65);
  dibujarPrenda(outfitRojo.x,outfitRojo.y,"outfit",100);
  dibujarProtagonistaRopa(jugador.x,jugador.y,false);
  dibujarInterfazRopa();
  fill(235); textFont("Impact"); textSize(25); textAlign(CENTER, CENTER); text("MUÉVETE CON LAS FLECHAS", 735, 985);

  if (dist(jugador.x,jugador.y,outfitRojo.x,outfitRojo.y)<70) {
    puntosRopa += 100; felicidad = felicidadRopa; estado = 5;
    tiempoSalon = 60 * 60; introSalonFrames = 0; salonEnJuego = false; ultimoConteoSalon = objetos.filter(o => o.recogido).length;
    for (let o of objetos) o.recogido = false;
    jugador.x=1160; jugador.y=810; jugador.xAnterior=jugador.x; jugador.yAnterior=jugador.y;
    return;
  }
  if (felicidadRopa<=0 || tiempoRopa<=0) { felicidadRopa=0; felicidad=0; derrota=true; estado=11; }
}

function dibujarFinalRopa() {
  background(214);
  noStroke(); fill(36,32,32); rect(735,525,1170,730);
  dibujarProtagonistaRopa(735,470,false);
  fill(235); textAlign(CENTER,CENTER); textStyle(BOLD); textSize(64);
  text("TE VOLVISTE GRIS",735,690);
  textStyle(NORMAL); textSize(27); text("No alcanzaste el outfit rojo. Presiona R para volver a intentarlo.",735,760);
  dibujarInterfazRopa();
}

function dibujarEscenaRopaBase() {
  background(214);
  noStroke(); fill(36,32,32); rect(735,525,1170,730);
}

function dibujarInterfazRopa() {
  // La interfaz común se dibuja desde dibujarHUDGlobal() en todos los niveles.
}

function dibujarProtagonistaRopa(x, y, quieto) {
  // Reutiliza el personaje original de la clase Personaje.
  // Solo cambia temporalmente su posición para las pantallas de presentación.
  let xAnterior = jugador.x;
  let yAnterior = jugador.y;
  let felicidadAnterior = felicidad;

  jugador.x = x;
  jugador.y = y;
  felicidad = felicidadRopa;
  jugador.mostrar();

  jugador.x = xAnterior;
  jugador.y = yAnterior;
  felicidad = felicidadAnterior;
}

function dibujarPrenda(x,y,tipo,tam) {
  push(); translate(x,y); scale(tam/100); noStroke();
  if (tipo==="camisa") { fill(130); beginShape(); vertex(-45,-38); vertex(-18,-50); vertex(-7,-38); vertex(7,-38); vertex(18,-50); vertex(45,-38); vertex(60,0); vertex(35,12); vertex(35,60); vertex(-35,60); vertex(-35,12); vertex(-60,0); endShape(CLOSE); fill(90); for(let i=0;i<4;i++) ellipse(0,i*13-5,4,4); }
  else if (tipo==="falda") { fill(145); quad(-34,-42,34,-42,58,48,-58,48); }
  else if (tipo==="corbata") { fill(115); quad(-8,-45,8,-45,5,-28,-5,-28); quad(-5,-28,5,-28,10,48,0,62,-10,48); }
  else {
    // Vestido del PDF: mangas cortas, escote profundo en V,
    // cuerpo entallado y falda trapezoidal amplia.
    let vestido = color(116, 75, 96);
    stroke(78, 52, 66); strokeWeight(1.2);
    fill(vestido);
    // Manga izquierda
    beginShape(); vertex(-27,-48); vertex(-43,-43); vertex(-59,-15);
      vertex(-49,-3); vertex(-35,-15); vertex(-25,-5); endShape(CLOSE);
    // Manga derecha
    beginShape(); vertex(27,-48); vertex(43,-43); vertex(59,-15);
      vertex(49,-3); vertex(35,-15); vertex(25,-5); endShape(CLOSE);
    // Falda, unida al talle
    beginShape(); vertex(-29,8); vertex(29,8); vertex(58,91);
      vertex(-58,91); endShape(CLOSE);
    // Parte superior del vestido con escote en V.
    // Se construye solo con vertex() para evitar incompatibilidad
    // con bezierVertex() en p5.js 2.0.
    beginShape();
      vertex(-25,-48); vertex(-12,-52); vertex(0,-24);
      vertex(12,-52); vertex(25,-48); vertex(31,4);
      vertex(28,23); vertex(20,39); vertex(0,49);
      vertex(-20,39); vertex(-28,23); vertex(-31,4);
    endShape(CLOSE);
    // Interior oscuro del escote para definir claramente la abertura
    noStroke(); fill(125,0,0);
    beginShape(); vertex(-11,-50); vertex(0,-25); vertex(11,-50);
      vertex(5,-9); vertex(-5,-9); endShape(CLOSE);
  }
  pop();
}

// SEGUNDO ESTADO: SALÓN ORIGINAL


function dibujarSalonOriginal() {
  background(214);

  noFill(); stroke(0); strokeWeight(2);
  rect(width / 2, height / 2, width - 8, height - 8);
  noStroke(); fill(0);
  rect(salonX + salonAncho / 2, salonY + salonAlto / 2, salonAncho, salonAlto);

  stroke(130); strokeWeight(9);
  line(salonX, salonY + 45, 405, salonY + 45);
  line(565, salonY + 45, salonX + salonAncho, salonY + 45);
  noStroke(); fill(255); textAlign(CENTER); textSize(16);
  text("SALIDA", 485, salonY + 28);

  dibujarMesasSalon();
  for (let i = 0; i < grupo.length; i++) { grupo[i].mover(); grupo[i].mostrar(); }
  for (let i = 0; i < objetos.length; i++) objetos[i].mostrar();

  // La secuencia de instrucciones aparece antes de iniciar el minuto de juego.
  if (!salonEnJuego) {
    dibujarInstruccionesSalon();
    introSalonFrames++;
    if (introSalonFrames >= 5 * 36) salonEnJuego = true;
    return;
  }

  tiempoSalon = max(0, tiempoSalon - 1);
  if (felicidad > 0 && !victoria) {
    jugador.controlar();
    if (empujar) { jugador.empujarNPC(); empujar = false; }

    let recogidosAntes = objetos.filter(o => o.recogido).length;
    for (let i = 0; i < objetos.length; i++) objetos[i].recoger(jugador);
    let recogidosAhora = objetos.filter(o => o.recogido).length;
    if (recogidosAhora > recogidosAntes) puntosRopa += (recogidosAhora - recogidosAntes) * 10;

    jugador.mostrar();

    // La salida solo funciona cuando se han recogido TODOS los objetos.
    if (recogidosAhora === objetos.length && jugador.y < salonY + 35 && jugador.x > 405 && jugador.x < 565) {
      estado = 6;
      contadorTiempo = 0;
      jugador.x = 250; jugador.y = 735;
      jugador.xAnterior = jugador.x; jugador.yAnterior = jugador.y;
      victoria = false;
    }
  }

  if (tiempoSalon <= 0 || felicidad <= 0) {
    dibujarFinal("SE ACABÓ EL TIEMPO", "No lograste recoger todos los objetos. Presiona R para intentarlo.");
  }
}

function dibujarInstruccionesSalon() {
  // Velo gris translúcido: deja ver el salón y sus personajes por debajo.
  noStroke(); fill(105, 105, 105, 185);
  rect(width / 2, height / 2, salonAncho, salonAlto);
  let bloque = floor(introSalonFrames / 36);

  // Composición basada en el PDF: rojo arriba a la izquierda, palabra libre
  // al centro, bloque blanco inclinado y cierre rojo de gran tamaño.
  if (bloque >= 0) textoBloqueRopa("COLECCIONA", 230, 235, 43, [25,25,25], [125,0,0], 8, 245, 68);
  if (bloque >= 1) textoLibreRopa("TODOS", 640, 405, 48, [25,25,25], 0);
  if (bloque >= 2) textoBloqueRopa("LOS OBJETOS", 610, 555, 48, [125,0,0], [235,235,235], -9, 280, 72);
  if (bloque >= 3) textoLibreRopa("Y ESCAPA", 930, 720, 92, [125,0,0], 0);
}

// Mesas del primer salón. La protagonista no puede atravesarlas.
function dibujarMesasSalon() {
  // Una mesa por cada estudiante del primer salón, alineada con su puesto.
  // Se conserva el grupo original y las mesas funcionan como obstáculos.
  for (let n of grupo) {
    noStroke();
    fill(105);
    rect(n.puestoX, n.puestoY, 125, 58);
    fill(145);
    rect(n.puestoX, n.puestoY + 34, 112, 9);
  }
}

// INTERFAZ DEL PRIMER ESTADO


function dibujarInterfaz() {
  // La interfaz común se dibuja desde dibujarHUDGlobal() en todos los niveles.
}

// SEGUNDO ESTADO: PRESENTACIÓN DE DEPORTES


function dibujarPresentacionDeportes() {
  dibujarCancha();

  jugador.mostrarDeporte();

  for (let n of grupoVolley) n.mostrarDeporte();
  for (let n of grupoFutbol) n.mostrarDeporte();

  balonVolley.mostrar();
  balonFutbol.mostrar();


  contadorTiempo++;

  // La primera imagen permanece durante 2 segundos.

  if (contadorTiempo >= 120) {
    estado = 7;
    contadorTiempo = 0;
    setMensaje = 0;
    bloqueMensaje = 0;
  }
}

// MENSAJES DE INTRODUCCIÓN


function dibujarMensajes() {
  dibujarCancha();

  jugador.mostrarDeporte();

  for (let n of grupoVolley) n.mostrarDeporte();
  for (let n of grupoFutbol) n.mostrarDeporte();

  balonVolley.mostrar();
  balonFutbol.mostrar();

  // Velo blanco: todavía no se puede jugar durante la explicación.
  noStroke(); fill(255, 150); rect(width / 2, height / 2, width, height);

  contadorTiempo++;

  if (setMensaje == 0) {
    dibujarSetUno();

    if (contadorTiempo >= 360) {
      setMensaje = 1;
      contadorTiempo = 0;
    }
  }

  else if (setMensaje == 1) {
    dibujarSetDos();

    if (contadorTiempo >= 360) {
      setMensaje = 2;
      contadorTiempo = 0;
    }
  }

  else if (setMensaje == 2) {
    dibujarSetTres();

    if (contadorTiempo >= 540) {
      estado = 8;
      contadorTiempo = 0;
      cuentaRegresiva = 3;
    }
  }
}

// SET 1

function dibujarSetUno() {
  let bloque = floor(contadorTiempo / 90);

  textAlign(CENTER);
  textStyle(BOLD);

  if (bloque >= 0) {
    textoGrande("SOLO PERMITEN", 330, 190, 58, 0);
  }

  if (bloque >= 1) {
    textoGrande("QUE JUEGUES", 330, 390, 48, 0);
  }

  if (bloque >= 2) {
    textoGrande("VOLLEYBALL", 730, 560, 100, -35);
  }

  if (bloque >= 3) {
    textoGrande("POR SER MUJER", 1030, 760, 45, 25);
  }
}

// SET 2


function dibujarSetDos() {
  let bloque = floor(contadorTiempo / 90);
  textAlign(CENTER);
  textStyle(BOLD);
  // Orden de lectura: abajo derecha, centro, ERES y finalmente CAPAZ.
  if (bloque >= 0) textoGrande("VEEE Y MUESTRALES", 1010, 790, 52, 0);
  if (bloque >= 1) textoGrande("QUE TU TAMBIÉN", 750, 570, 55, -20);
  if (bloque >= 2) textoGrande("ERES", 400, 440, 55, -15);
  if (bloque >= 3) textoGrande("CAPAZ", 850, 280, 80, 0);
}

// SET 3


function dibujarSetTres() {
  let bloque = floor(contadorTiempo / 90);

  textAlign(CENTER);
  textStyle(BOLD);

  if (bloque >= 0) {
    textoGrande("ESCAPA DE VOLLEY", 400, 350, 52, 0);
  }

  if (bloque >= 1) {
    textoGrande("CUANDO EL PROFE", 420, 600, 48, -10);
  }

  if (bloque >= 2) {
    textoGrande("NO VEA", 450, 800, 90, -15);
  }

  if (bloque >= 3) {
    textoGrande("METE EL GOL", 900, 260, 60, 10);
  }

  if (bloque >= 4) {
    textoGrande("Y ESCAPA", 1030, 480, 95, 0);
  }

  if (bloque >= 5) {
    textoGrande("ANTES DE LOS 2:00", 950, 690, 45, 0);
  }
}

function textoGrande(contenido, x, y, tamano, giro) {
  push();
  translate(x, y);
  rotate(giro);
  textFont("Impact");
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textSize(tamano);
  noStroke();

  // Mantiene la combinación de colores de las referencias.
  let rojoSobreNegro = ["VOLLEYBALL", "VEEE Y MUESTRALES", "NO VEA", "METE EL GOL", "Y ESCAPA", "CAPAZ"];
  let negroSobreRojo = ["SOLO PERMITEN", "QUE TU TAMBIÉN", "ESCAPA DE VOLLEY"];

  if (rojoSobreNegro.includes(contenido)) {
    fill(145, 0, 0);
    text(contenido, 0, 0);
  } else if (negroSobreRojo.includes(contenido)) {
    fill(145, 0, 0);
    rect(0, 0, textWidth(contenido) + 28, tamano * 1.2);
    fill(0);
    text(contenido, 0, 0);
  } else {
    fill(245);
    rect(0, 0, textWidth(contenido) + 28, tamano * 1.2);
    fill(0);
    text(contenido, 0, 0);
  }
  pop();
}

// CUENTA REGRESIVA


function dibujarCuentaRegresiva() {
  dibujarCancha();

  jugador.mostrarDeporte();

  for (let n of grupoVolley) n.mostrarDeporte();
  for (let n of grupoFutbol) n.mostrarDeporte();

  balonVolley.mostrar();
  balonFutbol.mostrar();

  profesor.mostrar();

  contadorTiempo++;

  // Cada número permanece un segundo completo: 3, 2, 1. Nunca llega a cero negativo.
  let numero = 3 - floor(contadorTiempo / 60);
  if (contadorTiempo < 180) {
    fill(145, 0, 0);
    noStroke();
    textFont("Impact");
    textAlign(CENTER, CENTER);
    textSize(150);
    textStyle(BOLD);
    text(numero, width / 2, height / 2);
  }

  if (contadorTiempo >= 180) {
    estado = 9;
    ultimoPaseVolley = 0; ultimoPaseFutbol = 0;
    contadorTiempo = 0;
    tiempoJuego = 7200;
    tiempoQuieto = 0;
    felicidad = 10; felicidadDeporte = 10; felicidadQuietudFrames = 0; tiempoExtra = 0; golMarcado = false; golHabilitadoPorProtagonista = false;
  }
}

// JUEGO DEPORTIVO


function dibujarJuegoDeportes() {
  dibujarCancha();

  // Dos minutos de juego. Solo con felicidad completa se habilitan 30 segundos extra.
  if (tiempoJuego > 0) {
    tiempoJuego--;
  } else if (felicidad >= 10 && tiempoExtra < 180) {
    tiempoExtra++;
  } else {
    derrota = true;
    estado = 10;
    dibujarInterfazDeportes();
    return;
  }

  profesor.mover();
  profesor.mostrar();

  for (let n of grupoVolley) { n.moverDeporte(); n.mostrarDeporte(); }
  for (let n of grupoFutbol) { n.moverDeporte(); n.mostrarDeporte(); }

  balonVolley.mover();
  balonVolley.mostrar();
  balonFutbol.mover();
  balonFutbol.mostrar();

  if (felicidad > 0 && !derrota && !victoria) {
    jugador.controlarDeporte();

    // Si la protagonista corre contra el balón, lo empuja en la dirección del movimiento.
    empujarBalonPorContacto();

    if (empujar) { jugador.empujarNPC(); empujar = false; }
    if (patear) { patearBalon(); patear = false; }

    jugador.mostrarDeporte();

    // El cono real de visión del profesor devuelve a la protagonista a su puesto de voleibol.
    if (!golMarcado && profesor.detectar(jugador)) {
      jugador.x = 285;
      jugador.y = 735;
      jugador.xAnterior = jugador.x;
      jugador.yAnterior = jugador.y;
      felicidad = max(0, felicidad - 1);
      felicidadQuietudFrames = 0;
    }

    // Permanecer quieta en la zona de voleibol hace perder felicidad.
    let seMovio = jugador.x != jugador.xAnterior || jugador.y != jugador.yAnterior;
    if (seMovio) felicidadQuietudFrames = 0;
    else if (jugador.x < 700) felicidadQuietudFrames++;
    else felicidadQuietudFrames = 0;

    if (felicidadQuietudFrames > 0 && felicidadQuietudFrames % 120 == 0) {
      felicidad = max(0, felicidad - 1);
    }
    jugador.xAnterior = jugador.x;
    jugador.yAnterior = jugador.y;

    // Gol al tocar cualquiera de las dos porterías grises del campo de fútbol.
    if (!golMarcado && golHabilitadoPorProtagonista && balonEnPorteria()) {
      golMarcado = true;
      golHabilitadoPorProtagonista = false;
      mensajeGolFrames = 150;
      balonFutbol.vx = 0;
      balonFutbol.vy = 0;
    }

    if (golMarcado && mensajeGolFrames > 0) {
      mensajeGolFrames--;
      push();
      textFont("Impact"); textAlign(CENTER, CENTER); textSize(100);
      fill(255, 220, 0); stroke(0); strokeWeight(5);
      text("¡¡¡GOOOOOOL!!!", width / 2, height / 2);
      pop();
    }

    // La salida está en el hueco de la pared derecha, abajo. Se abre después del gol.
    if (golMarcado && jugador.x >= 1360 && jugador.y >= 700 && jugador.y <= 900) {
      victoria = true;
      estado = 10;
      return;
    }
  }

  dibujarInterfazDeportes();
  if (felicidad <= 0) { derrota = true; estado = 10; }
  if (tiempoJuego <= 0 && felicidad < 10) { derrota = true; estado = 10; }
}

// Empujar el balón por contacto: caminar hacia él también lo desplaza.
function empujarBalonPorContacto() {
  let movX = jugador.x - jugador.xAnterior;
  let movY = jugador.y - jugador.yAnterior;
  if (abs(movX) + abs(movY) < 0.1) return;

  let distancia = dist(jugador.x, jugador.y, balonFutbol.x, balonFutbol.y);
  if (distancia < 48) {
    let magnitud = sqrt(movX * movX + movY * movY) || 1;
    let dx = movX / magnitud;
    let dy = movY / magnitud;
    balonFutbol.x += dx * 9;
    balonFutbol.y += dy * 9;
    balonFutbol.vx = dx * 5;
    balonFutbol.vy = dy * 5;
    golHabilitadoPorProtagonista = true;
  }
}

// Comprueba si el balón entró en alguno de los dos bloques/porterías grises.
function balonEnPorteria() {
  let radio = balonFutbol.tamano / 2;
  let porteriaSuperior = balonFutbol.x > 820 && balonFutbol.x < 1160 && balonFutbol.y - radio < 175;
  let porteriaInferior = balonFutbol.x > 820 && balonFutbol.x < 1160 && balonFutbol.y + radio > 905;
  return porteriaSuperior || porteriaInferior;
}

// ESCENARIO DEPORTIVO


function dibujarCancha() {
  background(214);

  // Marco exterior
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(width / 2, height / 2, width - 8, height - 8);

  // Espacio deportivo
  noStroke();
  fill(0);
  rect(735, 530, 1260, 780);

  // Malla horizontal de voleibol: separa los dos equipos.
  stroke(125); strokeWeight(8);
  line(145, 515, 620, 515);
  stroke(95); strokeWeight(1);
  for (let x = 155; x <= 610; x += 22) line(x, 508, x, 522);

  // Separación vertical entre voleibol y fútbol, con paso central.
  stroke(125); strokeWeight(8);
  line(700, 135, 700, 455);
  line(700, 575, 700, 930);

  // Límites laterales: una sola pared limpia y una abertura inferior para escapar.
  line(105, 140, 105, 920);
  line(1365, 140, 1365, 690);
  line(1365, 900, 1365, 920);

  // Mallas de voleibol y fútbol: postes y entramado fino, no bloques sólidos.
 
  dibujarMalla(835, 150, 310, 42);
  dibujarMalla(835, 890, 310, 42);

  // Línea central de la cancha de fútbol.
  noFill();
  stroke(130);
  strokeWeight(7);
  circle(970, 530, 75);

  // La salida queda señalada en el hueco de la pared derecha.
  noStroke();
  fill(000);
  textFont("Impact");
  textAlign(CENTER, CENTER);
  textSize(32);
  textStyle(BOLD);
  text("SALIDA", 1410, 795);
  textStyle(NORMAL);
}

// Malla dibujada con líneas finas para que se lea como red deportiva.
function dibujarMalla(x, y, w, h) {
  push();
  stroke(145);
  strokeWeight(3);
  line(x, y, x + w, y);
  line(x, y + h, x + w, y + h);
  line(x, y, x, y + h);
  line(x + w, y, x + w, y + h);
  strokeWeight(1);
  for (let xx = x + 12; xx < x + w; xx += 12) line(xx, y, xx, y + h);
  for (let yy = y + 8; yy < y + h; yy += 8) line(x, yy, x + w, yy);
  pop();
}

// INTERFAZ DEL SEGUNDO ESTADO


function dibujarInterfazDeportes() {
  // La interfaz común se dibuja desde dibujarHUDGlobal() en todos los niveles.
}


// TEMPORIZADOR DE PRESENTACIÓN


function dibujarTemporizador(segundos) {
  noStroke();
  fill(0);
  textAlign(RIGHT);
  textSize(42);
  textStyle(BOLD);
  text("2:00", 1400, 70);
  textStyle(NORMAL);
}

// PATADAS


function patearBalon() {
  let distancia = dist(jugador.x, jugador.y, balonFutbol.x, balonFutbol.y);
  if (distancia <= 75) {
    // La patada manda el balón en sentido opuesto a la posición de la protagonista.
    // Detrás del balón: hacia adelante. Delante del balón: hacia atrás.
    let dx = balonFutbol.x - jugador.x;
    let dy = balonFutbol.y - jugador.y;
    let magnitud = sqrt(dx * dx + dy * dy) || 1;
    balonFutbol.vx = (dx / magnitud) * 15;
    balonFutbol.vy = (dy / magnitud) * 15;
    golHabilitadoPorProtagonista = true;
    return;
  }

  let distanciaVolley = dist(jugador.x, jugador.y, balonVolley.x, balonVolley.y);
  if (distanciaVolley <= 75) {
    let dx = balonVolley.x - jugador.x;
    let dy = balonVolley.y - jugador.y;
    let magnitud = sqrt(dx * dx + dy * dy) || 1;
    balonVolley.patear(dx / magnitud, dy / magnitud);
  }
}

// CLASE PERSONAJE


class Personaje {

  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;

    this.tamano = 34;

    this.puestoX = x;
    this.puestoY = y;

    this.velocidad = random(0.5, 1.2);
    this.direccion = random([-1, 1]);

    this.enojado = false;
    this.tiempoEnojo = 0;
    this.vibracionX = 0;
    this.vibracionY = 0;

    this.xAnterior = x;
    this.yAnterior = y;
  }

  // PERSONAJES DEL PRIMER SALÓN
 

  mostrar() {
    push();

    translate(
      this.x + this.vibracionX,
      this.y + this.vibracionY
    );

    this.colorPersonaje();

    noStroke();

    if (this.tipo == "hombre") {
      this.dibujarHombre();
    }

    else if (this.tipo == "mujer") {
      this.dibujarMujer();
    }

    else {
      this.dibujarProtagonista();
    }

    pop();
  }

  colorPersonaje() {
    if (this.tipo == "protagonista") {
      let rojo = map(felicidad, 0, 10, 150, 240);
      let verde = map(felicidad, 0, 10, 150, 20);
      let azul = map(felicidad, 0, 10, 150, 30);

      fill(rojo, verde, azul);
    }

    else if (this.enojado == true) {
      fill(208, 0, 0);
    }

    else {
      fill(130);
    }
  }

  dibujarMujer() {
    // Cuando la empujan, toda la figura se vuelve roja (no solo la camisa).
    let tono = this.enojado ? color(208, 0, 0) : color(214);
    fill(tono);
    ellipse(0, -55, 34, 38);

    fill(this.enojado ? color(208, 0, 0) : color(125));
    rect(0, -20, 43, 45);
    fill(this.enojado ? color(208, 0, 0) : color(65));
    triangle(-5, -39, 5, -39, 0, -10);

    fill(this.enojado ? color(208, 0, 0) : color(170));
    rect(-28, -12, 11, 48, 5);
    rect(28, -12, 11, 48, 5);
    fill(this.enojado ? color(208, 0, 0) : color(115));
    triangle(-20, 2, 20, 2, 37, 68);
    triangle(-20, 2, -37, 68, 37, 68);
    fill(this.enojado ? color(208, 0, 0) : color(170));
    rect(-9, 73, 8, 20);
    rect(9, 73, 8, 20);
  }

  dibujarHombre() {
    // Toda la silueta cambia a rojo mientras está enojado.
    fill(this.enojado ? color(208, 0, 0) : color(214));
    ellipse(0, -55, 34, 38);
    fill(this.enojado ? color(208, 0, 0) : color(125));
    rect(0, -20, 43, 45);
    fill(this.enojado ? color(208, 0, 0) : color(65));
    triangle(-5, -39, 5, -39, 0, -10);
    fill(this.enojado ? color(208, 0, 0) : color(170));
    rect(-28, -12, 11, 48, 5);
    rect(28, -12, 11, 48, 5);
    fill(this.enojado ? color(208, 0, 0) : color(115));
    rect(0, 42, 43, 78);
    rect(-11, 90, 15, 20);
    rect(11, 90, 15, 20);
  }

  dibujarProtagonista() {
    // La intensidad del rojo representa la felicidad actual.
    let intensidadRojo = map(felicidad, 0, 10, 90, 245);
    let tonoGris = map(felicidad, 0, 10, 145, 25);
    // Cabeza
    fill(intensidadRojo, tonoGris, tonoGris);
    ellipse(0, -55, 40, 40);

    // Camisa
    fill(105, 75, 95);
    rect(0, -17, 45, 48);

    // Brazos y piernas pierden rojo al bajar la felicidad.
    fill(intensidadRojo, tonoGris, tonoGris);
    rect(-29, -10, 12, 55, 6);
    rect(29, -10, 12, 55, 6);

    // Falda
    fill(105, 75, 95);
    triangle(-22, 3, 22, 3, 38, 62);
    triangle(-22, 3, -38, 62, 38, 62);

    // Piernas separadas
    fill(intensidadRojo, tonoGris, tonoGris);
    rect(-10, 76, 9, 25);
    rect(10, 76, 9, 25);
  }

  // MOVIMIENTO DEL PRIMER SALÓN
 

  mover() {
    if (this.tipo != "protagonista") {

      if (this.enojado == true) {
        this.vibracionX = random(-5, 5);
        this.vibracionY = random(-3, 3);

        this.tiempoEnojo--;

        if (this.tiempoEnojo <= 0) {
          this.enojado = false;
          this.vibracionX = 0;
          this.vibracionY = 0;
        }
      }

      else {
        this.x += this.velocidad * this.direccion;

        if (this.x > this.puestoX + 30) {
          this.direccion = -1;
        }

        if (this.x < this.puestoX - 30) {
          this.direccion = 1;
        }
      }
    }
  }

  // CONTROLAR MOVIMIENTO DEL PRIMER SALÓN
 

  controlar() {
    // Movimiento consultado directamente en cada fotograma.
    let movX = 0;
    let movY = 0;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) movX -= 1;  // Flecha izquierda o A
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) movX += 1; // Flecha derecha o D
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) movY -= 1;    // Flecha arriba o W
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) movY += 1;  // Flecha abajo o S

    let nx = this.x + movX * 4;
    let ny = this.y + movY * 4;
    // Obstáculos: mesas rectangulares con margen para el cuerpo.
    let bloqueado = false;
    for (let n of grupo) {
      if (abs(nx - n.puestoX) < 76 && abs(ny - n.puestoY) < 48) bloqueado = true;
    }
    if (!bloqueado) { this.x = nx; this.y = ny; }

    // Límites del salón
    if (this.x < salonX + 20) this.x = salonX + 20;
    if (this.x > salonX + salonAncho - 20) this.x = salonX + salonAncho - 20;
    if (this.y > salonY + salonAlto - 25) this.y = salonY + salonAlto - 25;

    if (this.y < salonY + 20 && (this.x < 405 || this.x > 565)) {
      this.y = salonY + 20;
    }
  }

  // EMPUJAR NPC
  

  empujarNPC() {
    let cercano = -1;
    let menorDistancia = 1000;

    let candidatos = estado === 9 ? grupoVolley.concat(grupoFutbol) : grupo;
    for (let i = 0; i < candidatos.length; i++) {
      let distancia = dist(this.x, this.y, candidatos[i].x, candidatos[i].y);

      if (
        distancia < 85 &&
        distancia < menorDistancia
      ) {
        menorDistancia = distancia;
        cercano = i;
      }
    }

    if (cercano != -1) {
      let otro = candidatos[cercano];

      if (otro.x < this.x) {
        otro.x -= 45;
      }

      else {
        otro.x += 45;
      }

      otro.enojado = true;
      otro.tiempoEnojo = 40;

          felicidad++;

      if (felicidad > 10) {
        felicidad = 10;
      }
    }
  }

  // DIBUJO DEPORTIVO


  mostrarDeporte() {
    // Personajes deportivos más pequeños para respetar las formaciones del PDF.
    push();
    translate(this.x, this.y);
    scale(0.72);
    translate(-this.x, -this.y);
    this.mostrar();
    pop();
  }


  // MOVIMIENTO DEPORTIVO


  controlarDeporte() {
    let movX = 0;
    let movY = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) movX -= 1;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) movX += 1;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) movY -= 1;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) movY += 1;

    let nx = this.x + movX * 4;
    let ny = this.y + movY * 4;
    if (movX < 0) { direccionJugadorX = -1; direccionJugadorY = 0; }
    if (movX > 0) { direccionJugadorX = 1; direccionJugadorY = 0; }
    if (movY < 0) { direccionJugadorX = 0; direccionJugadorY = -1; }
    if (movY > 0) { direccionJugadorX = 0; direccionJugadorY = 1; }

    nx = constrain(nx, 90, 1435);
    ny = constrain(ny, 220, 870);
    // La división entre volley y fútbol tiene un paso central.
    if (((this.x < 700 && nx >= 700) || (this.x >= 700 && nx < 700)) && (ny < 455 || ny > 575)) nx = this.x;
    // Pared derecha: solo se puede cruzar por la abertura inferior y después del gol.
    if (nx > 1365 && !(golMarcado && ny >= 700 && ny <= 900)) nx = 1365;
    this.x = nx;
    this.y = ny;
  }

  // MOVIMIENTO DE LOS NPC DEPORTIVOS


  moverDeporte() {
    this.fase = (this.fase || random(360)) + 1.4;
    if (this.enojado) {
      this.vibracionX = random(-3, 3);
      this.vibracionY = random(-2, 2);
      this.tiempoEnojo--;
      if (this.tiempoEnojo <= 0) {
        this.enojado = false;
        this.vibracionX = 0;
        this.vibracionY = 0;
      }
      return;
    }
    this.vibracionX = 0; this.vibracionY = 0;

    if (this.equipoDeporte === "volleyArriba" || this.equipoDeporte === "volleyAbajo") {
      let arriba = this.equipoDeporte === "volleyArriba";
      let dx = balonVolley.x - this.puestoX;
      let dy = balonVolley.y - this.puestoY;
      let objetivoX = this.puestoX + constrain(dx * 0.20, -75, 75) + sin(this.fase) * 17;
      let objetivoY = this.puestoY + constrain(dy * 0.18, -55, 55) + cos(this.fase * 1.3) * 13;
      objetivoX = constrain(objetivoX, 165, 585);
      objetivoY = arriba ? constrain(objetivoY, 250, 475) : constrain(objetivoY, 555, 825);
      this.x = lerp(this.x, objetivoX, 0.045);
      this.y = lerp(this.y, objetivoY, 0.045);
      // Cuando un NPC alcanza el balón, se lo pasa a otra persona de su equipo.
      if (dist(this.x, this.y, balonVolley.x, balonVolley.y) < 55 && frameCount - ultimoPaseVolley > 42) {
        let equipo = grupoVolley.filter(n => n !== this && n.equipoDeporte === this.equipoDeporte);
        if (equipo.length) {
          let compañera = equipo[floor(random(equipo.length))];
          let vx = compañera.x - balonVolley.x;
          let vy = compañera.y - balonVolley.y;
          let d = max(1, dist(0, 0, vx, vy));
          balonVolley.vx = (vx / d) * 6.5;
          balonVolley.vy = (vy / d) * 6.5;
          ultimoPaseVolley = frameCount;
        }
      }
    } else if (this.equipoDeporte === "futbol") {
      let dx = balonFutbol.x - this.puestoX;
      let dy = balonFutbol.y - this.puestoY;
      let objetivoX = this.puestoX + constrain(dx * 0.22, -95, 95) + sin(this.fase) * 19;
      let objetivoY = this.puestoY + constrain(dy * 0.18, -85, 85) + cos(this.fase * 1.2) * 16;
      this.x = lerp(this.x, constrain(objetivoX, 755, 1340), 0.045);
      this.y = lerp(this.y, constrain(objetivoY, 230, 850), 0.045);
      // Los jugadores de fútbol se buscan y se pasan el balón entre sí.
      if (dist(this.x, this.y, balonFutbol.x, balonFutbol.y) < 52 && frameCount - ultimoPaseFutbol > 48) {
        let compañeros = grupoFutbol.filter(n => n !== this);
        if (compañeros.length) {
          let receptor = compañeros[floor(random(compañeros.length))];
          let vx = receptor.x - balonFutbol.x;
          let vy = receptor.y - balonFutbol.y;
          let d = max(1, dist(0, 0, vx, vy));
          balonFutbol.vx = (vx / d) * 7;
          balonFutbol.vy = (vy / d) * 7;
          ultimoPaseFutbol = frameCount;
          golHabilitadoPorProtagonista = false;
        }
      }
    }
  }
}

// CLASE OBJETO DEL SALÓN


class ObjetoSalon {

  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.recogido = false;
  }

  mostrar() {

    if (this.recogido == false) {
      push();
      translate(this.x, this.y);
      noStroke();

      if (this.tipo == "cuaderno") {
        fill(70, 145, 220);
        rect(0, 0, 28, 34);

        stroke(255);
        strokeWeight(2);
        line(-7, -10, -7, 10);
      }

      if (this.tipo == "lapiz") {
        fill(255, 210, 40);
        rect(0, 0, 8, 32);

        fill(220, 50, 40);
        triangle(-4, -16, 4, -16, 0, -23);
      }

      if (this.tipo == "manzana") {
        fill(220, 30, 40);
        ellipse(-5, 0, 17, 19);
        ellipse(5, 0, 17, 19);

        fill(70, 170, 60);
        ellipse(5, -12, 10, 5);
      }

      if (this.tipo == "tijeras") {
        stroke(220);
        strokeWeight(4);
        line(-10, -10, 10, 10);
        line(-10, 10, 10, -10);

        noStroke();
        fill(220, 50, 50);
        ellipse(-10, -10, 10, 10);
        ellipse(-10, 10, 10, 10);
      }

      pop();
    }
  }

  recoger(jugador) {
    let distancia = dist(
      this.x,
      this.y,
      jugador.x,
      jugador.y
    );

    if (distancia < 35 && this.recogido == false) {
      this.recogido = true;
    }
  }
}

// CLASE BALÓN


class Balon {

  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;

    this.tamano = 38;
    this.vx = 0;
    this.vy = 0;
  }

  mostrar() {
    push();
    translate(this.x, this.y);

    noStroke();

    if (this.tipo == "volley") {
      fill(185);
      ellipse(0, 0, this.tamano, this.tamano);

      stroke(110);
      strokeWeight(2);
      noFill();
      arc(0, 0, 28, 28, 30, 150);
      arc(0, 0, 28, 28, 210, 330);
    }

    if (this.tipo == "futbol") {
      fill(210, 125, 155);
      ellipse(0, 0, this.tamano, this.tamano);

      fill(110, 55, 75);
      ellipse(0, 0, 13, 13);

      stroke(110, 55, 75);
      strokeWeight(2);
      line(0, -17, 0, 17);
      line(-17, 0, 17, 0);
    }

    pop();
  }

  mover() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.985;
    this.vy *= 0.985;

    if (this.tipo == "volley") {
      if (this.x < 110 || this.x > 660) this.vx *= -1;
      this.x = constrain(this.x, 110, 660);
      if (this.y < 220 || this.y > 870) this.vy *= -1;
      this.y = constrain(this.y, 220, 870);
      return;
    }

    // El balón de fútbol rebota en los bordes laterales, pero puede entrar a las porterías.
    if (this.x < 755 || this.x > 1350) {
      this.vx *= -0.75;
      this.x = constrain(this.x, 755, 1350);
    }
    // Rebote arriba/abajo salvo que entre en uno de los bloques grises de gol.
    if (this.y < 185 || this.y > 895) {
      if (this.x > 820 && this.x < 1160) {
        this.y = this.y < 185 ? 175 : 905;
      } else {
        this.vy *= -0.75;
        this.y = constrain(this.y, 220, 870);
      }
    }
  }

  patear(dx, dy) {
    this.vx = dx * 13;
    this.vy = dy * 13;
  }
}

// CLASE PROFESOR


class Profesor {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angulo = -35;
    this.direccion = 1;
    this.alcance = 220;
  }

  mover() {
    // Después del gol, el profesor abandona su recorrido y persigue directamente a la protagonista.
    if (golMarcado) {
      let dxPersecucion = jugador.x - this.x;
      let dyPersecucion = jugador.y - this.y;
      let distanciaPersecucion = sqrt(dxPersecucion * dxPersecucion + dyPersecucion * dyPersecucion);
      if (distanciaPersecucion > 2) {
        let velocidadPersecucion = 3.4;
        this.x += (dxPersecucion / distanciaPersecucion) * velocidadPersecucion;
        this.y += (dyPersecucion / distanciaPersecucion) * velocidadPersecucion;
        this.angulo = atan2(dyPersecucion, dxPersecucion) + 90;
      }
      return;
    }

    let ruta = [
      [1120, 300], [1280, 430], [1260, 760], [900, 790],
      [735, 535], [560, 790], [250, 760], [250, 300],
      [560, 300], [735, 535]
    ];
    if (this.pasoRuta === undefined) this.pasoRuta = 0;
    let destino = ruta[this.pasoRuta];
    let dx = destino[0] - this.x;
    let dy = destino[1] - this.y;
    let distancia = sqrt(dx * dx + dy * dy);
    if (distancia < 7) {
      this.pasoRuta = (this.pasoRuta + 1) % ruta.length;
    } else {
      this.x += (dx / distancia) * 1.35;
      this.y += (dy / distancia) * 1.35;
      this.angulo = atan2(dy, dx) + 90;
    }
  }

  mostrar() {
    push();
    translate(this.x, this.y);

    // Cono de visión que gira.
    push();
    rotate(this.angulo);

    noStroke();
    fill(220, 220, 220, 75);

    triangle(
      0, -25,
      -this.alcance, 200,
      this.alcance, 200
    );

    pop();

    // Cuerpo del profesor.
    fill(40);
    ellipse(0, -55, 42, 42);

    fill(110);
    rect(0, 0, 60, 110);

    fill(55);
    triangle(-7, -48, 7, -48, 0, -10);

    fill(120);
    rect(-38, 0, 16, 75, 6);
    rect(38, 0, 16, 75, 6);

    rect(0, 85, 60, 80);

    pop();
  }

  detectar(jugador) {
    // Detección dentro del cono triangular que se dibuja frente al profesor.
    let dx = jugador.x - this.x;
    let dy = jugador.y - this.y;
    let distancia = sqrt(dx * dx + dy * dy);
    if (distancia > this.alcance) return false;
    let anguloJugador = atan2(dy, dx);
    let direccionCono = this.angulo + 90; // El triángulo apunta hacia el eje +Y antes de rotar.
    let diferencia = abs(((anguloJugador - direccionCono + 540) % 360) - 180);
    return diferencia < 24;
  }
}

// PANTALLAS FINALES


function dibujarFinal(titulo, subtitulo) {
  noStroke();
  fill(0, 0, 0, 220);
  rect(width / 2, height / 2, width, height);

  textAlign(CENTER);
  fill(208, 0, 0);
  textSize(55);
  textStyle(BOLD);
  text(titulo, width / 2, height / 2);

  fill(255);
  textStyle(NORMAL);
  textSize(22);
  text(subtitulo, width / 2, height / 2 + 45);
}

function dibujarFinalDeportes() {
  background(214);

  if (victoria == true) {
    dibujarFinal(
      "¡VICTORIA!",
      "Metiste el gol y escapaste. Presiona R para volver a jugar."
    );
  }

  else {
    dibujarFinal(
      "GAME OVER",
      "No lograste escapar a tiempo. Presiona R para intentarlo."
    );
  }
}

// HUD GLOBAL: FELICIDAD, PUNTOS, AYUDA Y CONTROLES

function dibujarHUDGlobal() {
  push();
  textFont('Impact'); textStyle(BOLD); noStroke();
  let felicidadActual = (estado >= 1 && estado <= 4) ? felicidadRopa :
                        (estado >= 6 && estado <= 10) ? felicidadDeporte : felicidad;
  felicidadActual = constrain(felicidadActual, 0, 10);

  // Felicidad: esquina superior izquierda.
  fill(25); textAlign(LEFT, BASELINE); textSize(47);
  text('FELICIDAD:', 72, 58);
  fill(90); rectMode(CORNER); rect(72, 70, 185, 25);
  fill(125, 0, 0); rect(72, 70, 18.5 * felicidadActual, 25);

  // Puntos: esquina superior derecha.
  fill(25); textAlign(RIGHT, BASELINE); textSize(47);
  text('PUNTOS: ' + puntosRopa, 1395, 58);

  // Logo de ayuda clicable: esquina inferior izquierda.
  dibujarLogoAyuda(64, 975);

  // Controles permanentes: esquina inferior derecha.
  fill(25); textAlign(RIGHT, BASELINE); textSize(22);
  text('CONTROLES', 1395, 930);
  textStyle(NORMAL); textSize(17);
  text('FLECHAS  MOVERSE', 1395, 958);
  text('ESPACIO  EMPUJAR', 1395, 982);
  text('X  PATEAR BALÓN', 1395, 1006);
  text('R  REINICIAR', 1395, 1030);

  // Reloj del primer juego y reloj deportivo, debajo de los puntos.
  textStyle(BOLD); textSize(30);
  if (estado === 4) text(ceil(tiempoRopa / 60) + 's', 1395, 105);
  else if (estado === 5) {
    let restante = salonEnJuego ? tiempoSalon : 60 * 60;
    let totalSeg = floor(restante / 60);
    let reloj = floor(totalSeg / 60) + ':' + nf(totalSeg % 60, 2);
    text(reloj, 1395, 105);
  }
  else if (estado >= 6 && estado <= 9) {
    let restante = max(0, tiempoJuego);
    let totalSeg = floor(restante / 60);
    let reloj = floor(totalSeg / 60) + ':' + nf(totalSeg % 60, 2);
    text(reloj, 1395, 105);
  }
  pop();
}

function dibujarLogoAyuda(x, y) {
  push(); translate(x, y);
  noStroke(); fill(0); ellipse(0, 0, 72, 72);
  // Signo de interrogación rojo, de alto contraste como el logo de referencia.
  fill(150, 0, 0); textFont('Impact'); textStyle(BOLD);
  textAlign(CENTER, CENTER); textSize(58); text('?', 0, -1);
  pop();
}

function dibujarPanelInstrucciones() {
  push();
  // Oscurece la escena sin cubrir la interfaz fija.
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 185);
  rect(0, 0, width, height);

  // Imagen real de las instrucciones exportada del PDF de Illustrator.
  // El recorte conserva tipografía, colores, ilustraciones y composición.
  imageMode(CENTER);
  image(instruccionesImagen, width / 2, height / 2, 1130, 545);
  pop();
}

// Haz clic en el lienzo para darle el foco al juego.
function mousePressed() {
  if (canvasJuego) canvasJuego.elt.focus();

  // El logo ? permanece en la esquina inferior izquierda en todos los niveles.
  if (estado !== 0 && dist(mouseX, mouseY, 64, 975) <= 48) {
    ayudaAbierta = !ayudaAbierta;
    return;
  }
  if (ayudaAbierta) { ayudaAbierta = false; return; }

  if (estado == 0) {
    iniciarJuegoRopa();
    estado = 1;
    introRopaFrames = 0;
  }
}

// EVENTOS DEL TECLADO


function keyPressed() {
  if (ayudaAbierta) { if (keyCode === ESC) ayudaAbierta = false; return false; }

  // MOVIMIENTO: se mantienen activas hasta soltar la flecha.
  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') { izquierda = true; return false; }
  if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') { derecha = true; return false; }
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') { arriba = true; return false; }
  if (keyCode === DOWN_ARROW || key === 's' || key === 'S') { abajo = true; return false; }

  // EMPUJAR
  if (key === " ") {
    if (estado === 5 || estado === 9) {
      empujar = true;
    }
    return false;
  }

  // PATEAR
  if (key === "x" || key === "X") {
    if (estado === 9) {
      patear = true;
    }
    return false;
  }

  // REINICIAR
  if (key === "r" || key === "R") {
    felicidad = 10;
      victoria = false;
    derrota = false;
    golMarcado = false;
    golHabilitadoPorProtagonista = false;
    mensajeGolFrames = 0;
    felicidadDeporte = 10;
    felicidadQuietudFrames = 0;
    tiempoExtra = 0;
    empujar = false;
    patear = false;

    izquierda = false;
    derecha = false;
    arriba = false;
    abajo = false;

    iniciarJuegoRopa();
    estado = 1;

    for (let n of grupo.concat(grupoVolley, grupoFutbol)) {
      n.x = n.puestoX; n.y = n.puestoY;
      n.enojado = false; n.tiempoEnojo = 0;
      n.vibracionX = 0; n.vibracionY = 0;
    }

    for (let i = 0; i < objetos.length; i++) {
      objetos[i].recogido = false;
    }

    balonVolley.x = 580;
    balonVolley.y = 700;
    balonVolley.vx = 0;
    balonVolley.vy = 0;

    balonFutbol.x = 1080;
    balonFutbol.y = 600;
    balonFutbol.vx = 0;
    balonFutbol.vy = 0;

    profesor.angulo = -35;
    profesor.direccion = 1;
    profesor.x = 1120;
    profesor.y = 370;
    profesor.pasoRuta = 0;

    ultimoPaseVolley = 0; ultimoPaseFutbol = 0;
    contadorTiempo = 0;
    tiempoJuego = 7200;
    tiempoQuieto = 0;
    felicidad = 10; felicidadDeporte = 10; felicidadQuietudFrames = 0; tiempoExtra = 0; golMarcado = false; golHabilitadoPorProtagonista = false;
    cuentaRegresiva = 0;
    setMensaje = 0;
    bloqueMensaje = 0;

    return false;
  }
}


// SOLTAR TECLAS


function keyReleased() {
  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') izquierda = false;
  if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') derecha = false;
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') arriba = false;
  if (keyCode === DOWN_ARROW || key === 's' || key === 'S') abajo = false;

  return false;
}