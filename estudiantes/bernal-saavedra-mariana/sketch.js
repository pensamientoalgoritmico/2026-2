// Mariana Bernal Saavedra 202420238
// Crossy Tongues

// Crossy Tongues se inspira de dos elementos principales, la desobediencia digital del autocorrector el cual aunque funciona como herramienta de ayuda, te frustra porque siempre cambia las palabras a unas que no quieres decir, y transforma tu mensaje en algo completamente diferente. Y, también en el juego Crossy Roads, que consiste en llevar a tu personaje a través de las calles, impidiendo que te atropellen. Decidí fusionar ambas ideas, siguiendo el formato simple de Crossy Roads, pero con un saboteo diferente en el cual hay checkpoints en que el jugador tiene que llenar en una caja de texto una frase asignada, y el juego va a tratar de sabotear al usuario al estar escribiendo la frase.

// Links referentes:
// - Crossy Road: https://crossyroadgame.io/
// - Autocorrector (referente): 
// - p5.js createInput (caja de texto): https://p5js.org/reference/p5/createInput/

// CLASES

// clase de zona: se refiere a las diferentes franjas del escenario que es el inicio, las calles, la zona segura, el lago, la orilla y el checkpoint.

class Zona {
  constructor(fila, tipo) {
    this.fila = fila; // número de fila (0 a 11)
    this.tipo = tipo; // 'inicio', 'calle', 'segura', 'lago' u 'orilla'
    this.y = fila * CELDA;
  }

  show() {
    noStroke();
    // los colores de esta clase ahora se reconocen con la variable "paleta" ya que dependiendo del nivel en el que está los colores se ven mas vibrantes, generando un nivel de estrés y cansancio visual, exacerbando la sensación de frustración al usuario que busco a través de la parte gráfica. 

    if (this.tipo === "segura") {
      // zona segura (no puede perder aquí): una franja morada con cuadros celestes adentro.
      fill(paleta.seguraFondo);
      rect(0, this.y + 7, width, 36);
      fill(paleta.seguraCuadros);
      for (let x = 0; x < width; x += 40) {
        rect(x + 4, this.y + 15, 32, 20); // el +4 deja un espacio entre cuadros
      }
    } else if (this.tipo === "lago") {
      // Zona del lago, esta contiene las plataformas moradas donde el jugador tiene que saltar una por una para cruzar el lago y llegar al checkpoint
      fill(paleta.lagoArena);
      rect(0, this.y, width, CELDA);
      fill(paleta.lagoVerde);
      rect(0, this.y + 17, width, 16);
    } else if (this.tipo === "orilla") {
      // orilla
      fill(paleta.lagoArena);
      rect(0, this.y, width, CELDA);
    } else if (this.tipo === "calle") {
      // calle: se refiere a las lineas punteadas que separan las franjas

      stroke(paleta.calleLinea);
      strokeWeight(2);
      for (let x = 0; x < width; x += 26) {
        line(x, this.y, x + 16, this.y);
      }
    }
  }
}

// Clase carros/ se encarga del elemento de los carros enemigos directos del jugador al ser que su propósito es atropellarlo

class Carro {
  constructor(
    fila,
    x,
    largo,
    velocidad,
    colorCuerpo,
    colorVentana,
    nVentanas,
    ciclo
  ) {
    this.fila = fila; // en qué fila (carril) está
    this.x = x; // posición horizontal (esquina izquierda)
    this.y = fila * CELDA + CELDA / 2; // centro vertical del carril: el inicio
    this.largo = largo;
    this.velocidad = velocidad; // píxeles que avanza por frame
    this.colorCuerpo = colorCuerpo;
    this.colorVentana = colorVentana;
    this.nVentanas = nVentanas;
    this.ciclo = ciclo;
  }

  show() {
    noStroke();

    fill(this.colorCuerpo);
    rect(this.x, this.y - 10, this.largo, 20);

    fill(this.colorVentana);
    let paso = (this.largo - 12) / this.nVentanas;
    for (let k = 0; k < this.nVentanas; k++) {
      rect(this.x + 6 + k * paso, this.y - 5, paso * 0.65, 10);
    }
  }

  mover() {
    // Sumo la velocidad a x. Si la velocidad es positiva avanza a la derecha, si es negativa avanza a la izquierda.
    this.x += this.velocidad;

    if (this.velocidad > 0 && this.x > width) {
      this.x -= this.ciclo;
    } else if (this.velocidad < 0 && this.x + this.largo < 0) {
      this.x += this.ciclo;
    }
  }

  // detectar si el carro toca al jugador, lo que indica perder el juego

  toca(j) {
    // Para que haya choque se tienen que cumplir las TRES condiciones a la vez
    return (
      // 1) están en la misma fila
      this.fila === j.fila &&
      // 2) el borde derecho del jugador pasó el borde izquierdo del carro
      j.x + j.radio > this.x &&
      // 3) el borde izquierdo del jugador no ha pasado el borde derecho del carro. Las condiciones 2 y 3 juntas significan "se están cruzando en horizontal".
      j.x - j.radio < this.x + this.largo
    );
  }
}

// Clase plataformas moradas las cuales se mueven por el lago, donde el jugador tiene que saltar de una a otra para poder cruzar.

class Plataforma {
  constructor(fila, x, ancho, velocidad, ciclo) {
    this.fila = fila; // en qué fila del lago está
    this.x = x; // posición horizontal (esquina izquierda)
    this.y = fila * CELDA + CELDA / 2; // centro vertical de la fila
    this.ancho = ancho;
    this.velocidad = velocidad;
    this.ciclo = ciclo;
  }

