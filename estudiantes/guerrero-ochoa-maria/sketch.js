// Nombre: Maria Jose Guerrero
// Juego: La Regla Incómoda
//
// Descripción:
// Un mono atraviesa tres momentos llenos de reglas.
// 1. La mochila: las reglas que nos dan desde pequeñas caen del cielo y uno
//    decide cuáles cargar. Las que cuidan arman un paraguas; las que aprietan
//    son piedras que pesan.
// 2. El camino a casa: en la calle aparecen reglas que cambian la forma de
//    jugar. Se pueden romper con clics, pero algunas estaban cuidando.
// 3. La fiesta: los demás lanzan frases mientras el mono baila. Hay que
//    reventar las que aprietan y dejar llegar las que cuidan.
// Mi postura: unas reglas cuidan y otras aprietan. No se trata de obedecer
// todo ni de romper todo, sino de aprender a distinguirlas.
//
// Referentes:
// - Moodboard "Universo visual": (link del moodboard)
// - Aboreto: https://fonts.google.com/specimen/Aboreto
// - Beth Ellen: https://fonts.google.com/specimen/Beth+Ellen
// - Música: Let Me Love You, DJ Snake ft. Justin Bieber
// - Referencia de p5.js: https://p5js.org/reference/


// 5. CLASES 

//  FONDO 
// Papel beige con estrellas rosadas que respiran y se deslizan.
// Con una tecla presionada las estrellas respiran más rápido.
class Fondo {
  constructor() {
    this.color = FONDO;
    this.colorEstrella = CREMA;
    this.espacio = 60;
    this.pulso = 7;
    this.dirPulso = 1;
    this.desliza = 0;
    this.granos = [];
    for (let i = 0; i < 250; i++) {
      this.granos.push([random(900), random(620)]);
    }
  }

  // cada estado tiene su ambiente
  setModo(estado) {
    this.color = FONDO;
    this.colorEstrella = "#FFF6F8";
    if (estado === "cierre") {
      this.color = ROSA;
      this.colorEstrella = CREMA;
    }
  }

  mostrar() {
    background(this.color);

    // textura de papel
    stroke(224, 82, 122, 25);
    strokeWeight(2);
    for (let i = 0; i < this.granos.length; i++) {
      point(this.granos[i][0], this.granos[i][1]);
    }

    // las estrellas respiran (y laten con la música)
    let vel = 0.05;
    if (keyIsPressed) vel = 0.25;
    this.pulso += vel * this.dirPulso;
    if (this.pulso > 8.5) this.dirPulso = -1;
    if (this.pulso < 6) this.dirPulso = 1;

    // patrón de estrellas en filas desfasadas que se desliza
    this.desliza += 0.3;
    let ox = this.desliza % this.espacio;
    noStroke();
    fill(this.colorEstrella);
    let late = nivelMusica() * 4;
    let fila = 0;
    for (let y = 30; y < 650; y += this.espacio) {
      let desfase = 0;
      if (fila % 2 === 1) desfase = this.espacio / 2;
      for (let x = desfase + ox - this.espacio; x < 940; x += this.espacio) {
        formaEstrella(x, y, this.pulso + late);
      }
      fila++;
    }
  }
}

//  ESTRELLA 
// Estrella decorativa de los menús: gira, huye del mouse y brilla con un clic.
class Estrella {
  constructor(x, y) {
    this.casaX = x;
    this.casaY = y;
    this.x = x;
    this.y = y;
    this.r = random(10, 17);
    this.ang = random(360);
    this.vel = random(-2, 2);
    this.brillo = 0;
  }

  actualizar() {
    // gira; más rápido si el mouse está presionado
    this.ang += this.vel;
    if (mouseIsPressed) this.ang += this.vel * 3;

    // huye del mouse
    let dx = this.x - mouseX;
    let dy = this.y - mouseY;
    if (dx > -80 && dx < 80 && dy > -80 && dy < 80) {
      if (dx > 0) this.x += 4;
      else this.x -= 4;
      if (dy > 0) this.y += 4;
      else this.y -= 4;
    }

    // vuelve despacio a su lugar
    this.x += (this.casaX - this.x) * 0.05;
    this.y += (this.casaY - this.y) * 0.05;
    if (this.brillo > 0) this.brillo -= 0.05;
  }

  destellar() {
    this.brillo = 1;
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    stroke(ROSA_FUERTE);
    strokeWeight(1.5);
    if (this.brillo > 0) fill(MANTEQUILLA);
    else fill(ROSA);
    formaEstrella(0, 0, this.r);
    pop();
  }
}

//  MONO 
// El personaje. Hay cinco, cada uno con nombre, manía y accesorio.
// Cambia de cara según cómo se siente y su color se apaga si "pierde su forma".
class Mono {
  constructor(x, y, tipo, nombre, apodo, rasgo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo; // 0 lentes, 1 sombrero, 2 gorro, 3 audífonos, 4 gafas
    this.nombre = nombre; // en mayúsculas, para la cinta
    this.apodo = apodo; // en minúsculas, para el diario
    this.rasgo = rasgo;
    let pelajes = [[139, 107, 70], [160, 122, 79], [122, 90, 56], [150, 110, 72], [111, 79, 48]];
    this.base = pelajes[tipo];
    this.resp = random(-2, 2);
    this.dirResp = 0.1;
    this.cola = random(-12, 12);
    this.dirCola = 0.7;
    this.parpadeo = random(80, 240);
    this.esc = 1;
    this.salto = 0;
    this.seleccionado = false;
    this.reiniciar();
  }

  // vuelve a su estado normal (al empezar cada nivel)
  reiniciar() {
    this.forma = 1; // 1 = colores completos; baja cuando se apaga
    this.sx = 1; // aplastado de lado
    this.sy = 1; // aplastado de arriba
    this.mira = 1; // 1 derecha, -1 izquierda
    this.cara = "feliz";
    this.conAccesorio = true;
    this.giro = 0; // se usa cuando se cae
    this.comodidad = 0;
    this.cansancio = 0; // 0 con todas sus fuerzas, 1 sin fuerzas
    this.sacudon = 0; // cuadros que tiembla cuando pierde fuerza
  }

  // respira, mueve la cola y parpadea solito
  animar() {
    this.resp += this.dirResp;
    if (this.resp > 2) this.dirResp = -0.1;
    if (this.resp < -2) this.dirResp = 0.1;
    this.cola += this.dirCola;
    if (this.cola > 12) this.dirCola = -0.7;
    if (this.cola < -12) this.dirCola = 0.7;
    this.parpadeo--;
    if (this.parpadeo < -7) this.parpadeo = random(120, 280);
    if (this.sacudon > 0) this.sacudon--;
  }

  // color del pelaje mezclado con gris según su forma
  pelaje(f) {
    // cansado se ve más gris
    let fo = this.forma * (1 - 0.45 * this.cansancio);
    let r = this.base[0] * fo + 167 * (1 - fo);
    let g = this.base[1] * fo + 167 * (1 - fo);
    let b = this.base[2] * fo + 167 * (1 - fo);
    return [r * f, g * f, b * f];
  }

  mouseEncima() {
    return mouseX > this.x - 60 && mouseX < this.x + 60 && mouseY > this.y - 60 && mouseY < this.y + 110;
  }

  // pantalla de elegir: crece con el mouse encima
  actualizarSeleccion() {
    this.animar();
    let objetivo = 1;
    if (this.mouseEncima()) objetivo = 1.12;
    if (this.seleccionado) objetivo = 1.18;
    this.esc += (objetivo - this.esc) * 0.15;
    this.salto += (0 - this.salto) * 0.12;
    if (this.mouseEncima() && !this.seleccionado) this.cara = "sorpresa";
    else this.cara = "feliz";
  }

  elegir() {
    this.seleccionado = true;
    this.salto = -30;
  }

  mostrarSeleccion() {
    if (this.seleccionado) {
      noFill();
      stroke(ROSA_FUERTE);
      strokeWeight(3);
      circle(this.x, this.y + 25, 150);
    }
    push();
    translate(this.x, this.y + this.resp + this.salto);
    scale(this.esc);
    this.dibujar();
    pop();
    // cinta de papel con el nombre
    noStroke();
    fill(ROSA);
    rect(this.x, this.y + 128, 116, 26, 4);
    fill(CARBON);
    titulo(14);
    text(this.nombre, this.x, this.y + 127);
  }

  // dibuja el mono con los pies en (x, pies)
  mostrarEn(x, pies, esc) {
    esc = esc * (1 - 0.12 * this.cansancio); // cansado se ve más chiquito
    noStroke();
    fill(0, 0, 0, 35);
    ellipse(x, pies + 2, 70 * esc * this.sx, 12 * esc);
    push();
    translate(x, pies);
    if (this.sacudon > 0) translate(random(-3, 3), 0);
    rotate(this.giro);
    translate(0, -83 * esc * this.sy);
    scale(esc * this.sx * this.mira, esc * this.sy);
    this.dibujar();
    pop();
  }

  // dibuja el mono con el centro de la cabeza en (0, 0)
  dibujar() {
    let p = this.pelaje(1);
    let po = this.pelaje(0.8);

    // cola enroscada
    push();
    translate(22, 56);
    rotate(this.cola);
    noFill();
    stroke(p[0], p[1], p[2]);
    strokeWeight(7);
    arc(16, -6, 32, 26, 160, 420);
    pop();

    // patas, cuerpo y bracitos
    noStroke();
    fill(po[0], po[1], po[2]);
    ellipse(-14, 76, 24, 13);
    ellipse(14, 76, 24, 13);
    fill(p[0], p[1], p[2]);
    ellipse(0, 50 + this.resp * 0.5, 60, 54);
    ellipse(-27, 50, 15, 24);
    ellipse(27, 50, 15, 24);
    fill(CREMA);
    ellipse(0, 55, 36, 30);

    // orejas
    fill(p[0], p[1], p[2]);
    circle(-43, -2, 30);
    circle(43, -2, 30);
    fill(ROSA);
    circle(-43, -2, 17);
    circle(43, -2, 17);

    // cabeza y copete
    fill(p[0], p[1], p[2]);
    ellipse(0, 0, 90, 80);
    noFill();
    stroke(p[0], p[1], p[2]);
    strokeWeight(4);
    arc(3, -43, 12, 12, 90, 360);

    // cara en forma de corazón
    noStroke();
    fill(CREMA);
    circle(-13, -5, 38);
    circle(13, -5, 38);
    ellipse(0, 12, 58, 38);

    // cachetes
    fill(217, 137, 154, 150);
    ellipse(-25, 13, 15, 9);
    ellipse(25, 13, 15, 9);

    this.dibujarOjos();

    // nariz
    noStroke();
    fill(90, 62, 40);
    ellipse(0, 7, 8, 5);

    this.dibujarBoca();
    if (this.conAccesorio) this.accesorio();

    // con poca fuerza: párpados caídos y gotita de sudor
    if (this.cansancio > 0.6 && this.cara !== "incomoda") {
      noStroke();
      fill(CREMA);
      rect(-14, -8, 18, 9);
      rect(14, -8, 18, 9);
      stroke(CARBON);
      strokeWeight(2);
      line(-22, -4, -6, -4);
      line(6, -4, 22, -4);
    }
    if (this.cansancio > 0.3) {
      noStroke();
      fill(220, 235, 245);
      ellipse(36, -22, 9, 12);
      triangle(31.5, -24, 40.5, -24, 36, -33);
    }
  }

  dibujarOjos() {
    if (this.cara === "incomoda") {
      // ojitos > <
      stroke(CARBON);
      strokeWeight(3);
      line(-20, -7, -10, -2);
      line(-10, -2, -20, 3);
      line(20, -7, 10, -2);
      line(10, -2, 20, 3);
      return;
    }
    if (this.parpadeo < 0) {
      noFill();
      stroke(CARBON);
      strokeWeight(3);
      arc(-14, 0, 13, 9, 180, 360);
      arc(14, 0, 13, 9, 180, 360);
    } else {
      noStroke();
      fill(CARBON);
      ellipse(-14, -2, 15, 18);
      ellipse(14, -2, 15, 18);
      fill(255);
      circle(-11, -6, 6);
      circle(17, -6, 6);
      circle(-16, 1, 2.5);
      circle(12, 1, 2.5);
    }
    if (this.cara === "triste") {
      stroke(CARBON);
      strokeWeight(2.5);
      line(-21, -14, -9, -18);
      line(9, -18, 21, -14);
    }
  }

