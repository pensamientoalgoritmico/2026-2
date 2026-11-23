// Natalia Yunda Altare
// El juego de los permisos (Juego desobediente)
// El juego cuestiona como las páginas web si nos piden permiso, pero de una manera en la que no entendemos que estamos aceptando. Aceptar es facil (un solo clic) y rechazar cuesta mucho mas. Al final el juego explica una conclusion y muestra cuantas veces se acepto y cuantas se rechazo.
// Pantallas (variable pantalla)  0 = inicio, 1 = terminos y condiciones, 2 = cookies, 3/4 = no soy un robot, 5 = bienvenida con el boton jugar, 6 = conclusion y contadores
// aceptar pasa de una con un solo clic, rechazar hay que oprimirlo varias veces porque se mueve 
//en no soy un robot se oprime el cuadrito y luego hay que oprimir muchos pedazos de imagenes
// el boton jugar se escapa varias veces cuando el mouse se acerca y despues se deja oprimir
// Referentes:
// The Stanley Parable: https://www.stanleyparable.com/
// The Password Game: https://neal.fun/password-game/
// Google reCAPTCHA (el no soy un robot): https://www.google.com/recaptcha/about/
// Banners de cookies y pop-ups reales de paginas web
// Referencia de p5.js: https://p5js.org/reference/

//CLASE FIGURAS
// Son las formas geometricas de mi universo visual que se puse de fondo
class Figura {
  constructor(x, y, tam, tipo, color) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.tipo = tipo; // circulo, triangulo o cuadrado
    this.color = color;
    this.angulo = random(0, 360); // cada una empieza girada distinto
    this.velocidad = random(-1, 1); // cuánto gira y para qué lado
    this.subida = random(0.2, 0.8); // qué tan rápido va arriba
  }
  //flotar
  flotar() {
    this.y -= this.subida;
    // si se sale, vuelve a aparecer por abajo
    if (this.y < -this.tam) {
      this.y = height + this.tam;
    }
  }
  // girar
  girar() {
    this.angulo += this.velocidad;
  }
  //Mostrar
  mostrar() {
    push();
    translate(this.x, this.y); 
    rotate(this.angulo);
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    // dibujar la forma
    if (this.tipo == "circulo") {
      circle(0, 0, this.tam);
    } else if (this.tipo == "triangulo") {
      triangle(0, -this.tam / 2, -this.tam / 2, this.tam / 2, this.tam / 2, this.tam / 2);
    } else {
      rect(0, 0, this.tam, this.tam);
    }
    pop();
  }
}

// CLASE BOTON
//los botones de aceptar, rechazar, jugar y verificar
class Boton {
  constructor(x, y, ancho, alto, texto, colorBase, colorHover, colorTexto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.texto = texto;
    this.colorBase = colorBase;
    this.colorHover = colorHover;
    this.colorTexto = colorTexto;
  }
  //si el jugador esta encima del boton
  tocaJugador(j) {
    if (j.x > this.x && j.x < this.x + this.ancho &&
        j.y > this.y && j.y < this.y + this.alto) {
      return true;
    } else {
      return false;
    }
  }
  // mostrarse
  mostrar() {
    if (this.tocaJugador(jugador)) {
      fill(this.colorHover);
    } else {
      fill(this.colorBase);
    }
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y, this.ancho, this.alto);
    // el texto del boton, su tamano depende de que tan alto es el boton
    fill(this.colorTexto);
    textFont(bold);
    textAlign(CENTER, CENTER);
    textSize(this.alto * 0.4);
    text(this.texto, this.x + this.ancho / 2, this.y + this.alto / 2);
  }
  // moverse a algun lugar random del rectangulo blanco
  // limites para que no se salgan del rectangulo
  moverse(xMin, xMax, yMin, yMax) {
    this.x = random(xMin, xMax);
    this.y = random(yMin, yMax);
  }
}

