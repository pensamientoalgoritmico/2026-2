/*
ENTREGA FINAL
Mariana González Melo (código: 202524703)
 
CONCEPTO:
Demora es un juego sobre la espera. La única acción válida es quedarse quieto; sin mover el mouse, sin hablar, sin tocar nada. Mientras el jugador aguanta, el juego va "revelando" un álbum de fotos crudas del propio jugador, como una cianotipia (el color de las celdas cambia con el tiempo).
 
Ninguna foto está precargada y el jugador no sube nada. Todas se toman en vivo con la cámara (createCapture):
- Cada vez que se completa un intervalo de quietud, el juego toma una foto sin avisar y la reparte en pedacitos entre las celdas reveladas.
- En momentos al azar, aparece "SONRÍE" y el jugador tiene 2 segundos para reaccionar antes de que se tome la foto (no se le penaliza por este movimiento).

REFERENCIAS (qué tomé y cómo lo apropié)
  - Designing Friction (Luna Maurer y Roel Wouters): De aquí viene la idea
    de "demora" y de "lo no positivo". Lo apropié en el temporizador oculto y en que la recompensa nunca es una celebración, sino un álbum silencioso.
  - The Slow Game (Will Odom, Ishac Bertran, Garnet Hertz): Tomé la idea de estirar el tiempo hasta convertirlo en un ejercicio de paciencia. Lo apropié sumando una capa física: la quietud real, medida con cámara y micrófono.
  - Light Phone: Tomé la postura de "interfaz mínima y sin distracciones". La apropié con una interfaz simple, sin textos durante la espera.
  - Windows Media Player (versión antigua): De aquí vienen el marco, los botones circulares, la barra de búsqueda y las barras del visualizador. Lo apropié en una paleta de azules y lavandas, y convertí el visualizador en un medidor del ruido del jugador.
  - Cianotipia (proceso fotográfico de 1842): De aquí viene el cambio de color de las celdas (verde azulado, que pasa a azul, que pasa a azul de Prusia y luego da la foto final).
  - Detección de movimiento: Usé la técnica de comparar un cuadro de video
    con el anterior ("diferencia de cuadros"), una técnica común con
    createCapture en p5.js.
 
El micrófono y la cámara son el juego:
- Las barras del reproductor (abajo a la derecha, en la barra de control) son un "medidor de ruido": suben cuando te mueves o hablas. Así el jugador siente qué tan cerca está de interrumpirse, sin leer nada.
- Si se supera el límite, el temporizador (oculto y al azar) se reinicia.
 
EL JUGADOR:
- Se ve visualmente al ser un visor de cámara. Está conformado por cuatro esquinas de color lavanda alrededor de una celda de la cuadrícula, con un puntico en el centro.
- Representa la quietud del jugador real. El jugador de verdad no puede mover el visor (moverse es justo lo que el juego castiga), por eso el visor se mueve solo, según qué tan quieto está el jugador de verdad.
- Incluye:
    irA(): Elige una celda vacía, se desliza despacio hasta ella y la "mira".
    Respirar: Cuando hay calma, el visor se agranda y se achica muy suavemente.
    Temblar: Cuando hay ruido (cámara, micrófono o mouse), el visor tiembla. Entre más ruido, más tiembla.
    asustar(): Cuando el jugador se interrumpe, el visor se sacude fuerte unos instantes.
- Al terminar un intervalo de quietud, el visor "dispara", haciendo que la celda que estaba mirando sea la primera que se revela (con una foto), y luego el visor busca la siguiente. Luego, la celda que está bajo el visor se ilumina un poquito (Celda.reaccionar() le pregunta al visor si está encima suyo con Jugador.estaSobre()). Cuando el jugador se interrumpe, se borra una celda ya revelada y el visor se devuelve a esa celda. Básicamente, lo que perdiste lo tienes que volver a esperar.

ESTADOS DEL JUEGO (cada uno es una pantalla distinta y una función):
- Inicio: Tiene dos páginas. Página 1: El título y textos de bienvenida. Página 2: "Cómo se juega". Se sale con el botón play.
- Espera: El jugador debe quedarse quieto. Casi sin texto (solo las ayudas de la primera partida). Aquí viven el visor, las celdas y el medidor.
- "Sonríe": SONRÍE a pantalla completa durante 2 segundos.
- Fin: El álbum quedó completo y los textos cuentan cuánto tardaste, cuántas veces te interrumpiste, una reflexión y la pregunta final.

CÓMO SE CAMBIA DE UN ESTADO A OTRO:
    - Inicio (página 1) ; Inicio (página 2): Cuando el jugador hace clic en el botón adelante. Con atrás se devuelve.
    - Inicio ; espera: Cuando el jugador hace clic en el botón play (en cualquiera de las dos páginas).
    - Espera ; "Sonríe": Al azar, en el 35% de las esperas, entre el 30% y el 80% del tiempo de la espera.
    - "Sonríe" ; Espera: Pasados 2 segundos, se toma la foto y se sigue.
    - Espera ; Fin: Cuando ya no queda ninguna celda vacía.
    - Fin ; Espera: Cuando el jugador hace clic en play otra vez.

TECLAS PROVISIONALES (para ver cada pantalla sin jugar la partida completa):
    - Tecla 1: Pasa a la introducción (y reinicia las ayudas de la primera partida).
    - Tecla 2: Pasa a la espera (empieza una partida).
    - Tecla 3: Pasa al SONRÍE.
    - Tecla 4: Revela todo el álbum y pasa al cierre.
En la partida, cualquier otra tecla cuenta como ruido (es una tentación). Para que el navegador deje de usar la cámara y el micrófono, hay que hacer clic o presionar una tecla al menos una vez.
*/
 
//PALETA
let COLOR_FONDO = "#121A30";      //Detrás de la ventana (un poco más oscuro)
let COLOR_VENTANA = "#1B2742";    //Fondo principal, azul oscuro desaturado
let COLOR_CUADRICULA = "#3B4A7A"; //Líneas de la cuadrícula, azul-morado apagado
let COLOR_TEXTO = "#C7C1E8";      //Lavanda suave: textos e interfaz
let COLOR_BORDE = "#8B84C8";      //Bordes de la ventana, lavanda más fuerte
 
// Colores de la cianotipia como números (R, G, B):
// 1) Revelado inicial: Verde azulado tenue  ; (111, 167, 160)
// 2) Transición: Azul medio                 ; (46, 94, 140)
// 3) Oxidación: Azul de Prusia              ; (21, 66, 115)
 
//AJUSTES DEL JUEGO
let UMBRAL_MOVIMIENTO = 9;   //Qué tanto movimiento en cámara cuenta como ruido
let UMBRAL_VOLUMEN = 0.05;   //Qué tan fuerte debe ser el sonido (0 a 1)
let DURACION_REVELADO = 500; //Frames que tarda una celda en "oxidarse" (~8 s)
let MIN_ESPERA = 7000;       //Espera mínima en milisegundos (7 s)
let MAX_ESPERA = 12000;      //Espera máxima en milisegundos (12 s)
let COLUMNAS = 8;
let FILAS = 5;
 
