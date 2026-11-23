// 1. Nombre: Maria Alejandra Contreras
// 2. Nombre del juego: BURBUJA.EXE
// 3. Descripcion: es un juego interactivo sobre la burbuja universitaria, la apatia politica
// y como usamos el algoritmo y las excusas del dia a dia para evadir la realidad del pais.
// uno arranca comodo en el centro y si intenta salir hacia el boton de escapar, el sistema
// te bombardea con pop ups de excusas comunes y te jala de vuelta al centro si te demoras mucho.
// 4. Referentes:
// - Estetica retro / paleta calida [url: https://co.pinterest.com/pin/588634613838803083/]
// - Interfaz de pop ups viejos: [url https://co.pinterest.com/pin/949415165218621547/]
// - Referente conceptual: [- We Become What We Behold (Nicky Case): https://ncase.me/wbwwb/
// - Molleindustria: https://www.molleindustria.org/
// - Cow Clicker (Ian Bogost): https://bogost.com/games/cow_clicker/]

// 5. CLASES
// Cada pop-up es un objeto con su titulo, su mensaje y su posicion.
// Metodos: mostrar() lo dibuja, leDioClic() revisa si le dieron a [Aceptar]
// y estaEncima() revisa si el mouse esta sobre la ventana.
// Cuando apuntaASalir es true el pop-up nace tapando el boton SALIR,
// y cuando es false nace por las afueras de la burbuja.
class PopUp {
  constructor(apuntaASalir) {
    // El tamano depende de escala para que se vea bien en cualquier pantalla
    this.ancho = 300 * escala;
    this.alto = 180 * escala;
    this.enSalir = apuntaASalir;

    // Limites para que el pop-up no se salga del lienzo
    let minX = 10;
    let maxX = width - this.ancho - 10;
    let minY = 10;
    let maxY = height - this.alto - 10;
    if (maxX < minX) { maxX = minX; }
    if (maxY < minY) { maxY = minY; }

    if (apuntaASalir == true) {
      // Lo centro sobre el boton SALIR y le sumo un random pequeno
      // para que lo tape o quede pegado encima
      let centroX = salirX + salirAncho / 2;
      let centroY = salirY + salirAlto / 2;
      this.x = centroX - this.ancho / 2 + random(-this.ancho * 0.3, this.ancho * 0.3);
      this.y = centroY - this.alto / 2 + random(-this.alto * 0.3, this.alto * 0.3);

      if (this.x < minX) { this.x = minX; }
      if (this.x > maxX) { this.x = maxX; }
      if (this.y < minY) { this.y = minY; }
      if (this.y > maxY) { this.y = maxY; }
    } else {
      // Busco un lugar afuera de la burbuja que no tape el boton SALIR.
      // Pruebo varias posiciones al azar hasta que una sirva.
      let intentos = 0;
      let sirve = false;
      while (sirve == false && intentos < 60) {
        intentos = intentos + 1;
        this.x = random(minX, maxX);
        this.y = random(minY, maxY);

        // El punto del pop-up que queda mas cerca del centro de la burbuja
        let cercanoX = width / 2;
        if (cercanoX < this.x) { cercanoX = this.x; }
        if (cercanoX > this.x + this.ancho) { cercanoX = this.x + this.ancho; }
        let cercanoY = height / 2;
        if (cercanoY < this.y) { cercanoY = this.y; }
        if (cercanoY > this.y + this.alto) { cercanoY = this.y + this.alto; }

        let dx = cercanoX - width / 2;
        let dy = cercanoY - height / 2;
        let limite = radioBurbuja + 10;

        sirve = false;
        if (dx * dx + dy * dy > limite * limite) {
          sirve = true;
        }

        // Reviso que no tape el boton SALIR (margen de 15 px)
        if (sirve == true) {
          if (this.x < salirX + salirAncho + 15) {
            if (this.x + this.ancho > salirX - 15) {
              if (this.y < salirY + salirAlto + 15) {
                if (this.y + this.alto > salirY - 15) {
                  sirve = false;
                }
              }
            }
          }
        }
      }
    }

    // Escojo una de las 8 frases al azar. random() da decimales,
    // entonces con un while saco el numero de posicion del arreglo.
    let r = random(0, titulos.length);
    let indice = 0;
    while (indice + 1 < r) {
      indice = indice + 1;
    }
    this.titulo = titulos[indice];
    this.mensaje = mensajes[indice];

    this.cerrado = false;
  }

