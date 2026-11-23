//Angélica Díaz - 202514825
//Entrega final

//UNBOXED: A DRAGON'S TALE: Es un juego en el que el jugador debe guiar a un dragón hasta la meta utilizando las flechas del teclado para moverse y la barra espaciadora para saltar. Sin embargo, el camino aparentemente seguro esconde una trampa y la solución requiere explorar el escenario y utilizar elementos de la interfaz para avanzar sobre la propia consola.

//El juego propone una reflexión sobre la importancia de cuestionar las instrucciones y los caminos establecidos, en lugar de seguirlos por inercia. A través de sus mecánicas, invita a pensar fuera de la caja para encontrar una solución poco convencional. Después de todo, si eres un dragón, ¿por qué caminar cuando puedes volar?

//Variables para la paleta de colores 
let colVerdeOscuro;
let colVerdeMedio;
let colVerdeClaro;
let colAzulClaro;
let colAzulOscuro;
let colAmarillo;
let colBorde;
let colBlanco;
let colLuzDragon;
let colTurquesa;

//Variables de los objetos del juego
let consola;
let dragon;
let nubes = [];

//Estados
let INTRO = 0;
let INSTRUCCIONES = 1;
let NIVEL1 = 2;
let PERDIO = 3;
let GANO = 4;

//declarar inicio
let estadoActual = INTRO;

// CLASES

class Consola {
  constructor() {
    //Coordenadas fijas que delimitan la pantalla LCD interior
    this.pantallaX = 205;
    this.pantallaY = 65;
    this.pantallaAncho = 490;
    this.pantallaAlto = 340;
    this.trampaAbierta = false;
    this.huecoX = 395;

    //Coordenadas de la cruceta
    this.crucetaX = 42;
    this.crucetaY = 348;
    this.crucetaActiva = false; // Cambia cuando el dragón la pisa
    this.botonAbajoActivo = false; //También cambia
    this.botonArribaActivo = false; //También cambia
  }