//TEXTOS
// Introducción: Se muestran una tras otra, la última se queda hasta que se presione play
let frasesIntro = [
  "Todo a tu alrededor está hecho para que no esperes.",
  "Bienvenido a Demora, un lugar que te va a enseñar a esperar.",
  "Quédate un momento. Sin mover el mouse. Sin hablar.",
  "Usaremos tu cámara y tu micrófono.",
  "Presiona adelante para ver cómo se juega."
];
// Ayudas de la primera partida (la última frase vacía hace que el texto desaparezca)
let frasesAyuda = [
  "Quédate quieto. Sin hablar ni mover el mouse.",
  "Las barras de abajo miden tu ruido: procura que no suban.",
  "El visor marca la próxima celda que se va a revelar.",
  ""
];
// Cuando el jugador se interrumpe (se escoge una al azar)
let frasesInterrupcion = [
  "Se movió algo. Empezamos de nuevo.",
  "Eso fue ruido. Sin prisa, otra vez.",
  "Casi. Otra vez.",
  "Respira. Vuelve a empezar."
];
 
//VARIABLES
let ventana;           // Objeto de la clase Ventana
let sensores;          // Objeto de la clase Sensores
let jugador;           // Objeto de la clase Jugador
let leyenda;           // Objeto de la clase Texto (le puse leyendas para no confundirme con texto de título y otros)
let celdas = [];       // Arreglo de objetos Celda
let barras = [];       // Arreglo de objetos Barra
let botones = [];      // Arreglo de objetos Boton
 
let estado = "inicio"; // En qué pantalla del juego estamos
let nivel = 1;         // Sube cada 3 intervalos cumplidos
let intervalosCumplidos = 0;
let interrupciones = 0; // Cuántas veces se interrumpió el jugador (se muestra al final)
let inicioJuego = 0;    // Cuándo empezó la partida (para contar cuánto tardó)
let paginaInicio = 0;   // Página de la introducción: 0 = título, 1 = cómo se juega
let primeraPartida = true; // True hasta que empieza la primera partida (para mostrar las ayudas)
let avisoRevelado = false; // True cuando ya se explicó qué pasa al revelarse una celda
let avisoSonrie = false;   // True cuando ya se explicó que el SONRÍE no penaliza
 
let inicioQuietud = 0;     // Cuándo empezó a contar la espera actual
let duracionQuietud = 0;   // Cuánto debe aguantar (se decide al azar y no se ve)
let esperaExtra = 0;       // Cada interrupción suma un poco más de espera
let momentoSonrie = -1;    // Cuándo (dentro de la espera) saldrá SONRÍE; -1 = no saldrá
 
let inicioSonrie = 0;      // Cuándo empezó el SONRÍE actual
let flash = 0;             // Destello blanco cuando se toma la foto
 
let nivelRuido = 0;        // 0 = silencio total, 1 = límite, más de 1 = te pasaste
let hayClic = false;       // True solo durante el frame en que hubo clic/tecla
let arranqueHasta = 0;     // Frames en los que se ignora el ruido (calibrar cámara)
let penalizadoHasta = 0;   // Evita penalizar muchas veces seguidas por el mismo ruido
 
function setup() {
  createCanvas(960, 640);
  pixelDensity(1); // Así los píxeles de la cámara se leen sin confusión
  // Tipografía monoespaciada (Space Mono; si no carga, Courier New)
  textFont("Space Mono, Courier New, monospace");
 
  //El marco del reproductor
  ventana = new Ventana(30, 20, 900, 600, "Demora");
 
  //Cámara y micrófono (todavía no se encienden, falta el clic)
  sensores = new Sensores();
 
  //El jugador (el visor) y las leyendas (los textos de subtítulos)
  jugador = new Jugador();
  leyenda = new Leyenda(480, 512);
 
  //Cuadrícula de celdas con un for() anidado
  let anchoCelda = 100;
  let altoCelda = 75;
  let separacion = 8;
  let anchoTotal = COLUMNAS * anchoCelda + (COLUMNAS - 1) * separacion;
  let inicioX = 30 + (900 - anchoTotal) / 2; // Centrada dentro de la ventana
  let inicioY = 62;
  for (let fila = 0; fila < FILAS; fila++) {
    for (let col = 0; col < COLUMNAS; col++) {
      let x = inicioX + col * (anchoCelda + separacion);
      let y = inicioY + fila * (altoCelda + separacion);
      celdas.push(new Celda(x, y, anchoCelda, altoCelda));
    }
  }
 
  //Barras del medidor de ruido (visualizador del reproductor)
  for (let i = 0; i < 14; i++) {
    barras.push(new Barra(660 + i * 16, 606, 10, 44));
  }
 
  //Botones del reproductor (el último dato es lo que dice la leyenda si los tocas)
  botones.push(new Boton(76, 585, 40, "play", "Ya está sonando. Solo falta esperar."));
  botones.push(new Boton(124, 585, 26, "stop", "Detenerte es justo lo que estás haciendo."));
  botones.push(new Boton(158, 585, 26, "atras", "No hay nada atrás. Solo esto."));
  botones.push(new Boton(192, 585, 26, "adelante", "Aquí no hay nada que adelantar."));
 
  //El juego arranca en la introducción
  leyenda.iniciarSecuencia(frasesIntro, 4200);
}
 
function draw() {
  background(COLOR_FONDO);
 
  //Lo que siempre se ve: El marco y las celdas
  ventana.dibujar();
 
  for (let i = 0; i < celdas.length; i++) {
    celdas[i].reaccionar(jugador); // La celda se entera si el visor está encima
    celdas[i].oxidarse();
    celdas[i].dibujar();
  }
 
  //Se mide el ruido del jugador (solo cuando ya empezó el juego)
  if (estado !== "inicio" && estado !== "fin") {
    sensores.actualizar();
    nivelRuido = calcularRuido();
  } else {
    nivelRuido = 0;
  }
 
  //El visor (solo se ve durante la partida)
  jugador.actualizar(nivelRuido);
  jugador.dibujar();
 
  //El medidor de ruido
  for (let i = 0; i < barras.length; i++) {
    barras[i].reaccionar(nivelRuido);
    barras[i].dibujar();
  }
 
  //Los botones que invitan a hacer clic (con un anillo que late):
  //play en la segunda página de la introducción y en el cierre; adelante en la primera página
  botones[0].invita = ((estado === "inicio" && paginaInicio === 1) || estado === "fin");
  botones[3].invita = (estado === "inicio" && paginaInicio === 0);
  for (let i = 0; i < botones.length; i++) {
    botones[i].dibujar();
  }
 
  //Lo que cambia según el estado del juego
  if (estado === "inicio") {
    pantallaInicio();
  } else if (estado === "espera") {
    pantallaEspera();
  } else if (estado === "sonrie") {
    pantallaSonrie();
  } else if (estado === "fin") {
    pantallaFin();
  }
 
  //Las leyendas (subtítulos). En el SONRÍE no, porque debe tapar todo.
  if (estado !== "sonrie") {
    leyenda.actualizar();
    leyenda.dibujar();
  }
 
  //Destello blanco que se apaga solo (cuando se toma una foto)
  if (flash > 0) {
    noStroke();
    fill(255, flash);
    rect(0, 0, width, height);
    flash = flash - 12;
  }
 
  hayClic = false; //El clic solo cuenta un frame
}
 
 
//FUNCIONES DE CADA ESTADO
//INICIO: Introducción con dos páginas. Página 0: título. Página 1: cómo se juega.
//Se sale con el botón play.
function pantallaInicio() {
  //Mientras se lee la introducción, algunas celdas se revelan y se borran solas
  //Es solo ambiente: Ayuda a mostrar el cambio de color de la cianotipia
  if (frameCount % 150 === 0) {
    let i = floor(random(celdas.length));
    if (celdas[i].estado === 0) {
      celdas[i].revelarse(null, 0, 0, 0, 0);
    }
  }
  for (let i = 0; i < celdas.length; i++) {
    if (celdas[i].estado === 1 && celdas[i].edad > DURACION_REVELADO + 120) {
      celdas[i].borrarse();
    }
  }

  //Velo semitransparente (más fuerte en la página de instrucciones para que se lean bien)
  noStroke();
  if (paginaInicio === 0) {
    fill(18, 26, 48, 150);
  } else {
    fill(18, 26, 48, 225);
  }
  rect(31, 49, 898, 500);

  if (paginaInicio === 0) {
    //Título y subtítulo
    fill(COLOR_TEXTO);
    textAlign(CENTER, CENTER);
    textSize(72);
    text("Demora", 480, 225);
    textSize(16);
    text("un juego sobre la espera", 480, 285);
  } else {
    dibujarInstrucciones();
  }
}