  dibujarBoca() {
    noFill();
    stroke(CARBON);
    strokeWeight(2);
    if (this.cara === "feliz") {
      arc(-3.5, 12, 7, 7, 0, 180);
      arc(3.5, 12, 7, 7, 0, 180);
    } else if (this.cara === "sorpresa") {
      noStroke();
      fill(CARBON);
      ellipse(0, 17, 8, 9);
    } else if (this.cara === "triste") {
      arc(0, 20, 12, 8, 180, 360);
    } else if (this.cara === "plana") {
      line(-5, 16, 5, 16);
    } else if (this.cara === "incomoda") {
      line(-7, 16, -3.5, 13);
      line(-3.5, 13, 0, 16);
      line(0, 16, 3.5, 13);
      line(3.5, 13, 7, 16);
    }
  }

  accesorio() {
    if (this.tipo === 0) {
      // lentes redondos
      noFill();
      stroke(ROSA_FUERTE);
      strokeWeight(3);
      circle(-14, -2, 25);
      circle(14, -2, 25);
      line(-1.5, -2, 1.5, -2);
    } else if (this.tipo === 1) {
      // sombrero
      noStroke();
      fill(ROSA_FUERTE);
      ellipse(0, -33, 100, 18);
      rect(0, -46, 58, 28, 10);
      fill(CREMA);
      rect(0, -37, 58, 6);
    } else if (this.tipo === 2) {
      // gorro tejido
      noStroke();
      fill("#C77B2C");
      arc(0, -22, 84, 64, 180, 360);
      fill(CREMA);
      circle(0, -56, 16);
      stroke("#A9631E");
      strokeWeight(2);
      for (let i = -30; i <= 30; i += 10) line(i, -24, i * 0.7, -46);
    } else if (this.tipo === 3) {
      // audífonos
      noFill();
      stroke(CARBON);
      strokeWeight(5);
      arc(0, -4, 100, 88, 195, 345);
      noStroke();
      fill(ROSA_FUERTE);
      ellipse(-47, 2, 17, 30);
      ellipse(47, 2, 17, 30);
    } else if (this.tipo === 4) {
      // gafas de estrella
      stroke(ROSA_FUERTE);
      strokeWeight(2);
      fill(CARBON);
      formaEstrella(-14, -2, 14);
      formaEstrella(14, -2, 14);
    }
  }
}

//  BOTON 
// Botón de papel: la sombra se achica cuando el mouse pasa encima.
class Boton {
  constructor(x, y, w, h, texto, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.texto = texto;
    this.col = col;
    this.hover = 0;
  }

  mouseEncima() {
    return mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2;
  }

  mostrar() {
    if (this.mouseEncima()) this.hover += (1 - this.hover) * 0.25;
    else this.hover += (0 - this.hover) * 0.25;
    let sube = this.hover * 3; // con el mouse encima el botón se levanta
    sombra(this.x, this.y + sube * 0.3, this.w, this.h, 14);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(this.col);
    rect(this.x, this.y - sube, this.w, this.h, 14);
    // brillo suave arriba
    noStroke();
    fill(255, 255, 255, 60);
    rect(this.x, this.y - sube - this.h / 4, this.w - 16, this.h / 3, 10);
    fill(CARBON);
    titulo(17);
    text(this.texto, this.x, this.y - sube - 3);
  }
}

//  PAPELITO 
// Confeti de papel: sale disparado, gira y cae.
class Papelito {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4);
    this.vy = random(-8, -2);
    this.ang = random(360);
    this.vang = random(-12, 12);
    this.w = random(6, 11);
    this.col = col;
    this.vida = random(35, 65);
  }

  actualizar() {
    this.vy += 0.4;
    this.x += this.vx;
    this.y += this.vy;
    this.ang += this.vang;
    this.vida--;
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    noStroke();
    fill(this.col);
    rect(0, 0, this.w, this.w * 0.6);
    pop();
  }
}

//  TARJETA 
// Una regla escrita en papel. Se usa en los tres niveles:
// nivel 1 cae del cielo y se arrastra; nivel 2 se clava arriba y se rompe
// con 3 clics; nivel 3 se arrastra al tablero de la casa.
// "cuida" dice si es una regla que cuida (true) o que aprieta (false).
class Tarjeta {
  constructor(texto, cuida, x, y, w, h) {
    this.texto = texto;
    this.cuida = cuida;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.casaX = x; // a dónde vuelve si la sueltas en otro lado
    this.casaY = y;
    this.ang = random(-4, 4);
    this.vy = random(0.6, 0.9);
    this.estado = "cae"; // "cae", "agarrada", "guardada", "suelo", "fija", "rota"
    this.golpes = 0; // clics recibidos (nivel 2)
    this.sacudida = 0;
    this.abre = 0; // cuánto se separan las mitades al romperse
    this.alfa = 255;
    this.ox = 0; // distancia entre el mouse y la tarjeta al agarrarla
    this.oy = 0;
    this.ranura = -1; // nivel 3: espacio del tablero donde está (-1 = ninguno)
  }

  encima() {
    return mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2;
  }

  agarrar() {
    this.estado = "agarrada";
    this.ox = this.x - mouseX;
    this.oy = this.y - mouseY;
    this.ang = 0;
  }

  // mientras está agarrada sigue al mouse
  seguirMouse() {
    let k = 1 - 0.8 * (1 - juego.fuerza / 100);
    this.x += (mouseX + this.ox - this.x) * k;
    this.y += (mouseY + this.oy - this.y) * k;
  }

  // cada clic la agrieta; al tercero se rompe en dos
  romper() {
    this.golpes++;
    this.sacudida = 12;
    if (this.golpes >= 3) this.estado = "rota";
  }

  mostrar() {
    // rota: dos mitades que se separan y desaparecen
    if (this.estado === "rota") {
      this.abre += 3;
      this.alfa -= 5;
      if (this.alfa <= 0) return;
      noStroke();
      fill(246, 241, 230, this.alfa);
      push();
      translate(this.x - this.abre, this.y + this.abre);
      rotate(-this.abre * 0.5);
      rect(-this.w / 4, 0, this.w / 2, this.h);
      pop();
      push();
      translate(this.x + this.abre, this.y + this.abre * 1.3);
      rotate(this.abre * 0.6);
      rect(this.w / 4, 0, this.w / 2, this.h);
      pop();
      return;
    }

    let sh = 0;
    if (this.sacudida > 0) {
      sh = random(-3, 3);
      this.sacudida--;
    }
    push();
    translate(this.x + sh, this.y);
    rotate(this.ang);
    // sombra suave y papel
    if (this.alfa > 200) sombra(0, 0, this.w, this.h, 8);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(246, 241, 230, this.alfa);
    rect(0, 0, this.w, this.h, 8);
    // franja de color: rosa si la regla está en juego
    noStroke();
    fill(224, 82, 122, this.alfa * 0.8);
    rect(-this.w / 2 + 4, 0, 3, this.h - 16, 2);
    // cinta para pegarla
    fill(243, 237, 163, 230);
    rect(0, -this.h / 2, 44, 11, 2);
    // grietas (nivel 2)
    stroke(ROSA_FUERTE);
    strokeWeight(2);
    if (this.golpes >= 1) {
      line(-this.w * 0.1, -this.h / 2, 0, -this.h * 0.1);
      line(0, -this.h * 0.1, -this.w * 0.08, this.h * 0.15);
    }
    if (this.golpes >= 2) {
      line(-this.w * 0.08, this.h * 0.15, this.w * 0.05, this.h / 2);
    }
    // texto de la regla con la letra de las reglas
    noStroke();
    fill(46, 46, 46, this.alfa);
    titulo(11);
    text(this.texto, 0, 1, this.w - 14, this.h - 6);
    pop();
  }
}

// ── GOTA ──
// Nivel 1: la lluvia de comentarios. Si cae sobre el paraguas se deshace;
// si cae sobre el mono, le baja el ánimo.
class Gota {
  constructor(x) {
    this.x = x;
    this.y = -20;
    this.vy = random(4, 6);
    this.viva = true;
  }

  actualizar() {
    this.y += this.vy;
    if (this.y > PISO) this.viva = false;
  }

  mostrar() {
    noStroke();
    fill(GRIS);
    ellipse(this.x, this.y, 7, 9);
    triangle(this.x - 3.5, this.y - 2, this.x + 3.5, this.y - 2, this.x, this.y - 10);
  }
}

//  OBSTACULO 
// Nivel 2: cosas del camino. "charco" ensucia, "carro" pasa por la cebra.
class Obstaculo {
  constructor(mx, tipo) {
    this.mx = mx; // posición en el mundo
    this.tipo = tipo;
    this.usado = false; // si ya hizo efecto sobre el mono
    this.y = 0; // los carros se mueven de arriba hacia abajo
  }

  mostrar(dist) {
    let x = this.mx - dist;
    if (x < -100 || x > 1000) return;
    if (this.tipo === "charco") {
      noStroke();
      fill(139, 107, 70, 200);
      ellipse(x, PISO + 4, 70, 14);
      fill(167, 140, 100, 200);
      ellipse(x - 10, PISO + 2, 26, 5);
    } else if (this.tipo === "carro") {
      // carrito de collage visto desde arriba
      push();
      translate(x, this.y);
      stroke(CARBON);
      strokeWeight(2);
      fill(ROSA_FUERTE);
      rect(0, 0, 54, 80, 10);
      fill(CREMA);
      rect(0, -14, 40, 18, 4);
      noStroke();
      fill(CARBON);
      rect(-28, -24, 6, 16, 2);
      rect(28, -24, 6, 16, 2);
      rect(-28, 24, 6, 16, 2);
      rect(28, 24, 6, 16, 2);
      pop();
    }
  }
}

//  NIVEL 1: LA MOCHILA 
// La regla incómoda: "carga todo lo que te den".
// Las reglas caen del cielo. Si arrastras una a la mochila, la cargas:
//  - si cuida, se vuelve un pedazo del paraguas que te protege de la lluvia.
//  - si aprieta, se vuelve una piedra: el mono se encorva y se apaga.
// Si la sueltas lejos (o la dejas caer), no la cargas.
// Enseñanza: no todas las reglas pesan igual; algunas son techo.
class NivelMochila {
  constructor() {
   
    this.nombre = "LA MOCHILA";
    this.reglaIncomoda = "carga todo lo que te den";
    this.pasos = [
      ["mouse", "arrastra una regla a la mochila para cargarla"],
      ["mouse", "suéltala lejos (o déjala caer) para no cargarla"],
      ["nada", "ojo: va a empezar a llover"]
    ];
    this.instruccion = "arrastra cada regla: a la mochila para cargarla, lejos para soltarla";
   
    //    true = la regla cuida (paraguas) · false = la regla aprieta (piedra)
    // tercer dato: lo que sale si te equivocas con esa regla
    this.lista = [
      ["PIDE AYUDA SI LA NECESITAS", true, "pedir ayuda no te hace débil. esa regla te cuidaba."],
      ["NO LLORES", false, "llorar también es cuidarte. esa regla solo pesa."],
      ["MIRA A LOS LADOS AL CRUZAR", true, "esa regla te protege de verdad. no era para controlarte."],
      ["CALLADITA TE VES MÁS BONITA", false, "tu voz no te quita nada. esa regla solo aprieta."],
      ["DESCANSAR TAMBIÉN CUENTA", true, "sin descanso no hay fuerza. esa regla te cuidaba."],
      ["NO OCUPES TANTO ESPACIO", false, "tienes derecho a tu lugar. esa regla solo aprieta."],
      ["NADIE TE TOCA SIN PERMISO", true, "tu cuerpo es tuyo. esa regla te cuidaba: no se suelta."],
      ["SIEMPRE DI QUE SÍ", false, "decir que no también es cuidarte. esa regla pesa."],
      ["DI LO QUE SIENTES", true, "lo que sientes importa. esa regla te cuidaba."],
      ["NO TE EQUIVOQUES NUNCA", false, "equivocarse es parte de aprender. esa regla aprieta."],
      ["PUEDES DECIR QUE NO", true, "tu no también cuenta. esa regla te cuidaba."],
      ["¿QUÉ VA A DECIR LA GENTE?", false, "vivir pendiente de la gente pesa mucho. esa regla aprieta."]
    ];
    // el paraguas se llena del centro hacia afuera
    this.ordenParaguas = [2, 3, 1, 4, 0, 5];
  }

  // prepara todo cada vez que empieza el nivel
  iniciar(mono) {
    this.mono = mono;
    this.t = 0;
    this.tarjetas = [];
    this.siguiente = 0; // cuál regla cae después
    this.gotas = [];
    this.paraguas = [false, false, false, false, false, false];
    this.cuidaGuardadas = 0;
    this.piedras = 0;
    this.soltadasCuida = 0;
    this.soltadasAprieta = 0;
    this.animo = 10;
    this.aciertos = 0;
    this.racha = 0;
    this.mojado = 0; // cuadros con cara triste después de mojarse
    this.finT = 0;
    this.terminado = false;
  }