  //Comportamiento 1: Dibujar el fondo de la consola, botones y pantalla interior
  display() {
    noStroke();

    //CARCASA EXTERIOR
    fill(colBorde);
    rect(0, 0, width, height);
    fill(colAzulOscuro);
    rect(8, 8, width - 16, height - 16);
    //Brillo superior e izquierdo de la carcasa
    fill(colAzulClaro);
    rect(14, 14, width - 28, 6);
    rect(14, 14, 6, height - 28);

    //PANTALLA LCD INTERIOR
    fill(colAzulClaro);
    rect(this.pantallaX, this.pantallaY, this.pantallaAncho, this.pantallaAlto);

    //Sol
    fill(colAmarillo);
    rect(430, 95, 44, 56);
    rect(424, 101, 56, 44);
    fill(colBlanco);
    rect(436, 103, 12, 6); // Brillo 

    //Estrellitas amarillas de 4 puntas 
    this.dibujarEstrella(255, 105);
    this.dibujarEstrella(635, 105);
    this.dibujarEstrella(380, 195);
    this.dibujarEstrella(515, 195);
    this.dibujarEstrella(235, 250);
    this.dibujarEstrella(446, 235);
    this.dibujarEstrella(655, 250);

    //Pasto
    fill(colBorde);
    rect(this.pantallaX, 380, this.pantallaAncho, 6);
    fill(colVerdeOscuro);
    rect(this.pantallaX, 386, this.pantallaAncho, 19);
    fill(colVerdeMedio);
    rect(this.pantallaX, 386, this.pantallaAncho, 8);
    
    //Detalles amarillos en el pasto
    fill(colAmarillo);
    for (let gx = this.pantallaX + 15; gx < this.pantallaX + this.pantallaAncho - 10; gx += 35) {
      rect(gx, 386, 6, 4);
    }

    //Hueco de la trampa (Se abre en el pasto debajo de donde pisa el dragón)
    if (this.trampaAbierta) {
      fill(colAzulClaro);
      rect(this.huecoX, 380, 115, 25);
      fill(colBorde);
      rect(this.huecoX, 380, 6, 25);
      rect(this.huecoX + 109, 380, 6, 25); 
    }

    //Flecha y banderita (Aparecen durante el juego y los estados de fin)
    if (estadoActual !== INTRO && estadoActual !== INSTRUCCIONES) {
      //Flecha
      fill(colBorde);
      rect(426, 331, 32, 24);  
      rect(454, 319, 8, 48); 
      rect(462, 325, 8, 36); 
      rect(470, 331, 8, 24);
      rect(478, 337, 8, 12); 

      fill(colAmarillo);
      rect(430, 335, 28, 16); 
      rect(458, 323, 4, 40); 
      rect(462, 329, 8, 28);
      rect(470, 335, 8, 16);
      rect(478, 341, 4, 4); 

      fill(colBlanco);
      rect(432, 337, 22, 4); // Brillito flecha

      //Banderita de la meta
      fill(colBorde);
      rect(631, 370, 32, 10); 
      rect(640, 290, 14, 82); 
      rect(637, 280, 20, 14); 
      rect(654, 294, 12, 32); 
      rect(666, 300, 12, 20); 
      rect(678, 306, 8, 8);   

      fill(colVerdeMedio);
      rect(635, 374, 24, 6);  
      fill(colBlanco);
      rect(644, 294, 6, 76);  
      fill(colAmarillo);
      rect(641, 284, 12, 6); 

      fill(colTurquesa);
      rect(654, 298, 12, 24); 
      rect(666, 304, 12, 12); 
      rect(678, 308, 4, 4);   
      fill(colBlanco);
      rect(656, 300, 8, 4); // Brillito bandera
    }

    //Placa inferior central
    this.dibujarPlacaRetro(310, 450, 280, 44);

    //Controles izquierdos (Botones amarillos)
    if (this.botonArribaActivo) {
      this.dibujarCirculoPixel(68, 155, colVerdeClaro);
    } else {
      this.dibujarCirculoPixel(68, 155, colAmarillo);
    }

    if (this.botonAbajoActivo) {
      this.dibujarCirculoPixel(68, 250, colVerdeClaro);
    } else {
      this.dibujarCirculoPixel(68, 250, colAmarillo);
    }

    //Cruceta
    let cx = this.crucetaX;
    let cy = this.crucetaY;
    fill(colBorde);
    rect(cx + 32, cy, 36, 100); // Borde vertical
    rect(cx, cy + 32, 100, 36); // Borde horizontal
    fill(colVerdeOscuro);
    rect(cx + 38, cy + 6, 24, 88); // Sombra interna
    rect(cx + 6, cy + 38, 88, 24);

    //Si el dragón está pisando la cruceta, se ilumina en verde claro
    if (this.crucetaActiva) {
      fill(colVerdeClaro);
    } else {
      fill(colVerdeMedio);
    }
    rect(cx + 38, cy + 6, 20, 84); // Relleno vertical
    rect(cx + 6, cy + 38, 84, 20); // Relleno horizontal

    fill(colBlanco);
    rect(cx + 40, cy + 8, 14, 4); // Brillito superior cruceta
    rect(cx + 8, cy + 40, 28, 4); // Brillito izquierdo cruceta

    //El centro también cambia a amarillo cuando el dragón pisa la cruceta
    if (this.crucetaActiva) {
      fill(colAmarillo);
    } else {
      fill(colTurquesa);
    }
    rect(cx + 44, cy + 44, 12, 12); // Centro de la cruceta

    // Controles derechos
    this.dibujarPlacaRetro(745, 295, 125, 38);
    this.dibujarCirculoPixel(745, 365, colTurquesa);
    this.dibujarCirculoPixel(815, 365, colTurquesa);
  }

  //Comportamiento 2: Dibujar el marco verde hueco ENCIMA del dragón para que pase por debajo
  mostrarMarco() {
    noStroke();

    //Borde oscuro del marco
    fill(colBorde);
    rect(180, 40, 540, 25); 
    rect(180, 405, 540, 25); 
    rect(180, 65, 25, 340); 
    rect(695, 65, 25, 340); 

    //Sombra verde oscura del marco
    fill(colVerdeOscuro);
    rect(186, 46, 528, 13); 
    rect(186, 411, 528, 13); 
    rect(186, 59, 13, 352); 
    rect(701, 59, 13, 352);

    //Color verde principal del marco
    fill(colVerdeMedio);
    rect(186, 46, 522, 13); 
    rect(186, 411, 522, 7);
    rect(186, 59, 13, 352);
    rect(701, 59, 7, 352);

    //Brillito blanco en L del marco
    fill(colBlanco);
    rect(190, 50, 500, 4); // Brillo superior
    rect(190, 50, 4, 350); // Brillo izquierdo
  }