  show() {
    noStroke();

    fill(paleta.plataforma);
    rect(this.x, this.y - 17, this.ancho, 34);
  }

  mover() {
    this.x += this.velocidad;
    if (this.velocidad > 0 && this.x > width) {
      this.x -= this.ciclo;
    } else if (this.velocidad < 0 && this.x + this.ancho < 0) {
      this.x += this.ciclo;
    }
  }

  // detectar si el jugador está parado encima, devuelve true si el CENTRO del jugador está sobre esta plataforma.
  sostiene(j) {
    return this.fila === j.fila && j.x >= this.x && j.x <= this.x + this.ancho;
  }
}

// Clase CHECKPOINT: punto final del lago el cual pone a prueba al jugador con el efecto de autocorrector

class Checkpoint {
  constructor(columna, fila) {
    this.fila = fila;
    this.x = columna * CELDA + CELDA / 2;
    this.y = fila * CELDA + CELDA / 2;
    this.lado = 40;
  }

  show() {
    noStroke();

    // Acá se ve evidente el cambio de la paleta de colores cambiando de nivel, se vuelven mas vibrantes
    
    fill(paleta.checkpointBarra);
    rect(60, this.y - 20, 470, 40);

    // rotación del cuadrado que marca el CHECKPOINT

    push();
    translate(this.x, this.y);
    rotate(frameCount * 0.03);

    // Mitad de arriba del cuadrado (celeste)
    fill(paleta.checkpointArriba);
    rect(-this.lado / 2, -this.lado / 2, this.lado, this.lado / 2);
    // Mitad de abajo del cuadrado (verde)
    fill(paleta.checkpointAbajo);
    rect(-this.lado / 2, 0, this.lado, this.lado / 2);

    // Círculo rosado en el centro del cuadrado
    fill(paleta.checkpointCirculo);
    ellipse(0, 0, 24);
    pop();
  }

  // detectar o saber si el jugador llegó al checkpoint
  llego(j) {
    return this.fila === j.fila && dist(j.x, 0, this.x, 0) < CELDA / 2;
  }
}

// Clase jugador: personaje principal que representa al usuario en este juego, se mueve de casilla a casilla y se mueve con las flechas del teclado

class Jugador {
  constructor(columna, fila) {
    // Guardo el punto de partida para poder volver a él cuando pierda
    this.xInicial = columna * CELDA + CELDA / 2;
    this.filaInicial = fila;

    // Posición actual: x en píxeles, fila en casillas (0 a 11)
    this.x = this.xInicial;
    this.fila = fila;

    this.radio = 18; // medio ancho del jugador, se usa para los choques

    this.actualizarY();
  }

  // Traduce la fila a píxeles verticales (centro de la casilla)
  actualizarY() {
    this.y = this.fila * CELDA + CELDA / 2;
  }

  show() {
    noStroke();

    // Cinco círculos concéntricos del más grande al más chico
    fill(222, 60, 120);
    ellipse(this.x, this.y, 36);
    fill(150, 215, 230);
    ellipse(this.x, this.y, 28);
    fill(222, 72, 52);
    ellipse(this.x, this.y, 22);
    fill(245, 190, 60);
    ellipse(this.x, this.y, 16);
    fill(222, 60, 120);
    ellipse(this.x, this.y, 10);
  }

  // Movimiento según la tecla presionada
  mover(tecla) {
    // 38 = arriba, 40 = abajo, 37 = izquierda, 39 = derecha
    // Cada if revisa que sea la flecha correcta Y que no se salga del lienzo
    if (tecla === 38 && this.fila > 0) {
      this.fila--;
    } else if (tecla === 40 && this.fila < FILAS - 1) {
      this.fila++;
    } else if (tecla === 37 && this.x - CELDA >= 0) {
      this.x -= CELDA;
    } else if (tecla === 39 && this.x + CELDA <= width) {
      this.x += CELDA;
    }

    this.actualizarY();

    // Fuera del lago, la x se alinea con la casilla más cercana.
    // En el lago no, porque ahí la x tiene que quedar donde la dejó la plataforma.
    if (!this.enLago()) {
      this.alinearACuadricula();
    }
  }

  // Recorre las 12 columnas y se queda con el centro más cercano al jugador
  alinearACuadricula() {
    let mejorCentro = 0;
    let menorDistancia = 9999;
    for (let c = 0; c < COLUMNAS; c++) {
      let centro = c * CELDA + CELDA / 2;
      let d = dist(this.x, 0, centro, 0);
      if (d < menorDistancia) {
        menorDistancia = d;
        mejorCentro = centro;
      }
    }
    this.x = mejorCentro;
  }

  // Viajar con una plataforma: "v" es su velocidad y sumarla a x mueve al jugador igual
  arrastrar(v) {
    this.x += v;
  }

  // Volver al inicio cuando pierde pero a su vez se usa al cambiar el nivel para que el jugador vuelva a la primera fila. 
 
  reiniciar() {
    this.x = this.xInicial;
    this.fila = this.filaInicial;
    this.actualizarY();
  }

  // true si el jugador está en alguna fila del lago
  enLago() {
    return this.fila >= FILA_LAGO_INICIO && this.fila <= FILA_LAGO_FIN;
  }

  // true si el jugador se salió del lienzo por los lados
  fueraDelLienzo() {
    return this.x < 0 || this.x > width;
  } 
} 

// Clase Autocorrector: una palabra de la frase que tiene que escriir el jugador en el checkpoint, que el autocorrector puede cambiar por otra. Las palabras que se "autocorrigen" y por las palabras que se corrigen están en las variables