  mostrar() {
    if (this.cerrado == true) {
      return;
    }

    push();
    translate(this.x, this.y);

    // Cuerpo beige/crema de la ventana, estilo computador viejo
    fill(242, 232, 208);
    stroke(0);
    strokeWeight(2);
    rect(0, 0, this.ancho, this.alto);

    // Barra del titulo en naranja quemado
    fill(220, 85, 25);
    noStroke();
    rect(2, 2, this.ancho - 4, 25 * escala);

    // Boton de cerrar (la X) en fucsia neon. Solo decora, el unico boton que sirve es [Aceptar]
    let xBoton = this.ancho - 25 * escala;
    let yBoton = 2 + 2.5 * escala;
    fill(255, 20, 155);
    rect(xBoton, yBoton, 20 * escala, 20 * escala);
    stroke(255);
    strokeWeight(2);
    line(xBoton + 3 * escala, yBoton + 3 * escala, xBoton + 17 * escala, yBoton + 17 * escala);
    line(xBoton + 17 * escala, yBoton + 3 * escala, xBoton + 3 * escala, yBoton + 17 * escala);

    // Titulo y mensaje. Con text() y un ancho, el texto largo se acomoda
    // solo dentro de la ventana.
    noStroke();
    textFont(fuente);
    textSize(12 * escala);
    textAlign(LEFT, TOP);
    fill(255);
    text(this.titulo, 8 * escala, 8 * escala);
    fill(40, 25, 20);
    text(this.mensaje, 12 * escala, 38 * escala, this.ancho - 24 * escala, this.alto - 85 * escala);

    // Boton [Aceptar] en crema mas oscuro
    fill(210, 198, 175);
    stroke(0);
    strokeWeight(1);
    rect(this.ancho / 2 - 50 * escala, this.alto - 35 * escala, 100 * escala, 25 * escala);

    fill(40, 25, 20);
    noStroke();
    textAlign(CENTER, CENTER);
    text("[Aceptar]", this.ancho / 2, this.alto - 22.5 * escala);
    pop();
  }