  //Pantalla de inicio dentro de la consola (Estado INTRO)
  mostrarInicio() {
    noStroke();

    //UNBOXED centrado
    push();
    translate(285, 175);
    fill(colBlanco);

    //U
    rect(0, 0, 8, 40);
    rect(30, 0, 8, 40);
    rect(0, 32, 38, 8);

    //N
    rect(50, 0, 8, 40);
    rect(58, 8, 8, 10);
    rect(66, 18, 8, 10);
    rect(74, 0, 8, 40);

    //B
    rect(94, 0, 8, 40);
    rect(102, 0, 22, 8);
    rect(102, 16, 22, 8);
    rect(102, 32, 22, 8);
    rect(124, 8, 8, 8);
    rect(124, 24, 8, 8);

    //O
    rect(144, 0, 8, 40);
    rect(174, 0, 8, 40);
    rect(144, 0, 38, 8);
    rect(144, 32, 38, 8);

    //X
    rect(194, 0, 8, 14);
    rect(224, 0, 8, 14);
    rect(202, 14, 22, 10);
    rect(194, 24, 8, 16);
    rect(224, 24, 8, 16);

    //E
    rect(244, 0, 8, 40);
    rect(252, 0, 28, 8);
    rect(252, 16, 20, 8);
    rect(252, 32, 28, 8);

    //D
    rect(292, 0, 8, 40);
    rect(300, 0, 22, 8);
    rect(300, 32, 22, 8);
    rect(322, 8, 8, 24);
    pop();

    //Cajita blanca con A DRAGON'S TALE
    fill(colBlanco);
    rect(320, 230, 260, 32, 8);
    fill(colAzulOscuro);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text("A DRAGON'S TALE", 450, 247);

    //Botón Play
    let distMousePlay = dist(mouseX, mouseY, 450, 312);
    if (distMousePlay < 30) {
      this.dibujarCirculoPixel(423, 285, colAmarillo);
    } else {
      this.dibujarCirculoPixel(423, 285, colVerdeMedio);
    }
    push();
    translate(450, 312);
    if (distMousePlay < 30) {
      fill(colBorde);
    } else {
      fill(colBlanco);
    }
    rect(-8, -12, 6, 24);
    rect(-2, -8, 6, 16);
    rect(4, -4, 6, 8);
    rect(10, -2, 4, 4);
    pop();
  }

  //Pantalla de Instrucciones (Estado INSTRUCCIONES)
  mostrarInstrucciones() {
    noStroke();

    //Fondo oscuro semitransparente sobre la pantalla
    fill(13, 59, 73, 215);
    rect(this.pantallaX, this.pantallaY, this.pantallaAncho, this.pantallaAlto);

    //YOUR MISSION en Pixel Art centrado
    push();
    translate(340, 86);
    fill(colAmarillo);

    //Y
    rect(0, 0, 4, 12);
    rect(12, 0, 4, 12);
    rect(4, 10, 8, 4);
    rect(6, 14, 4, 10);

    //O
    rect(20, 0, 4, 24);
    rect(32, 0, 4, 24);
    rect(24, 0, 8, 4);
    rect(24, 20, 8, 4);

    //U
    rect(40, 0, 4, 24);
    rect(52, 0, 4, 24);
    rect(44, 20, 8, 4);

    //R
    rect(60, 0, 4, 24);
    rect(64, 0, 8, 4);
    rect(64, 10, 8, 4);
    rect(72, 4, 4, 6);
    rect(68, 14, 4, 4);
    rect(72, 18, 4, 6);

    //M
    rect(92, 0, 4, 24);
    rect(108, 0, 4, 24);
    rect(96, 4, 4, 6);
    rect(104, 4, 4, 6);
    rect(100, 10, 4, 6);

    //I
    rect(116, 0, 10, 4);
    rect(119, 4, 4, 16);
    rect(116, 20, 10, 4);

    //S
    rect(130, 0, 16, 4);
    rect(130, 4, 4, 6);
    rect(130, 10, 16, 4);
    rect(142, 14, 4, 6);
    rect(130, 20, 16, 4);

    //S
    rect(150, 0, 16, 4);
    rect(150, 4, 4, 6);
    rect(150, 10, 16, 4);
    rect(162, 14, 4, 6);
    rect(150, 20, 16, 4);

    //I
    rect(170, 0, 10, 4);
    rect(173, 4, 4, 16);
    rect(170, 20, 10, 4);

    //O
    rect(184, 0, 4, 24);
    rect(196, 0, 4, 24);
    rect(188, 0, 8, 4);
    rect(188, 20, 8, 4);

    //N
    rect(204, 0, 4, 24);
    rect(216, 0, 4, 24);
    rect(208, 6, 4, 6);
    rect(212, 12, 4, 6);
    pop();

    textAlign(CENTER, CENTER);

    //Objetivo
    fill(colBlanco);
    textSize(16);
    textStyle(BOLD);
    text("Get the dragon to the flag!", 450, 130);

    //Controles
    fill(colLuzDragon);
    textSize(14);
    textStyle(NORMAL);
    text("Use the ARROW KEYS to move and SPACE to jump.", 450, 162);

    //Pista
    text("Explore your surroundings, think outside the box,", 450, 192);
    text("and remember...", 450, 212);

    //Cajita blanca destacada (más espaciosa y con texto más grande)
    fill(colBlanco);
    rect(215, 238, 470, 34, 8);
    fill(colAzulOscuro);
    textSize(13);
    textStyle(BOLD);
    text("YOU'RE A DRAGON. WHY WALK WHEN YOU CAN FLY?", 450, 255);

    //Botón START para comenzar el juego
    let distMouseStart = dist(mouseX, mouseY, 450, 312);
    if (distMouseStart < 26) {
      this.dibujarCirculoPixel(423, 287, colAmarillo);
    } else {
      this.dibujarCirculoPixel(423, 287, colVerdeMedio);
    }

    push();
    translate(450, 312);
    if (distMouseStart < 26) {
      fill(colBorde);
    } else {
      fill(colBlanco);
    }
    //Icono de Play
    rect(-8, -12, 6, 24);
    rect(-2, -8, 6, 16);
    rect(4, -4, 6, 8);
    rect(10, -2, 4, 4);
    pop();

    //Texto START debajo del botón
    fill(colBlanco);
    textSize(11);
    textStyle(BOLD);
    text("START", 450, 350);
  }