  actualizar() {
    if (this.terminado) return;
    this.t++;
    this.mono.animar();

    // cae una regla nueva cada 140 cuadros
    if (this.t % 140 === 1 && this.siguiente < this.lista.length) {
      let r = this.lista[this.siguiente];
      let c = new Tarjeta(r[0], r[1], random(130, 770), -40, 190, 56);
      c.mensaje = r[2];
      this.tarjetas.push(c);
      this.siguiente++;
    }

    // mover las tarjetas
    for (let i = 0; i < this.tarjetas.length; i++) {
      let c = this.tarjetas[i];
      if (c.estado === "cae") {
        c.y += c.vy;
        // llega al piso sin que la cargues: se queda tirada
        if (c.y > PISO - 10) {
          c.y = PISO - 10;
          c.estado = "suelo";
          c.alfa = 150;
          this.contarSoltada(c);
          this.decidir(c, false);
        }
      } else if (c.estado === "agarrada") {
        c.seguirMouse();
      }
    }

    // la lluvia empieza después de la segunda regla y va aumentando
    let cada = 30 - this.t / 90;
    if (cada < 7) cada = 7;
    if (this.t > 300 && this.t % 7 === 0 && random(cada) < 7) {
      this.gotas.push(new Gota(random(300, 600)));
    }

    // Gota <-> paraguas y Gota <-> mono
    let vivas = [];
    for (let i = 0; i < this.gotas.length; i++) {
      let g = this.gotas[i];
      g.actualizar();
      let seg = this.segmento(g.x);
      if (seg >= 0 && this.paraguas[seg] && g.y > PISO - 315) {
        g.viva = false;
        explotarEn(g.x, g.y, 2, [GRIS, CREMA]);
      } else if (g.x > 410 && g.x < 490 && g.y > PISO - 160 + this.piedras * 6) {
        g.viva = false;
        this.animo -= 0.5;
        this.mojado = 40;
      }
      if (g.viva) vivas.push(g);
    }
    this.gotas = vivas;
    if (this.animo < 0) this.animo = 0;

    // el peso de las piedras encorva y apaga al mono
    this.mono.sy = 1 - this.piedras * 0.06;
    this.mono.forma = 1 - this.piedras * 0.09;
    if (this.mojado > 0) this.mojado--;
    if (this.mojado > 0 || this.piedras >= 4) this.mono.cara = "triste";
    else if (this.piedras >= 2) this.mono.cara = "plana";
    else this.mono.cara = "feliz";

    // fin: cuando ya cayeron todas y ninguna está en el aire
    if (this.siguiente >= this.lista.length) {
      let enAire = false;
      for (let i = 0; i < this.tarjetas.length; i++) {
        if (this.tarjetas[i].estado === "cae" || this.tarjetas[i].estado === "agarrada") enAire = true;
      }
      if (!enAire) {
        this.finT++;
        if (this.finT > 120) this.terminar();
      }
    }
  }

  // qué pedazo del paraguas está sobre esta x (-1 si ninguno)
  segmento(x) {
    for (let i = 0; i < 6; i++) {
      if (x >= 320 + i * 43.3 && x < 320 + (i + 1) * 43.3) return i;
    }
    return -1;
  }

  contarSoltada(c) {
    if (c.cuida) this.soltadasCuida++;
    else this.soltadasAprieta++;
  }

  // revisa si cargar o soltar esa regla estuvo bien y lo dice
  decidir(c, cargo) {
    if (cargo === c.cuida) {
      juego.ganarFuerza(3, 450, PISO - 200);
      this.aciertos++;
      this.racha++;
      if (this.racha >= 3) juego.avisar("¡racha de " + this.racha + "!");
      else if (cargo) juego.avisar("bien: esa te abriga");
      else juego.avisar("bien: esa pesaba, déjala ir");
    } else {
      this.racha = 0;
      juego.perderFuerza(12, 450, PISO - 200);
      juego.alertar(c.mensaje);
    }
  }

  // la mochila está a la derecha del mono
  enMochila(x, y) {
    return x > 540 && x < 700 && y > PISO - 120 && y < PISO;
  }

  clic() {
    // agarra la tarjeta de más arriba que esté cayendo bajo el mouse
    for (let i = this.tarjetas.length - 1; i >= 0; i--) {
      let c = this.tarjetas[i];
      if (c.estado === "cae" && c.encima()) {
        c.agarrar();
        return;
      }
    }
  }

  soltar() {
    for (let i = 0; i < this.tarjetas.length; i++) {
      let c = this.tarjetas[i];
      if (c.estado !== "agarrada") continue;
      if (this.enMochila(c.x, c.y)) {
        // la cargas
        c.estado = "guardada";
        if (c.cuida) {
          this.paraguas[this.ordenParaguas[this.cuidaGuardadas]] = true;
          this.cuidaGuardadas++;
          explotarEn(450, PISO - 260, 14, [MANTEQUILLA, ROSA]);
        } else {
          this.piedras++;
          juego.temblor = 6;
        }
        this.decidir(c, true);
      } else {
        // la sueltas: vuelve a caer
        c.estado = "cae";
        c.vy = 3;
      }
    }
  }

  tecla() {}

  terminar() {
    this.terminado = true;
    let r = this.cuidaGuardadas;
    let p = this.piedras;
   
    if (r >= 4 && p >= 4) {
      this.diario = "lo cargué todo, por si acaso. tenía un techo... y una espalda que ya no podía con tanto.";
      this.ensenanza = "OBEDECER TODAS LAS REGLAS NO TE PROTEGE MÁS: TAMBIÉN TE PESA.";
    } else if (r >= 4) {
      this.diario = "me quedé con las que me abrigaban y dejé caer las que solo pesaban. seguía lloviendo, pero ya no me mojaba tanto.";
      this.ensenanza = "UNAS REGLAS CUIDAN, OTRAS APRIETAN. SE PUEDE ELEGIR QUÉ CARGAR.";
    } else if (p <= 2) {
      this.diario = "no cargué casi nada. todo se sintió liviano... hasta que empezó a llover.";
      this.ensenanza = "SOLTAR TODAS LAS REGLAS TAMPOCO ES LIBERTAD: ALGUNAS ERAN TECHO.";
    } else {
      this.diario = "me quedé con las que pesaban y solté las que me cuidaban. no me di cuenta hasta que llovió.";
      this.ensenanza = "A VECES CONFUNDIMOS LO QUE APRIETA CON LO QUE PROTEGE.";
    }
    this.pregunta = "¿qué regla cargas desde hace años que ya no te sirve?";
    this.resumen = "la mochila: " + r + " reglas que cuidan y " + p + " que aprietan";
    this.estrellas = 0;
    if (this.aciertos >= 6) this.estrellas++;
    if (this.aciertos >= 9) this.estrellas++;
    if (this.aciertos >= 11) this.estrellas++;
    print("nivel 1 · aciertos: " + this.aciertos + " de 12 · cuidan cargadas: " + r + " · aprietan cargadas: " + p + " · ánimo: " + this.animo);
  }

  mostrar() {
    dibujarPiso();

    // tarjetas tiradas en el piso (atrás)
    for (let i = 0; i < this.tarjetas.length; i++) {
      if (this.tarjetas[i].estado === "suelo") this.tarjetas[i].mostrar();
    }

    // paraguas hecho con las reglas que cuidan
    stroke(CARBON);
    strokeWeight(3);
    line(450, PISO - 255, 456, PISO - 98);
    noFill();
    arc(464, PISO - 98, 16, 16, 0, 180);
    line(450, PISO - 325, 450, PISO - 340);
    for (let i = 0; i < 6; i++) {
      if (this.paraguas[i]) {
        stroke(CARBON);
        strokeWeight(1.5);
        if (i % 2 === 0) fill(ROSA_FUERTE);
        else fill(MANTEQUILLA);
      } else {
        noFill();
        stroke(GRIS);
        strokeWeight(1.5);
      }
      arc(450, PISO - 255, 260, 140, 180 + i * 30, 210 + i * 30);
    }

    // el mono
    this.mono.mostrarEn(450, PISO, 1);

    // la mochila: asa, cuerpo, piedras que asoman y bolsillo
    let mx = 620;
    let my = PISO - 48;
    noFill();
    stroke(110, 82, 52);
    strokeWeight(6);
    arc(mx, my - 52, 56, 40, 180, 360);
    sombra(mx, my, 150, 96, 22);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(110, 82, 52);
    rect(mx, my, 150, 96, 22);
    for (let i = 0; i < this.piedras; i++) {
      let fila = (i - (i % 4)) / 4;
      noStroke();
      fill(GRIS);
      ellipse(mx - 48 + (i % 4) * 32 + (fila % 2) * 14, my - 26 - fila * 16, 30, 22);
      fill(215, 215, 215);
      ellipse(mx - 54 + (i % 4) * 32 + (fila % 2) * 14, my - 30 - fila * 16, 9, 5);
    }
    stroke(CARBON);
    strokeWeight(1.5);
    fill(CAFE);
    rect(mx, my + 14, 150, 68, 20);
    fill(160, 122, 79);
    rect(mx, my + 22, 88, 40, 12);
    line(mx - 44, my + 12, mx + 44, my + 12);
    fill(MANTEQUILLA);
    rect(mx, my + 12, 14, 9, 3);
    noStroke();
    fill(CREMA);
    titulo(11);
    text("mochila", mx, my + 28);

    // lluvia y tarjetas en el aire
    for (let i = 0; i < this.gotas.length; i++) this.gotas[i].mostrar();
    for (let i = 0; i < this.tarjetas.length; i++) {
      let c = this.tarjetas[i];
      if (c.estado === "cae" || c.estado === "agarrada") c.mostrar();
    }
  }

  mostrarHUD() {
    marcador(130, 95, "paraguas: " + this.cuidaGuardadas + " de 6", "paraguas");
    marcador(130, 135, "piedras: " + this.piedras, "piedra");
    marcador(770, 95, "ánimo: " + this.animo, "corazon");
  }
}

//  NIVEL 2: EL CAMINO A CASA
// La regla incómoda: "obedece todo lo que diga el camino".
// El mono camina solo. En el camino aparecen reglas que CAMBIAN EL JUEGO:
//  1. CABEZA BAJA (aprieta): una sombra tapa lo que viene.
//  2. AGÁRRATE SI HACE VIENTO (cuida): te sostiene del barandal en el viento.
//  3. NO SALTES (aprieta): las teclas dejan de servir y te llenas de barro.
//  4. ESPERA EL SEMÁFORO (cuida): te detiene cuando pasan carros.
// Cada regla se puede romper con 3 clics. Romper las que cuidan duele.
// Enseñanza: romper una regla no es romperlas todas; es saber cuál.
class NivelCamino {
  constructor() {
   
    this.nombre = "EL CAMINO A CASA";
    this.reglaIncomoda = "obedece todo lo que diga el camino";
    this.pasos = [
      ["tecla", "cualquier tecla: saltar los charcos"],
      ["mouse", "3 clics sobre una regla: romperla"],
      ["nada", "cada regla cambia cómo se juega"]
    ];
    this.instruccion = "cualquier tecla salta · 3 clics sobre una regla la rompen";
   
    //    (si cambias el texto, el efecto de cada regla sigue siendo el mismo)
    this.reglas = [
      ["CAMINA CON LA CABEZA BAJA", false, 150],
      ["AGÁRRATE FUERTE SI HACE VIENTO", true, 1000],
      ["NO SALTES, PÓRTATE BIEN", false, 2150],
      ["ESPERA EL SEMÁFORO", true, 3100]
    ];
    this.largo = 4300; // dónde está la casa
    this.vientoIni = 1450;
    this.vientoFin = 2050;
    this.cruce = 3650; // la calle con carros
  }

  iniciar(mono) {
    this.mono = mono;
    this.t = 0;
    this.d = 0; // cuánto ha avanzado el mundo
    this.x = 220; // el mono está quieto en la pantalla; el mundo se mueve
    this.dy = 0;
    this.vy = 0;
    this.enSuelo = true;
    this.vidas = 4;
    this.invulnerable = 0;
    this.lento = 0;
    this.barro = 0;
    this.golpesViento = 0;
    this.rotasCuida = 0;
    this.rotasAprieta = 0;
    this.tarjetas = [];
    this.luz = "verde"; // semáforo para el mono
    this.luzT = 0;
    this.obstaculos = [];
    let charcos = [650, 1250, 2450, 2750, 3000];
    for (let i = 0; i < charcos.length; i++) this.obstaculos.push(new Obstaculo(charcos[i], "charco"));
    this.carros = [];
    this.terminado = false;
    this.llego = false;
    this.avisoBarro = false;
    this.tiempoCabeza = 0;
  }