//CLASE AVISO
// texto de los permisos. al pasar el mouse muestra lo que significa
class Aviso {
  constructor(x, y, ancho, alto, textoConfuso, significado) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.textoConfuso = textoConfuso;
    this.significado = significado;
  }
  tocaJugador(j) {
    if (j.x > this.x && j.x < this.x + this.ancho &&
        j.y > this.y && j.y < this.y + this.alto) {
      return true;
    } else {
      return false;
    }
  }
  // mostrar el texto o la explicacion segun si el jugador esta o no encima del texto
  mostrar() {
    textFont(regular);
    textAlign(LEFT, TOP);
    if (this.tocaJugador(jugador)) {
      fill(255, 0, 68);
      textSize(14);
      text(this.significado, this.x, this.y, this.ancho, this.alto);
    } else {
      // titila entre gris y rojo para que se note que se puede pasar el mouse
      if (frameCount % 60 < 30) {
        fill(150);
      } else {
        fill(255, 0, 68);
      }
      textSize(8);
      text(this.textoConfuso, this.x, this.y, this.ancho, this.alto);
      // letrero chiquito que avisa que se puede pasar el mouse
      textSize(7);
      text("pasa el mouse por aquí", this.x, this.y - 14);
    }
  }
}

//CLASE POPUP
// ventanas de "¿Seguro?" que salen cuando se oprime rechazar
// se mueven por el cuadro blanco y pasan encima de todo
class Popup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ancho = 170;
    this.alto = 80;
    this.vx = random(-2, 2);   // velocidad en x
    this.vy = random(-2, 2);   // velocidad en y
  }
  // se mueven y rebotan en los bordes del cuadro blanco
  moverse() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < panelX) {
      this.x = panelX;
      this.vx = -this.vx;
    }
    if (this.x + this.ancho > panelX + panelAncho) {
      this.x = panelX + panelAncho - this.ancho;
      this.vx = -this.vx;
    }
    if (this.y < panelY) {
      this.y = panelY;
      this.vy = -this.vy;
    }
    if (this.y + this.alto > panelY + panelAlto) {
      this.y = panelY + panelAlto - this.alto;
      this.vy = -this.vy;
    }
  }
  // choque con el boton aceptar (interaccion entre dos clases) si se tocan, la ventana rebota
  chocarCon(boton) {
    if (this.x < boton.x + boton.ancho && this.x + this.ancho > boton.x &&
        this.y < boton.y + boton.alto && this.y + this.alto > boton.y) {
      this.x -= this.vx;
      this.y -= this.vy;
      this.vx = -this.vx;
      this.vy = -this.vy;
    }
  }
  // rectangulo blanco con todo
  mostrar() {
    push();
    fill(255);
    stroke(120);
    strokeWeight(0.5);
    rectMode(CORNER);
    rect(this.x, this.y, this.ancho, this.alto);
    // textos
    noStroke();
    fill(0);
    textAlign(LEFT, TOP);
    textFont(bold);
    textSize(14);
    text("¿Seguro?", this.x + 10, this.y + 20);
    textFont(regular);
    textSize(9);
    text("Rechazar toma más tiempo", this.x + 10, this.y + 50);
    pop();
  }
}

//CLASE CAJA
// la señal de "No soy un robot". al oprimirlo sale un chulo y despues pasa a las imagenes
class Caja {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ancho = 300;
    this.alto = 70;
    this.marcada = false;   // si ya le di clic
    this.espera = 0;        // cuadros que lleva esperando despues del clic
  }
  // si el jugador esta encima del cuadrado
  tocaJugador(j) {
    if (j.x > this.x + 20 && j.x < this.x + 50 &&
        j.y > this.y + 20 && j.y < this.y + 50) {
      return true;
    } else {
      return false;
    }
  }
  // mostrarse
  mostrar() {
    push();
    // rectangulo gris
    fill(240);
    stroke(200);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.x, this.y, this.ancho, this.alto, 6);
    //cuadrado check
    fill(255);
    stroke(150);
    rect(this.x + 20, this.y + 20, 30, 30);
    //el chulo, cuando se oprime la caja
    if (this.marcada) {
      stroke(0, 144, 168);
      strokeWeight(4);
      line(this.x + 26, this.y + 36, this.x + 33, this.y + 43);
      line(this.x + 33, this.y + 43, this.x + 45, this.y + 27);
    }
    // texto
    noStroke();
    fill(0);
    textFont(regular);
    textAlign(LEFT, CENTER);
    textSize(20);
    text("No soy un robot", this.x + 65, this.y + 35);
    pop();
  }
}