//Página 2 de la introducción: Cuatro columnas con un dibujito, un título y una explicación
function dibujarInstrucciones() {
  fill(COLOR_TEXTO);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Cómo se juega", 480, 90);

  let centros = [172, 377, 582, 787]; //Centro (en x) de cada columna
  let titulos = ["Quédate quieto", "No hagas ruido", "Espera", "Si ves SONRÍE"];
  let textos = [
    "Frente a la cámara, sin mover el mouse ni tocar el teclado.",
    "Las barras miden tu ruido. Si suben mucho, te interrumpes.",
    "Cada espera cumplida revela celdas con fotos tuyas. No sabrás cuánto dura.",
    "Sonríe. Se toma una foto y no pasa nada."
  ];

  //Los cuatro dibujitos
  dibujarIconoVisor(centros[0], 185);
  dibujarIconoBarras(centros[1], 185);
  dibujarIconoCeldas(centros[2], 185);
  dibujarIconoSonrie(centros[3], 185);

  for (let i = 0; i < 4; i++) {
    //Título de la columna
    fill(COLOR_TEXTO);
    textAlign(CENTER, CENTER);
    textSize(15);
    text(titulos[i], centros[i], 252);

    //Explicación (el texto se acomoda solo dentro de una caja de 190 x 100)
    fill(199, 193, 232, 210);
    textAlign(CENTER, TOP);
    textSize(12);
    text(textos[i], centros[i] - 95, 275, 190, 100);

    //Línea que separa las columnas
    if (i < 3) {
      stroke(COLOR_CUADRICULA);
      strokeWeight(1);
      line(centros[i] + 102, 140, centros[i] + 102, 360);
      noStroke();
    }
  }

  //El objetivo del juego
  fill(COLOR_TEXTO);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Objetivo: revelar todo el álbum. Cada interrupción alarga la espera.", 480, 410);
}

//Dibujito 1: El visor (cuatro esquinas y un puntico) alrededor de una celda
function dibujarIconoVisor(cx, cy) {
  noStroke();
  fill("#18223C");
  rect(cx - 36, cy - 27, 72, 54);
  stroke(COLOR_TEXTO);
  strokeWeight(2.5);
  noFill();
  let izq = cx - 44;
  let der = cx + 44;
  let arr = cy - 34;
  let aba = cy + 34;
  line(izq, arr, izq + 12, arr);
  line(izq, arr, izq, arr + 12);
  line(der, arr, der - 12, arr);
  line(der, arr, der, arr + 12);
  line(izq, aba, izq + 12, aba);
  line(izq, aba, izq, aba - 12);
  line(der, aba, der - 12, aba);
  line(der, aba, der, aba - 12);
  noStroke();
  fill(COLOR_TEXTO);
  circle(cx, cy, 4);
}

//Dibujito 2: Barras que van subiendo (el medidor de ruido)
function dibujarIconoBarras(cx, cy) {
  noStroke();
  fill(COLOR_TEXTO);
  let alturas = [10, 18, 28, 38, 48];
  for (let i = 0; i < alturas.length; i++) {
    rect(cx - 32 + i * 13, cy + 26 - alturas[i], 8, alturas[i]);
  }
}

//Dibujito 3: Cuatro celdas que muestran los colores de la cianotipia
function dibujarIconoCeldas(cx, cy) {
  noStroke();
  fill(111, 167, 160);
  rect(cx - 34, cy - 26, 30, 22);
  fill(46, 94, 140);
  rect(cx + 4, cy - 26, 30, 22);
  fill(21, 66, 115);
  rect(cx - 34, cy + 4, 30, 22);
  stroke(COLOR_CUADRICULA);
  strokeWeight(1);
  fill("#18223C");
  rect(cx + 4, cy + 4, 30, 22);
}

//Dibujito 4: La palabra SONRÍE dentro de un recuadro claro (como en la pantalla del juego)
function dibujarIconoSonrie(cx, cy) {
  noStroke();
  fill(COLOR_TEXTO);
  rect(cx - 46, cy - 22, 92, 44);
  fill(COLOR_VENTANA);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("SONRÍE", cx, cy);
}

//ESPERA: Aquí ocurre el juego. Casi sin texto en pantalla.
function pantallaEspera() {
  let transcurrido = millis() - inicioQuietud;
 
  // 1) ¿El jugador hizo ruido? (nivelRuido pasó de 1)
  if (nivelRuido > 1 && frameCount > arranqueHasta) {
    //El temporizador siempre vuelve a empezar
    inicioQuietud = millis();
    //Pero la penalización (borrar celdas, esperar más) ocurre una vez
    if (frameCount > penalizadoHasta) {
      penalizar();
      penalizadoHasta = frameCount + 90; //1.5 s antes de poder penalizar otra vez
    }
    return;
  }
 
  // 2) ¿Llegó el momento de SONRÍE?
  if (momentoSonrie > 0 && transcurrido > momentoSonrie) {
    estado = "sonrie";
    inicioSonrie = millis();
    momentoSonrie = -1; //Solo una vez por intervalo
    return;
  }
 
  // 3) ¿Aguantó todo el intervalo? ; Recompensa
  if (transcurrido > duracionQuietud) {
    intervalosCumplidos++;
    nivel = 1 + floor(intervalosCumplidos / 3); //Cada 3 intervalos sube el nivel
    revelarCeldas(3, false); // 3 celdas con pedacitos de una foto nueva
    //La primera vez, una leyenda explica qué acaba de pasar
    if (avisoRevelado === false) {
      leyenda.mostrar("Se reveló una parte de una foto tuya. Sigue esperando.", 4500);
      avisoRevelado = true;
    }
    nuevoIntervalo();
    if (contarOcultas() === 0) {
      terminarJuego();
    }
  }
}
 