class Trampa {
  constructor(palabra, cambio) {
    this.palabra = palabra; // la palabra de la frase que se sabotea o no 
    this.cambio = cambio; // la palabra por la que el autocorrector la cambia 
    this.veces = 0; // cuántas veces ya fue saboteada en este intento (empieza en 0)
  }

  coincide(escrita) {
    return escrita.toLowerCase() === this.palabra;
  }

  // Devuelve true mientras todavía no haya llegado al máximo de sabotajes (MAX_SABOTAJES). Así se puede garantizar que el sabotaje no es eterno y es lograble escribir la frase para poder pasar el nivel. 

  puedeSabotear() {
    return this.veces < MAX_SABOTAJES;
  }

  // Vuelve el contador a 0: se llama cada vez que se abre la caja
  reiniciar() {
    this.veces = 0;
  }
}

// Clase Caja de Texto: inicia cuando el jugador llega al checkpoint, en primer lugar aparece el anuncio de la frase que debe escribir, el cuadro de texto y el sistema debe verificar si la frase que escribió esta bien para poder continuar, si esta es incorrecta lo devuelve al inicio.

class CajaFrase {
  constructor(frase, lienzo) {
    this.frase = frase; // la frase que el jugador debe escribir exactamente
    this.activa = false; // true mientras el anuncio y el cuadro de texto están en pantalla
    this.completada = false; // true cuando el jugador ya escribió bien la frase (para que no se vuelva a activar)
    this.mensaje = ""; // "Intenta de nuevo"
    this.tiempoLimite = 20; // segundos que tiene el jugador para escribir la frase
    this.inicioTiempo = 0; // momento (en milisegundos) en que se abrió la caja; se llena en activar()

    // datos del autocorrector 
    
    this.trampas = []; // las palabras que el autocorrector puede cambiar en este checkpoint
    this.probabilidad = 0; // probabilidad (0 a 1) de que cambie una palabra trampa cuando el jugador la termina de escribir
    this.aviso = ""; // mensaje rojo que aparece cuando el autocorrector cambia una palabra
    this.inicioAviso = -10000; // momento en que apareció el aviso; -10000 significa "hace mucho", o sea que no se muestra

    // createInput() crea el cuadro de texto HTML (ver https://p5js.org/reference/p5/createInput/)
    this.input = createInput("");

    // Ubico el cuadro de texto encima del lienzo: position() trabaja con coordenadas de la PÁGINA,
  
    let posLienzo = lienzo.position();
    this.input.position(posLienzo.x + 100, posLienzo.y + 345);

    // Ancho y alto del cuadro de texto, en píxeles
    this.input.size(400, 30);

    // Detectar la tecla ENTER o RETURN para dar la señal que se acabo de escribir la frase y que el sistema detecte si esta mal esrita y la debe repetir o esta bien y puede pasar de nivel. 

    // "keydown" = el momento en que se presiona una tecla mientras el cursor está dentro del cuadro.
    
    // "evento" trae la información de la tecla presionada. evento.key vale "Enter" tanto para la tecla
    
    this.input.elt.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        this.verificar(); // reviso si lo que escribió es igual a la frase
      }
    });

    // AUTOCORRECTOR
    
    // Cada vez que ocurre, se llama a this.autocorregir() y se le pasa "evento", que dice qué cambió.
    this.input.elt.addEventListener("input", (evento) => {
      this.autocorregir(evento);
    });

    // Bloquear el "pegar" (Ctrl+V / Cmd+V). preventDefault() cancela lo que el navegador iba a hacer; esto conatruido así el jugador no puede copiar la frase de la pantalla y pegarla para saltarse el reto.
    this.input.elt.addEventListener("paste", (evento) => {
      evento.preventDefault();
    });

    // Lo que permanece oculto, no está visible en la mayor parte del juego, solo se muestra cuando el jugador llega al checkpoint
    this.input.hide();
  }

  // Prepara la caja de texto para un checkpoint distinto (otra frase y otro tiempo de duración que se le da al jugador para escribir la frase asignada).
  
  // Se llama desde crearNivel() cada vez que empieza un nivel, así la MISMA caja sirve para los 4 checkpoints y no hay que crear 4 cuadros de texto.
  
  nuevaFrase(frase, tiempo, trampas, probabilidad) {
    this.frase = frase; // la nueva frase que hay que escribir
    this.tiempoLimite = tiempo; // los segundos que se tienen para este checkpoint
    this.trampas = trampas; // las palabras que el autocorrector puede cambiar en este checkpoint
    this.probabilidad = probabilidad; // qué tan seguido puede cambiar las palabras el efecto de "autocorrector" las cambia 
    this.activa = false; // la caja arranca cerrada
    this.completada = false; // la frase de este nivel todavía no se ha escrito
    this.mensaje = ""; // sin mensaje de error
    this.input.value(""); // cuadro de texto vacío
    this.input.hide(); // y oculto hasta que el jugador llegue al checkpoint
  }

  // Se activa cuando el jugador llega al checkpoint, solo se activa si no se completó antes y no estuvo activada
  activar() {

    if (!this.activa && !this.completada) {
      this.activa = true;
      this.mensaje = "";
      this.input.value("");
      this.input.show();
      this.input.elt.focus();
      // Guardo el instante exacto en que se abrió la caja. millis() devuelve los milisegundos que han pasado desde que arrancó el sketch; más adelante lo resto para saber cuánto tiempo ha pasado.
      this.inicioTiempo = millis();

      // Cada vez que se abre la caja el autocorrector empieza de cero: todas las trampas vuelven a tener sus sabotajes disponibles y se borra el aviso anterior
      
      for (let i = 0; i < this.trampas.length; i++) {
        this.trampas[i].reiniciar();
      }
      this.inicioAviso = -10000;
    }
  }


  // Funciona como un autocorrector de celular: cuando el jugador TERMINA una palabra (escribiendo un espacio o una coma), revisa esa palabra; si es una trampa, a veces la cambia por otra.
  
  autocorregir(evento) {
    // 1) Solo me interesa cuando el jugador ESCRIBE una letra ("insertText").
    
    // Si borra (backspace) o hace otra cosa, no hago nada, así corregir un error no dispara el autocorrector.
    if (evento.inputType !== "insertText") {
      return;
    }

    //solo actúa cuando lo que escribió es un espacio o una coma, que son los que cierran una palabra
    if (evento.data !== " " && evento.data !== ",") {
      return;
    }

    // solo actúa si el cursor está al final del texto (si está editando en la mitad, no hago nada)
    let texto = this.input.value();
    if (this.input.elt.selectionStart !== texto.length) {
      return;
    }

    // separa el texto en dos: el último carácter (el espacio o la coma) y todo lo anterior
    let delimitador = texto.charAt(texto.length - 1);
    let sinDelimitador = texto.substring(0, texto.length - 1);

    // busca dónde empieza la palabra que se acaba de cerrar: retrocedo letra por letra hasta encontrar un espacio, una coma o el principio del texto.
    
    let inicio = sinDelimitador.length;
    while (
      inicio > 0 &&
      sinDelimitador.charAt(inicio - 1) !== " " &&
      sinDelimitador.charAt(inicio - 1) !== ","
    ) {
      inicio--;
    }

    // La palabra es lo que queda entre "inicio" y el final. Si está vacía (por ejemplo, la coma de "Hola, " seguida de un espacio) no hay palabra nueva que revisar.
    
    let palabra = sinDelimitador.substring(inicio);
    if (palabra === "") {
      return;
    }

    // recorre las trampas de este checkpoint buscando si la palabra es una de ellas
    for (let i = 0; i < this.trampas.length; i++) {
      let t = this.trampas[i];

      // Es esta trampa Y todavía le quedan sabotajes disponibles?
      if (t.coincide(palabra) && t.puedeSabotear()) {
        // random(1) da un número entre 0 y 1. Si sale menor que la probabilidad del nivel, la cambio.

        if (random(1) < this.probabilidad) {
          let nueva = t.cambio;

          // Respeta la mayúscula: si el jugador escribió "Voy" con mayúscula inicial, la palabra nueva también empieza con mayúscula ("Voyager")
          let primera = palabra.charAt(0);
          if (primera !== primera.toLowerCase()) {
            nueva = nueva.charAt(0).toUpperCase() + nueva.substring(1);
          }

          // Arma el texto de nuevo: lo que estaba antes de la palabra + la palabra nueva + el espacio o la coma
          this.input.value(sinDelimitador.substring(0, inicio) + nueva + delimitador);

          t.veces++; // cuento este sabotaje (máximo MAX_SABOTAJES por palabra)

          // Preparo el aviso rojo para que el jugador entienda qué pasó
          this.aviso = 'Autocorregido: "' + palabra + '" por "' + nueva + '"';
          this.inicioAviso = millis();
        }

        return;
      }
    }
  }

  // El anuncio de lo que debe escribir se genera, indica escriba: "frase"
  show() {
    // Si no está activa no dibujo nada
    if (!this.activa) {
      return;
    }

    stroke(200, 40, 110);
    strokeWeight(4);
    fill(0);
    rect(50, 160, 500, 170); // más alto que antes (empieza en 160) para que quepa el temporizador arriba

    noStroke();
    textAlign(CENTER, CENTER);

    fill(245, 235, 80);
    textSize(18);
    text("Escribe esta frase:", width / 2, 220);

    // Las frases de los niveles 2, 3 y 4 son largas y no caben en una sola línea, entonces: 1) achica la letra según el largo de la frase y 2) uso text() con ancho y alto (text(frase, x, y, ancho, alto)), que parte el texto en varias líneas dentro de ese rectángulo.
    

    fill(255);
    if (this.frase.length <= 45) {
      textSize(20); // frase corta: letra grande
    } else if (this.frase.length <= 90) {
      textSize(16); // frase mediana
    } else {
      textSize(14); // frase muy larga
    }
    text(this.frase, 60, 230, 480, 60);

    fill(113, 195, 195);
    textSize(14);
    text("Presiona ENTER para enviar", width / 2, 295);

    fill(200, 40, 110);
    textSize(14);
    
    // Tiempo de 1.5 segundos (1500 milisegundos) después de un sabotaje, se muestra el aviso del autocorrector en otro rojo; pasado ese tiempo vuelve a mostrarse el mensaje normal
    
    if (millis() - this.inicioAviso < 1500) {
      fill(255, 70, 50);
      text(this.aviso, width / 2, 316);
    } else {
      text(this.mensaje, width / 2, 316);
    }

    // TEMPORIZADOR: temporizador caja de preguntas, mide el tiempo de 20 segundos en que el jugador tiene la oportunidad de escribir la frase en la caja de texto. Si no logra escribir la frase correcta en el tiempo que se le da pierde y tiene que volver a recorrer el nivel. Los tiempos cambian dependiendo de que nivel pues hay frases que son mas largas que otras. 


    // Pregunta cuántos segundos le quedan al jugador
    let restante = this.tiempoRestante();

    if (restante <= 5) {
      fill(222, 72, 52);
    } else {
      fill(176, 205, 110);
    }

    // Número de segundos
    textSize(20);
    text("Tiempo: " + ceil(restante), width / 2, 182);

    // Barra que se va encogiendo: map() convierte los segundos restantes (de 0 a 20)

    let anchoBarra = map(restante, 0, this.tiempoLimite, 0, 460);
    rect(70, 200, anchoBarra, 6);
  }

  // Calcula cuántos segundos le quedan al jugador. Devuelve un número entre 20 y 0
  tiempoRestante() {
    let transcurrido = (millis() - this.inicioTiempo) / 1000;

    // max() evita que el resultado baje de 0
    return max(0, this.tiempoLimite - transcurrido);
  }

  // Revisa si se acabó el tiempo. Corre en cada frame desde draw()
  revisarTiempo() {
    if (this.activa && this.tiempoRestante() <= 0) {
      // Se acaba el tiempo: se cierra la caja y oculta el cuadro de texto.

      this.activa = false;
      this.input.hide();

      // El jugador pierde y vuelve al inicio del NIVEL en el que estaba, no al nivel 1, igual que cuando lo atropella un carro o cae al agua

      jugador.reiniciar();
    }
  }

  // Compara lo que escribió el jugador con la frase. Esta orden empieza a correr cuando el jugador presiona la tecla ENTER o RETURN.

  verificar() {
    let escrito = this.input.value().trim();

    if (escrito === this.frase) {
      // Frase correcta: se cierra la caja y se oculta otra vez para seguir con el juego
      this.activa = false;
      this.completada = true;
      this.input.hide();

      // Si la frase está bien, se pasa al siguiente nivel (o se gana si era el último checkpoint).
     
      pasarDeNivel();
    } else {
      // Frase incorrecta: aviso y dejo el texto para que lo corrija
      this.mensaje = "No es igual a la frase, intenta de nuevo";
    }
  }
}