//CLASE CASILLA
// cada cuadrito de la cuadricula de pinguinos. muestra un pedazo de una foto
// si le doy clic se borra y despues sale otro pedazo de otra foto
class Casilla {
  constructor(x, y, tam, col, fila) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.col = col;     // en que columna de la foto esta el pedazo
    this.fila = fila;   // en que fila de la foto esta el pedazo
    this.foto = 0;      // que foto muestra (numero de la posicion en el arreglo fotos)
    this.espera = 0;    // cuadros que se queda borrada despues del clic
  }
  // si el jugador esta encima de la casilla
  tocaJugador(j) {
    if (j.x > this.x && j.x < this.x + this.tam &&
        j.y > this.y && j.y < this.y + this.tam) {
      return true;
    } else {
      return false;
    }
  }
  // mostrarse
  mostrar() {
    if (this.espera > 0) {
      // esta borrada, se ve un cuadro gris mientras carga
      noStroke();
      fill(225);
      rectMode(CORNER);
      rect(this.x, this.y, this.tam, this.tam);
      this.espera--;
      // cuando termina de esperar escoge otra foto al azar
      if (this.espera == 0) {
        this.foto = floor(random(fotos.length));
      }
    } else {
      let img = fotos[this.foto];
      // saco un cuadrado de la foto para que el pedazo no se estire
      let lado = img.width;
      if (img.height < lado) {
        lado = img.height;
      }
      let corte = lado / lineas;                  // tamano de cada pedazo
      let inicioX = (img.width - lado) / 2;       // para cortar desde el centro
      let inicioY = (img.height - lado) / 2;
      // image con 9 datos: la foto, donde y que tan grande la dibujo, y de donde y que tanto corto
      image(img, this.x, this.y, this.tam, this.tam,
            inicioX + this.col * corte, inicioY + this.fila * corte, corte, corte);
    }
    // lineas blancas entre las casillas
    noFill();
    stroke(255);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.x, this.y, this.tam, this.tam);
  }
}

//CLASE JUGADOR
// para saber si esta encima de ellas o si le dio clic
class Jugador {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  // seguir el mouse: en cada vuelta del draw copia donde esta el mouse
  seguir() {
    this.x = mouseX;
    this.y = mouseY;
  }
}

//variables
let regular;
let bold;
let fotos = [];
let figuras = [];
let paleta = [];
let aceptar;
let rechazar;
let jugar;           
let verificar;      
let caja;            
let casillas = [];   
let avisos = [];     //aviso por cada permiso
let titulos = ["Términos y condiciones", "Cookies"];
let popups = [];
let jugador;
// ESTADOS DEL JUEGO (la variable pantalla):
// 0 = inicio, 1 = terminos y condiciones, 2 = cookies, 3 = no soy un robot,
// 4 = pinguinos, 5 = bienvenida, 6 = conclusion
let pantalla = 0;
let clicsAceptar = 0;
let clicsRechazar = 0;
let intentos = 0;     // cuantas veces he oprimido rechazar en esta pantalla
let necesarios = 7;   // cuantas veces hay que oprimirlo para pasar
let clicsCaptcha = 0;          // cuantas casillas de pinguinos he oprimido
let necesariosCaptcha = 30;    // cuantas hay que oprimir antes de que verificar sirva
let fotoRonda = 0;             // la foto con la que empieza la cuadricula
let mensaje = "";              // el mensaje que sale al oprimir verificar
let lineas = 4;                // cuantos cuadritos por lado tiene la cuadricula
let escapes = 0;               // cuantas veces se ha escapado el boton jugar
let maxEscapes = 8;            // despues de estas veces ya se deja oprimir
// rectangulo blanco
let panelX = 100;
let panelY = 60;
let panelAncho = 600;
let panelAlto = 380;