  //Pantalla de Game Over (Estado PERDIO)
  mostrarGameOver() {
    noStroke();

    //Rectángulo oscuro con transparencia para ver el fondo
    fill(13, 59, 73, 190);
    rect(this.pantallaX, this.pantallaY, this.pantallaAncho, this.pantallaAlto);

    //GAME OVER centrado
    push();
    translate(258, 165);
    fill(colBlanco);

    //G
    rect(0, 0, 8, 40);
    rect(0, 0, 36, 8);
    rect(0, 32, 36, 8);
    rect(28, 20, 8, 20);
    rect(18, 20, 18, 8);

    //A
    rect(46, 8, 8, 32);
    rect(74, 8, 8, 32);
    rect(54, 0, 20, 8);
    rect(46, 20, 36, 8);

    //M
    rect(92, 0, 8, 40);
    rect(100, 8, 8, 10);
    rect(108, 16, 12, 10);
    rect(120, 8, 8, 10);
    rect(128, 0, 8, 40);

    //E
    rect(146, 0, 8, 40);
    rect(154, 0, 28, 8);
    rect(154, 16, 20, 8);
    rect(154, 32, 28, 8);

    //O
    rect(206, 0, 8, 40);
    rect(236, 0, 8, 40);
    rect(206, 0, 38, 8);
    rect(206, 32, 38, 8);

    //V
    rect(254, 0, 8, 26);
    rect(282, 0, 8, 26);
    rect(262, 24, 8, 10);
    rect(274, 24, 8, 10);
    rect(268, 32, 8, 8);

    //E
    rect(300, 0, 8, 40);
    rect(308, 0, 28, 8);
    rect(308, 16, 20, 8);
    rect(308, 32, 28, 8);

    //R
    rect(346, 0, 8, 40);
    rect(354, 0, 22, 8);
    rect(354, 18, 22, 8);
    rect(376, 8, 8, 10);
    rect(370, 26, 8, 8);
    rect(376, 32, 8, 8);
    pop();

    //Cajita blanca con Why walk when you can fly?
    fill(colBlanco);
    rect(305, 225, 290, 32, 8);
    fill(colAzulOscuro);
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(BOLD);
    text("Why walk when you can fly?", 450, 242);

    //Botón retry
    let distMouseRetry = dist(mouseX, mouseY, 450, 312);
    if (distMouseRetry < 30) {
      this.dibujarCirculoPixel(423, 285, colAmarillo);
    } else {
      this.dibujarCirculoPixel(423, 285, colVerdeMedio);
    }

    push();
    translate(450, 312);
    if (distMouseRetry < 30) {
      fill(colBorde);
    } else {
      fill(colBlanco);
    }
    rect(-10, -10, 20, 5);
    rect(5, -10, 5, 20);
    rect(-10, 5, 20, 5);
    rect(-10, -2, 5, 12);
    rect(-14, -6, 12, 4);
    rect(-8, -14, 4, 12);
    pop();
  }