  // ¿la regla i apareció y sigue sin romperse?
  activa(i) {
    return i < this.tarjetas.length && this.tarjetas[i].estado !== "rota";
  }

  actualizar() {
    if (this.terminado) return;
    this.t++;
    this.mono.animar();
    let pos = this.d + this.x; // posición del mono en el mundo

    // aparecen las reglas, clavadas arriba en fila
    for (let i = 0; i < this.reglas.length; i++) {
      if (this.tarjetas.length === i && this.d >= this.reglas[i][2]) {
        let c = new Tarjeta(this.reglas[i][0], this.reglas[i][1], 150 + i * 200, 125, 180, 62);
        c.estado = "fija";
        this.tarjetas.push(c);
        juego.avisar("apareció una regla nueva");
      }
    }

    // semáforo: 160 cuadros en rojo (pasan carros) y 160 en verde
    this.luzT++;
    if (this.luzT > 160) {
      this.luzT = 0;
      if (this.luz === "verde") this.luz = "rojo";
      else this.luz = "verde";
    }
    // los carros salen solo en la primera mitad del rojo, así la calle queda libre en verde
    if (this.luz === "rojo" && this.luzT < 80 && this.t % 45 === 0) {
      let c = new Obstaculo(this.cruce + 60, "carro");
      c.y = 260;
      this.carros.push(c);
    }
    let siguen = [];
    for (let i = 0; i < this.carros.length; i++) {
      this.carros[i].y += 7;
      if (this.carros[i].y < 700) siguen.push(this.carros[i]);
    }
    this.carros = siguen;

    // velocidad del camino
    let vel = 3;
    if (this.lento > 0) {
      vel = 1.4;
      this.lento--;
    }
    let enViento = pos > this.vientoIni && pos < this.vientoFin;
    if (enViento && this.activa(1)) vel = 2; // agarrada del barandal va más despacio
    vel = vel * (0.55 + 0.45 * juego.fuerza / 100); // sin fuerza camina más lento

    // regla 4 activa: espera en la esquina mientras el semáforo está en rojo
    // (también espera si el verde ya se va a acabar)
    let peligro = this.luz === "rojo" || this.luzT > 110;
    if (this.activa(3) && peligro && pos > this.cruce - 40 && pos < this.cruce) vel = 0;

    this.d += vel;
    pos = this.d + this.x;

    // salto y gravedad
    if (!this.enSuelo) {
      this.vy += 0.7;
      this.dy += this.vy;
      if (this.dy >= 0) {
        this.dy = 0;
        this.vy = 0;
        this.enSuelo = true;
      }
    }

    // viento sin la regla que cuida: te empuja y te lastima (máximo 2 veces)
    if (enViento && !this.activa(1) && this.t % 80 === 0 && this.golpesViento < 2) {
      this.golpesViento++;
      this.d -= 70;
      this.herir("el viento te tumbó. esa regla te sostenía: no todo lo que incomoda aprieta.");
      if (this.mono.conAccesorio) {
        this.mono.conAccesorio = false;
        explotarEn(this.x, PISO - 120, 16, [ROSA_FUERTE, CREMA]);
      }
    }

    // Mono <-> charco: si no saltas te llenas de barro y vas más lento
    for (let i = 0; i < this.obstaculos.length; i++) {
      let o = this.obstaculos[i];
      if (!o.usado && o.mx > pos - 30 && o.mx < pos + 10 && this.enSuelo) {
        o.usado = true;
        this.barro++;
        if (this.activa(2)) juego.perderFuerza(5, this.x, PISO - 150);
        else juego.perderFuerza(3, this.x, PISO - 150);
        if (this.activa(2) && !this.avisoBarro) {
          juego.alertar("«pórtate bien» no te cuida: solo te llena de barro. rómpela con 3 clics.");
          this.avisoBarro = true;
        }
        this.lento = 60;
        explotarEn(this.x, PISO, 10, [CAFE, "#A07A4F"]);
      }
    }

    // Mono <-> carro: si cruzas sin esperar, te pega
    if (pos > this.cruce && pos < this.cruce + 120 && this.invulnerable === 0) {
      for (let i = 0; i < this.carros.length; i++) {
        let c = this.carros[i];
        if (c.y > PISO - 130 && c.y < PISO + 20) {
          this.herir("te pasó un carro muy cerca. el semáforo no era para controlarte: era para cuidarte.");
          this.d += 60;
        }
      }
    }
    if (this.invulnerable > 0) this.invulnerable--;

    // caminar mucho rato con la cabeza baja también tiene su mensaje
    if (this.activa(0)) {
      this.tiempoCabeza++;
      // caminar con la cabeza baja cansa
      if (this.tiempoCabeza % 240 === 0) juego.perderFuerza(3, this.x, PISO - 150);
      if (this.tiempoCabeza === 420) juego.alertar("caminar con la cabeza baja no te protege: solo te quita el camino. rómpela.");
    }

    // cara del mono según lo que pasa
    if (this.mono.giro !== 0) this.mono.giro += (0 - this.mono.giro) * 0.1;
    if (this.invulnerable > 30) this.mono.cara = "triste";
    else if (this.activa(0)) this.mono.cara = "plana";
    else if (this.barro >= 3) this.mono.cara = "incomoda";
    else this.mono.cara = "feliz";

    // fin
    if (pos >= this.largo) {
      this.llego = true;
      this.terminar();
    } else if (this.vidas <= 0) {
      this.terminar();
    }
  }

  herir(txt) {
    if (this.invulnerable > 0) return;
    this.vidas--;
    juego.perderFuerza(15, this.x, PISO - 150);
    this.invulnerable = 70;
    this.mono.giro = -60;
    juego.temblor = 10;
    juego.alertar(txt);
  }

  clic() {
    // 3 clics sobre una regla la rompen
    for (let i = 0; i < this.tarjetas.length; i++) {
      let c = this.tarjetas[i];
      if (c.estado === "fija" && c.encima()) {
        c.romper();
        if (c.estado === "rota") {
          explotarEn(c.x, c.y, 20, [CREMA, ROSA_FUERTE]);
          if (c.cuida) this.rotasCuida++;
          else this.rotasAprieta++;
          if (c.cuida) {
            juego.perderFuerza(10, this.x, PISO - 150);
            juego.alertar("rompiste una regla que te cuidaba. ya vas a ver para qué servía.");
          } else {
            juego.ganarFuerza(8, this.x, PISO - 150);
            juego.avisar("¡bien! esa te apretaba");
          }
        }
      }
    }
  }

  tecla() {
    // si la regla "no saltes" está activa, la tecla no sirve
    if (this.activa(2)) {
      juego.avisar("no se salta... eso dice la regla");
      return;
    }
    if (this.enSuelo) {
      this.vy = -12 * (0.8 + 0.2 * juego.fuerza / 100);
      this.enSuelo = false;
    }
  }

  soltar() {}

 
  terminar() {
    this.terminado = true;
    let a = this.rotasAprieta;
    let c = this.rotasCuida;
    if (a === 2 && c === 0) {
      this.diario = "rompí la que me hacía mirar el piso y la que no me dejaba saltar. me quedé con la que me sostuvo en el viento y con la del semáforo.";
      this.ensenanza = "ROMPER UNA REGLA NO ES ROMPERLAS TODAS: ES SABER CUÁL.";
    } else if (c >= 1 && a >= 1) {
      this.diario = "rompí casi todo lo que encontré. algunas me liberaron... otras me estaban cuidando y me di cuenta tarde.";
      this.ensenanza = "NO TODO LO QUE INCOMODA APRIETA: A VECES CUIDA.";
    } else if (c >= 1) {
      this.diario = "rompí justo las que me cuidaban y me quedé con las que me hacían pequeño.";
      this.ensenanza = "A VECES NOS REBELAMOS CONTRA LO QUE NOS PROTEGE Y OBEDECEMOS LO QUE NOS ENCOGE.";
    } else {
      this.diario = "obedecí cada letrero. avancé mirando el piso, con los zapatos llenos de barro.";
      this.ensenanza = "OBEDECER TODO TE LLEVA, PERO NO SIEMPRE COMO QUIERES LLEGAR.";
    }
    if (!this.llego) this.diario = "no llegué a casa esta vez. " + this.diario;
    this.pregunta = "¿qué regla de tu camino de todos los días sí te cuida?";
    this.resumen = "el camino: rompiste " + a + " que aprietan y " + c + " que cuidan";
    this.estrellas = 0;
    if (this.llego) this.estrellas++;
    if (a === 2) this.estrellas++;
    if (c === 0) this.estrellas++;
    print("nivel 2 · rotas que aprietan: " + a + " · rotas que cuidan: " + c + " · vidas: " + this.vidas + " · barro: " + this.barro + " · llegó: " + this.llego);
  }

  mostrar() {
    let d = this.d;

    // anden de baldosas que se mueve
    noStroke();
    fill(214, 198, 170);
    rect(450, PISO + 75, 900, 150);
    stroke(190, 172, 140);
    strokeWeight(2);
    let off = -d % 60;
    for (let x = off; x < 920; x += 60) line(x, PISO, x, PISO + 150);
    stroke(CARBON);
    strokeWeight(3);
    line(0, PISO, 900, PISO);

    // zona de viento: rayitas que vuelan y barandal
    let vx = this.vientoIni - d;
    let vf = this.vientoFin - d;
    if (vf > 0 && vx < 900) {
      stroke(CAFE);
      strokeWeight(4);
      line(vx, PISO - 60, vf, PISO - 60);
      for (let x = vx; x < vf; x += 80) line(x, PISO - 60, x, PISO);
      stroke(167, 167, 167, 180);
      strokeWeight(2);
      for (let i = 0; i < 6; i++) {
        let lx = ((this.t * 9 + i * 170) % 700) + vx;
        if (lx < vf) line(lx, 180 + i * 45, lx + 40, 175 + i * 45);
      }
    }

    // la calle con cebra y semáforo
    let cx = this.cruce - d;
    if (cx > -200 && cx < 1000) {
      noStroke();
      fill(CARBON);
      rect(cx + 60, 470, 120, 340);
      fill(CREMA);
      for (let y = PISO - 10; y < 620; y += 24) rect(cx + 60, y, 110, 10);
      // semáforo
      stroke(CARBON);
      strokeWeight(5);
      line(cx - 30, PISO, cx - 30, PISO - 140);
      noStroke();
      fill(CARBON);
      rect(cx - 30, PISO - 2, 24, 6, 3);
      rect(cx - 30, PISO - 172, 34, 70, 10);
      if (this.luz === "rojo") {
        fill(224, 82, 122, 80);
        circle(cx - 30, PISO - 188, 32);
        fill(ROSA_FUERTE);
      } else {
        fill(75, 75, 75);
      }
      circle(cx - 30, PISO - 188, 17);
      if (this.luz === "verde") {
        fill(243, 237, 163, 80);
        circle(cx - 30, PISO - 156, 32);
        fill(MANTEQUILLA);
      } else {
        fill(75, 75, 75);
      }
      circle(cx - 30, PISO - 156, 17);
    }
    for (let i = 0; i < this.carros.length; i++) this.carros[i].mostrar(d);

    // charcos
    for (let i = 0; i < this.obstaculos.length; i++) this.obstaculos[i].mostrar(d);

    // la casa al final
    let hx = this.largo - d + 60;
    if (hx < 1100) {
      sombra(hx, PISO - 75, 150, 150, 4);
      stroke(CARBON);
      strokeWeight(1.5);
      fill(ROSA);
      rect(hx, PISO - 75, 150, 150, 4);
      fill(ROSA_FUERTE);
      triangle(hx - 92, PISO - 148, hx + 92, PISO - 148, hx, PISO - 228);
      // puerta con manija
      fill(MANTEQUILLA);
      rect(hx - 30, PISO - 40, 40, 80, 16, 16, 2, 2);
      noStroke();
      fill(CAFE);
      circle(hx - 19, PISO - 38, 6);
      // ventana con marco
      stroke(CARBON);
      strokeWeight(1.5);
      fill(CREMA);
      rect(hx + 38, PISO - 92, 42, 38, 4);
      line(hx + 38, PISO - 111, hx + 38, PISO - 73);
      line(hx + 17, PISO - 92, hx + 59, PISO - 92);
      // ventana redonda con estrella
      circle(hx, PISO - 180, 30);
      noStroke();
      fill(ROSA_FUERTE);
      formaEstrella(hx, PISO - 180, 9);
    }

    // el mono (parpadea si lo acaban de lastimar)
    if (this.invulnerable === 0 || this.invulnerable % 10 < 6) {
      this.mono.mostrarEn(this.x, PISO + this.dy, 0.8);
    }
    // manchas de barro
    noStroke();
    fill(139, 107, 70, 220);
    for (let i = 0; i < this.barro; i++) {
      ellipse(this.x - 20 + i * 11, PISO + this.dy - 10 - (i % 2) * 14, 10, 8);
    }

    // regla 1 activa: una sombra tapa lo que viene adelante
    if (this.activa(0)) {
      noStroke();
      fill(46, 46, 46, 190);
      rect(700, 330, 400, 460);
      fill(CREMA);
      titulo(13);
      text("no ves lo que viene", 700, 330);
    }

    // reglas clavadas arriba
    for (let i = 0; i < this.tarjetas.length; i++) this.tarjetas[i].mostrar();
  }