//SONRÍE: Pantalla completa, grande, sin tiempo para pensar
function pantallaSonrie() {
  noStroke();
  fill(COLOR_TEXTO);
  rect(0, 0, width, height);
 
  fill(COLOR_VENTANA);
  textAlign(CENTER, CENTER);
  textSize(150);
  text("SONRÍE", width / 2, height / 2);
 
  //A los 2 segundos se toma la foto. No penaliza ni reinicia nada.
  if (millis() - inicioSonrie > 2000) {
    revelarCeldas(1, true); // 1 celda con la foto completa
    flash = 255;
    //La primera vez, una leyenda explica que el SONRÍE no penaliza
    if (avisoSonrie === false) {
      leyenda.mostrar("Esa fue tu foto. SONRÍE nunca te penaliza.", 4500);
      avisoSonrie = true;
    }
    //El tiempo que duró SONRÍE no cuenta contra el intervalo
    inicioQuietud = inicioQuietud + 2000;
    arranqueHasta = frameCount + 60; //Un segundo para que la cámara se estabilice
    estado = "espera";
    if (contarOcultas() === 0) {
      terminarJuego();
    }
  }
}
 
//FIN: Cierre. El álbum está completo y las leyendas (textos) cuentan cómo te fue
//y llevan, paso a paso, a la reflexión final.
function pantallaFin() {
  //Aquí casi no hay que dibujar, ya que el protagonista es el álbum.
  //Los textos (que ya se iniciaron en terminarJuego) hacen el resto.
  //El botón play brilla suavemente para invitar a volver a empezar.
  //Y con adelante y atrás el jugador puede moverse entre las frases a su ritmo.

  //Firma pequeña debajo del álbum
  noStroke();
  fill(199, 193, 232, 120);
  textAlign(CENTER, CENTER);
  textSize(11);
  text("Demora · un juego sobre la espera · Mariana González Melo", 480, 538);
}


//FUNCIONES AUXILIARES DEL JUEGO
//Prepara una partida nueva desde cero (se usa al presionar play y con la tecla 2)
function empezarJuego() {
  userStartAudio(); //Los navegadores exigen un gesto del usuario para el audio
  //La cámara y el micrófono se encienden solo la primera vez
  if (sensores.camara === null) {
    sensores.iniciar();
  }
 
  //Todo vuelve a cero
  for (let i = 0; i < celdas.length; i++) {
    celdas[i].borrarse();
  }
  nivel = 1;
  intervalosCumplidos = 0;
  interrupciones = 0;
  esperaExtra = 0;
  inicioJuego = millis();
  ventana.titulo = "Demora";
  leyenda.apagar();

  //En la primera partida, unas leyendas de ayuda explican qué mirar
  if (primeraPartida) {
    leyenda.iniciarSecuencia(frasesAyuda, 3200);
    primeraPartida = false;
  }
 
  estado = "espera";
  arranqueHasta = frameCount + 150; //2.5 s para que la cámara se calibre
  jugador.visible = true;
  elegirObjetivo();                 //El visor escoge su primera celda
  jugador.x = jugador.objetivoX;    //Y aparece ya sobre ella
  jugador.y = jugador.objetivoY;
  nuevoIntervalo();
}
 
//Vuelve a la introducción (tecla 1)
function volverAlInicio() {
  estado = "inicio";
  paginaInicio = 0;
  primeraPartida = true; //Vuelven a salir las ayudas de la primera partida
  avisoRevelado = false;
  avisoSonrie = false;
  for (let i = 0; i < celdas.length; i++) {
    celdas[i].borrarse();
  }
  jugador.visible = false;
  ventana.titulo = "Demora";
  leyenda.iniciarSecuencia(frasesIntro, 4200);
}
 
//Cierre del juego: Arma las leyendas (textos) finales con los datos de la partida
function terminarJuego() {
  estado = "fin";
  jugador.visible = false;
  ventana.titulo = "Demora - álbum";
 
  //Cuánto tardó el jugador, en minutos y segundos
  let segundosTotales = floor((millis() - inicioJuego) / 1000);
  let minutos = floor(segundosTotales / 60);
  let segundos = segundosTotales % 60;
 
  //Frase sobre las interrupciones (con singular y plural)
  let fraseInterrupciones = "";
  if (interrupciones === 0) {
    fraseInterrupciones = "No te interrumpiste ni una sola vez, felicitaciones.";
  } else if (interrupciones === 1) {
    fraseInterrupciones = "Te interrumpiste 1 vez.";
  } else {
    fraseInterrupciones = "Te interrumpiste " + interrupciones + " veces.";
  }
 
  //Una reflexión distinta según cuántas veces se interrumpió el jugador
  let fraseReflexion = "";
  if (interrupciones === 0) {
    fraseReflexion = "Esperar así, sin distraerte, es raro. ¿Cuándo fue la última vez?";
  } else if (interrupciones <= 3) {
    fraseReflexion = "Algo te sacó de la espera. Casi siempre es el impulso de hacer algo.";
  } else {
    fraseReflexion = "Esperar cuesta. Casi nada a tu alrededor te entrena para hacerlo.";
  }

  //La secuencia final: primero cómo te fue, luego la reflexión y al final la pregunta.
  //Cada frase es corta para que quepa en una sola línea.
  let frasesFin = [
    "Un álbum de instantes que no elegiste.",
    "Tardaste " + minutos + " min " + segundos + " s en llegar hasta aquí.",
    fraseInterrupciones,
    fraseReflexion,
    "Cada pausa que el diseño digital borra es una espera menos que toleras.",
    "Scroll infinito, notificaciones, reproducción automática: nada espera.",
    "La demora que sentiste no era un error: era fricción a propósito.",
    "Y tus fotos: no elegiste ni repetiste ninguna. Así saliste, sin filtro.",
    "¿Qué parte de ti aparece cuando no puedes elegir cómo te ven?",
    "Gracias por quedarte.",
    "Presiona play para volver a esperar."
  ];
  leyenda.iniciarSecuencia(frasesFin, 4500);
}
 
// Combina todo lo que cuenta como "ruido" en un solo número.
// 0 = quieto del todo, 1 = justo en el límite, más de 1 = interrupción.
function calcularRuido() {
  //Cámara y micrófono
  let ruido = sensores.nivelRuido();
 
  //El mouse también es una tentación, ya que moverlo mucho cuenta como ruido
  let movimientoMouse = abs(mouseX - pmouseX) + abs(mouseY - pmouseY);
  if (movimientoMouse > 8) {
    ruido = max(ruido, 1.5);
  }
 
  //Un clic o una tecla es ruido seguro
  if (hayClic) {
    ruido = 2;
  }
 
  //Los primeros segundos no se miden (la cámara se está ajustando)
  if (frameCount < arranqueHasta) {
    ruido = 0;
  }
  return ruido;
}
 
//Empieza una espera nueva con una duración al azar (el jugador nunca la ve)
function nuevoIntervalo() {
  inicioQuietud = millis();
  duracionQuietud = random(MIN_ESPERA, MAX_ESPERA + esperaExtra);
 
  //35% de probabilidad de que en esta espera aparezca un SONRÍE
  if (random(1) < 0.35) {
    //Aparece en un punto al azar entre el 30% y el 80% de la espera
    momentoSonrie = duracionQuietud * random(0.3, 0.8);
  } else {
    momentoSonrie = -1;
  }
}
 