// VARIABLES GLOBALES


let CELDA = 50; // ancho y alto de cada celda donde se mueve el jugador principal
let FILAS = 12; // 12 filas donde transita en el encuadre el jugador
let COLUMNAS = 12; // 12 columnas

// Filas 8, 9 y 10 son las del lago amarillo, (las que tienen cuadrados morados encima de las lineas verdes).

let FILA_LAGO_INICIO = 8;
let FILA_LAGO_FIN = 10;

// Arreglos básicos
let zonas = []; // me refiero a las 12 franjas por las que se mueve el jugador en el encuadre
let carros = []; // todos los carros del juego
let plataformas = []; // todas las plataformas moradas del lago
let checkpoint; // dónde va a haber la caja de texto para llenar la frase y seguir jugando
let jugador; // personaje principal (circulo de colores)
let cajaFrase; // objeto de la clase CajaFrase: el anuncio con la frase + el cuadro de texto donde el jugador escribe

//NIVELES VARIABLES

let nivel = 0; // nivel actual: 0 = primero, 1 = segundo, 2 = tercero, 3 = cuarto (el último)
let TOTAL_NIVELES = 4; // cuántos checkpoints/niveles tiene el juego

// La frase de cada checkpoint, en orden: frases[0] es la del primer checkpoint, frases[3] la del último.
// El jugador las tiene que escribir EXACTAMENTE igual (mayúsculas, tildes y comas incluidas).
let frases = [
  "Voy a ir a comer ajiaco con mis amigas",
  "Hola, me llamo Lorenzo, amo comer dulces, pero especialmente me encanta el barrilete",
  "Las fotos de mi abuela están en el cajón derecho de mi clóset, abajo de las camisas",
  "Perdón por ponerte los cachos, yo qué hacía si estabas en el baño y quería besar a alguien, igual no significó nada",
];