  mostrarHUD() {
    marcador(130, 205, "vidas: " + this.vidas, "corazon");
    let p = (this.d + this.x) / this.largo;
    if (p > 1) p = 1;
    marcador(770, 205, "camino: " + (p * 100 - (p * 100) % 1) + "%", "casa");
  }
}

//  BURBUJA 
// nivel 3: lo que dicen los demás en la fiesta. viaja hacia el mono.
// si aprieta hay que reventarla con un clic; si cuida hay que dejarla llegar.
class Burbuja {
  constructor(x, y, frase, emisor) {
    this.x = x;
    this.y = y;
    this.texto = frase[0];
    this.cuida = frase[1];
    this.mensaje = frase[2]; // lo que sale si te equivocas con esta burbuja
    this.emisor = emisor; // qué invitado la dijo
    this.w = 176;
    this.h = 48;
    this.vel = random(1.2, 1.8);
    this.fase = random(360);
    this.crece = 0.2;
    this.viva = true;
  }

  // avanza hacia el mono flotando un poquito
  actualizar(tx, ty) {
    let dx = tx - this.x;
    let dy = ty - this.y;
    let ax = dx;
    if (ax < 0) ax = -ax;
    let ay = dy;
    if (ay < 0) ay = -ay;
    let m = ax;
    if (ay > m) m = ay;
    if (m < 1) m = 1;
    this.x += (dx / m) * this.vel;
    this.y += (dy / m) * this.vel + onda(tiempo * 4 + this.fase) * 0.4;
    if (this.crece < 1) this.crece += 0.08;
  }

  llego(tx, ty) {
    return this.x > tx - 40 && this.x < tx + 40 && this.y > ty - 40 && this.y < ty + 40;
  }

  encima() {
    return mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2;
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    scale(this.crece);
    sombra(0, 0, this.w, this.h, 24);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    rect(0, 0, this.w, this.h, 24);
    circle(-this.w / 2 + 22, this.h / 2 + 9, 10);
    circle(-this.w / 2 + 12, this.h / 2 + 17, 6);
    noStroke();
    fill(CARBON);
    titulo(11);
    text(this.texto, 0, 0, this.w - 22, this.h - 8);
    pop();
  }
}

//  NIVEL 3: LA FIESTA 
// la regla incómoda: "no bailes, ¿qué van a decir?"
// con una tecla presionada el mono baila y sube el ambiente.
// los otros monos le lanzan frases en burbujas:
//  - las que aprietan se revientan con clic. si llegan, el mono se congela.
//    cuando revientas la frase de un invitado, ese invitado se suelta y baila.
//  - las que cuidan hay que dejarlas llegar: le devuelven energía al mono.
//    si las revientas, el mono se cansa más.
// bailar gasta energía; sin energía no se puede bailar.
class NivelFiesta {
  constructor() {
    this.nombre = "LA FIESTA";
    this.reglaIncomoda = "no bailes, ¿qué van a decir?";
    this.pasos = [
      ["tecla", "mantén cualquier tecla para bailar"],
      ["mouse", "clic en las burbujas que aprietan para reventarlas"],
      ["nada", "deja llegar las que cuidan: te devuelven energía"]
    ];
    this.instruccion = "una tecla para bailar · clic para reventar lo que aprieta · deja llegar lo que cuida";
    // [lo que dicen, cuida, mensaje si te equivocas]
    this.frases = [
      ["¡NO BAILES!", false, "«no bailes» te congeló. esa regla solo aprieta: revéntala."],
      ["QUÉ OSO", false, "«qué oso» te congeló. la vergüenza también es una regla que aprieta."],
      ["¿QUÉ VAN A DECIR?", false, "«qué van a decir» te congeló. lo que digan no es tuyo: revéntala."],
      ["NO HAGAS EL RIDÍCULO", false, "«no hagas el ridículo» te congeló. disfrutar no es hacer el ridículo."],
      ["ESO NO ES PARA TI", false, "«eso no es para ti» te congeló. tú decides qué es para ti."],
      ["NO LLAMES LA ATENCIÓN", false, "«no llames la atención» te congeló. brillar no es un error."],
      ["TOMA AGUA", true, "reventaste «toma agua». esa te cuidaba: bailar también cansa."],
      ["AVÍSAME SI TE VAS", true, "reventaste «avísame si te vas». era alguien que te quiere, cuidándote."],
      ["SI ALGUIEN DICE NO, ES NO", true, "reventaste «si alguien dice no, es no». esa regla cuida a todos en la fiesta."],
      ["DESCANSA UN RATO", true, "reventaste «descansa un rato». descansar no es rendirse: te cuidaba."],
      ["CUIDA A TUS AMIGOS", true, "reventaste «cuida a tus amigos». esa regla hace la fiesta más segura."]
    ];
  }

  iniciar(mono) {
    this.mono = mono;
    this.t = 0;
    this.dur = 2700; // 45 segundos de fiesta
    this.burbujas = [];
    this.proxima = 60; // cuadros para la siguiente burbuja
    this.energia = 100;
    this.ambiente = 0;
    this.congelado = 0;
    this.bailando = false;
    this.sinEnergia = false;
    this.avisoEnergia = false;
    this.bien = 0; // burbujas que apretaban y reventaste
    this.mal = 0; // burbujas que cuidaban y reventaste
    this.congeladas = 0;
    this.cuidados = 0; // burbujas que cuidaban y te llegaron
    this.dy = 0;
    // los otros cuatro monos son los invitados; empiezan serios y apagados
    this.invitados = [];
    let xs = [105, 225, 675, 795];
    let k = 0;
    for (let i = 0; i < monos.length; i++) {
      if (monos[i].tipo !== mono.tipo) {
        let g = new Mono(xs[k], 0, monos[i].tipo, monos[i].nombre, monos[i].apodo, monos[i].rasgo);
        g.forma = 0.5;
        g.cara = "plana";
        g.libre = false;
        g.fase = k * 70;
        this.invitados.push(g);
        k++;
      }
    }
    irAlCoro();
    this.terminado = false;
  }

  // escoge una frase al azar que cuide (true) o que apriete (false)
  escogerFrase(cuida) {
    let f = this.frases[entero(random(this.frases.length))];
    while (f[1] !== cuida) f = this.frases[entero(random(this.frases.length))];
    return f;
  }

  actualizar() {
    if (this.terminado) return;
    this.t++;
    this.mono.animar();
    let nivel = nivelMusica();

    // bailar gasta energía; descansar la recupera
    this.bailando = keyIsPressed && this.congelado === 0 && !this.sinEnergia;
    if (this.bailando) {
      this.ambiente += (0.05 + nivel * 0.12) * (0.4 + 0.6 * juego.fuerza / 100);
      this.energia -= 0.3;
    } else {
      this.energia += 0.1;
    }
    if (this.energia <= 0) {
      this.energia = 0;
      this.sinEnergia = true;
      if (!this.avisoEnergia) {
        juego.alertar("te quedaste sin energía. las reglas que cuidan también te sostienen: déjalas llegar.");
        this.avisoEnergia = true;
      }
    }
    if (this.sinEnergia && this.energia > 30) this.sinEnergia = false;
    this.energia = limitar(this.energia, 0, 100);
    if (this.congelado > 0) this.congelado--;

    // los invitados que se soltaron bailan y suben el ambiente
    for (let i = 0; i < this.invitados.length; i++) {
      let g = this.invitados[i];
      g.animar();
      if (g.libre) {
        this.ambiente += 0.02;
        g.forma += (1 - g.forma) * 0.05;
        g.cara = "feliz";
      }
    }
    this.ambiente = limitar(this.ambiente, 0, 100);

    // sale una burbuja nueva; cada vez salen más seguido
    this.proxima--;
    if (this.proxima <= 0) {
      let cada = 80 - this.t / 70;
      if (cada < 40) cada = 40;
      this.proxima = cada;
      let e = entero(random(this.invitados.length));
      let g = this.invitados[e];
      // los invitados serios casi siempre dicen reglas que aprietan;
      // los que ya bailan solo dicen reglas que cuidan
      let cuida = random() < 0.35;
      if (g.libre) cuida = random() < 0.85;
      this.burbujas.push(new Burbuja(g.x, PISO - 130, this.escogerFrase(cuida), e));
    }

    // Burbuja <-> mono
    let vivas = [];
    for (let i = 0; i < this.burbujas.length; i++) {
      let b = this.burbujas[i];
      b.actualizar(450, PISO - 95);
      if (b.llego(450, PISO - 95)) {
        b.viva = false;
        if (b.cuida) {
          this.cuidados++;
          this.energia = limitar(this.energia + 30, 0, 100);
          juego.ganarFuerza(4, 450, PISO - 200);
          explotarEn(450, PISO - 120, 12, [ROSA, MANTEQUILLA]);
          juego.avisar("esa te cuida: +energía");
        } else {
          this.congeladas++;
          this.congelado = 100;
          juego.perderFuerza(8, 450, PISO - 200);
          juego.temblor = 8;
          juego.alertar(b.mensaje);
        }
      }
      if (b.viva) vivas.push(b);
    }
    this.burbujas = vivas;

    // cómo se ve el mono
    if (this.congelado > 0) {
      this.mono.cara = "triste";
      this.mono.forma = 0.6;
      this.mono.sx += (0.88 - this.mono.sx) * 0.2;
      this.mono.sy += (0.88 - this.mono.sy) * 0.2;
    } else {
      this.mono.forma += (1 - this.mono.forma) * 0.1;
      this.mono.sx += (1 - this.mono.sx) * 0.2;
      this.mono.sy += (1 - this.mono.sy) * 0.2;
      if (this.sinEnergia) this.mono.cara = "triste";
      else if (this.bailando) this.mono.cara = "feliz";
      else this.mono.cara = "plana";
    }

    if (this.t >= this.dur) this.terminar();
  }

  clic() {
    // revienta la burbuja de más arriba que esté bajo el mouse
    for (let i = this.burbujas.length - 1; i >= 0; i--) {
      let b = this.burbujas[i];
      if (b.viva && b.encima()) {
        b.viva = false;
        explotarEn(b.x, b.y, 16);
        if (!b.cuida) {
          this.bien++;
          juego.ganarFuerza(3, 450, PISO - 200);
          let g = this.invitados[b.emisor];
          if (!g.libre) {
            g.libre = true;
            juego.avisar("¡" + g.apodo + " se soltó y se unió a bailar!");
          } else {
            juego.avisar("¡bien! esa apretaba");
          }
        } else {
          this.mal++;
          this.energia = limitar(this.energia - 25, 0, 100);
          juego.perderFuerza(10, 450, PISO - 200);
          juego.alertar(b.mensaje);
        }
        return;
      }
    }
  }

  tecla() {}

  soltar() {}