  //Pantalla de Victoria estilo Arcade (Estado GANO)
  mostrarVictoria() {
    noStroke();

    //Filtro oscuro transparente para ver el fondo y la banderita
    fill(13, 59, 73, 190);
    rect(this.pantallaX, this.pantallaY, this.pantallaAncho, this.pantallaAlto);

    //Estrellitas mágicas animadas de celebración
    this.dibujarEstrella(260, 115 + sin(frameCount * 0.1) * 6);
    this.dibujarEstrella(630, 115 + cos(frameCount * 0.1) * 6);
    this.dibujarEstrella(310, 285 + sin(frameCount * 0.12) * 6);
    this.dibujarEstrella(590, 285 + cos(frameCount * 0.12) * 6);
    this.dibujarEstrella(645, 215 + sin(frameCount * 0.08) * 8);

    //YOU WIN! centrado en pixel art 
    push();
    translate(313, 165);
    fill(colAmarillo);

    //Y
    rect(0, 0, 8, 16);
    rect(24, 0, 8, 16);
    rect(8, 16, 16, 10);
    rect(12, 26, 8, 14);

    //O
    rect(40, 0, 8, 40);
    rect(70, 0, 8, 40);
    rect(40, 0, 38, 8);
    rect(40, 32, 38, 8);

    //U
    rect(88, 0, 8, 40);
    rect(118, 0, 8, 40);
    rect(88, 32, 38, 8);

    //W
    rect(140, 0, 8, 40);
    rect(176, 0, 8, 40);
    rect(148, 32, 12, 8);
    rect(164, 32, 12, 8);
    rect(156, 16, 8, 18);

    //I
    rect(194, 0, 20, 8);
    rect(200, 8, 8, 24);
    rect(194, 32, 20, 8);

    //N
    rect(224, 0, 8, 40);
    rect(232, 8, 8, 10);
    rect(240, 18, 8, 10);
    rect(248, 0, 8, 40);

    //!
    rect(266, 0, 8, 26);
    rect(266, 32, 8, 8);
    pop();

    //Cajita blanca con You flew!
    fill(colBlanco);
    rect(370, 225, 160, 32, 8);
    fill(colAzulOscuro);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text("You flew!", 450, 241);

    //Botón Play Again
    let distMousePlayAgain = dist(mouseX, mouseY, 450, 302);
    if (distMousePlayAgain < 28) {
      this.dibujarCirculoPixel(423, 275, colAmarillo);
    } else {
      this.dibujarCirculoPixel(423, 275, colVerdeMedio);
    }

    push();
    translate(450, 302);
    if (distMousePlayAgain < 28) {
      fill(colBorde);
    } else {
      fill(colBlanco);
    }
    //Icono de Play (triangulito pixelado)
    rect(-8, -12, 6, 24);
    rect(-2, -8, 6, 16);
    rect(4, -4, 6, 8);
    rect(10, -2, 4, 4);
    pop();

    //Letrero debajo del botón
    fill(colBlanco);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text("PLAY AGAIN", 450, 338);
  }

  //Botones START - MENU
  dibujarPlacaRetro(x, y, ancho, alto) {
    fill(colBorde);
    rect(x, y, ancho, alto);
    fill(colVerdeOscuro);
    rect(x + 6, y + 6, ancho - 12, alto - 12);
    fill(colVerdeMedio);
    rect(x + 6, y + 6, ancho - 16, alto - 16);
    fill(colBlanco);
    rect(x + 10, y + 10, ancho - 28, 4);
    rect(x + 10, y + 10, 4, alto - 28);
  }

  //Dibuja las estrellitas amarillas de 4 puntas (+)
  dibujarEstrella(x, y) {
    fill(colAmarillo);
    rect(x + 4, y, 4, 12);
    rect(x, y + 4, 12, 4);
    fill(colBlanco);
    rect(x + 4, y + 4, 4, 4);
  }

  //Círculos en pixel art
  dibujarCirculoPixel(x, y, colBoton) {
    push();
    translate(x, y);
    noStroke();

    //Relleno del círculo (dos rectángulos cruzados)
    fill(colBoton);
    rect(12, 6, 30, 42);
    rect(6, 12, 42, 30);

    //Brillo blanco arriba a la izquierda dentro del botón
    fill(colBlanco);
    rect(12, 12, 12, 6);
    rect(12, 18, 6, 6);

    //Borde pixelado del círculo
    fill(colBorde);
    rect(12, 0, 30, 6); 
    rect(12, 48, 30, 6); 
    rect(0, 12, 6, 30); 
    rect(48, 12, 6, 30); 
    rect(6, 6, 6, 6); 
    rect(42, 6, 6, 6); 
    rect(6, 42, 6, 6); 
    rect(42, 42, 6, 6);

    pop();
  }
}

class Dragon {
  constructor(tempX, tempY, tempSize) {
    this.x = tempX;
    this.y = tempY;
    this.size = tempSize;
    this.velocidadY = 0;
    this.gravedad = 0.6;
    this.sueloY = tempY;
    this.limiteIzq = 15;
    this.limiteDer = 790;
    this.cayendoEnTrampa = false;
  }