//Qué pasa cuando el jugador se interrumpe
function penalizar() {
  interrupciones++;
  jugador.asustar(); //El visor se sacude
 
  //La leyenda (texto) cuenta qué pasó (si fue un clic en un botón, ya hay una leyenda del botón)
  if (hayClic === false) {
    leyenda.mostrar(frasesInterrupcion[floor(random(frasesInterrupcion.length))], 2500);
  }
 
  //La próxima espera puede ser más larga (tope de 8 s extra)
  esperaExtra = min(esperaExtra + 1500, 8000);
  duracionQuietud = random(MIN_ESPERA, MAX_ESPERA + esperaExtra);
  momentoSonrie = -1;
 
  //En el nivel 1 lo revelado nunca se pierde.
  //Desde el nivel 2, una interrupción borra una celda revelada al azar, y el visor se devuelve a esa celda: lo perdido hay que volver a esperarlo.
  if (nivel >= 2) {
    let reveladas = [];
    for (let i = 0; i < celdas.length; i++) {
      if (celdas[i].estado === 1) {
        reveladas.push(i);
      }
    }
    if (reveladas.length > 0) {
      let elegida = reveladas[floor(random(reveladas.length))];
      celdas[elegida].borrarse();
      jugador.irA(elegida);
    }
  }
}
 
//Cuenta cuántas celdas siguen sin revelar
function contarOcultas() {
  let total = 0;
  for (let i = 0; i < celdas.length; i++) {
    if (celdas[i].estado === 0) {
      total++;
    }
  }
  return total;
}
 
//El visor escoge una celda vacía al azar para mirarla
function elegirObjetivo() {
  if (contarOcultas() === 0) {
    return; //No queda ninguna
  }
  let i = floor(random(celdas.length));
  while (celdas[i].estado !== 0) {
    i = floor(random(celdas.length));
  }
  jugador.irA(i);
}
 
//Toma una foto y la reparte entre "cantidad" celdas ocultas.
//La primera celda es siempre la que está mirando el visor, las demás se eligen al azar.
// Completa = true  ; La celda muestra la foto entera (la del SONRÍE)
// Completa = false ; Cada celda muestra un pedacito distinto de la foto
function revelarCeldas(cantidad, completa) {
  let foto = sensores.foto();
  //Nunca se piden más celdas de las que quedan
  cantidad = min(cantidad, contarOcultas());
 
  let reveladas = 0;
 
  //Primero la celda que mira el visor (si todavía está vacía)
  if (cantidad > 0 && jugador.indiceObjetivo >= 0) {
    if (celdas[jugador.indiceObjetivo].estado === 0) {
      ponerFoto(celdas[jugador.indiceObjetivo], foto, completa);
      reveladas++;
    }
  }
 
  //Después las demás, al azar
  while (reveladas < cantidad) {
    let i = floor(random(celdas.length));
    if (celdas[i].estado === 0) {
      ponerFoto(celdas[i], foto, completa);
      reveladas++;
    }
  }
 
  //El visor busca su próxima celda
  elegirObjetivo();
}
 
//Le pone a una celda su foto (entera o un pedacito)
function ponerFoto(celda, foto, completa) {
  if (foto === null) {
    celda.revelarse(null, 0, 0, 0, 0); //Sin cámara: solo el color
  } else if (completa) {
    celda.revelarse(foto, 0, 0, foto.width, foto.height);
  } else {
    //Recorte de la foto con la misma proporción 4:3 que la celda
    let sw = foto.width * 0.4;
    let sh = sw * 0.75;
    let sx = random(0, foto.width - sw);
    let sy = random(0, foto.height - sh);
    celda.revelarse(foto, sx, sy, sw, sh);
  }
}
 
 
//EVENTOS DEL MOUSE Y EL TECLADO
function mousePressed() {
  //En la introducción: play empieza el juego; adelante y atrás cambian de página
  if (estado === "inicio") {
    if (botones[0].estaEncima()) {
      empezarJuego();
    } else if (botones[3].estaEncima() && paginaInicio === 0) {
      paginaInicio = 1;
      leyenda.mostrar("Presiona play cuando estés listo.", 0); //Duración 0: se queda
    } else if (botones[2].estaEncima() && paginaInicio === 1) {
      paginaInicio = 0;
      leyenda.iniciarSecuencia(frasesIntro, 4200);
    }
    return;
  }

  //En el cierre: play vuelve a empezar; adelante y atrás cambian de frase
  if (estado === "fin") {
    if (botones[0].estaEncima()) {
      empezarJuego();
    } else if (botones[3].estaEncima()) {
      leyenda.siguiente();
    } else if (botones[2].estaEncima()) {
      leyenda.anterior();
    }
    return;
  }
 
  //En el SONRÍE no se hace nada (no penaliza)
  if (estado === "sonrie") {
    return;
  }
 
  //Durante la partida, todo clic es una tentación que cuenta como ruido
  hayClic = true;
  for (let i = 0; i < botones.length; i++) {
    botones[i].presionar(); //Si el clic fue sobre un botón, la leyenda (texto) responde
  }
}
 
function keyPressed() {
  //TECLAS PROVISIONALES: para ver cada pantalla (se quitan en la versión final)
  if (key === "1") {
    volverAlInicio();
    return;
  } else if (key === "2") {
    empezarJuego();
    return;
  } else if (key === "3") {
    //Si todavía no hay partida, se empieza una para tener cámara y celdas
    if (estado === "inicio" || estado === "fin") {
      empezarJuego();
    }
    estado = "sonrie";
    inicioSonrie = millis();
    momentoSonrie = -1;
    return;
  } else if (key === "4") {
    if (estado === "inicio") {
      empezarJuego();
    }
    revelarCeldas(contarOcultas(), false); //Se revela todo el álbum de una vez
    terminarJuego();
    return;
  }
 
  //Cualquier otra tecla durante la partida cuenta como ruido
  if (estado === "espera") {
    hayClic = true;
  }
}
 
 
//CLASES
//CLASE VENTANA: El marco del reproductor (no tiene lógica de juego)
class Ventana {
  constructor(x, y, ancho, alto, titulo) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.titulo = titulo;
    this.altoTitulo = 28; //Altura de la barra de título
    this.altoControl = 70; //Altura de la barra de control (abajo)
  }
 
  dibujar() {
    //Cuerpo de la ventana
    stroke(COLOR_BORDE);
    strokeWeight(2);
    fill(COLOR_VENTANA);
    rect(this.x, this.y, this.ancho, this.alto);
 
    //Barra de título con degradado (una línea de cada color)
    noStroke();
    for (let i = 0; i < this.altoTitulo; i++) {
      let r = map(i, 0, this.altoTitulo, 107, 66);
      let g = map(i, 0, this.altoTitulo, 98, 58);
      let b = map(i, 0, this.altoTitulo, 184, 140);
      fill(r, g, b);
      rect(this.x + 1, this.y + 1 + i, this.ancho - 2, 1);
    }
 
    //Ícono (un circulito con los colores de la cianotipia) y título
    fill("#6FA7A0");
    circle(this.x + 18, this.y + 15, 13);
    fill("#154273");
    circle(this.x + 18, this.y + 15, 6);
    fill("#E9E5FA");
    textAlign(LEFT, CENTER);
    textSize(13);
    text(this.titulo, this.x + 34, this.y + 15);
 
    //Tres botoncitos decorativos de la ventana (minimizar, maximizar, cerrar)
    let bx = this.x + this.ancho - 72;
    let by = this.y + 6;
    stroke("#1B2742");
    strokeWeight(1);
    fill(COLOR_TEXTO);
    rect(bx, by, 20, 18);
    rect(bx + 23, by, 20, 18);
    rect(bx + 46, by, 20, 18);
    // símbolos: _  □  x
    stroke("#1B2742");
    line(bx + 5, by + 13, bx + 15, by + 13);
    noFill();
    rect(bx + 23 + 5, by + 4, 10, 9);
    line(bx + 46 + 5, by + 4, bx + 46 + 15, by + 14);
    line(bx + 46 + 15, by + 4, bx + 46 + 5, by + 14);
 
    //Barra de control (abajo) con degradado
    let yControl = this.y + this.alto - this.altoControl;
    noStroke();
    for (let i = 0; i < this.altoControl - 2; i++) {
      let r = map(i, 0, this.altoControl, 74, 50);
      let g = map(i, 0, this.altoControl, 67, 44);
      let b = map(i, 0, this.altoControl, 144, 105);
      fill(r, g, b);
      rect(this.x + 1, yControl + i, this.ancho - 2, 1);
    }
    //Línea de brillo arriba de la barra
    stroke(COLOR_BORDE);
    strokeWeight(1);
    line(this.x + 1, yControl, this.x + this.ancho - 1, yControl);
 
    //Etiqueta del medidor de ruido (las barras de la derecha)
    noStroke();
    fill(COLOR_TEXTO);
    textAlign(RIGHT, CENTER);
    textSize(11);
    text("ruido", 650, 598);

    //Barra de búsqueda (Decorativa: no muestra progreso)
    stroke(COLOR_BORDE);
    strokeWeight(1);
    fill(COLOR_VENTANA);
    rect(240, 580, 360, 10, 5);
    //La perilla va y viene muy despacio. Se mueve, pero no indica cuánto falta.
    let ciclo = frameCount % 1800;          //0 a 1799 (unos 30 s)
    let ida = abs(ciclo - 900);             //Baja de 900 a 0 y sube a 900
    let px = map(ida, 0, 900, 246, 594);
    noStroke();
    fill(COLOR_TEXTO);
    rect(px - 5, 576, 10, 18, 3);
  }
}
 