  terminar() {
    this.terminado = true;
    let libres = 0;
    for (let i = 0; i < this.invitados.length; i++) if (this.invitados[i].libre) libres++;
    if (this.mal === 0 && this.congeladas <= 1) {
      this.diario = "bailé. reventé el qué oso y el no bailes, y dejé que me llegara el toma agua. al final estábamos bailando todos.";
      this.ensenanza = "LAS REGLAS QUE APRIETAN NOS APRIETAN A TODOS. CUANDO UNA SE ROMPE, OTROS TAMBIÉN SE SUELTAN.";
    } else if (this.mal >= 2) {
      this.diario = "reventé todo lo que me decían, hasta lo que me cuidaba. bailé mucho... y terminé sin agua y sin que nadie supiera dónde estaba.";
      this.ensenanza = "NO TODO LO QUE TE DICEN TE QUIERE APAGAR: ALGUNAS PALABRAS TE CUIDAN.";
    } else if (this.congeladas >= 3) {
      this.diario = "cada qué oso me congeló un poquito. casi no bailé, y nadie más se atrevió.";
      this.ensenanza = "LO QUE NO SE CUESTIONA SE QUEDA, Y NOS QUITA LA FIESTA A TODOS.";
    } else {
      this.diario = "bailé a ratos. algunas reglas las reventé y otras me alcanzaron. la próxima ya sé cuáles son cuáles.";
      this.ensenanza = "DISTINGUIR TAMBIÉN SE PRACTICA. CADA VEZ ES UN POCO MÁS FÁCIL.";
    }
    this.pregunta = "¿qué te dejarías de prohibir si nadie te estuviera mirando?";
    this.resumen = "la fiesta: " + libres + " de 4 monos se soltaron a bailar";
    this.estrellas = 0;
    if (libres >= 2) this.estrellas++;
    if (this.mal === 0) this.estrellas++;
    if (this.congeladas <= 1) this.estrellas++;
    print("nivel 3 · reventadas que apretaban: " + this.bien + " · reventadas que cuidaban: " + this.mal + " · congelada: " + this.congeladas + " · se soltaron: " + libres);
  }

  mostrar() {
    let nivel = nivelMusica();

    // pista de baile de cuadros que brilla con la música
    noStroke();
    for (let fila = 0; fila < 3; fila++) {
      for (let col = 0; col < 15; col++) {
        if ((fila + col) % 2 === 0) fill(224, 82, 122, 90 + nivel * 120);
        else fill(246, 241, 230, 220);
        rect(30 + col * 60, PISO + 25 + fila * 50, 60, 50);
      }
    }
    stroke(CARBON);
    strokeWeight(2);
    line(0, PISO, 900, PISO);

    // luces que se mueven desde la estrella disco
    noStroke();
    for (let i = 0; i < 4; i++) {
      let lx = 450 + onda(this.t * 1.5 + i * 90) * 320;
      if (i % 2 === 0) fill(243, 237, 163, 40 + nivel * 60);
      else fill(224, 82, 122, 30 + nivel * 50);
      triangle(450, 120, lx - 60, PISO, lx + 60, PISO);
    }

    // banderines
    stroke(CARBON);
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let x = 0; x <= 900; x += 30) {
      let k = (x - 450) / 450;
      vertex(x, 70 + 30 * (1 - k * k));
    }
    endShape();
    let colores = [ROSA_FUERTE, MANTEQUILLA, ROSA, CREMA];
    for (let i = 0; i < 18; i++) {
      let x = 25 + i * 50;
      let k = (x - 450) / 450;
      let y = 70 + 30 * (1 - k * k);
      stroke(CARBON);
      strokeWeight(1);
      fill(colores[i % 4]);
      triangle(x - 12, y, x + 12, y, x, y + 22);
    }

    // estrella disco que gira y crece con la música
    push();
    translate(450, 120);
    rotate(this.t * 2);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(MANTEQUILLA);
    formaEstrella(0, 0, 26 + nivel * 14);
    noStroke();
    fill(255, 255, 255, 150);
    circle(-5, -6, 8);
    pop();

    // invitados: serios y apagados, o bailando si se soltaron
    for (let i = 0; i < this.invitados.length; i++) {
      let g = this.invitados[i];
      if (g.libre) {
        let o = onda(this.t * 8 + g.fase);
        if (o < 0) o = -o;
        g.giro = onda(this.t * 5 + g.fase) * 8;
        g.mostrarEn(g.x, PISO - o * 12, 0.75);
      } else {
        g.giro = 0;
        g.mostrarEn(g.x, PISO, 0.75);
      }
    }

    // el mono: baila si hay una tecla presionada
    this.mono.giro = 0;
    let salto = 0;
    if (this.bailando) {
      let o = onda(this.t * 8);
      if (o < 0) o = -o;
      salto = -o * (10 + nivel * 14);
      this.mono.giro = onda(this.t * 5) * 10;
      if (this.t % 24 === 0) this.mono.mira = -this.mono.mira;
    }
    this.mono.mostrarEn(450, PISO + salto, 1);
    if (this.congelado > 0) {
      // escarcha de congelado
      noFill();
      stroke(167, 167, 167, 200);
      strokeWeight(2);
      for (let i = 0; i < 6; i++) {
        let a = i * 60;
        line(450 + onda(a) * 70, PISO - 90 + onda(a + 90) * 70, 450 + onda(a) * 80, PISO - 90 + onda(a + 90) * 80);
      }
    }

    for (let i = 0; i < this.burbujas.length; i++) this.burbujas[i].mostrar();
  }

  mostrarHUD() {
    marcador(130, 95, "energía: " + entero(this.energia), "corazon");
    marcador(130, 135, "se soltaron: " + this.contarLibres() + " de 4", "estrella");
    marcador(770, 95, "ambiente: " + entero(this.ambiente), "nota");
    marcador(770, 135, "tiempo: " + entero((this.dur - this.t) / 60), "reloj");
  }

  contarLibres() {
    let n = 0;
    for (let i = 0; i < this.invitados.length; i++) if (this.invitados[i].libre) n++;
    return n;
  }
}

//  JUEGO 
// Controla los estados: inicio -> elegir -> instrucciones -> juego ->
// reflexión (x3 niveles) -> cierre, y desde el cierre se vuelve a empezar.
class Juego {
  constructor() {
    this.estado = "inicio";
    this.tEstado = 0;
    this.elegido = -1;
    this.mono = null;
    this.n = 0;
    this.niveles = [new NivelMochila(), new NivelCamino(), new NivelFiesta()];
    this.mensaje = "";
    this.aviso = "";
    this.avisoT = 0;
    this.alerta = "";
    this.alertaT = 0;
    this.temblor = 0;
    this.espera = 0;
    this.saltoY = 0;
    this.saltoV = 0;
    this.fuerza = 100; // se gasta con las decisiones que no son buenas
    this.desmayos = 0;
    this.desmayado = false;
    this.flotantes = []; // los "-14 fuerza" que suben sobre el mono
  }

  // equivocarse le quita fuerza al mono
  perderFuerza(n, x, y) {
    this.fuerza = limitar(this.fuerza - n, 0, 100);
    this.flotantes.push([x, y, "-" + n + " fuerza", 70, true]);
    if (this.mono !== null) this.mono.sacudon = 20;
  }

  // acertar le devuelve un poquito
  ganarFuerza(n, x, y) {
    if (this.fuerza >= 100) return;
    this.fuerza = limitar(this.fuerza + n, 0, 100);
    this.flotantes.push([x, y, "+" + n, 50, false]);
  }

  // los numeritos que suben y se desvanecen
  dibujarFlotantes() {
    let siguen = [];
    for (let i = 0; i < this.flotantes.length; i++) {
      let f = this.flotantes[i];
      f[1] -= 0.8;
      f[3]--;
      let a = limitar(f[3] * 6, 0, 255);
      noStroke();
      if (f[4]) fill(224, 82, 122, a);
      else fill(139, 107, 70, a);
      titulo(16);
      text(f[2], f[0], f[1]);
      if (f[3] > 0) siguen.push(f);
    }
    this.flotantes = siguen;
  }

  // barra de fuerza arriba en el centro
  dibujarFuerza() {
    let f = this.fuerza;
    sombra(450, 30, 270, 32, 16);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    rect(450, 30, 270, 32, 16);
    noStroke();
    fill(CARBON);
    titulo(11);
    text("FUERZA", 362, 29);
    fill(230, 220, 205);
    rect(482, 30, 150, 12, 6);
    // con poca fuerza la barra titila
    if (f < 30 && tiempo % 30 < 15) fill(CARBON);
    else if (f < 50) fill(MANTEQUILLA);
    else fill(ROSA_FUERTE);
    if (f > 1) rect(407 + (150 * f) / 200, 30, (150 * f) / 100, 12, 6);
    dibujarCorazon(573, 28, 8);
  }

  cambiarEstado(nuevo) {
    this.estado = nuevo;
    this.tEstado = 0;
    this.avisoT = 0;
    this.alertaT = 0;
    fondo.setModo(nuevo);
    papelitos = [];
    if (nuevo === "elegir" && this.elegido < 0) {
      this.mensaje = "haz clic en un mono para elegirlo";
    } else if (nuevo === "instrucciones") {
      this.mono.reiniciar();
      this.mono.cara = "plana";
    } else if (nuevo === "juego") {
      // entre nivel y nivel el mono descansa un poquito
      if (this.n > 0) this.fuerza = limitar(this.fuerza + 20, 35, 100);
      this.desmayado = false;
      this.flotantes = [];
      this.mono.reiniciar();
      this.niveles[this.n].iniciar(this.mono);
      this.espera = 0;
    } else if (nuevo === "reflexion") {
      explotarEn(450, 100, 30);
    } else if (nuevo === "cierre") {
      this.mono.reiniciar();
      explotarEn(200, 250, 50);
    }
  }

  // evita saltarse una pantalla por un clic o tecla del nivel anterior
  listo() {
    return this.tEstado > 40;
  }

  // aviso corto cuando algo sale bien
  avisar(txt) {
    if (this.alertaT > 60) return; // no tapar un mensaje de error
    this.aviso = txt;
    this.avisoT = 110;
  }

  // mensaje más grande cuando la decisión no fue buena
  alertar(txt) {
    this.alerta = txt;
    this.alertaT = 230;
    this.avisoT = 0;
  }

  elegirMono(i) {
    for (let k = 0; k < monos.length; k++) monos[k].seleccionado = false;
    monos[i].elegir();
    this.elegido = i;
    this.mensaje = "elegiste a " + monos[i].apodo + ". clic en listo o cualquier tecla";
  }

  confirmarMono() {
    if (this.elegido < 0) {
      this.mensaje = "primero elige un mono";
      return;
    }
    let m = monos[this.elegido];
    this.mono = new Mono(0, 0, m.tipo, m.nombre, m.apodo, m.rasgo);
    print("mono elegido: " + m.nombre);
    this.n = 0;
    this.fuerza = 100;
    this.desmayos = 0;
    this.cambiarEstado("instrucciones");
  }

  siguiente() {
    if (this.n < 2) {
      this.n++;
      this.cambiarEstado("instrucciones");
    } else {
      this.cambiarEstado("cierre");
    }
  }

  //  eventos que llegan desde mousePressed, mouseReleased y keyPressed 
  clic() {
    if (this.estado === "inicio") {
      if (btnEmpezar.mouseEncima()) this.cambiarEstado("elegir");
    } else if (this.estado === "elegir") {
      for (let i = 0; i < monos.length; i++) if (monos[i].mouseEncima()) this.elegirMono(i);
      if (this.elegido >= 0 && btnListo.mouseEncima()) this.confirmarMono();
    } else if (this.estado === "instrucciones") {
      if (this.listo() && btnJugar.mouseEncima()) this.cambiarEstado("juego");
    } else if (this.estado === "juego") {
      this.niveles[this.n].clic();
    } else if (this.estado === "reflexion") {
      if (this.listo() && btnSeguir.mouseEncima()) this.siguiente();
    } else if (this.estado === "cierre") {
      if (this.listo() && btnOtraVez.mouseEncima()) {
        this.n = 0;
        this.fuerza = 100;
        this.desmayos = 0;
        this.cambiarEstado("instrucciones");
      }
      if (this.listo() && btnCambiar.mouseEncima()) this.cambiarEstado("elegir");
    }
  }

  soltar() {
    if (this.estado === "juego") this.niveles[this.n].soltar();
  }

  tecla() {
    if (this.estado === "inicio") this.cambiarEstado("elegir");
    else if (this.estado === "elegir") this.confirmarMono();
    else if (this.estado === "instrucciones" && this.listo()) this.cambiarEstado("juego");
    else if (this.estado === "juego") this.niveles[this.n].tecla();
    else if (this.estado === "reflexion" && this.listo()) this.siguiente();
  }

  //  dibujo de cada estado 
  dibujar() {
    this.tEstado++;
    if (this.estado === "inicio") this.dibujarInicio();
    else if (this.estado === "elegir") this.dibujarElegir();
    else if (this.estado === "instrucciones") this.dibujarInstrucciones();
    else if (this.estado === "juego") this.dibujarJuego();
    else if (this.estado === "reflexion") this.dibujarReflexion();
    else if (this.estado === "cierre") this.dibujarCierre();
    dibujarConfeti();
    if (this.estado === "juego") this.dibujarFlotantes();
    this.dibujarAviso();
  }