  //Comportamiento 3: Dibujar al dragón y actualizar su caída
  display() {
    //El dragón cae con la gravedad en el hueco
    this.y = this.y + this.velocidadY;
    this.velocidadY = this.velocidadY + this.gravedad;

    if (this.y >= this.sueloY) {
      this.y = this.sueloY;
      this.velocidadY = 0;
    }

    //Abro un push para poder dibujar el dragón
    push();
    translate(this.x, this.y);
    scale(this.size);
    noStroke();

    //Relleno base del ala
    fill(colVerdeClaro);
    beginShape();
    vertex(4, 32);
    vertex(24, 32);
    vertex(52, 60);
    vertex(52, 72);
    vertex(32, 72);
    vertex(24, 64);
    vertex(12, 56);
    vertex(8, 44);
    vertex(4, 40);
    endShape(CLOSE);

    //Detalles internos del ala y punta de la cola
    fill(colTurquesa);
    beginShape();
    vertex(8, 40);
    vertex(28, 40);
    vertex(12, 56);
    vertex(8, 48);
    endShape(CLOSE);

    beginShape();
    vertex(28, 48);
    vertex(36, 56);
    vertex(24, 64);
    vertex(16, 56);
    endShape(CLOSE);

    beginShape();
    vertex(40, 60);
    vertex(48, 72);
    vertex(32, 72);
    endShape(CLOSE);

    beginShape();
    vertex(4, 100);
    vertex(12, 100);
    vertex(16, 108);
    vertex(4, 112);
    endShape(CLOSE);

    //Relleno de la cabeza y el cuerno
    fill(colVerdeClaro);
    beginShape();
    vertex(48, 16);
    vertex(60, 20);
    vertex(84, 24);
    vertex(92, 32);
    vertex(92, 48);
    vertex(104, 52);
    vertex(104, 64);
    vertex(96, 64);
    vertex(92, 68);
    vertex(56, 68);
    vertex(56, 48);
    vertex(52, 48);
    vertex(52, 28);
    vertex(48, 24);
    endShape(CLOSE);

    //Relleno del cuerpo, cola y patas
    beginShape();
    vertex(52, 64);
    vertex(80, 68);
    vertex(84, 76);
    vertex(92, 84);
    vertex(92, 96);
    vertex(80, 92);
    vertex(68, 92);
    vertex(68, 124);
    vertex(56, 124);
    vertex(48, 112);
    vertex(44, 104);
    vertex(32, 120);
    vertex(8, 120);
    vertex(4, 112);
    vertex(4, 100);
    vertex(16, 108);
    vertex(24, 100);
    vertex(36, 84);
    endShape(CLOSE);

    //Barriga y luz del hocico
    fill(colLuzDragon);
    beginShape();
    vertex(72, 68);
    vertex(80, 68);
    vertex(84, 84);
    vertex(76, 92);
    vertex(64, 92);
    endShape(CLOSE);
    rect(92, 48, 12, 16);

    //Bordes en pixel art con rect()
    fill(colBorde);

    //Borde de la cabeza y cuerno
    rect(44, 12, 8, 4);
    rect(52, 16, 12, 4);
    rect(60, 20, 24, 4);
    rect(84, 24, 4, 8);
    rect(88, 28, 4, 4);
    rect(92, 32, 4, 16);
    rect(96, 48, 8, 4);
    rect(104, 52, 4, 12);
    rect(96, 64, 8, 4);
    rect(76, 68, 20, 4);
    rect(44, 16, 4, 8);
    rect(48, 20, 4, 8);
    rect(52, 28, 8, 4);
    rect(48, 32, 4, 16);
    rect(52, 48, 8, 4);
    rect(56, 48, 4, 20);

    //Borde del ala
    rect(0, 32, 20, 4);
    rect(20, 28, 8, 4);
    rect(28, 32, 4, 4);
    rect(32, 36, 4, 8);
    rect(36, 44, 4, 4);
    rect(40, 48, 4, 8);
    rect(44, 56, 4, 4);
    rect(48, 60, 4, 4);
    rect(0, 32, 4, 12);
    rect(4, 40, 4, 8);
    rect(8, 44, 4, 16);
    rect(12, 56, 4, 4);
    rect(16, 60, 8, 4);
    rect(20, 64, 8, 4);
    rect(28, 68, 4, 8);
    rect(28, 72, 16, 4);

    //Borde de espalda y cola
    rect(36, 76, 12, 4);
    rect(32, 80, 8, 4);
    rect(28, 84, 8, 4);
    rect(24, 88, 8, 4);
    rect(20, 92, 8, 4);
    rect(16, 96, 8, 8);
    rect(12, 100, 8, 8);
    rect(4, 96, 4, 8);
    rect(8, 96, 4, 4);
    rect(0, 104, 4, 12);
    rect(4, 112, 4, 8);
    rect(8, 116, 4, 8);
    rect(8, 120, 24, 4);
    rect(32, 116, 8, 4);
    rect(36, 112, 8, 4);
    rect(40, 104, 8, 8);

    //Borde de brazo y pata
    rect(84, 72, 4, 8);
    rect(88, 76, 4, 8);
    rect(92, 80, 4, 16);
    rect(80, 96, 12, 4);
    rect(80, 88, 4, 8);
    rect(68, 92, 16, 4);
    rect(64, 96, 4, 16);
    rect(68, 104, 4, 20);
    rect(56, 124, 12, 4);
    rect(52, 116, 8, 8);
    rect(48, 108, 4, 12);

    //Ojo y nariz
    rect(72, 40, 8, 16);
    rect(96, 56, 4, 4);
    fill(colBlanco);
    rect(76, 44, 4, 4);

    pop();
  }