// Segundos que tiene el jugador para escribir cada frase (una por nivel).
// Las frases nuevas son mucho más largas que la primera, por eso se les da más tiempo. Se pueden cambiar a gusto.
let tiemposLimite = [20, 25, 30, 40];


// Trampa(palabra, cambio): "palabra" es la de la frase y "cambio" es por la que el autocorrector la cambia. Ninguna es la última palabra de su frase porque el autocorrector solo actúa cuando la palabra se cierra con un espacio o una coma, y la última palabra nunca se cierra.

let trampas = [
  // Checkpoint 1
  [
    new Trampa("voy", "voyager"),
    new Trampa("comer", "correr"),
    new Trampa("ajiaco", "ajillo"),
  ],
  // Checkpoint 2
  [
    new Trampa("lorenzo", "lorena"),
    new Trampa("dulces", "duchas"),
    new Trampa("pero", "perro"),
  ],
  // Checkpoint 3
  [
    new Trampa("fotos", "focas"),
    new Trampa("cajón", "camión"),
    new Trampa("derecho", "izquierdo"),
  ],
  // Checkpoint 4 (el último)
  [
    new Trampa("cachos", "chicos"),
    new Trampa("baño", "banco"),
    new Trampa("besar", "pensar"),
  ],
];

// Probabilidad de que el autocorrector cambie una palabra trampa en cada nivel (0.4 = 40%, 1 = siempre)
let probabilidadesCambio = [0.4, 0.55, 0.7, 0.85];

// Máximo de veces que se puede sabotear la MISMA palabra en un intento. Después de eso la deja pasar, para que la frase siempre se pueda terminar.
let MAX_SABOTAJES = 2;

// Multiplicador de velocidad de carros y plataformas por nivel: 1 = velocidad original, 1.07 = 7% más rápido...

// Son aumentos pequeños para que siga siendo posible cruzar, solo que cada vez más difícil.
let factoresVelocidad = [1, 1.07, 1.14, 1.2];