  // título de collage: papel crema + bloque rosa
  dibujarTitulo(x, y, s) {
    push();
    translate(x, y);
    scale(s);
    rotate(-2);
    noStroke();
    fill(ROSA_FUERTE);
    rect(25, 55, 520, 70);
    stroke(CARBON);
    strokeWeight(2);
    fill(CREMA);
    rect(-15, -12, 430, 70);
    noStroke();
    fill(CARBON);
    titulo(52);
    text("LA REGLA", -15, -10);
    fill(CREMA);
    text("INCÓMODA", 25, 57);
    pop();
  }

  // ESTADO 1: INICIO
  dibujarInicio() {
    this.dibujarTitulo(450, 115, 1);
    fill(CARBON);
    noStroke();
    mano(22);
    textLeading(40);
    text("un juego sobre las reglas que cargamos, las que rompemos y las que bailamos", 450, 258, 820, 80);
    for (let i = 0; i < monos.length; i++) {
      monos[i].animar();
      monos[i].cara = "feliz";
      monos[i].mostrarEn(monos[i].x, 430, 0.85);
    }
    titulo(13);
    fill(CARBON);
    text("UNAS REGLAS CUIDAN. OTRAS APRIETAN.", 450, 480);
    btnEmpezar.mostrar();
  }

  // ESTADO 2: ELEGIR MONO
  dibujarElegir() {
    this.dibujarTitulo(450, 52, 0.45);
    fill(CARBON);
    noStroke();
    titulo(17);
    text("¿QUIÉN VA A CRUZAR LAS TRES REGLAS?", 450, 140);
    let txt = this.mensaje;
    for (let i = 0; i < monos.length; i++) {
      monos[i].actualizarSeleccion();
      monos[i].mostrarSeleccion();
      if (monos[i].mouseEncima()) txt = monos[i].apodo + ": " + monos[i].rasgo;
    }
    fill(CARBON);
    noStroke();
    titulo(14);
    text(txt, 450, 475);
    if (this.elegido >= 0) btnListo.mostrar();
  }

  // ESTADO 3: INSTRUCCIONES (una tarjeta por nivel)
  dibujarInstrucciones() {
    let lvl = this.niveles[this.n];
    push();
    translate(450, 265);
    rotate(-1);
    sombra(0, 0, 640, 400, 12);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(CREMA);
    rect(0, 0, 640, 400, 12);
    noStroke();
    fill(MANTEQUILLA);
    rect(-215, -200, 170, 32, 2);
    fill(CARBON);
    titulo(13);
    text("nivel " + (this.n + 1) + " de 3", -215, -202);
    titulo(38);
    text(lvl.nombre, 0, -135);
    // la regla incómoda del nivel
    fill(ROSA);
    rect(0, -70, 560, 46, 3);
    fill(CARBON);
    titulo(15);
    text("la regla incómoda dice: «" + lvl.reglaIncomoda + "»", 0, -72);
    // cómo se juega, con iconitos
    titulo(13);
    text("CÓMO SE JUEGA", 0, -15);
    for (let i = 0; i < lvl.pasos.length; i++) {
      let y = 30 + i * 46;
      dibujarIcono(lvl.pasos[i][0], -230, y);
      noStroke();
      fill(CARBON);
      titulo(14);
      textAlign(LEFT, CENTER);
      text(lvl.pasos[i][1], -195, y - 2);
      textAlign(CENTER, CENTER);
    }
    pop();
    this.mono.animar();
    this.mono.mostrarEn(110, 590, 0.55);
    btnJugar.mostrar();
  }

  // ESTADO 4: JUEGO
  dibujarJuego() {
    let lvl = this.niveles[this.n];
    lvl.actualizar();
    // el mono muestra lo cansado que está
    this.mono.cansancio += (1 - this.fuerza / 100 - this.mono.cansancio) * 0.1;
    // sin nada de fuerza el mono se desmaya y el nivel se acaba
    if (this.fuerza <= 0 && !lvl.terminado) {
      lvl.terminar();
      lvl.diario = "me quedé sin fuerzas a mitad de camino. " + lvl.diario;
      lvl.estrellas = 0;
      this.desmayado = true;
      this.desmayos++;
      this.alertar("el mono se quedó sin fuerzas. tantas decisiones que pesan cansan mucho.");
      print("se desmayó en el nivel " + (this.n + 1));
    }
    if (this.desmayado) this.mono.cara = "triste";
    lvl.mostrar();
    if (this.desmayado) {
      noStroke();
      fill(CARBON);
      titulo(18);
      text("z z z", 470 + onda(tiempo * 3) * 10, 230 - (tiempo % 60) * 0.5);
    }

    // cabecera con el nombre del nivel
    sombra(150, 40, 260, 50, 12);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    rect(150, 40, 260, 50, 12);
    noStroke();
    fill(CARBON);
    titulo(11);
    text("nivel " + (this.n + 1) + " de 3", 150, 27);
    fill(ROSA_FUERTE);
    titulo(15);
    text(lvl.nombre, 150, 52);
    lvl.mostrarHUD();
    this.dibujarFuerza();

    // instrucciones siempre visibles abajo
    sombra(450, 592, 870, 36, 18);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    rect(450, 592, 870, 36, 18);
    noStroke();
    fill(CARBON);
    titulo(11);
    text(lvl.instruccion, 450, 590, 840, 34);

    // cuando el nivel termina, espera un momento y pasa a la reflexión
    if (lvl.terminado) {
      this.espera++;
      let tope = 50;
      if (this.desmayado) tope = 200; // da tiempo de leer que se desmayó
      if (this.espera > tope) this.cambiarEstado("reflexion");
    }
  }

  // ESTADO 5: REFLEXIÓN (el diario del mono + la enseñanza + una pregunta)
  dibujarReflexion() {
    let lvl = this.niveles[this.n];
    push();
    translate(450, 250);
    rotate(-0.6);
    sombra(0, 0, 700, 400, 12);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(CREMA);
    rect(0, 0, 700, 400, 12);
    // renglones de cuaderno
    stroke(217, 137, 154, 90);
    strokeWeight(1);
    for (let y = -120; y < 40; y += 28) line(-330, y, 330, y);
    noStroke();
    fill(MANTEQUILLA);
    rect(-200, -200, 300, 32, 2);
    fill(CARBON);
    titulo(13);
    text("diario de " + this.mono.apodo + " · nivel " + (this.n + 1), -200, -202);
    // estrellas ganadas en el nivel
    for (let i = 0; i < 3; i++) {
      stroke(CARBON);
      strokeWeight(1.2);
      if (i < lvl.estrellas) fill(ROSA_FUERTE);
      else fill(CREMA);
      formaEstrella(250 + i * 34, -165, 14);
    }
    noStroke();
    fill(CARBON);
    titulo(11);
    text("fuerza: " + entero(this.fuerza), 284, -138);
    // lo que escribió el mono, con su letra
    noStroke();
    fill(CARBON);
    mano(19);
    textLeading(34);
    text(lvl.diario, 0, -72, 610, 140);
    // la enseñanza, con la letra de las reglas
    fill(ROSA_FUERTE);
    titulo(15);
    textLeading(22);
    text(lvl.ensenanza, 0, 45, 600, 60);
    // pregunta para pensar
    fill(ROSA);
    rect(0, 140, 640, 70, 3);
    fill(CARBON);
    titulo(11);
    text("para pensar:", 0, 117);
    mano(17);
    text(lvl.pregunta, 0, 149, 610, 50);
    pop();
    this.mono.animar();
    this.mono.cara = "feliz";
    this.mono.mostrarEn(110, 590, 0.55);
    btnSeguir.mostrar();
  }

  // ESTADO 6: CIERRE (resumen, mi postura y volver a empezar)
  dibujarCierre() {
    this.dibujarTitulo(450, 48, 0.42);

    // el mono celebra saltando
    if (this.saltoY >= 0 && this.tEstado % 60 === 0) this.saltoV = -9;
    this.saltoV += 0.6;
    this.saltoY += this.saltoV;
    if (this.saltoY > 0) {
      this.saltoY = 0;
      this.saltoV = 0;
    }
    this.mono.animar();
    this.mono.cara = "feliz";
    this.mono.mostrarEn(160, 420 + this.saltoY, 1.15);

    // tarjeta con lo que pasó en cada nivel
    push();
    translate(570, 258);
    rotate(0.8);
    sombra(0, 0, 560, 260, 12);
    stroke(CARBON);
    strokeWeight(1.5);
    fill(CREMA);
    rect(0, 0, 560, 260, 12);
    noStroke();
    fill(MANTEQUILLA);
    rect(-170, -130, 210, 32, 2);
    fill(CARBON);
    titulo(13);
    text("lo que pasó", -170, -132);
    let total = 0;
    for (let i = 0; i < 3; i++) total += this.niveles[i].estrellas;
    fill(ROSA_FUERTE);
    titulo(13);
    text("estrellas: " + total + " de 9", 170, -112);
    fill(CARBON);
    titulo(11);
    let fin = "fuerza al final: " + entero(this.fuerza);
    if (this.desmayos > 0) fin += " · se desmayó " + this.desmayos + " vez";
    if (this.desmayos > 1) fin += "es";
    text(fin, 0, 118);
    for (let i = 0; i < 3; i++) {
      let y = -75 + i * 42;
      stroke(CARBON);
      strokeWeight(1.5);
      fill(ROSA_FUERTE);
      formaEstrella(-240, y, 11);
      noStroke();
      fill(CARBON);
      titulo(13);
      textAlign(LEFT, CENTER);
      text(this.niveles[i].resumen, -215, y - 2);
      textAlign(CENTER, CENTER);
    }
    fill(ROSA_FUERTE);
    titulo(14);
    textLeading(22);
    text("UNAS REGLAS CUIDAN, OTRAS APRIETAN. CRECER ES APRENDER A DISTINGUIRLAS.", 0, 68, 500, 60);
    pop();

    fill(CARBON);
    noStroke();
    mano(19);
    textLeading(34);
    text("soltar las que pesan, guardar las que abrigan, y bailar aunque alguien diga qué oso.", 450, 448, 800, 80);
    mano(15);
    text("un juego de maria jose guerrero", 450, 503);

    btnOtraVez.mostrar();
    btnCambiar.mostrar();
  }

  // avisos y mensajes de error
  dibujarAviso() {
    if (this.alertaT > 0) {
      this.alertaT--;
      let a = limitar(this.alertaT * 8, 0, 255);
      noStroke();
      fill(46, 46, 46, a * 0.12);
      rect(451, 262, 580, 70, 18);
      stroke(224, 82, 122, a);
      strokeWeight(2);
      fill(246, 241, 230, a);
      rect(450, 258, 580, 70, 18);
      noStroke();
      fill(224, 82, 122, a);
      circle(192, 258, 34);
      fill(246, 241, 230, a);
      titulo(20);
      text("!", 192, 256);
      fill(46, 46, 46, a);
      titulo(12);
      textLeading(19);
      text(this.alerta, 470, 256, 480, 60);
      return;
    }
    if (this.avisoT <= 0) return;
    this.avisoT--;
    sombra(450, 238, 440, 34, 17);
    stroke(CARBON);
    strokeWeight(1.2);
    fill(MANTEQUILLA);
    rect(450, 238, 440, 34, 17);
    noStroke();
    fill(CARBON);
    titulo(13);
    text(this.aviso, 450, 237);
  }

  // etiqueta arriba a la derecha con el estado actual
  dibujarEtiqueta() {
    let nombres = ["inicio", "elegir", "instrucciones", "juego", "reflexion", "cierre"];
    let num = 1;
    for (let i = 0; i < nombres.length; i++) if (nombres[i] === this.estado) num = i + 1;
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    rect(800, 22, 180, 26, 13);
    noStroke();
    fill(CARBON);
    titulo(11);
    text("pantalla " + num + "/6 · " + this.estado, 800, 20);
  }
}


//  6. VARIABLES GLOBALES 

// paleta del moodboard
let MANTEQUILLA = "#F3EDA3";
let ROSA = "#D9899A";
let ROSA_FUERTE = "#E0527A";
let CREMA = "#F6F1E6";
let CAFE = "#8B6B46";
let CARBON = "#2E2E2E";
let GRIS = "#A7A7A7";
let BEIGE = "#EADFC8";

// color del fondo (rosado clarito para que el juego resalte)
let FONDO = "#F9DDE5";

// música (el nombre tiene que ser igual al del archivo que subiste)
let ARCHIVO_CANCION = "let-me-love-you.mp3";
let cancion = null;
let amplitud = null;
let musicaLista = false;
let musicaEmpezo = false;
let musicaPausada = false;
let SEGUNDO_FIESTA = 60; // en qué segundo de la canción empieza la fiesta del nivel 3