  //Comportamiento 4: Moverse a la izquierda o derecha cuando se tiene presionada la tecla
  mover() {
    if (keyIsPressed && this.cayendoEnTrampa === false) {
      if (keyCode === LEFT_ARROW || key === 'ArrowLeft' || key === 'a' || key === 'A') {
        this.x = this.x - 4;
      }
      if (keyCode === RIGHT_ARROW || key === 'ArrowRight' || key === 'd' || key === 'D') {
        this.x = this.x + 4;
      }
    }

    //Solo frena en el borde exterior de toda la consola
    if (this.x < this.limiteIzq) {
      this.x = this.limiteIzq;
    }
    if (this.x > this.limiteDer) {
      this.x = this.limiteDer;
    }
  }

  //Comportamiento 5: Saltar cuando se presiona la barra espaciadora
  saltar() {
    if (this.y >= this.sueloY) {
      this.velocidadY = -12;
    }
  }

  //Comportamiento 6: Relación entre Dragon y Consola usando dist y map
  interactuar(otraConsola) {
    //Coordenadas de los pies del dragón
    let piesX = this.x + 55;
    let piesY = this.y + 112;

    otraConsola.crucetaActiva = false;
    otraConsola.botonAbajoActivo = false;
    otraConsola.botonArribaActivo = false;

    //Se mide la distancia de los pies del dragón a los botones, cruceta y a la trampa del pasto
    let distBotonArriba = dist(piesX, piesY, 95, 155);
    let distBotonAbajo  = dist(piesX, piesY, 95, 250);
    let distCruceta     = dist(piesX, piesY, 92, 380);

    //Si pisa el pasto en la zona de la trampa (465 a 590), se abre el piso
    if (piesX >= 465 && piesX <= 590 && piesY >= 375 && this.cayendoEnTrampa === false) {
      otraConsola.trampaAbierta = true;
      otraConsola.huecoX = this.x - 9;
      this.cayendoEnTrampa = true;
    }

    //Si aterriza en la meta (de 590 hasta el final de la pantalla)
    if (piesX > 590 && piesX < otraConsola.pantallaX + otraConsola.pantallaAncho && piesY >= 375 && this.cayendoEnTrampa === false) {
      estadoActual = GANO;
    }

    //Si ya cayó en la trampa, se va directo al vacío y al caer pasa a PERDIO
    if (this.cayendoEnTrampa) {
      this.sueloY = 1500;
      if (this.y > 1400) {
        estadoActual = PERDIO;
      }
    }
    //Botón amarillo de arriba
    else if (distBotonArriba < 30 && piesY <= 165 && this.velocidadY >= 0) {
      this.sueloY = 43;
      otraConsola.botonArribaActivo = true;
    }
    //Botón amarillo de abajo 
    else if (distBotonAbajo < 30 && piesY <= 260 && this.velocidadY >= 0) {
      this.sueloY = 138;
      otraConsola.botonAbajoActivo = true;
    }
    //Brazo horizontal de la cruceta
    else if (distCruceta < 50 && piesY <= 390 && this.velocidadY >= 0) {
      this.sueloY = 268;
      otraConsola.crucetaActiva = true;
    }
    //Si está dentro de la pantalla LCD, pisa el pasto
    else if (piesX > otraConsola.pantallaX && piesX < otraConsola.pantallaX + otraConsola.pantallaAncho) {
      this.sueloY = 268;
    }
    //Si no pisa nada, cae al fondo de la consola
    else {
      this.sueloY = 395;
    }

    //Revisar si el dragón cae encima de alguna nube del arreglo
    for (let nube of nubes) {
      let distNube = dist(piesX, piesY, nube.x + 48, nube.y + 15);
      if (distNube < 48 && piesY <= nube.y + 25 && this.velocidadY >= 0) {
        this.sueloY = nube.y - 97;
      }
    }
  }
}

class Nube {
  constructor(tempX, tempY) {
    this.x = tempX;
    this.y = tempY;
  }