async function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);
  // cargo las tipografias, el await espera a que cada una cargue
  regular = await loadFont("fonts/Redaction50-Regular.ttf");
  bold = await loadFont("fonts/Redaction50-Bold.ttf");
  // cargo las 11 fotos una por una, sin for, porque el editor de p5 cree que un for
  // con await adentro es un ciclo infinito (cada vuelta se demora esperando la foto)
  fotos.push(await loadImage("fotos/1.JPG"));
  fotos.push(await loadImage("fotos/2.JPG"));
  fotos.push(await loadImage("fotos/3.JPG"));
  fotos.push(await loadImage("fotos/4.JPG"));
  fotos.push(await loadImage("fotos/5.JPG"));
  fotos.push(await loadImage("fotos/6.JPG"));
  fotos.push(await loadImage("fotos/7.JPG"));
  fotos.push(await loadImage("fotos/8.JPG"));
  fotos.push(await loadImage("fotos/9.JPG"));
  fotos.push(await loadImage("fotos/10.JPG"));
  fotos.push(await loadImage("fotos/11.JPG"));
  textFont(regular);
  // paleta de colores
  paleta = [
    color(255, 0, 68),
    color(104, 140, 32),
    color(0, 144, 168),
    color(72, 64, 64)
  ];
  //creo figuras con un for
  for (let i = 0; i < 14; i++) {
    let x = random(width);
    let y = random(height);
    let tam = random(40, 90);
    // saca un numero entre 0 y 1 y segun donde caiga se elige la forma
    let n = random(1);
    let tipo;
    if (n < 0.33) {
      tipo = "circulo";
    } else if (n < 0.66) {
      tipo = "triangulo";
    } else {
      tipo = "cuadrado";
    }
    // lo mismo para el color, de los de mi paleta
    let m = random(1);
    let c;
    if (m < 0.25) {
      c = paleta[0];
    } else if (m < 0.5) {
      c = paleta[1];
    } else if (m < 0.75) {
      c = paleta[2];
    } else {
      c = paleta[3];
    }
    figuras.push(new Figura(x, y, tam, tipo, c));
  }
  // Aceptar
  aceptar = new Boton(150, 230, 200, 70, "Aceptar", color(0), color(255, 0, 68), color(255));
  // Rechazar(no cambia al pasar el jugador, para que sea mas dificil)
  rechazar = new Boton(560, 330, 60, 22, "Rechazar", color(200), color(200), color(160));
  // Jugar: el boton de la bienvenida, se escapa varias veces antes de dejarse oprimir
  jugar = new Boton(330, 200, 100, 50, "Jugar", color(0), color(255, 0, 68), color(255));
  // Verificar: el boton de abajo de los pinguinos
  verificar = new Boton(420, 388, 100, 34, "VERIFICAR", color(0, 144, 168), color(0, 110, 130), color(255));
  // textos de los permisos, el confuso y lo que significa de verdad
  avisos.push(new Aviso(
    130, 385, 440, 45,
    "Al continuar otorgas una licencia no exclusiva, mundial y transferible sobre tu contenido y datos de uso.",
    "Podemos usar lo que haces y compartirlo con otras empresas."
  ));
  avisos.push(new Aviso(
    130, 385, 440, 45,
    "Usamos cookies de rendimiento y de socios para optimizar tu experiencia.",
    "Seguimos lo que haces en internet para mostrarte anuncios."
  ));
  // el no soy un robot
  caja = new Caja(250, 200);
  // la cuadricula de pinguinos, 4 filas y 4 columnas de casillas de 60
  for (let fila = 0; fila < lineas; fila++) {
    for (let col = 0; col < lineas; col++) {
      casillas.push(new Casilla(280 + col * 60, 125 + fila * 60, 60, col, fila));
    }
  }
  // el jugador
  jugador = new Jugador();
  // empiezo en la pantalla de inicio
  cambiarPantalla(0);
}