let PISO = 470; // altura del piso
let tiempo = 0; // contador propio de cuadros

// puntos de una estrella de 5 puntas de radio 1 (calculados de antemano)
let PUNTOS_ESTRELLA = [
  [0, -1], [0.2645, -0.364], [0.9511, -0.309], [0.428, 0.1391], [0.5878, 0.809],
  [0, 0.45], [-0.5878, 0.809], [-0.428, 0.1391], [-0.9511, -0.309], [-0.2645, -0.364]
];

// objetos del juego
let fondo;
let juego;
let estrellas = [];
let monos = [];
let papelitos = [];
let btnEmpezar, btnListo, btnJugar, btnSeguir, btnOtraVez, btnCambiar;


//  7. SETUP 
function setup() {
  createCanvas(900, 620);
  angleMode(DEGREES);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  fondo = new Fondo();

  // estrellas decorativas de los menús
  for (let i = 0; i < 9; i++) {
    estrellas.push(new Estrella(random(30, 870), random(30, 590)));
  }

  // los cinco monos, cada uno con su nombre y su manía
 
  let nombres = ["MIMÍ", "FRESA", "CANELA", "TATO", "LUNA"];
  let apodos = ["mimí", "fresa", "canela", "tato", "luna"];
  let rasgos = [
    "lee la letra pequeña de todo",
    "saluda a todos, aunque no le devuelvan el saludo",
    "pide permiso hasta para estornudar",
    "se pone música para no oír los no",
    "colecciona deseos que todavía no se atreve a pedir"
  ];
  let i = 0;
  while (i < 5) {
    monos.push(new Mono(130 + i * 160, 280, i, nombres[i], apodos[i], rasgos[i]));
    i++;
  }

 
  btnEmpezar = new Boton(450, 540, 240, 50, "empezar", MANTEQUILLA);
  btnListo = new Boton(450, 545, 220, 50, "¡listo!", MANTEQUILLA);
  btnJugar = new Boton(450, 555, 220, 50, "jugar", MANTEQUILLA);
  btnSeguir = new Boton(450, 555, 220, 50, "seguir", MANTEQUILLA);
  btnOtraVez = new Boton(330, 555, 230, 50, "jugar otra vez", MANTEQUILLA);
  btnCambiar = new Boton(590, 555, 250, 50, "cambiar mono", CREMA);

  juego = new Juego();
  juego.cambiarEstado("inicio");

  // la canción se carga aparte; cuando está lista se llama cancionLista()
  // (si la librería de sonido no está en index.html, el juego sigue sin música)
  if (typeof loadSound === "function") {
    cancion = loadSound(ARCHIVO_CANCION, cancionLista, cancionError);
  }
}


//  8. DRAW 
function draw() {
  tiempo++;
  push();
  // la pantalla tiembla cuando algo duele o pesa
  if (juego.temblor > 0) {
    translate(random(-4, 4), random(-4, 4));
    juego.temblor--;
  }
  fondo.mostrar();
  // las estrellas decorativas solo fuera del juego
  if (juego.estado !== "juego") {
    for (let i = 0; i < estrellas.length; i++) {
      estrellas[i].actualizar();
      estrellas[i].mostrar();
    }
  }
  juego.dibujar();
  pop();
  juego.dibujarEtiqueta();
  dibujarBotonMusica();

  // si la canción se acabó, vuelve a empezar
  if (musicaEmpezo && !musicaPausada && tiempo % 120 === 0 && !cancion.isPlaying()) {
    cancion.play();
  }
}


//  9. FUNCIONES 

// letra de las reglas y de todo lo que hay que leer rápido (Aboreto)
function titulo(tam) {
  textFont("Aboreto");
  textSize(tam);
  textAlign(CENTER, CENTER);
}

// letra a mano del mono (Beth Ellen)
function mano(tam) {
  textFont("Beth Ellen");
  textSize(tam);
  textAlign(CENTER, CENTER);
}

// quita los decimales de un número positivo
function entero(v) {
  return v - (v % 1);
}

// la canción terminó de cargar
function cancionLista() {
  musicaLista = true;
  amplitud = new p5.Amplitude();
  print("canción cargada");
}

// no se encontró la canción
function cancionError() {
  print("no encontré la canción: revisa que se llame " + ARCHIVO_CANCION);
}

// el navegador solo deja sonar música después de un clic o una tecla
function encenderMusica() {
  userStartAudio(); // despierta el sonido del navegador
  if (musicaLista && !musicaEmpezo && !musicaPausada) {
    cancion.play();
    musicaEmpezo = true;
  }
}

// qué tan fuerte suena la canción ahora (de 0 a 1); sin música, un pulso suave
function nivelMusica() {
  if (amplitud !== null && musicaEmpezo && !musicaPausada) {
    return limitar(amplitud.getLevel() * 3, 0, 1);
  }
  return 0;
}

// en la fiesta la canción salta a la parte más bailable
function irAlCoro() {
  if (!musicaLista || musicaPausada) return;
  if (!cancion.isPlaying()) cancion.play();
  musicaEmpezo = true;
  if (SEGUNDO_FIESTA < cancion.duration()) cancion.jump(SEGUNDO_FIESTA);
}

// botoncito redondo para pausar o seguir la música
function dibujarBotonMusica() {
  if (!musicaLista) return;
  stroke(CARBON);
  strokeWeight(1.2);
  fill(CREMA);
  circle(686, 22, 28);
  noStroke();
  fill(CARBON);
  ellipse(682, 28, 8, 6);
  stroke(CARBON);
  strokeWeight(1.5);
  line(686, 28, 686, 14);
  line(686, 14, 692, 17);
  if (musicaPausada) {
    stroke(ROSA_FUERTE);
    strokeWeight(2.5);
    line(676, 12, 696, 32);
  }
}

// clic sobre el botón de música: pausa o sigue
function clicMusica() {
  if (!musicaLista) return false;
  if (mouseX > 672 && mouseX < 700 && mouseY > 8 && mouseY < 36) {
    if (cancion.isPlaying()) {
      cancion.pause();
      musicaPausada = true;
    } else {
      musicaPausada = false;
      userStartAudio();
      cancion.play();
      musicaEmpezo = true;
    }
    return true;
  }
  return false;
}

// estrella de 5 puntas en (x, y) con radio r
function formaEstrella(x, y, r) {
  beginShape();
  for (let i = 0; i < PUNTOS_ESTRELLA.length; i++) {
    vertex(x + PUNTOS_ESTRELLA[i][0] * r, y + PUNTOS_ESTRELLA[i][1] * r);
  }
  endShape(CLOSE);
}

// onda triangular entre -1 y 1 (para animar sin sin())
function onda(t) {
  let m = t % 360;
  if (m < 0) m = m + 360;
  if (m < 90) return m / 90;
  if (m < 270) return (180 - m) / 90;
  return (m - 360) / 90;
}

// deja un número entre un mínimo y un máximo
function limitar(v, mn, mx) {
  if (v < mn) return mn;
  if (v > mx) return mx;
  return v;
}

// confeti en (x, y)
function explotarEn(x, y, n, cols) {
  if (cols === undefined) cols = [ROSA, ROSA_FUERTE, MANTEQUILLA, CREMA];
  for (let i = 0; i < n; i++) papelitos.push(new Papelito(x, y, random(cols)));
}

// mueve, dibuja y borra el confeti que ya cayó
function dibujarConfeti() {
  let vivos = [];
  for (let i = 0; i < papelitos.length; i++) {
    papelitos[i].actualizar();
    papelitos[i].mostrar();
    if (papelitos[i].vida > 0) vivos.push(papelitos[i]);
  }
  papelitos = vivos;
}

// piso de los niveles 1 y 3
function dibujarPiso() {
  noStroke();
  fill(214, 198, 170);
  rect(450, PISO + 75, 900, 150);
  stroke(CARBON);
  strokeWeight(3);
  line(0, PISO, 900, PISO);
}

// marcador en forma de pastilla con iconito a la izquierda
function marcador(x, y, txt, icono) {
  sombra(x, y, 200, 32, 16);
  stroke(CARBON);
  strokeWeight(1.2);
  fill(CREMA);
  rect(x, y, 200, 32, 16);
  noStroke();
  fill(MANTEQUILLA);
  circle(x - 84, y, 24);
  dibujarMiniIcono(icono, x - 84, y);
  fill(CARBON);
  titulo(13);
  text(txt, x + 12, y - 2);
}

// iconitos de los marcadores
function dibujarMiniIcono(tipo, x, y) {
  noStroke();
  if (tipo === "paraguas") {
    fill(ROSA_FUERTE);
    arc(x, y + 1, 16, 14, 180, 360);
    stroke(CARBON);
    strokeWeight(1.2);
    line(x, y + 1, x, y + 7);
  } else if (tipo === "piedra") {
    fill(GRIS);
    ellipse(x, y + 1, 15, 11);
    fill(220, 220, 220);
    ellipse(x - 3, y - 1, 5, 3);
  } else if (tipo === "corazon") {
    dibujarCorazon(x, y - 2, 7);
  } else if (tipo === "estrella") {
    fill(ROSA_FUERTE);
    formaEstrella(x, y, 8);
  } else if (tipo === "nota") {
    fill(CARBON);
    ellipse(x - 2, y + 5, 7, 5);
    stroke(CARBON);
    strokeWeight(1.5);
    line(x + 1, y + 5, x + 1, y - 7);
    line(x + 1, y - 7, x + 6, y - 4);
  } else if (tipo === "reloj") {
    stroke(CARBON);
    strokeWeight(1.2);
    fill(CREMA);
    circle(x, y, 15);
    line(x, y, x, y - 5);
    line(x, y, x + 4, y);
  } else if (tipo === "casa") {
    fill(ROSA);
    rect(x, y + 3, 11, 8);
    fill(ROSA_FUERTE);
    triangle(x - 8, y - 1, x + 8, y - 1, x, y - 8);
  }
}

// sombra suave (dos capas transparentes) debajo de un rectángulo redondeado
function sombra(x, y, w, h, r) {
  noStroke();
  fill(46, 46, 46, 14);
  rect(x + 1, y + 6, w + 6, h + 4, r + 2);
  fill(46, 46, 46, 24);
  rect(x + 1, y + 3, w, h, r);
}

// rectángulo hecho de rayitas
function rectPunteado(x, y, w, h) {
  for (let i = -w / 2; i < w / 2 - 3; i += 9) {
    line(x + i, y - h / 2, x + i + 4, y - h / 2);
    line(x + i, y + h / 2, x + i + 4, y + h / 2);
  }
  for (let j = -h / 2; j < h / 2 - 3; j += 9) {
    line(x - w / 2, y + j, x - w / 2, y + j + 4);
    line(x + w / 2, y + j, x + w / 2, y + j + 4);
  }
}

// iconos de las instrucciones: mouse, tecla o estrellita
function dibujarIcono(tipo, x, y) {
  stroke(CARBON);
  strokeWeight(1.5);
  if (tipo === "mouse") {
    fill(CREMA);
    rect(x, y, 24, 34, 11);
    line(x - 12, y - 4, x + 12, y - 4);
    line(x, y - 17, x, y - 4);
    noStroke();
    fill(ROSA_FUERTE);
    rect(x - 6, y - 10, 9, 10, 4, 0, 0, 0);
  } else if (tipo === "tecla") {
    fill(GRIS);
    rect(x, y + 2, 32, 30, 6);
    fill(CREMA);
    rect(x, y - 1, 24, 22, 4);
    noStroke();
    fill(CARBON);
    titulo(11);
    text("A", x, y - 1);
  } else {
    fill(ROSA_FUERTE);
    formaEstrella(x, y, 11);
  }
}

// corazoncito de "me siento bien"
function dibujarCorazon(x, y, r) {
  noStroke();
  fill(ROSA_FUERTE);
  circle(x - r / 2, y, r);
  circle(x + r / 2, y, r);
  triangle(x - r, y + 1, x + r, y + 1, x, y + r * 1.2);
}

//  10. EVENTOS 

// clic: botones, agarrar o romper reglas, y las estrellas brillan
function mousePressed() {
  if (clicMusica()) return;
  encenderMusica();
  juego.clic();
  for (let i = 0; i < estrellas.length; i++) estrellas[i].destellar();
}

// soltar el clic: dejar una regla en la mochila o en el tablero
function mouseReleased() {
  juego.soltar();
}

// cualquier tecla: avanzar pantallas o saltar en el camino
function keyPressed() {
  encenderMusica();
  juego.tecla();
  return false; // evita que el espacio mueva la página
}