//CLASE JUGADOR: El visor de cámara. Hay 1 instancia.
//Representa la quietud del jugador real. Se mueve solo, según qué tan quieto esté.
class Jugador {
  constructor() {
    this.x = 480;               //Centro del visor
    this.y = 265;
    this.objetivoX = this.x;    //Hacia dónde se desliza
    this.objetivoY = this.y;
    this.indiceObjetivo = -1;   //Qué celda está mirando (posición en el arreglo celdas); -1 = ninguna
    this.ancho = 108;           //Un poquito más grande que una celda (100 x 75)
    this.alto = 83;
    this.visible = false;       //Solo se ve durante la partida
    this.respiracion = 0;       //Va de 0 a 1 y de 1 a 0 (para agrandarse y achicarse)
    this.direccion = 1;         //1 = se agranda, -1 = se achica
    this.temblor = 0;           //Cuántos píxeles tiembla en este frame
    this.susto = 0;             //Frames que le quedan de sacudida fuerte
  }
 
  //COMPORTAMIENTO 1: Mirar una celda. Se guarda cuál es y hacia dónde hay que deslizarse.
  irA(indice) {
    this.indiceObjetivo = indice;
    this.objetivoX = celdas[indice].x + celdas[indice].ancho / 2;
    this.objetivoY = celdas[indice].y + celdas[indice].alto / 2;
  }
 
  //COMPORTAMIENTO 2 (responde al jugador): Sacudirse fuerte cuando el jugador se interrumpe
  asustar() {
    this.susto = 40;
  }
 
  //¿Está encima de esta celda? (así las celdas saben si las están mirando)
  estaSobre(celda) {
    let centroX = celda.x + celda.ancho / 2;
    let centroY = celda.y + celda.alto / 2;
    return dist(this.x, this.y, centroX, centroY) < 20;
  }
 
  //COMPORTAMIENTO 3 y 4 (responden al jugador): Deslizarse, respirar y temblar según el ruido
  actualizar(ruido) {
    if (this.visible === false) {
      return;
    }
 
    //Se desliza hacia su celda: cada frame recorre un 4% de lo que le falta
    this.x = this.x + (this.objetivoX - this.x) * 0.04;
    this.y = this.y + (this.objetivoY - this.y) * 0.04;
 
    //Respira: la variable sube hasta 1, baja hasta 0 y vuelve a subir
    this.respiracion = this.respiracion + 0.02 * this.direccion;
    if (this.respiracion > 1) {
      this.respiracion = 1;
      this.direccion = -1;
    }
    if (this.respiracion < 0) {
      this.respiracion = 0;
      this.direccion = 1;
    }
 
    //Tiembla solo si el ruido pasa de 0.6 (con poco ruido se queda tranquilo)
    this.temblor = max(0, ruido - 0.6) * 6;
    if (this.susto > 0) {
      this.temblor = 6; //Sacudida fuerte
      this.susto--;
    }
  }
 
  dibujar() {
    if (this.visible === false) {
      return;
    }
 
    //Posición con temblor (un desplazamiento al azar en cada frame)
    let dx = random(-this.temblor, this.temblor);
    let dy = random(-this.temblor, this.temblor);
    let cx = this.x + dx;
    let cy = this.y + dy;
 
    //Tamaño con respiración (se agranda hasta 6 px)
    let w = this.ancho + this.respiracion * 6;
    let h = this.alto + this.respiracion * 5;
 
    //Color: más claro si se acaba de asustar
    if (this.susto > 0) {
      stroke("#F4F1FF");
    } else {
      stroke(COLOR_TEXTO);
    }
    strokeWeight(2.5);
    noFill();
 
    //Las cuatro esquinas del visor (cada una son dos líneas)
    let largo = 14;
    let izq = cx - w / 2;
    let der = cx + w / 2;
    let arr = cy - h / 2;
    let aba = cy + h / 2;
    //Arriba a la izquierda
    line(izq, arr, izq + largo, arr);
    line(izq, arr, izq, arr + largo);
    //Arriba a la derecha
    line(der, arr, der - largo, arr);
    line(der, arr, der, arr + largo);
    //Abajo a la izquierda
    line(izq, aba, izq + largo, aba);
    line(izq, aba, izq, aba - largo);
    //Abajo a la derecha
    line(der, aba, der - largo, aba);
    line(der, aba, der, aba - largo);
 
    //Puntico en el centro
    noStroke();
    fill(COLOR_TEXTO);
    circle(cx, cy, 4);
  }
}
 