  // Reviso si el mouse esta encima del boton [Aceptar] de este pop-up
  leDioClic() {
    if (this.cerrado == true) {
      return false;
    }
    let botonX = this.x + this.ancho / 2 - 50 * escala;
    let botonY = this.y + this.alto - 35 * escala;

    if (mouseX > botonX) {
      if (mouseX < botonX + 100 * escala) {
        if (mouseY > botonY) {
          if (mouseY < botonY + 25 * escala) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Reviso si el mouse esta encima de cualquier parte de la ventana
  estaEncima() {
    if (this.cerrado == true) {
      return false;
    }
    if (mouseX > this.x) {
      if (mouseX < this.x + this.ancho) {
        if (mouseY > this.y) {
          if (mouseY < this.y + this.alto) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

// 6. VARIABLES GLOBALES

// FUENTE
let fuente;

// SONIDO
// canciones tiene las 7 que suenan al azar al entrar y cuando el sistema me jala
// (la 4 no esta porque es la de victoria)
let canciones = [];
let cancionIntro;          // song 9: suena completa en la portada
let cancionVictoria;       // song 4: suena completa solo al ganar
let ultimaCancion = -1;    // cual fue la ultima que sono por castigo (para no repetirla)
let cancionSonando = -1;   // cual esta sonando por castigo (-1 = ninguna)
let analizador;
let sonidoEncendido = false; // el primer clic prende el audio (el navegador lo exige)

// ESTADOS DEL JUEGO
// "inicio" es la portada y "juego" es la burbuja con los pop-ups
let estado = "inicio";

// PALETA DE COLOR (calida, brillante y neon)
let colFondo;
let colFucsia;
let colFucsiaSuave;
let colNaranja;
let colAmarillo;

// TAMANOS (se calculan en setup segun el tamano de la pantalla)
let escala = 1;            // numero con el que escalo textos, botones y pop-ups
let diametroBase = 300;    // tamano con el que empieza la burbuja (se calcula en setup)
let diametroBurbuja = 400;
let radioBurbuja = 200;
let anguloOndas = 0;       // cuanto han girado las ondas (asi no dan saltos al cambiar de fase)
let escalaOndas = 1;       // las ondas se disenaron para una burbuja de 350

// AVATAR
let avatarX;
let avatarY;
let estaAtrapado = false;
let salioDeLaBurbuja = false; // apenas sale una vez, el contador ya no para ni se reinicia
let tiempoAfuera = 0;
// cuantos cuadros (a 60 fps) puedo estar afuera en cada fase antes de que el sistema me jale
// va de 12 segundos en la fase 0 hasta 7 segundos en la fase 5
let limitesJalon = [720, 660, 600, 540, 480, 420];
let contadorPopUp = 0;   // cuenta los cuadros para saber cuando sale otro pop-up
let emojiCursor = "🎧";  // los audifonos son la burbuja

// POP-UPS
let popUps = [];
let totalPopUps = 0;
let turnoPopUp = 0;      // sirve para alternar donde nace cada pop-up nuevo
let puntosSociales = 0;
// cada cuantos cuadros sale un pop-up en cada fase (de 1.4s a 0.75s)
let intervalosPopUp = [84, 75, 66, 58, 50, 45];

// BOTON SALIR Y FASES
// fase es cuantas veces le he dado a SALIR (0 a 5). Con 6 se gana.
let fase = 0;
let totalFases = 6;
let salirX = 0;
let salirY = 0;
let salirAncho = 110;
let salirAlto = 44;
let ganoElJuego = false;

// AVISO TEMPORAL AL SUBIR DE NIVEL
let tiempoAviso = 0;     // cuadros que le faltan al aviso (90 cuadros = 1.5 segundos)
let textoAviso = "";
let avisosNivel = ["NIVEL 2: FILTROS ACTIVADOS", "NIVEL 3: AUMENTANDO DISTRACCIONES", "NIVEL 4: BLOQUEANDO SALIDA", "NIVEL 5: MODO RETENCIÓN", "NIVEL 6: ALERTA CRÍTICA: NO SALGAS"];

// CONTADORES PARA LA PANTALLA FINAL
let excusasAceptadas = 0;
let vecesJalado = 0;

// FRASES DE LOS POP-UPS
// Las 8 frases originales del concepto: un arreglo de titulos y otro de
// mensajes, los dos en el mismo orden.
let titulos = [
  "Filtro de Realidad Incompatible",
  "Saturación de \"Bad Vibes\"",
  "Modo Autocensura Activado",
  "Actualización de Criterio Propio",
  "Alerta de Ruido Exterior",
  "Desvío de Ruta Detectado",
  "Cuota de Empatía Completada",
  "Proyección a Futuro.exe"
];

let mensajes = [
  "Un video sobre la crisis nacional acaba de interrumpir sus Get Ready With Me. ¿Desea marcarlo como 'No me interesa' para que el algoritmo lo devuelva a su zona segura de matcha y skincare?",
  "Su pantalla ha mostrado demasiada desigualdad hoy. ¿Desea limpiar su caché para volver a ver exclusivamente hauls de ropa y rutinas de productividad?",
  "Se ha detectado que está a punto de dar una opinión en un debate. ¿Desea retractarse y decir 'yo la verdad no sé mucho del tema' para evitar cualquier conflicto o funazo en redes?",
  "El sistema está procesando demasiada información incómoda. ¿Desea delegar su postura política a lo que opina su círculo social para no gastar energía pensando?",
  "Sus audífonos con cancelación de ruido se han desconectado. ¿Desea reconectarlos inmediatamente para no escuchar el transporte público y mantener su paz mental intacta?",
  "Su Uber está pasando por un sector que no reconoce. ¿Desea subir la ventana, asegurar los seguros y mirar la pantalla del celular hasta volver a la Zona T?",
  "Felicidades. Ha compartido una infografía sobre la situación del país en sus Close Friends. Su deber ciudadano ha terminado. ¿Desea continuar ignorando el problema real?",
  "Se ha mencionado un problema estructural de su país. ¿Desea responder automáticamente 'por eso apenas me gradúe me voy a hacer la maestría afuera' para desentenderse?"
];

// 7. PRELOAD Y SETUP
function preload() {
  fuente = loadFont("fuente.otf");

  cancionIntro = loadSound("song 9.mp3");
  cancionVictoria = loadSound("song 4.mp3");

  // Las 7 canciones del castigo (me salto la 4 porque es la de victoria)
  canciones[0] = loadSound("song 1.mp3");
  canciones[1] = loadSound("song 2.mp3");
  canciones[2] = loadSound("song 3.mp3");
  canciones[3] = loadSound("song 5.mp3");
  canciones[4] = loadSound("song 6.mp3");
  canciones[5] = loadSound("song 7.mp3");
  canciones[6] = loadSound("song 8.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES); // para que los elipses giren suave

  // Calculo la escala con el lado mas corto de la pantalla
  let lado = height;
  if (width < height) {
    lado = width;
  }
  escala = lado / 600;
  if (escala < 0.7) { escala = 0.7; }
  if (escala > 1.6) { escala = 1.6; }

  diametroBase = 300 * escala;
  diametroBurbuja = diametroBase;
  radioBurbuja = diametroBurbuja / 2;
  escalaOndas = diametroBurbuja / 350;

  // Defino los colores de la paleta una sola vez aqui
  colFondo = color(20, 5, 42);
  colFucsia = color(255, 20, 155);
  colFucsiaSuave = color(255, 20, 155, 60);
  colNaranja = color(255, 115, 0);
  colAmarillo = color(255, 215, 50);

  avatarX = width / 2;
  avatarY = height / 2;

  analizador = new p5.Amplitude();

  // Pongo el boton SALIR en su primera posicion
  colocarSalir();
}

// 8. DRAW
function draw() {
  // La fuente se pone en cada cuadro porque p5 la reinicia
  textFont(fuente);

  if (estado == "inicio") {
    dibujarInicio();
    return;
  }

  // ---------- PANTALLA FINAL ----------
  if (ganoElJuego == true) {
    dibujarFinal();
    return;
  }

  background(colFondo);

  // En el juego los elipses se quedan con un tamano base. Solo reaccionan
  // a la amplitud en la portada, que es donde suena la cancion de inicio.
  // Giran mas rapido en cada fase para generar tension
  anguloOndas = anguloOndas + 0.6 + fase * 0.55;
  dibujarOndas(10, true);

  // LA BURBUJA
  noStroke();
  fill(colFucsiaSuave);
  circle(width / 2, height / 2, diametroBurbuja);
  noFill();
  stroke(colNaranja);
  strokeWeight(3);
  circle(width / 2, height / 2, diametroBurbuja);

  // BOTON SALIR (cambia de lugar y de tamano segun la fase)
  push();
  stroke(255);
  strokeWeight(2);
  fill(colFucsia);
  rect(salirX, salirY, salirAncho, salirAlto);
  noStroke();
  fill(255);
  textSize(salirAlto * 0.42);
  textAlign(CENTER, CENTER);
  text("SALIR", salirX + salirAncho / 2, salirY + salirAlto / 2);
  pop();

  // DIFICULTAD SEGUN LA FASE
  // intervalo = cada cuantos cuadros sale un pop-up
  // limiteActual = cuantos cuadros puedo estar afuera antes de que me jalen
  let intervalo = intervalosPopUp[fase];
  let limiteActual = limitesJalon[fase];

  let jugadorFuera = false;

  if (estaAtrapado == true) {
    // El sistema me tiene en el centro hasta que lleve el mouse ahi
    avatarX = width / 2;
    avatarY = height / 2;

    let enCentroX = false;
    let enCentroY = false;
    if (mouseX > width / 2 - 20 * escala) {
      if (mouseX < width / 2 + 20 * escala) {
        enCentroX = true;
      }
    }
    if (mouseY > height / 2 - 20 * escala) {
      if (mouseY < height / 2 + 20 * escala) {
        enCentroY = true;
      }
    }

    if (enCentroX == true) {
      if (enCentroY == true) {
        estaAtrapado = false;
      }
    }
  } else {
    avatarX = mouseX;
    avatarY = mouseY;

    // ¿El jugador salio de la burbuja? Uso el radio exacto del circulo
    let dx = avatarX - width / 2;
    let dy = avatarY - height / 2;
    if (dx * dx + dy * dy > radioBurbuja * radioBurbuja) {
      jugadorFuera = true;
      salioDeLaBurbuja = true;
    }

    // Apenas sale de la burbuja el contador corre sin parar hasta que lo jale
    if (salioDeLaBurbuja == true) {
      tiempoAfuera = tiempoAfuera + 1;

      // EL JALON (checkpoint al centro)
      if (tiempoAfuera >= limiteActual) {
        estaAtrapado = true;
        tiempoAfuera = 0;
        salioDeLaBurbuja = false;
        contadorPopUp = 0;
        vecesJalado = vecesJalado + 1;

        // Se cierran todos los pop-ups
        for (let i = 0; i < totalPopUps; i = i + 1) {
          popUps[i].cerrado = true;
        }

        // Pauso cualquier cancion de castigo que este sonando
        for (let i = 0; i < canciones.length; i = i + 1) {
          if (canciones[i].isPlaying()) {
            canciones[i].pause();
          }
        }

        // Escojo una al azar (que no sea la que acaba de sonar) y la pongo desde el 0
        cancionSonando = elegirCancion();
        ultimaCancion = cancionSonando;
        canciones[cancionSonando].jump(0);
        // jump() ya la pone a sonar, pero por si algun navegador no, la fuerzo
        if (canciones[cancionSonando].isPlaying() == false) {
          canciones[cancionSonando].play();
        }
        print("Suena la cancion " + cancionSonando);
      }
    }
  }

  // Los pop-ups salen siempre, pero respetando un tope maximo en pantalla
  // y sin amontonarse sobre SALIR cuando estoy atrapado o adentro de la burbuja
  contadorPopUp = contadorPopUp + 1;
  if (contadorPopUp >= intervalo) {
    contadorPopUp = 0;

    // Cuento cuantos pop-ups estan abiertos y cuantos estan encima de SALIR
    let abiertos = 0;
    let abiertosEnSalir = 0;
    for (let i = 0; i < totalPopUps; i = i + 1) {
      if (popUps[i].cerrado == false) {
        abiertos = abiertos + 1;
        if (popUps[i].enSalir == true) {
          abiertosEnSalir = abiertosEnSalir + 1;
        }
      }
    }

    if (abiertos < 6) {
      turnoPopUp = turnoPopUp + 1;

      // Alterno mitad afuera y mitad sobre SALIR en todos los niveles
      let apuntaASalir = false;
      if (turnoPopUp % 2 == 0) {
        apuntaASalir = true;
      }

      // Si me jalaron al centro o sigo adentro, nunca salen sobre SALIR
      if (estaAtrapado == true) {
        apuntaASalir = false;
      }
      if (jugadorFuera == false) {
        apuntaASalir = false;
      }

      // Tope maximo encima de SALIR para que siempre sea pasable
      let maxEnSalir = 2;
      if (fase >= 3) {
        maxEnSalir = 3;
      }
      if (apuntaASalir == true) {
        if (abiertosEnSalir >= maxEnSalir) {
          apuntaASalir = false;
        }
      }

      popUps[totalPopUps] = new PopUp(apuntaASalir);
      totalPopUps = totalPopUps + 1;
    }
  }

  // LIMITE DE 30 SEGUNDOS
  // La cancion del jalon solo dura 30 segs y se corta sola
  if (cancionSonando != -1) {
    if (canciones[cancionSonando].isPlaying()) {
      if (canciones[cancionSonando].currentTime() > 30) {
        canciones[cancionSonando].pause();
        cancionSonando = -1;
      }
    }
  }

  // POP-UPS
  for (let i = 0; i < totalPopUps; i = i + 1) {
    popUps[i].mostrar();
  }

  // AVISO DEL SISTEMA AL SUBIR DE NIVEL (va despues de los pop-ups para que nada lo tape)
  if (tiempoAviso > 0) {
    tiempoAviso = tiempoAviso - 1;
    let anchoAviso = 700 * escala;
    if (anchoAviso > width - 40) {
      anchoAviso = width - 40;
    }
    push();
    rectMode(CENTER);
    stroke(colFucsia);
    strokeWeight(4);
    fill(20, 5, 42, 235);
    rect(width / 2, height / 2, anchoAviso, 90 * escala);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26 * escala);
    text(textoAviso, width / 2, height / 2);
    pop();
  }

  // ---------- LO QUE VA AL FINAL PARA QUE NINGUN POP-UP LO TAPE ----------

  // BARRITA DE TIEMPO AFUERA (debajo de los audifonos)
  if (estaAtrapado == false) {
    if (tiempoAfuera > 0) {
      let anchoBarra = 70 * escala;
      let largoBarra = tiempoAfuera / limiteActual * anchoBarra;
      if (largoBarra > anchoBarra) {
        largoBarra = anchoBarra;
      }
      push();
      stroke(255);
      strokeWeight(2);
      fill(colFondo);
      rect(avatarX - anchoBarra / 2, avatarY + 30 * escala, anchoBarra, 11 * escala);
      noStroke();
      // amarillo al principio y fucsia cuando ya esta por jalarme
      if (tiempoAfuera > limiteActual * 0.75) {
        fill(colFucsia);
      } else {
        fill(colAmarillo);
      }
      rect(avatarX - anchoBarra / 2, avatarY + 30 * escala, largoBarra, 11 * escala);
      pop();
    }
  }

  // MENSAJE DEL JALON
  if (estaAtrapado == true) {
    push();
    fill(colAmarillo);
    noStroke();
    textSize(16 * escala);
    textAlign(CENTER, CENTER);
    text("EL SISTEMA TE JALÓ. Sube el volumen e ignora lo de afuera. (Lleva el mouse al centro)", width / 2, height / 2 - radioBurbuja - 25 * escala);
    pop();
  }

  // AVATAR (los audifonos). Con push/pop le pongo una fuente normal
  // porque fuente.otf no tiene emojis y el cursor desaparecia.
  push();
  textFont("sans-serif");
  textAlign(CENTER, CENTER);
  textSize(30 * escala);
  fill(255);
  noStroke();
  text(emojiCursor, avatarX, avatarY);
  pop();

  // CONTADOR DE DESCONEXION Y PUNTOS (arriba al centro para no chocar con SALIR)
  push();
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16 * escala);
  fill(colNaranja);
  text("DESCONEXIÓN: " + fase + "/" + totalFases, width / 2, 15 * escala);
  textSize(14 * escala);
  fill(colAmarillo);
  text("Status Quo Points: " + puntosSociales, width / 2, 40 * escala);
  pop();
}

// 9. FUNCIONES PROPIAS

// Saca pop-ups iniciales tapando SALIR al arrancar cada nivel
// (1 en los primeros 3 niveles y 2 en los ultimos 3)
function popUpsIniciales() {
  let cantidad = 1;
  if (fase >= 3) {
    cantidad = 2;
  }
  for (let i = 0; i < cantidad; i = i + 1) {
    popUps[totalPopUps] = new PopUp(true);
    totalPopUps = totalPopUps + 1;
  }
}

// Pone el boton SALIR en el lugar y con el tamano que le toca segun la fase.
// 6 lugares distintos y en las ultimas 3 fases el boton se va encogiendo.
function colocarSalir() {
  // Tamano del boton
  salirAncho = 110;
  salirAlto = 44;
  if (fase == 3) {
    salirAncho = 92;
    salirAlto = 38;
  }
  if (fase == 4) {
    salirAncho = 78;
    salirAlto = 32;
  }
  if (fase >= 5) {
    salirAncho = 66;
    salirAlto = 28;
  }

  // Lugar del boton
  let margen = 20;
  if (fase == 0) {
    // arriba a la derecha
    salirX = width - salirAncho - margen;
    salirY = margen;
  }
  if (fase == 1) {
    // arriba a la izquierda
    salirX = margen;
    salirY = margen;
  }
  if (fase == 2) {
    // abajo a la derecha
    salirX = width - salirAncho - margen;
    salirY = height - salirAlto - margen;
  }
  if (fase == 3) {
    // abajo a la izquierda
    salirX = margen;
    salirY = height - salirAlto - margen;
  }
  if (fase == 4) {
    // borde derecho al medio
    salirX = width - salirAncho - margen;
    salirY = height / 2 - salirAlto / 2;
  }
  if (fase >= 5) {
    // borde izquierdo al medio
    salirX = margen;
    salirY = height / 2 - salirAlto / 2;
  }
}

// Dibujo los elipses. Los uso en la portada, en el juego y en la pantalla final.
// reaccion es cuanto crecen con el volumen y girar dice si rotan o se quedan quietos.
function dibujarOndas(reaccion, girar) {
  push();
  translate(width / 2, height / 2);
  scale(escalaOndas);
  noFill();
  strokeWeight(3);
  if (girar == true) {
    rotate(anguloOndas);
  }
  for (let i = 0; i < 5; i = i + 1) {
    // Alterno los colores: fucsia, naranja y amarillo
    if (i == 0 || i == 3) {
      stroke(255, 20, 155, 220);
    } else if (i == 1 || i == 4) {
      stroke(255, 115, 0, 220);
    } else {
      stroke(255, 215, 50, 230);
    }
    ellipse(0, 0, 200 + reaccion + (i * 50), 200 + reaccion - (i * 20));
  }
  pop();
}

// Titulo con efecto glitch de 3 capas: sombra amarilla, sombra fucsia y blanco adelante
function dibujarGlitch(texto, x, y, tamano) {
  push();
  textAlign(CENTER, CENTER);
  noStroke();
  textSize(tamano);
  fill(colAmarillo);
  text(texto, x + 4 * escala, y + 4 * escala);
  fill(colFucsia);
  text(texto, x - 2 * escala, y - 2 * escala);
  fill(255);
  text(texto, x, y);
  pop();
}

// PORTADA
// Primero pide un clic para encender el sonido. Cuando la cancion de inicio
// suena, los elipses bailan con su amplitud y aparece el boton para entrar.
function dibujarInicio() {
  background(colFondo);

  // Mido el volumen de la cancion de inicio y se lo paso a los elipses
  let volumen = analizador.getLevel();
  let tamanoReaccion = volumen * 500 + 10;
  anguloOndas = anguloOndas + 0.7;
  dibujarOndas(tamanoReaccion, true);

  // Circulo central que late con el volumen, es la burbuja de la portada
  let diametroPortada = diametroBurbuja * 0.86 + volumen * 400 * escalaOndas;
  noStroke();
  fill(colFucsiaSuave);
  circle(width / 2, height / 2, diametroPortada);
  noFill();
  stroke(colNaranja);
  strokeWeight(3);
  circle(width / 2, height / 2, diametroPortada);

  // Triangulitos repartidos por toda la pantalla (alternan fucsia, naranja y amarillo)
  for (let i = 0; i < 12; i = i + 1) {
    let sx = width / 12 * (i + 0.5);
    let sy = height * 0.12 + (i % 4) * height * 0.25;
    if (i % 3 == 0) {
      fill(colFucsia);
    } else if (i % 3 == 1) {
      fill(colNaranja);
    } else {
      fill(colAmarillo);
    }
    noStroke();
    triangle(sx, sy - 9 * escala, sx - 8 * escala, sy + 7 * escala, sx + 8 * escala, sy + 7 * escala);
  }

  // Titulo del juego con glitch calido
  dibujarGlitch("BURBUJA.EXE", width / 2, height / 2 - 70 * escala, 64 * escala);

  push();
  textAlign(CENTER, CENTER);
  noStroke();
  textSize(16 * escala);
  fill(colAmarillo);
  text("un juego sobre salir de tu zona de confort", width / 2, height / 2 - 15 * escala);

  // Instrucciones en 3 renglones con un fondo oscuro para que se lean bien
  fill(20, 5, 42, 210);
  rect(width / 2 - 270 * escala, height / 2 + 15 * escala, 540 * escala, 102 * escala);
  fill(255);
  textSize(14 * escala);
  textAlign(LEFT, TOP);
  text("1. Sal del centro y dale a SALIR 6 veces para desconectarte.", width / 2 - 255 * escala, height / 2 + 27 * escala);
  text("2. Despeja las alertas que te estorben.", width / 2 - 255 * escala, height / 2 + 57 * escala);
  text("3. No te demores afuera o el sistema te devuelve.", width / 2 - 255 * escala, height / 2 + 87 * escala);
  pop();

  // Boton de abajo: cambia segun si el sonido ya esta encendido
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  stroke(255);
  strokeWeight(2);
  fill(colFucsia);
  rect(width / 2, height / 2 + 150 * escala, 440 * escala, 50 * escala);
  noStroke();
  fill(255);
  textSize(18 * escala);
  if (sonidoEncendido == false) {
    text("ENCENDER EL SONIDO", width / 2, height / 2 + 150 * escala);
  } else {
    text("ENTRAR A LA BURBUJA", width / 2, height / 2 + 150 * escala);
  }
  pop();
}

// PANTALLA FINAL (cuando llego a 6/6)
function dibujarFinal() {
  background(colFondo);

  // Ondas congeladas, sin girar
  dibujarOndas(10, false);

  dibujarGlitch("DESCONEXIÓN COMPLETADA", width / 2, height * 0.14, 40 * escala);

  // Ancho de la caja de texto (700 escalado, sin pasarse de la pantalla)
  let anchoCaja = 700 * escala;
  if (anchoCaja > width - 60) {
    anchoCaja = width - 60;
  }
  let cajaX = width / 2 - anchoCaja / 2;
  let panelY = height * 0.24;
  let panelAlto = height * 0.56;

  // Panel oscuro detras del texto para que se lea
  push();
  noStroke();
  fill(20, 5, 42, 215);
  rect(cajaX - 20 * escala, panelY, anchoCaja + 40 * escala, panelAlto);

  textAlign(CENTER, TOP);

  // Estadisticas reales
  fill(colAmarillo);
  textSize(20 * escala);
  text("Aceptaste " + excusasAceptadas + " excusas antes de salir. El sistema te devolvió " + vecesJalado + " veces.", cajaX, panelY + 20 * escala, anchoCaja, 80 * escala);

  // Reflexion
  fill(255);
  textSize(18 * escala);
  text("Salir de la burbuja cuesta porque está diseñada para que no quieras irte. Es mucho más cómodo ponerse los audífonos, deslizar hacia abajo y convencerse de que lo que pasa afuera no nos toca. Pero el silencio también toma partido, y mirar hacia otro lado mientras todo arde también es una postura política. Desconectarse del algoritmo es apenas el primer paso; lo difícil empieza cuando apagas la pantalla y decides no volver a cerrar los ojos.", cajaX, panelY + 110 * escala, anchoCaja, panelAlto - 120 * escala);
  pop();

  // Boton de reinicio (debajo del panel)
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  stroke(255);
  strokeWeight(2);
  fill(colFucsia);
  rect(width / 2, height * 0.89, 340 * escala, 52 * escala);
  noStroke();
  fill(255);
  textSize(18 * escala);
  text("[VOLVER A LA BURBUJA]", width / 2, height * 0.89);
  pop();
}

// Escoge una de las 7 canciones al azar, sin repetir la que acaba de sonar.
// Saco el numero con un while porque random() da decimales.
function elegirCancion() {
  let nueva = ultimaCancion;
  while (nueva == ultimaCancion) {
    let r = random(0, canciones.length);
    nueva = 0;
    while (nueva + 1 < r) {
      nueva = nueva + 1;
    }
  }
  return nueva;
}

// Deja todo como al principio y vuelve a la portada
function reiniciarJuego() {
  // Pauso la cancion de victoria y cualquiera de castigo
  cancionVictoria.pause();
  for (let i = 0; i < canciones.length; i = i + 1) {
    if (canciones[i].isPlaying()) {
      canciones[i].pause();
    }
  }
  cancionSonando = -1;
  ultimaCancion = -1;

  // Variables del juego
  fase = 0;
  puntosSociales = 0;
  excusasAceptadas = 0;
  vecesJalado = 0;
  tiempoAfuera = 0;
  salioDeLaBurbuja = false;
  contadorPopUp = 0;
  turnoPopUp = 0;
  estaAtrapado = false;
  ganoElJuego = false;

  // Aviso, ondas y burbuja vuelven al inicio
  tiempoAviso = 0;
  textoAviso = "";
  anguloOndas = 0;
  diametroBurbuja = diametroBase;
  radioBurbuja = diametroBase / 2;

  // Pop-ups
  popUps = [];
  totalPopUps = 0;

  // El boton SALIR vuelve a su primera posicion y tamano
  colocarSalir();

  // Vuelvo a la portada y suena otra vez la cancion de inicio
  estado = "inicio";
  cancionIntro.jump(0);
  if (cancionIntro.isPlaying() == false) {
    cancionIntro.play();
  }
}

// 10. EVENTOS
function mousePressed() {
  // CLICS EN LA PORTADA
  if (estado == "inicio") {
    if (sonidoEncendido == false) {
      // userStartAudio() desbloquea el audio del navegador, y de ahi en
      // adelante las canciones del jalon si pueden sonar solas
      userStartAudio();
      cancionIntro.play(); // la de inicio suena completa
      sonidoEncendido = true;
    } else {
      // ¿Le di al boton de entrar?
      if (mouseX > width / 2 - 220 * escala) {
        if (mouseX < width / 2 + 220 * escala) {
          if (mouseY > height / 2 + 125 * escala) {
            if (mouseY < height / 2 + 175 * escala) {
              // Al entrar pauso la cancion de inicio y arranco una del juego por default
              if (cancionIntro.isPlaying()) {
                cancionIntro.pause();
              }
              estado = "juego";
              popUpsIniciales();

              cancionSonando = elegirCancion();
              ultimaCancion = cancionSonando;
              canciones[cancionSonando].jump(0);
              if (canciones[cancionSonando].isPlaying() == false) {
                canciones[cancionSonando].play();
              }
              print("Suena la cancion " + cancionSonando);
            }
          }
        }
      }
    }
    return;
  }

  // CLIC EN LA PANTALLA FINAL (boton de reinicio)
  if (ganoElJuego == true) {
    if (mouseX > width / 2 - 170 * escala) {
      if (mouseX < width / 2 + 170 * escala) {
        if (mouseY > height * 0.89 - 26 * escala) {
          if (mouseY < height * 0.89 + 26 * escala) {
            reiniciarJuego();
          }
        }
      }
    }
    return;
  }

  // CLICS EN EL JUEGO
  // Si el sistema me tiene atrapado no puedo darle a nada
  if (estaAtrapado == true) {
    return;
  }

  // ¿Le di a un pop-up? Reviso de atras hacia adelante para empezar por el que
  // esta encima. El primero que encuentre debajo del mouse se queda con el clic:
  // si fue en [Aceptar] se cierra, y si fue en otra parte de la ventana no pasa nada.
  let tapado = false;
  for (let i = totalPopUps - 1; i >= 0; i = i - 1) {
    if (popUps[i].estaEncima()) {
      tapado = true;
      if (popUps[i].leDioClic()) {
        puntosSociales = puntosSociales + 10;
        excusasAceptadas = excusasAceptadas + 1;
        popUps[i].cerrado = true;
        print("Obedeciste al algoritmo");
      }
      break;
    }
  }
  if (tapado == true) {
    return;
  }

  // ¿Le di al boton SALIR? Uso salirAncho y salirAlto para que el area del clic
  // sea justo la del boton, que cambia de tamano en cada fase.
  let leDioAlBotonX = false;
  let leDioAlBotonY = false;

  if (mouseX > salirX) {
    if (mouseX < salirX + salirAncho) {
      leDioAlBotonX = true;
    }
  }
  if (mouseY > salirY) {
    if (mouseY < salirY + salirAlto) {
      leDioAlBotonY = true;
    }
  }

  if (leDioAlBotonX == true) {
    if (leDioAlBotonY == true) {
      // Se cierran los pop-ups actuales y se reinicia el tiempo afuera
      for (let i = 0; i < totalPopUps; i = i + 1) {
        popUps[i].cerrado = true;
      }
      tiempoAfuera = 0;
      salioDeLaBurbuja = false;
      contadorPopUp = 0;
      fase = fase + 1;

      if (fase >= totalFases) {
        // 6/6: se gana el juego
        ganoElJuego = true;

        // Se corta lo que suene y arranca la cancion de victoria completa
        for (let i = 0; i < canciones.length; i = i + 1) {
          if (canciones[i].isPlaying()) {
            canciones[i].pause();
          }
        }
        cancionSonando = -1;
        cancionVictoria.jump(0);
        if (cancionVictoria.isPlaying() == false) {
          cancionVictoria.play();
        }
        print("EL SISTEMA COLAPSÓ");
      } else {
        // El boton salta a otro lugar y cambia de tamano si le toca
        colocarSalir();

        // Aviso del sistema por 1.5 segundos
        textoAviso = avisosNivel[fase - 1];
        tiempoAviso = 90;

        // La burbuja crece un poco en cada fase (la deteccion usa radioBurbuja)
        diametroBurbuja = diametroBase + fase * 12 * escala;
        radioBurbuja = diametroBurbuja / 2;

        // Pop-ups iniciales sobre SALIR para arrancar el nivel con presion
        popUpsIniciales();
      }
    }
  }
}