let paletas = []; // las 4 paletas de colores (una por nivel); se llena en crearPaletas()
let paleta; // la paleta del nivel actual: las clases leen sus colores de aquí

let estado = "jugando"; // "jugando" mientras se juega, "victoria" cuando ya completó el último checkpoint


// SETUP


function setup() {
  // El lienzo mide 12*50 = 600 de ancho y 12*50 = 600 de alto
  // Lo guardo en la variable "lienzo" para poder preguntarle después en qué parte de la página está,
  // porque el cuadro de texto se posiciona con respecto a la página y no con respecto al lienzo
  let lienzo = createCanvas(600, 600);

 
  crearPaletas();

  // El jugador, circulo que se mueve con las flechas y representa al usuario
  // (se crea una sola vez; en cada nivel nuevo solo se le llama reiniciar() para devolverlo al inicio)

  jugador = new Jugador(6, 0);

  cajaFrase = new CajaFrase(frases[0], lienzo);

  crearNivel(0);
}

// DRAW

function draw() {
  background(0);

  // Si el jugador ya ganó, solo dibujo la pantalla de victoria y salgo de draw() con return; así los carros y las plataformas dejan de moverse y no se ejecuta nada más.
  
  if (estado === "victoria") {
    pantallaVictoria();
    return;
  }

  for (let i = 0; i < zonas.length; i++) {
    zonas[i].show();
  }

  checkpoint.show();

  // "sobrePlataforma" es una variable que empieza en false en cada frame., si la plataforma tiene al jugador encima esta cambia a true.

  let sobrePlataforma = false;

  for (let i = 0; i < plataformas.length; i++) {
    plataformas[i].mover();
    plataformas[i].show();

    // esta sosteniendo al jugador?
    if (plataformas[i].sostiene(jugador)) {
      // Si sí, el jugador viaja con ella: le paso la velocidad de la plataforma para que se mueva igual.
      jugador.arrastrar(plataformas[i].velocidad);
      sobrePlataforma = true;
    }
  }

  // Si el jugador está en una fila de lago y NINGUNA plataforma lo sostiene, cae al agua y pierde.
  if (jugador.enLago() && !sobrePlataforma) {
    jugador.reiniciar();
  }

  // Si una plataforma lo arrastró fuera del lienzo, también pierde.
  if (jugador.fueraDelLienzo()) {
    jugador.reiniciar();
  }

  // Carros y efecto en el jugador
  // Para cada carro hago tres cosas, en este orden:
  for (let i = 0; i < carros.length; i++) {
    carros[i].mover(); // se mueve
    carros[i].show(); // se dibuja en su nueva posición

    // le pregunto si está tocando al jugador. toca() devuelve true o false. Si es true, el jugador pierde y vuelve al inicio.
    if (carros[i].toca(jugador)) {
      jugador.reiniciar();
    }
  }

  // jugador y su comportamiento: se dibuja al final para que quede por encima de todo

  jugador.show();

  // letrero pequeño con el nivel actual (ej. "Nivel 2 / 4") en la esquina superior derecha
  mostrarNivel();

  // checkpoint: si el jugador llega al checkpoint aparece un mensaje que le avisa cual es el siguiente paso para que pueda seguir avanzando

  if (checkpoint.llego(jugador)) {
    // Le pido a la caja que se active (que muestre el anuncio y el cuadro de texto).
    // activar() se protege sola: si ya está activa o ya fue completada no hace nada,
    // así que no pasa nada por llamarla en cada frame mientras el jugador esté parado en el checkpoint.
    cajaFrase.activar();
  }

  // Reviso en cada frame si a la caja ya se le acabó el tiempo.
  // Si el temporizador llegó a 0 mientras el jugador escribía, revisarTiempo() cierra la caja
  // y manda al jugador de vuelta al inicio. Si la caja no está activa, no hace nada.
  cajaFrase.revisarTiempo();

  // Dibujo el anuncio con la frase por encima de todo lo demás.
  // Si la caja no está activa, show() no dibuja nada.
  cajaFrase.show();
}


// FUNCIONES

// paletas respectivas a cada nivel, cambian para volverse más vibrante.