//CLASE LEYENDA (TEXTOS SUBTÍTULOS): Los subtítulos del reproductor. Hay 1 instancia.
//Es una clase que guarda texto: Aparece suave, se queda y se desvanece.
class Leyenda {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.texto = "";        //Lo que se está mostrando ("" = nada)
    this.inicio = 0;        //Cuándo apareció este texto
    this.duracion = 0;      //Cuánto dura en ms (0 = se queda hasta que algo la cambie)
    this.frases = [];       //Para las secuencias: La lista de frases
    this.intervalo = 4000;  //Cuánto dura cada frase de la secuencia
    this.inicioSecuencia = 0;
    this.indice = 0;        //Cuál frase de la secuencia se está mostrando
    this.enSecuencia = false;
  }
 
  //Muestra una frase durante "duracion" milisegundos
  mostrar(texto, duracion) {
    this.texto = texto;
    this.inicio = millis();
    this.duracion = duracion;
    this.enSecuencia = false;
  }
 
  //Muestra una lista de frases una tras otra. La última se queda en pantalla.
  iniciarSecuencia(frases, intervalo) {
    this.frases = frases;
    this.intervalo = intervalo;
    this.inicioSecuencia = millis();
    this.indice = 0;
    this.enSecuencia = true;
    this.texto = frases[0];
    this.inicio = millis();
    this.duracion = intervalo;
  }
 
  //Salta a una frase concreta de la secuencia (se usa con los botones adelante y atrás)
  irAFrase(i) {
    this.indice = i;
    this.texto = this.frases[i];
    this.inicio = millis();
    this.inicioSecuencia = millis() - i * this.intervalo; //Así la secuencia sigue desde ahí
  }

  //Pasa a la frase siguiente (si hay una secuencia y no es la última)
  siguiente() {
    if (this.enSecuencia && this.indice < this.frases.length - 1) {
      this.irAFrase(this.indice + 1);
    }
  }

  //Vuelve a la frase anterior (si hay una secuencia y no es la primera)
  anterior() {
    if (this.enSecuencia && this.indice > 0) {
      this.irAFrase(this.indice - 1);
    }
  }

  //Quita lo que se esté mostrando
  apagar() {
    this.texto = "";
    this.enSecuencia = false;
  }
 
  //Si hay una secuencia, revisa si ya toca pasar a la siguiente frase
  actualizar() {
    if (this.enSecuencia === false) {
      return;
    }
    let paso = floor((millis() - this.inicioSecuencia) / this.intervalo);
    paso = min(paso, this.frases.length - 1); //No pasarse de la última
    if (paso !== this.indice) {
      this.indice = paso;
      this.texto = this.frases[paso];
      this.inicio = millis();
    }
    //La última frase se queda (duración 0); las demás duran un intervalo
    if (this.indice === this.frases.length - 1) {
      this.duracion = 0;
    } else {
      this.duracion = this.intervalo;
    }
  }
 
  dibujar() {
    if (this.texto === "") {
      return;
    }
    let t = millis() - this.inicio; //Cuánto lleva en pantalla
 
    //Transparencia: Aparece en 500 ms y, si tiene duración, se desvanece al final
    let alfa = constrain(map(t, 0, 500, 0, 255), 0, 255);
    if (this.duracion > 0) {
      let alfaSalida = constrain(map(t, this.duracion - 500, this.duracion, 255, 0), 0, 255);
      alfa = min(alfa, alfaSalida);
      if (t > this.duracion) {
        this.texto = ""; //Ya terminó
        return;
      }
    }
 
    //Barra oscura detrás del texto, como los subtítulos de un reproductor
    textAlign(CENTER, CENTER);
    textSize(16);
    let anchoBarra = textWidth(this.texto) + 40;
    noStroke();
    fill(18, 26, 48, alfa * 0.8);
    rect(this.x - anchoBarra / 2, this.y - 18, anchoBarra, 36, 4);
 
    //El texto
    fill(199, 193, 232, alfa);
    text(this.texto, this.x, this.y);
  }
}
 
//CLASE CELDA: Un cuadro del álbum. Hay 40 instancias.
// Estado 0 = Sin revelar (solo la cuadrícula)
// Estado 1 = Revelada (cambia de color con el tiempo y muestra su foto)
class Celda {
  constructor(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
 
    this.estado = 0; //Empieza oculta
    this.edad = 0;   //Frames desde que se reveló
    this.foto = null; //La imagen (o null si no hay)
    this.iluminada = false; //True si el visor del jugador está encima
    //Qué parte de la foto muestra esta celda
    this.sx = 0;
    this.sy = 0;
    this.sw = 0;
    this.sh = 0;
  }
 
  //COMPORTAMIENTO 0 (reacciona al jugador): Se entera si el visor la está mirando
  reaccionar(visor) {
    this.iluminada = visor.visible && visor.estaSobre(this);
  }
 
  //COMPORTAMIENTO 1 (lo provoca el jugador al quedarse quieto):
  //La celda aparece con su foto y su recorte
  revelarse(foto, sx, sy, sw, sh) {
    this.estado = 1;
    this.edad = 0;
    this.foto = foto;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
  }
 
  //COMPORTAMIENTO 2 (Pasa el tiempo): La celda "se oxida".
  //Solo avanza su edad; el color se calcula en dibujar().
  oxidarse() {
    if (this.estado === 1) {
      this.edad++;
    }
  }
 
  //COMPORTAMIENTO 3 (Lo provoca el jugador al interrumpirse, nivel 2+):
  //La celda se pierde y vuelve a quedar vacía
  borrarse() {
    this.estado = 0;
    this.edad = 0;
    this.foto = null;
  }
 
  dibujar() {
    if (this.estado === 0) {
      //Celda vacía: Solo el papel y la línea de la cuadrícula
      //Si el visor la está mirando, se ve un poquito más clara
      if (this.iluminada) {
        stroke(COLOR_BORDE);
        fill("#232F57");
      } else {
        stroke(COLOR_CUADRICULA);
        fill("#18223C");
      }
      strokeWeight(1);
      rect(this.x, this.y, this.ancho, this.alto);
      return;
    }
 
    //Celda revelada: Evolución de color tipo cianotipia
    // t va de 0 a 1 según la edad de la celda
    let t = constrain(this.edad / DURACION_REVELADO, 0, 1);
    let r, g, b, alfaFoto;
 
    if (t < 0.4) {
      //Revelado inicial ; Transición: De verde azulado a azul medio
      r = map(t, 0, 0.4, 111, 46);
      g = map(t, 0, 0.4, 167, 94);
      b = map(t, 0, 0.4, 160, 140);
      alfaFoto = map(t, 0, 0.4, 0, 90);
    } else if (t < 0.75) {
      //Transición ; Oxidación: De azul medio a azul de Prusia
      r = map(t, 0.4, 0.75, 46, 21);
      g = map(t, 0.4, 0.75, 94, 66);
      b = map(t, 0.4, 0.75, 140, 115);
      alfaFoto = map(t, 0.4, 0.75, 90, 150);
    } else {
      //Foto final: El azul de Prusia se queda y la foto se aclara
      r = 21;
      g = 66;
      b = 115;
      alfaFoto = map(t, 0.75, 1, 150, 255);
    }
 
    //El color de fondo de la celda
    noStroke();
    fill(r, g, b);
    rect(this.x, this.y, this.ancho, this.alto);
 
    //La foto encima (con tinte azul y transparencia que va subiendo)
    if (this.foto !== null) {
      tint(150, 190, 255, alfaFoto); //Tinte azul = Efecto cianotipia
      image(this.foto, this.x, this.y, this.ancho, this.alto,
            this.sx, this.sy, this.sw, this.sh);
      noTint();
    }
  }
}
 
//CLASE BARRA: Una barrita del medidor de ruido. Hay 14 instancias.
//Es el "visualizador" del reproductor, pero mide al jugador.
class Barra {
  constructor(x, yBase, ancho, altoMax) {
    this.x = x;
    this.yBase = yBase;   //La línea sobre la que "se paran" las barras
    this.ancho = ancho;
    this.altoMax = altoMax;
    this.alto = 3;        //Altura actual
    //Cada barra reacciona con distinta fuerza para que no se vean todas iguales
    this.fuerza = random(0.6, 1);
  }
 