function draw() {
  background(0);
  jugador.seguir();
  // fondo de figuras
  for (let figura of figuras) {
    figura.flotar();
    figura.girar();
    figura.mostrar();
  }
  // cuadro blanco
  fill(244);
  noStroke();
  rectMode(CORNER);
  rect(panelX, panelY, panelAncho, panelAlto);

  //Inicio
  if (pantalla == 0) {
    fill(0);
    textFont(bold);
    textAlign(CENTER, TOP);
    textSize(26);
    text("¿Quieres jugar el juego de los permisos?", panelX + 40, panelY + 40, panelAncho - 80);
    aceptar.mostrar();
    rechazar.mostrar();
  }

  // pantalla 1 y 2
  if (pantalla == 1 || pantalla == 2) {
    fill(0);
    textFont(bold);
    textAlign(CENTER, TOP);
    textSize(26);
    text(titulos[pantalla - 1], panelX + 40, panelY + 40, panelAncho - 80);
    aceptar.mostrar();
    rechazar.mostrar();
    avisos[pantalla - 1].mostrar();
  }

  // pantalla 3: no soy un robot
  if (pantalla == 3) {
    fill(0);
    textFont(bold);
    textAlign(CENTER, TOP);
    textSize(26);
    text("Antes de continuar", panelX + 40, panelY + 40, panelAncho - 80);
    caja.mostrar();
    // despues de oprimir el cuadrito espera un momentico y pasa a los pinguinos
    if (caja.marcada) {
      caja.espera++;
      if (caja.espera > 45) {
        cambiarPantalla(4);
      }
    }
  }

  // pantalla 4: pinguinos
  if (pantalla == 4) {
    // el cuadro azul de arriba con la pregunta
    fill(0, 144, 168);
    noStroke();
    rectMode(CORNER);
    rect(280, 70, 240, 50);
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(regular);
    textSize(11);
    text("Selecciona todas las imágenes con", 290, 84);
    textFont(bold);
    textSize(22);
    text("pingüinos", 290, 106);
    // las casillas
    for (let casilla of casillas) {
      casilla.mostrar();
    }
    // el boton y el mensaje
    verificar.mostrar();
    fill(255, 0, 68);
    textFont(regular);
    textAlign(LEFT, TOP);
    textSize(11);
    text(mensaje, 280, 380, 130, 50);
  }

  // pantalla 5: bienvenida
  if (pantalla == 5) {
    fill(0);
    textFont(bold);
    textAlign(CENTER, TOP);
    textSize(26);
    text("Bienvenido al Juego de los Permisos", panelX + 40, panelY + 40, panelAncho - 80);
    // el boton Jugar se escapa cuando el jugador se le acerca, pero solo las primeras veces
    let d = dist(jugador.x, jugador.y, jugar.x + jugar.ancho / 2, jugar.y + jugar.alto / 2);
    if (d < 90 && escapes < maxEscapes) {
      jugar.moverse(panelX + 20, panelX + panelAncho - 120, panelY + 100, panelY + 280);
      escapes++;
    }
    jugar.mostrar();
  }

  // pantalla 6: conclusion y contadores
  if (pantalla == 6) {
    fill(0);
    textFont(bold);
    textAlign(CENTER, TOP);
    textSize(26);
    text("Conclusión", panelX + 40, panelY + 30, panelAncho - 80);
    // la explicacion
    textFont(regular);
    textSize(16);
    text("Los permisos de las páginas web están escritos para que los aceptes sí o sí: letra diminuta, palabras técnicas y botones que confunden. Aceptar es un solo clic y rechazar cuesta mucho más. Entender qué estás aceptando sí es posible, pero cuesta esfuerzo.",
         panelX + 60, panelY + 80, panelAncho - 120);
    // la reflexion
    fill(255, 0, 68);
    textFont(bold);
    textSize(18);
    text('¿A cuántas cosas hemos dicho "acepto" sin saber qué eran?', panelX + 60, panelY + 235, panelAncho - 120);
    // contadores
    fill(0);
    textFont(regular);
    textSize(16);
    text("Oprimiste rechazar: " + clicsRechazar, width / 2, 345);
    text("Oprimiste aceptar: " + clicsAceptar, width / 2, 370);
  }

  // popups de ultimo
  for (let popup of popups) {
    popup.moverse();
    popup.chocarCon(aceptar);
    popup.mostrar();
  }
}