  //Dibujar la nube en pixel art
  display() {
    push();
    translate(this.x, this.y);
    noStroke();

    //Relleno principal plano
    fill(colLuzDragon);
    rect(28, 4, 28, 36);
    rect(20, 8, 44, 32);
    rect(12, 16, 68, 24);
    rect(4, 24, 88, 12);

    //Sombrita inferior
    fill(colVerdeClaro);
    rect(4, 30, 88, 6);
    rect(16, 34, 64, 6);
    rect(28, 26, 24, 6);

    //Brillito blanco superior
    fill(colBlanco);
    rect(32, 8, 16, 4);
    rect(24, 12, 8, 4);

    //Borde oscuro en pixel art
    fill(colBorde);
    rect(28, 0, 28, 4);
    rect(20, 4, 8, 4);
    rect(56, 4, 8, 4);
    rect(16, 8, 4, 8);
    rect(60, 8, 4, 8);
    rect(64, 12, 12, 4);
    rect(8, 16, 8, 4);
    rect(76, 16, 8, 4);
    rect(4, 20, 4, 4);
    rect(84, 20, 4, 4);
    rect(0, 24, 4, 12);
    rect(88, 24, 4, 4);
    rect(92, 28, 4, 8);
    rect(4, 36, 12, 4);
    rect(80, 36, 12, 4);
    rect(16, 40, 64, 4);

    pop();
  }
}

//SETUP Y DRAW

function setup() {
  createCanvas(900, 520);

  //Paleta de colores
  colVerdeOscuro = color(40, 123, 88); 
  colVerdeMedio  = color(73, 165, 121);  
  colVerdeClaro  = color(151, 213, 190); 
  colAzulClaro   = color(106, 178, 229);
  colAzulOscuro  = color(39, 99, 154);   
  colAmarillo    = color(253, 224, 83);  
  colBorde       = color(13, 59, 73);   
  colBlanco      = color(255, 255, 255);
  colLuzDragon   = color(205, 243, 214); 
  colTurquesa    = color(54, 220, 208);  

  //Objetos principales (escala 0.9 para el dragón)
  consola = new Consola();
  dragon = new Dragon(240, 268, 0.9);

  //Se crean las 4 nubes en el arreglo (abajo, arriba, arriba, abajo)
  nubes.push(new Nube(235, 175));
  nubes.push(new Nube(315, 105));
  nubes.push(new Nube(490, 105));
  nubes.push(new Nube(570, 175));
}

//DRAW
function draw() {
  background(colBorde);

  //ESTADO 0: Pantalla de inicio
  if (estadoActual === INTRO) {
    consola.display();
    consola.mostrarInicio();
    consola.mostrarMarco();
  }

  //ESTADO 1: Pantalla de instrucciones
  if (estadoActual === INSTRUCCIONES) {
    consola.display();
    consola.mostrarInstrucciones();
    consola.mostrarMarco();
  }

  //ESTADO 2: Juego
  if (estadoActual === NIVEL1) {
    //El dragón verifica si pisa el pasto, nubes o cruceta
    dragon.interactuar(consola);

    //Se dibuja el fondo de la consola y la pantalla LCD
    consola.display();

    //Se dibujan las nubes
    for (let nube of nubes) {
      nube.display();
    }

    //Se mueve y se dibuja el dragón
    dragon.mover();
    dragon.display();

    //Se dibuja el marco verde ENCIMA de todo para que el dragón pase por debajo
    consola.mostrarMarco();
  }

  //ESTADO 3: Game Over
  if (estadoActual === PERDIO) {
    consola.display();
    consola.mostrarGameOver();
    consola.mostrarMarco();
  }

  //ESTADO 4: Victoria
  if (estadoActual === GANO) {
    consola.display();

    //Se dibujan las nubes
    for (let nube of nubes) {
      nube.display();
    }

    dragon.display();
    consola.mostrarVictoria();
    consola.mostrarMarco();
  }
}

// EVENTOS

//Hacer clic en play, start, retry o play again
function mousePressed() {
  if (estadoActual === INTRO) {
    let distPlay = dist(mouseX, mouseY, 450, 312);
    if (distPlay < 30) {
      estadoActual = INSTRUCCIONES; // Pasa a las instrucciones
    }
  } else if (estadoActual === INSTRUCCIONES) {
    let distStart = dist(mouseX, mouseY, 450, 312);
    if (distStart < 30) {
      estadoActual = NIVEL1; // Empieza el juego
    }
  } else if (estadoActual === PERDIO) {
    let distRetry = dist(mouseX, mouseY, 450, 312);
    if (distRetry < 30) {
      consola.trampaAbierta = false;
      dragon.x = 240;
      dragon.y = 268;
      dragon.sueloY = 268;
      dragon.velocidadY = 0;
      dragon.cayendoEnTrampa = false;
      estadoActual = NIVEL1;
    }
  } else if (estadoActual === GANO) {
    let distPlayAgain = dist(mouseX, mouseY, 450, 302);
    if (distPlayAgain < 28) {
      consola.trampaAbierta = false;
      dragon.x = 240;
      dragon.y = 268;
      dragon.sueloY = 268;
      dragon.velocidadY = 0;
      dragon.cayendoEnTrampa = false;
      estadoActual = NIVEL1;
    }
  }
}

//Saltos del dragón
function keyPressed() {
  if (keyCode === 32) {
    dragon.saltar();
  }
}