function crearPaletas() {
  // NIVEL 1: colores originales
  paletas.push({
    carroLargoCuerpo: color(222, 72, 52), // cuerpo rojo naranjoso
    carroLargoVentana: color(104, 56, 150), // ventanas moradas
    carroMedianoCuerpo: color(222, 72, 52), // cuerpo rojo naranjoso
    carroMedianoVentana: color(176, 205, 110), // ventanas verde claro
    carroPequenoCuerpo: color(245, 235, 80), // cuerpo amarillo
    carroPequenoVentana: color(35, 90, 60), // ventanas verde oscuro
    calleLinea: color(110, 155, 165), // lineas punteadas de las calles
    seguraFondo: color(104, 80, 128), // franja morada de la zona segura
    seguraCuadros: color(113, 155, 165), // cuadros celestes de la zona segura
    lagoArena: color(190, 150, 85), // fondo ocre del lago y la orilla
    lagoVerde: color(176, 205, 110), // linea verde del lago
    plataforma: color(128, 88, 130), // plataformas moradas
    checkpointBarra: color(200, 85, 120), // barra rosada del checkpoint
    checkpointArriba: color(113, 195, 195), // mitad celeste del cuadrado
    checkpointAbajo: color(176, 205, 110), // mitad verde del cuadrado
    checkpointCirculo: color(200, 40, 110), // circulo rosado del centro
  });

  // NIVEL 2: un poco más vibrantes
  paletas.push({
    carroLargoCuerpo: color(240, 60, 40),
    carroLargoVentana: color(125, 50, 185),
    carroMedianoCuerpo: color(240, 60, 40),
    carroMedianoVentana: color(160, 235, 80),
    carroPequenoCuerpo: color(255, 240, 40),
    carroPequenoVentana: color(20, 120, 70),
    calleLinea: color(70, 190, 215),
    seguraFondo: color(130, 70, 175),
    seguraCuadros: color(60, 200, 225),
    lagoArena: color(225, 150, 40),
    lagoVerde: color(140, 235, 70),
    plataforma: color(160, 60, 170),
    checkpointBarra: color(240, 60, 130),
    checkpointArriba: color(50, 225, 225),
    checkpointAbajo: color(140, 235, 70),
    checkpointCirculo: color(235, 20, 120),
  });

  // NIVEL 3: bastante vibrantes
  paletas.push({
    carroLargoCuerpo: color(255, 45, 30),
    carroLargoVentana: color(150, 40, 235),
    carroMedianoCuerpo: color(255, 70, 20),
    carroMedianoVentana: color(120, 255, 60),
    carroPequenoCuerpo: color(255, 245, 0),
    carroPequenoVentana: color(0, 150, 80),
    calleLinea: color(0, 215, 255),
    seguraFondo: color(155, 50, 230),
    seguraCuadros: color(0, 225, 255),
    lagoArena: color(255, 140, 0),
    lagoVerde: color(100, 255, 60),
    plataforma: color(200, 40, 215),
    checkpointBarra: color(255, 30, 140),
    checkpointArriba: color(0, 245, 245),
    checkpointAbajo: color(100, 255, 60),
    checkpointCirculo: color(255, 0, 110),
  });

  // NIVEL 4: máxima saturación (casi neón)
  paletas.push({
    carroLargoCuerpo: color(255, 20, 20),
    carroLargoVentana: color(180, 0, 255),
    carroMedianoCuerpo: color(255, 30, 90),
    carroMedianoVentana: color(60, 255, 0),
    carroPequenoCuerpo: color(255, 255, 0),
    carroPequenoVentana: color(0, 200, 90),
    calleLinea: color(0, 255, 255),
    seguraFondo: color(190, 0, 255),
    seguraCuadros: color(0, 255, 240),
    lagoArena: color(255, 120, 0),
    lagoVerde: color(0, 255, 80),
    plataforma: color(255, 0, 220),
    checkpointBarra: color(255, 0, 150),
    checkpointArriba: color(0, 255, 255),
    checkpointAbajo: color(0, 255, 100),
    checkpointCirculo: color(255, 0, 80),
  });
}


// Código para poder repetirlo en cada nivel, y lo que cambia de un nivel a otro es: los colores, la velocidad, los huecos entre carros, el ancho de las plataformas y la frase del checkpoint.