// cambia de pantalla y deja todo listo para la nueva
function cambiarPantalla(n) {
  pantalla = n;
  popups = [];      // borro los popups de la pantalla anterior
  intentos = 0;
  // vuelvo los botones a su lugar
  rechazar.x = 560;
  rechazar.y = 330;
  jugar.x = 330;
  jugar.y = 200;
  if (n == 0) {
    // empezar de nuevo: reinicio todo
    clicsAceptar = 0;
    clicsRechazar = 0;
    aceptar.ancho = 200;
    aceptar.alto = 70;
    rechazar.colorTexto = color(160);
    necesarios = 7;
  } else {
    necesarios = 5;
  }
  // cada vez aceptar sale mas grande y rechazar mas dificil de ver
  if (n == 1) {
    aceptar.ancho = 220;
    aceptar.alto = 80;
  }
  if (n == 2) {
    aceptar.ancho = 280;
    aceptar.alto = 100;
    rechazar.colorTexto = color(205);
  }
  // el no soy un robot empieza sin marcar
  if (n == 3) {
    caja.marcada = false;
    caja.espera = 0;
  }
  // los pinguinos empiezan con una foto al azar completa y sin clics
  if (n == 4) {
    fotoRonda = floor(random(fotos.length));
    for (let casilla of casillas) {
      casilla.foto = fotoRonda;
      casilla.espera = 0;
    }
    clicsCaptcha = 0;
    mensaje = "";
  }
  // la bienvenida empieza con el boton jugar sin haberse escapado
  if (n == 5) {
    escapes = 0;
  }
}

function mousePressed() {
  // en inicio y en los permisos
  if (pantalla <= 2) {
    // reviso primero rechazar por si se le cruza al boton de aceptar
    if (rechazar.tocaJugador(jugador)) {
      clicsRechazar++;
      intentos++;
      // se mueve a otro lugar dentro del cuadro
      rechazar.moverse(panelX + 20, panelX + panelAncho - 80, panelY + 120, panelY + 290);
      // sale un popup nuevo en la parte derecha del cuadro
      popups.push(new Popup(random(panelX + 300, panelX + panelAncho - 180), random(panelY + 20, panelY + panelAlto - 100)));
      // rechazar intentos
      if (intentos >= necesarios) {
        cambiarPantalla(pantalla + 1);
      }
    } else if (aceptar.tocaJugador(jugador)) {
      // aceptas con solo un clic
      clicsAceptar++;
      cambiarPantalla(pantalla + 1);
    }
  }
  // en no soy un robot: oprimir el cuadrito
  if (pantalla == 3) {
    if (caja.tocaJugador(jugador) && caja.marcada == false) {
      caja.marcada = true;
    }
  }
  // en los pinguinos: oprimir casillas y verificar
  if (pantalla == 4) {
    for (let casilla of casillas) {
      // solo cuenta si no esta borrada en ese momento
      if (casilla.tocaJugador(jugador) && casilla.espera == 0) {
        casilla.espera = 25;
        clicsCaptcha++;
      }
    }
    if (verificar.tocaJugador(jugador)) {
      if (clicsCaptcha >= necesariosCaptcha) {
        cambiarPantalla(5);
      } else {
        mensaje = "Todavía quedan pingüinos. Intenta de nuevo";
      }
    }
  }
  // en la bienvenida: oprimir jugar (solo se puede cuando ya dejo de escaparse)
  if (pantalla == 5) {
    if (jugar.tocaJugador(jugador)) {
      cambiarPantalla(6);
    }
  }
}