  //COMPORTAMIENTO 4 (Responde al jugador): Sube con el ruido y baja en silencio
  reaccionar(nivel) {
    //A qué altura quiere llegar (mínimo 3 px para que siempre se vea)
    let objetivo = constrain(nivel * this.altoMax * this.fuerza, 3, this.altoMax);
    //Se acerca poco a poco al objetivo (así no tiembla)
    this.alto = this.alto + (objetivo - this.alto) * 0.2;
  }
 
  dibujar() {
    noStroke();
    if (nivelRuido > 1) {
      fill("#F4F1FF"); //Se pasó del límite: Las barras se aclaran
    } else {
      fill(COLOR_TEXTO);
    }
    rect(this.x, this.yBase - this.alto, this.ancho, this.alto);
  }
}
 
//CLASE BOTON: Botones circulares del reproductor. Hay 4 instancias.
//Son la tentación: invitan a hacer clic, pero hacer clic es ruido y se penaliza.
//Cada botón tiene una frase que sale en la leyenda (texto) cuando lo presionas durante la partida.
class Boton {
  constructor(x, y, diametro, tipo, mensaje) {
    this.x = x;
    this.y = y;
    this.d = diametro;
    this.tipo = tipo;     //"play", "stop", "atras" o "adelante"
    this.mensaje = mensaje; //Lo que dice la leyenda (texto) si lo presionas en la partida
    this.presionado = 0;  //Frames que le quedan hundido
    this.invita = false;  //True si debe brillar para invitar a hacer clic (play en inicio y fin)
  }
 
  //¿El mouse está encima del botón?
  estaEncima() {
    return dist(mouseX, mouseY, this.x, this.y) < this.d / 2;
  }
 
  //COMPORTAMIENTO 5 (Responde al jugador): Se hunde y la leyenda responde
  presionar() {
    if (this.estaEncima()) {
      this.presionado = 8;
      leyenda.mostrar(this.mensaje, 2600);
    }
  }
 
  dibujar() {
    let desplazamiento = 0;
    if (this.presionado > 0) {
      desplazamiento = 2; //Se baja un poquito
      this.presionado--;
    }
 
    //Anillo que late suave alrededor del botón (invita a presionarlo)
    if (this.invita) {
      let latido = abs((frameCount % 90) - 45) / 45 * 7; // Va de 0 a 7 y vuelve
      noFill();
      stroke(COLOR_TEXTO);
      strokeWeight(1);
      circle(this.x, this.y, this.d + 8 + latido);
    }
 
    //Cuerpo del botón (más claro si el mouse está encima)
    stroke(COLOR_TEXTO);
    strokeWeight(1.5);
    if (this.estaEncima()) {
      fill("#8B84C8");
    } else {
      fill("#6B62B8");
    }
    circle(this.x, this.y + desplazamiento, this.d);
 
    //Brillo arriba a la izquierda (da efecto 3D)
    noStroke();
    fill(255, 255, 255, 45);
    circle(this.x - this.d * 0.1, this.y - this.d * 0.15 + desplazamiento, this.d * 0.55);
 
    //Símbolo de cada tipo de botón
    fill("#E9E5FA");
    let y = this.y + desplazamiento;
    let u = this.d * 0.2; //Unidad de medida para dibujar el símbolo
    if (this.tipo === "play") {
      triangle(this.x - u * 0.6, y - u * 1.1, this.x - u * 0.6, y + u * 1.1, this.x + u * 1.2, y);
    } else if (this.tipo === "stop") {
      rect(this.x - u * 0.8, y - u * 0.8, u * 1.6, u * 1.6);
    } else if (this.tipo === "atras") {
      triangle(this.x + u * 0.5, y - u * 0.9, this.x + u * 0.5, y + u * 0.9, this.x - u * 0.8, y);
      rect(this.x - u * 1.1, y - u * 0.9, u * 0.3, u * 1.8);
    } else if (this.tipo === "adelante") {
      triangle(this.x - u * 0.5, y - u * 0.9, this.x - u * 0.5, y + u * 0.9, this.x + u * 0.8, y);
      rect(this.x + u * 0.8, y - u * 0.9, u * 0.3, u * 1.8);
    }
  }
}
 
//CLASE SENSORES: La cámara y el micrófono. Hay 1 instancia.
//Mide qué tanto se mueve o hace ruido el jugador y toma las fotos.
class Sensores {
  constructor() {
    this.camara = null;   //Se crea en iniciar()
    this.mic = null;
    this.anterior = [];   //Brillo del frame anterior (para comparar)
    this.movimiento = 0;  //Qué tanto cambió la imagen entre frames
    this.volumen = 0;     //Volumen del micrófono (0 a 1)
  }
 
  //Enciende cámara y micrófono (se llama tras el primer clic en play)
  iniciar() {
    this.camara = createCapture(VIDEO);
    this.camara.size(320, 240);
    this.camara.hide(); //Se oculta el video "crudo"; El jugador no se ve a sí mismo
 
    this.mic = new p5.AudioIn();
    this.mic.start();
  }
 
  //Mide movimiento y volumen en este frame
  actualizar() {
    if (this.camara === null) {
      return;
    }
 
    //MOVIMIENTO: Se compara este frame con el anterior
    this.camara.loadPixels();
    let pixelesCamara = this.camara.pixels;
    if (pixelesCamara.length > 0) {
      let suma = 0;
      let cuenta = 0;
      //Cada píxel ocupa 4 posiciones (R, G, B, A). Se salta de 64 en 64
      //Para revisar solo algunos y que el juego no se ponga lento.
      for (let i = 0; i < pixelesCamara.length; i += 64) {
        let actual = pixelesCamara[i];       // Canal rojo
        let previo = this.anterior[i];
        if (previo === undefined) {
          previo = actual;                   //Primer frame: Sin comparación
        }
        suma = suma + abs(actual - previo);  //Cuánto cambió este punto
        cuenta++;
        this.anterior[i] = actual;           //Se guarda para el próximo frame
      }
      let promedio = suma / cuenta;
      //Se suaviza para que un frame raro no dispare una interrupción
      this.movimiento = this.movimiento * 0.7 + promedio * 0.3;
    }
 
    //VOLUMEN: Qué tan fuerte suena el micrófono
    //Solo se mide si el micrófono existe y tiene la función getLevel. (Si la librería de sonido no cargó bien, el juego sigue solo con la cámara.)
    if (this.mic !== null && this.mic.getLevel) {
      this.volumen = this.volumen * 0.7 + this.mic.getLevel() * 0.3;
    }
  }
 
  //Convierte movimiento y volumen en un solo número de "ruido": 1 significa justo el límite; más de 1, interrupción.
  nivelRuido() {
    let porMovimiento = this.movimiento / UMBRAL_MOVIMIENTO;
    let porVolumen = this.volumen / UMBRAL_VOLUMEN;
    return max(porMovimiento, porVolumen);
  }
 
  //Toma una foto del momento, en blanco y negro (el tinte azul se le pone a cada celda al dibujarla). Devuelve null si no hay cámara.
  foto() {
    if (this.camara === null || this.camara.width === 0) {
      return null;
    }
    let imagen = this.camara.get(); //Copia del cuadro actual
    imagen.filter(GRAY);            //Se pasa a escala de grises
    return imagen;
  }
}
 