function crearNivel(n) {
  // Vacío los arreglos para borrar todo lo del nivel anterior y empezar de cero
  zonas = [];
  carros = [];
  plataformas = [];

  nivel = n;
  paleta = paletas[n];

  // Cuánto se multiplican las velocidades en este nivel (1 en el primero, 1.2 en el último)
  let factor = factoresVelocidad[n];

  // Zonas de tránsito del jugador (calles, cera morada dónde el jugador no puede ser atropellado, lago amarillo con plataformas moradas, checkpoint franja)

  let tiposDeFila = [
    "inicio",
    "calle",
    "calle",
    "calle",
    "segura",
    "calle",
    "calle",
    "calle",
    "lago",
    "lago",
    "lago",
    "orilla",
  ];

  for (let i = 0; i < tiposDeFila.length; i++) {
    zonas.push(new Zona(i, tiposDeFila[i]));
  }

  //Creación de carros (forma y movimientos con velocidades y distancias entre carros)

  let filasCalle = [1, 2, 3, 5, 6, 7];

  // Velocidad de los carros, entre mayor sea el número, más velocidad hay y si está en negativo va para la ziquierda y positivo a la derecha

  let velocidades = [1.3, -0.8, 1.5, -1.2, 2.2, -3];

  // Multiplico cada velocidad por el factor del nivel. Como el factor es positivo,los carros que iban a la izquierda (negativos) siguen yendo a la izquierda, solo que más rápido.
  
  for (let i = 0; i < velocidades.length; i++) {
    velocidades[i] = velocidades[i] * factor;
  }

  // Largo de cada carro

  let largos = [200, 90, 60];

  for (let i = 0; i < filasCalle.length; i++) {
    // Primera zona: cuáles carros hay en las calles y sus velocidades

    let tipos = []; // tipo (0, 1 o 2) de cada carro del carril
    let huecos = []; // espacio libre que hay entre los carros asi no se estrellan entre ellos
    let ciclo = 0; // longitud total del carril

    for (let j = 0; j < 8; j++) {
      // randomizar el tipo de carro por carril
      let azar = random(1);
      let tipo;
      if (azar < 0.33) {
        tipo = 0;
      } else if (azar < 0.66) {
        tipo = 1;
      } else {
        tipo = 2;
      }

      // El espacio entre carros máximo se achica 10 píxeles por nivel (180, 170, 160, 150) para que los carros queden más juntos y sea más difícil. El mínimo sigue en 90, así que siempre cabe el jugador (mide 36).
      let hueco = random(90, 180 - n * 10); // espacio libre entre este carro y el siguiente
      tipos.push(tipo);
      huecos.push(hueco);
      // Cada carro suma a la cinta su propio largo más el hueco que le sigue
      ciclo += largos[tipo] + hueco;
    }

    let x = random(0, 200);
    for (let j = 0; j < tipos.length; j++) {
      // Según el tipo creo el carro con distintos parámetros estos siendo (fila, x, largo, velocidad, colorCuerpo, colorVentana, nVentanas, ciclo)


      if (tipos[j] === 0) {
        // Carro largo: cuerpo rojo naranjoso, 10 ventanas moradas
        carros.push(
          new Carro(
            filasCalle[i],
            x,
            200,
            velocidades[i],
            paleta.carroLargoCuerpo,
            paleta.carroLargoVentana,
            10,
            ciclo
          )
        );
      } else if (tipos[j] === 1) {
        // Carro mediano: cuerpo rojo naranjoso, 3 ventanas verde claro
        carros.push(
          new Carro(
            filasCalle[i],
            x,
            90,
            velocidades[i],
            paleta.carroMedianoCuerpo,
            paleta.carroMedianoVentana,
            3,
            ciclo
          )
        );
      } else {
        // Carro pequeño: cuerpo amarillo, 3 ventanas verde oscuro
        carros.push(
          new Carro(
            filasCalle[i],
            x,
            60,
            velocidades[i],
            paleta.carroPequenoCuerpo,
            paleta.carroPequenoVentana,
            3,
            ciclo
          )
        );
      }

      x += largos[tipos[j]] + huecos[j];
    }
  }

  // Plataformas moradas del lago (Segunda zona de movimiento que no son las calles)

  let filasLago = [8, 9, 10];
  let velocidadesLago = [1.2, -1.8, 1.5]; // velocidades que alternan de dirección tal como le sucede a los carros

  // Las plataformas también se aceleran con el factor del nivel
  for (let i = 0; i < velocidadesLago.length; i++) {
    velocidadesLago[i] = velocidadesLago[i] * factor;
  }

  let espacios = [100, 150, 120]; // distancia entre el inicio de una plataforma y el inicio de la siguiente

  // Las plataformas se van angostando 4 píxeles por nivel (60, 56, 52, 48), así hay menos espacio donde pararse. sostiene() usa el centro del jugador, entonces siempre se puede caer en ellas.
  
  let anchoPlataforma = 60 - n * 4;

  let cantidades = [7, 5, 6];

  for (let i = 0; i < filasLago.length; i++) {
    // Cantidad de plataformas en la fila y largo total de su cinta
    let cantidad = cantidades[i];
    let ciclo = cantidad * espacios[i]; // longitud total de la cinta

    // Cada carril empieza en un lugar distinto
    let inicio = random(0, espacios[i]);

    for (let j = 0; j < cantidad; j++) {
      plataformas.push(
        new Plataforma(
          filasLago[i],
          inicio + j * espacios[i],
          anchoPlataforma,
          velocidadesLago[i],
          ciclo
        )
      );
    }
  }

  // Checkpoint al final del lago (en este iría el autocorrector y la caja de texto)

  checkpoint = new Checkpoint(9, 11);

  cajaFrase.nuevaFrase(frases[n], tiemposLimite[n], trampas[n], probabilidadesCambio[n]);

  // El jugador arranca abajo (fila 0) en cada nivel nuevo
  jugador.reiniciar();
}

// Se llama cuando el jugador escribe bien la frase de un checkpoint (la llama CajaFrase.verificar()). Si todavía quedan niveles, arma el siguiente; si era el último checkpoint, el jugador gana.
function pasarDeNivel() {
  if (nivel === TOTAL_NIVELES - 1) {
    // Era el cuarto (último) checkpoint: ganó el juego
    estado = "victoria";
  } else {
    // Hay más niveles: armo el siguiente (nivel + 1)
    crearNivel(nivel + 1);
  }
}

// Vuelve a empezar todo el juego desde el nivel 1. La llaman la tecla R y el clic del mouse en la pantalla de victoria.
function reiniciarJuego() {
  estado = "jugando"; // vuelve a la pantalla de juego
  crearNivel(0); // arma el primer nivel otra vez
}

function mostrarNivel() {
  noStroke();
  fill(paleta.calleLinea);
  textSize(14);
  textAlign(RIGHT, TOP); // alineado a la derecha y arriba, para que x = width - 10 sea el borde derecho del texto
  text("Nivel " + (nivel + 1) + " / " + TOTAL_NIVELES, width - 10, 6);
}

// Pantalla de victoria que se muestra cuando el jugador completa el cuarto checkpoint
function pantallaVictoria() {
  noStroke();
  textAlign(CENTER, CENTER);

  fill(paletas[3].carroPequenoCuerpo);
  textSize(48);
  text("¡GANASTE!", width / 2, 240);

  fill(paletas[3].checkpointArriba);
  textSize(18);
  text("Escribiste las 4 frases sin que nadie te corrigiera, bueno parcialmente, pero no te dejaste!!!", 50, 265, 500, 70);

  fill(paletas[3].checkpointBarra);
  textSize(16);
  text("Presiona R o haz clic para jugar otra vez", width / 2, 350);
}


// EVENTOS

function keyPressed() {

  if (estado === "victoria") {
    if (key === "r" || key === "R") {
      reiniciarJuego();
    }
    return false;
  }

  // Si la caja está activa, el jugador está escribiendo la frase
  if (cajaFrase.activa) {
  
    return true;
  }

  // Si la caja no está activa, todo funciona como antes: la tecla presionada mueve al jugador y false evita que el navegador haga scroll con las flechas
  jugador.mover(keyCode);
  return false;
}


// En la pantalla de victoria, hacer clic dentro del lienzo reinicia el juego (igual que la tecla R).

function mousePressed() {

  let dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

  if (estado === "victoria" && dentro) {
    reiniciarJuego();
  }
}