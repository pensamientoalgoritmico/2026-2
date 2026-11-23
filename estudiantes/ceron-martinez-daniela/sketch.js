//Daniela Cerón (202513704)
//Ejntrega final: Mi juego esta pensado para que las personas (especialmente universitarios) reflexionen sobre que tanto afan cargan en su dia a dia ya que la juventud hoy en dia quiere ir a la par y siempre se esta preocupando por graduarse rapido, tener la hoja de vida llena rapido y "ganarle" a los demas. Muchas veces olvidamos que cada uno tiene todo el derecho de llevar su propio ritmo, entre mas sedisfrute el proceso, mas aprendizajes hay. En ese orden de ideas mi juego se basa en completar una serie de tareas muy sencillas pero que requieren de mucha paciencia, durante cada actividad habra un reloj en cuenta regresiva poniendo en mucha presion al jugador, el obejtivo del juego no es que las personas cumplan el tiempo estimado, la idea es que cada uno elabore las actividades a su ritmo porque si lo hace de afan el lienzo va a disminuir su tamaño lo que hara mas dificil la tarea. Ademas de esto habra una linea horizontal en la mitad del lienzo (eje x) la cual reacciona dependiendo de que tan rapido y brusco se mueve el mouse o se oprimen las teclas. Yo relaciono mucho el estado del jugador con los movimientos que hace, a lo que me refiero es que si la persona esta haciendo los movimientos con mucho afan y con la mente tensionada, se va a demorar mucho mas en realizar las tareas. Mi juego esta dividido en --- momentos, el primero es donde puse el titulo del juego y una breve explicacion, el segundo es la explicacion de la tarea 1 donde se ubica el boton de iniciar para que empiece el tiempo a correr y tambien inicie la musica, el tercer momento es la primera tarea, el cuarto es el resultado de la primera tarea y el transicionador para la tarea 2, el quinto es la explicacion de la segunda tarea, el sexto momento es el desarrollo de la tarea 2, el septimo es el resultado de la tarea 2 y el paso para la siguiente tarea, el octavo es la explicacion de la tarea numero 3, el noveno es la ejecucion de la tarea 3, el decimo es el resultado de la tarea 3, el momento 11 es la explicacion para la tarea 4, el 12 es la tarea 4, el 13 es el resultado de la tarea 4 y el 14 muestra el resultado de cada una de las actividades con los tiempos, todos los niveles hechos, un boton para reiniciar el juego y lo mas importante de mi juego: el mensaje. El mensaje que aparece en ese ultimo momento depende de como haya quedado el tiempo de las actividades del jugador; si el jugador completa las tareas en el tiempo establecido tiene un mensjae que invita a tomarse su tiempo y a disfrutar del proceso y lo felicita ironicamente, por el contrario, si no alcanzo a cumplir el tiempo da un mensaje de que lo esta haciendo bien por disfrutar del proceso y aprender. Por ultimo decidi añadirle una cancion a mi juego para que genere un poco de angustia y de presion.
//variables 
// Clases
// clase de circulos 
class TareaCirculo {
  constructor() {
    // Posición interna para que siempre enten dentro del cuadro
    this.nx = random(0.15, 0.85);
    this.ny = random(0.15, 0.85);
    this.tamBase = 45;
    this.colorG = color(30, 168, 255);
    this.mezcla = 0;
  }
  //vibracion de circulos
  moverse() {
    this.nx = this.nx + random(-0.002, 0.002);
    this.ny = this.ny + random(-0.002, 0.002);

    // limmites
    if (this.nx < 0.1) { this.nx = 0.1; }
    if (this.nx > 0.9) { this.nx = 0.9; }
    if (this.ny < 0.1) { this.ny = 0.1; }
    if (this.ny > 0.9) { this.ny = 0.9; }
  }
  actualizar(vel) {
    //evalua si la velocidad con la que se movió el mouse es mayor a 12
    let objetivo = 0;
    if (vel > 12) {
      //color si hay afan
      objetivo = 1; // Rojo de tensión
    } else {
      objetivo = 0; // Azul de calma
    }
    this.mezcla = lerp(this.mezcla, objetivo, 0.18);
    this.colorG = lerpColor(color(30, 168, 255), color(255, 56, 72), this.mezcla);
  }

  // Comportamiento 3: Dibuja la bolita calculando su posición real proporcional al tablero
  mostrar(m, factor) {
    let anchoCuadro = width - (m * 2);
    let altoCuadro = height - (m * 2);
    
    // Posición real adaptada al tamaño actual del lienzo
    let xReal = m + (this.nx * anchoCuadro);
    let yReal = m + (this.ny * altoCuadro);

    noFill();
    stroke(red(this.colorG), green(this.colorG), blue(this.colorG), 140);
    strokeWeight(2);
    ellipse(xReal, yReal, (this.tamBase * factor) + 14);

    fill(this.colorG);
    stroke(32, 24, 38, 120);
    strokeWeight(1.6);
    ellipse(xReal, yReal, this.tamBase * factor);

    fill(255, 250, 242, 230);
    noStroke();
    ellipse(xReal, yReal, (this.tamBase * factor) * 0.3);
  }
  fueClickeado(mx, my, m) {
    let anchoCuadro = width - (m * 2);
    let altoCuadro = height - (m * 2);
    let xReal = m + (this.nx * anchoCuadro);
    let yReal = m + (this.ny * altoCuadro);

    let distancia = dist(mx, my, xReal, yReal);
    let factorActual = map(m, 0, 220, 1, 0.5);
    
    if (distancia < (this.tamBase * factorActual) / 2) {
      return true;
    }
    return false;
  }
}

// Variables globales
//variables 
let tareas = [];
// Controla el tamaño del lienzo
let margen = 0;
// variable puntaje
let puntaje = 0;
// variable indicadora de numero del nivel
let fase = 1;
let factorVel = 1.0;
let direccionVel = 0.02;
// variable cancion
let sonidoPresion;

let tiempoInicio = 0;
let tiempoTranscurrido = 0;

let barraProgresoTarea3 = 0;
let ultimaPulsacion = 0;
let ultimaTeclaPresionada = "";
let penalizacionTeclado = 0;

let aciertosTarea4 = 0;
let anguloTarea4 = 0;
let momentoCalmaTarea4 = false;
let ultimaAccionTarea4 = 0;

let tarea1Completa = false;
let tarea2Completa = false;
let tarea3Completa = false;
let tarea4Completa = false;
let mostrandoTransicion = false;
let juegoTerminado = false;
let resumenTiempoTarea = "";
let tareaFueExcedida = false;

let mostrandoPortada = true;
let mostrandoInstruccion = false;
let tareasEnTiempo = 0;

let juegoPausado = false;
let inicioPausa = 0;
let fuenteIndicaciones = 'Comic Sans MS';
let anguloDecoracion = 0;
let nivelAfán = 0;
let historiaElectro = [];
let impulsoTeclaElectro = 0;
let resultadosTareas = ["", "", "", ""];
let tareaExcedidaLista = [false, false, false, false];
let ultimaTareaExcedida = false;

function preload() {
  sonidoPresion = loadSound("Rob Dougan - Clubbed to Death [Instrumental]-[AudioTrimmer.com].mp3");
}

//setup
function setup() {
  createCanvas(500, 500);
  textFont(fuenteIndicaciones);
  for (let i = 0; i < 167; i++) {
    historiaElectro.push(0);
  }
  // for para crear las instancias de los objetos
  for (let i = 0; i < 6; i++) {
    tareas.push(new TareaCirculo());
  }
}

//  draw
function draw() {
  background(22, 16, 26);
  textFont(fuenteIndicaciones);

  // variable para medir la velocidad del mouse
  let velocidadMouse = dist(mouseX, mouseY, pmouseX, pmouseY);
  let colorAzul = color(30, 168, 255);
  let colorRojo = color(255, 56, 72);
  let colorFondoFig = color(245, 182, 56);
  let colorFondoDetalle = color(168, 138, 214);
  if (!juegoPausado) {
    let esActividadTeclas = (fase === 3 || fase === 4);
    let intensidadOnda = 0;
    if (esActividadTeclas) {
      if (fase === 3 && penalizacionTeclado > 0) {
        impulsoTeclaElectro = max(impulsoTeclaElectro, 0.95);
      }
      intensidadOnda = constrain(impulsoTeclaElectro, 0, 1);
      impulsoTeclaElectro = max(0, impulsoTeclaElectro - 0.035);
    } else {
      intensidadOnda = constrain(velocidadMouse / 22, 0, 1);
    }
    let pulsoElectro = sin(frameCount * (0.14 + intensidadOnda * 0.8)) * (0.2 + intensidadOnda * 0.8) + (noise(frameCount * 0.25) - 0.5) * (0.35 + intensidadOnda * 1.45);
    historiaElectro.push(pulsoElectro);
    historiaElectro.shift();
    anguloDecoracion = anguloDecoracion + 0.01;
    let objetivoAfan = 0;
    if (fase === 3) {
      if (margen > 20 || penalizacionTeclado > 0) {
        objetivoAfan = 1;
      }
    } else if (fase === 4) {
      if (!momentoCalmaTarea4 && margen > 25) {
        objetivoAfan = map(margen, 25, 220, 0.2, 1);
      } else if (velocidadMouse > 10) {
        objetivoAfan = 0.7;
      }
    } else {
      if (velocidadMouse > 5 || margen > 45) {
        objetivoAfan = constrain(map(velocidadMouse, 5, 22, 0.2, 1), 0, 1);
        let afanMargen = constrain(map(margen, 45, 220, 0, 1), 0, 1);
        if (afanMargen > objetivoAfan) {
          objetivoAfan = afanMargen;
        }
      }
    }
    nivelAfán = lerp(nivelAfán, objetivoAfan, 0.12);

    if (mostrandoPortada || mostrandoTransicion || juegoTerminado || mostrandoInstruccion) {
      margen = 0;
    } else if (fase === 3) {
      if (penalizacionTeclado > 0) {
        penalizacionTeclado--;
      } else {
        let tiempoActual = millis();
        let intervaloTecla = tiempoActual - ultimaPulsacion;
        if (intervaloTecla > 800) {
          margen = margen - 0.5;
          if (margen < 0) {
            margen = 0;
          }
        }
      }
    } else {
      // Si hay movimiento rapido del mouse el tablero se encoge
      if (velocidadMouse > 5) {
        margen = margen + 3;
        if (margen > 220) {
          // Limite de encogimiento
          margen = 220;
        }
      } else {
        // Si hay calma con los movimientos del mouse, el tablero se vuelve a abrir lentamente
        margen = margen - 0.3;
        if (margen < 0) {
          margen = 0;
        }
    }
    }
  }

  let colorDifuminado = lerpColor(colorAzul, colorRojo, nivelAfán);
  let hayTension = nivelAfán > 0.35;

  noStroke();
  let pulsoSuave = sin(anguloDecoracion * 1.4) * 18;
  fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 22);
  ellipse(95, 95, 230 + pulsoSuave, 185 - pulsoSuave * 0.5);
  fill(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 22);
  ellipse(405, 405, 245 - pulsoSuave * 0.5, 205 + pulsoSuave);
  fill(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 18);
  ellipse(250, 250, 320 + pulsoSuave, 320 + pulsoSuave);
  for (let pt = 0; pt < 24; pt++) {
    let xPt = ((pt * 83) + 34) % width;
    let yPt = ((pt * 119) + 47) % height;
    let rPt = (pt % 3 === 0) ? 5 : 3.2;
    let flotarY = sin(anguloDecoracion * 2.2 + pt) * 3;
    if (pt % 2 === 0) {
      fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 85);
    } else {
      fill(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 80);
    }
    ellipse(xPt, yPt + flotarY, rPt, rPt);
  }
  let pulsosFondo = [
    [68, 86, 46],
    [392, 92, 52],
    [76, 412, 48],
    [388, 404, 54],
    [224, 56, 44],
    [226, 446, 48]
  ];
  let ritmosPulso = juegoPausado ? 0 : (anguloDecoracion * (3.5 + nivelAfán * 8));
  for (let b = 0; b < pulsosFondo.length; b++) {
    let bxPulso = pulsosFondo[b][0];
    let byPulso = pulsosFondo[b][1];
    let anchoPulso = pulsosFondo[b][2];
    let latido = sin(ritmosPulso + b * 1.3);
    let pico = (6 + nivelAfán * 9) * abs(latido);
    let sacudida = (!juegoPausado && hayTension) ? random(-1.5, 1.5) * nivelAfán : 0;
    noFill();
    if (b % 2 === 0) {
      stroke(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 68);
    } else {
      stroke(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 64);
    }
    strokeWeight(1.8);
    beginShape();
    vertex(bxPulso, byPulso + sacudida);
    vertex(bxPulso + anchoPulso * 0.25, byPulso + sacudida);
    vertex(bxPulso + anchoPulso * 0.42, byPulso - pico + sacudida);
    vertex(bxPulso + anchoPulso * 0.56, byPulso + pico * 0.75 + sacudida);
    vertex(bxPulso + anchoPulso * 0.72, byPulso + sacudida);
    vertex(bxPulso + anchoPulso, byPulso + sacudida);
    endShape();
  }
  noStroke();

  // Calcular para que los circulos sean proporcionales al tamaño del lienzo
  let factorEscala = map(margen, 0, 220, 1, 0.5);

  let anchoTablero = width - (margen * 2);
  let altoTablero = height - (margen * 2);

  fill(10, 8, 14, 145);
  noStroke();
  rect(margen + 6, margen + 7, anchoTablero, altoTablero, 8);

  // Dibujar el lienzo
  if (fase === 3 && penalizacionTeclado > 0) {
    fill(204, 196, 206);
  } else {
    fill(252, 248, 242);
  }
  stroke(colorDifuminado);
  strokeWeight(map(nivelAfán, 0, 1, 3, 5.5));
  rect(margen, margen, anchoTablero, altoTablero, 8);

  if (anchoTablero > 30 && altoTablero > 30) {
    noStroke();
    fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 36);
    ellipse(margen + anchoTablero * 0.22, margen + altoTablero * 0.24, min(anchoTablero, altoTablero) * 0.52, min(anchoTablero, altoTablero) * 0.36);
    fill(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 34);
    ellipse(margen + anchoTablero * 0.78, margen + altoTablero * 0.74, min(anchoTablero, altoTablero) * 0.56, min(anchoTablero, altoTablero) * 0.38);
    fill(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 24);
    ellipse(margen + anchoTablero * 0.5, margen + altoTablero * 0.55, min(anchoTablero, altoTablero) * 0.68, min(anchoTablero, altoTablero) * 0.44);

    for (let ip = 0; ip < 18; ip++) {
      let pxTab = margen + 18 + ((ip * 73) % max(20, anchoTablero - 36));
      let pyTab = margen + 18 + ((ip * 109) % max(20, altoTablero - 36));
      let tamPtTab = (ip % 3 === 0) ? 5.5 : 3.5;
      let olaPtTab = sin(anguloDecoracion * 2.4 + ip * 0.9) * 3.5;
      if (ip % 2 === 0) {
        fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 88);
      } else {
        fill(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 82);
      }
      ellipse(pxTab, pyTab + olaPtTab, tamPtTab, tamPtTab);
    }

    let pulsosTablero = [
      [margen + 24, margen + altoTablero * 0.78, min(56, anchoTablero * 0.16)],
      [margen + anchoTablero - min(80, anchoTablero * 0.22), margen + altoTablero * 0.78, min(56, anchoTablero * 0.16)],
      [margen + anchoTablero * 0.5 - 28, margen + altoTablero * 0.86, 56]
    ];
    for (let ptb = 0; ptb < pulsosTablero.length; ptb++) {
      let xPb = pulsosTablero[ptb][0];
      let yPb = pulsosTablero[ptb][1];
      let wPb = pulsosTablero[ptb][2];
      if (xPb + wPb < margen + anchoTablero - 10 && yPb > margen + 65) {
        let ondaPb = sin(ritmosPulso * 1.15 + ptb * 1.6);
        let picoPb = (5 + nivelAfán * 8) * abs(ondaPb);
        noFill();
        if (ptb % 2 === 0) {
          stroke(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 72);
        } else {
          stroke(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 68);
        }
        strokeWeight(1.7);
        beginShape();
        vertex(xPb, yPb);
        vertex(xPb + wPb * 0.25, yPb);
        vertex(xPb + wPb * 0.42, yPb - picoPb);
        vertex(xPb + wPb * 0.56, yPb + picoPb * 0.75);
        vertex(xPb + wPb * 0.72, yPb);
        vertex(xPb + wPb, yPb);
        endShape();
   }
    }
    noStroke();
  }

  if (anchoTablero > 20 && altoTablero > 20) {
    noFill();
    stroke(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 145);
    strokeWeight(1.8);
    rect(margen + 6, margen + 6, anchoTablero - 12, altoTablero - 12, 5);
  }
  noStroke();

  if (anchoTablero > 50 && altoTablero > 80 && !mostrandoPortada && !mostrandoInstruccion && !mostrandoTransicion && !juegoTerminado) {
    let nivelOndaActual = (fase === 3 || fase === 4) ? constrain(impulsoTeclaElectro, 0, 1) : constrain(velocidadMouse / 22, 0, 1);
    let ampElectro = map(nivelOndaActual, 0, 1, 16, 120) * factorEscala;
    let xInicio = margen + 10;
    let xFin = width - margen - 10;
    let pasoX = 3;

    stroke(80, 220, 255, 110);
    strokeWeight(1.5);
    for (let x = xInicio; x < xFin - pasoX; x = x + pasoX) {
      let idx1 = floor(map(x, xInicio, xFin, 0, historiaElectro.length - 2));
      let idx2 = idx1 + 1;
      let y1 = height / 2 + historiaElectro[idx1] * ampElectro - 6;
      let y2 = height / 2 + historiaElectro[idx2] * ampElectro - 6;
      line(x, y1, x + pasoX, y2);
    }
    stroke(80, 220, 255, 255);
    strokeWeight(2.5);
    for (let x = xInicio; x < xFin - pasoX; x = x + pasoX) {
      let idx1 = floor(map(x, xInicio, xFin, 0, historiaElectro.length - 2));
      let idx2 = idx1 + 1;
      let y1 = height / 2 + historiaElectro[idx1] * ampElectro;
      let y2 = height / 2 + historiaElectro[idx2] * ampElectro;
      line(x, y1, x + pasoX, y2);
    }
    noStroke();
  }
  // Texto
  fill(32, 24, 38);

  let instanteReloj = juegoPausado ? inicioPausa : millis();
  let segundosPasados = floor((instanteReloj - tiempoInicio) / 1000);
  let limiteTiempo = 20;
  if (fase === 2) {
    limiteTiempo = 35;
  } else if (fase === 3) {
    limiteTiempo = 15;
  } else if (fase === 4) {
    limiteTiempo = 45;
   }
  
  let tiempoRestante = limiteTiempo - segundosPasados;
  let textoMinutos = "0:";
  let segundosMostrar;
  if (tiempoRestante >= 0) {
    fill(colorAzul);
    segundosMostrar = tiempoRestante;
    if (segundosMostrar < 10) {
      segundosMostrar = "0" + segundosMostrar;
    }
  } else {
    let tiempoExcedido = segundosPasados - limiteTiempo;
    fill(colorRojo);
    segundosMostrar = tiempoExcedido;
    if (segundosMostrar < 10) {
      segundosMostrar = "0" + segundosMostrar;
    }
  }
  // Cambio de fase solo cuando estamos en la fase 1
  if (fase === 1 && puntaje >= 25 && !tarea1Completa && !mostrandoInstruccion && !mostrandoPortada) {
    tarea1Completa = true;
    if (tiempoRestante >= 0) {
      tareasEnTiempo++;
      tareaFueExcedida = false;
      tareaExcedidaLista[0] = false;
      resumenTiempoTarea = "A tiempo: " + textoMinutos + segundosMostrar + " restantes";
      resultadosTareas[0] = textoMinutos + segundosMostrar + " restantes";
    } else {
      tareaFueExcedida = true;
      tareaExcedidaLista[0] = true;
      resumenTiempoTarea = "Fuera de tiempo: " + textoMinutos + segundosMostrar + " de exceso";
      resultadosTareas[0] = "+" + textoMinutos + segundosMostrar + " de exceso";
    }
    mostrandoTransicion = true;
  }
  if (!mostrandoPortada && !mostrandoTransicion && !juegoTerminado && !mostrandoInstruccion) {
    textSize(30);
    textAlign(RIGHT);
    text(textoMinutos + segundosMostrar, width - margen - 20, margen + 46);
    textAlign(LEFT);
    textSize(12);
    let px = width - margen - 135;
    let py = margen + 24;
    let pw = 24;
    let ph = 24;

    fill(juegoPausado ? colorRojo : colorAzul);
    stroke(32, 24, 38);
    strokeWeight(1.8);
    rect(px, py, pw, ph, 5);
    if (juegoPausado) {
      fill(255);
      noStroke();
      triangle(px + 8, py + 6, px + 8, py + 18, px + 18, py + 12);
    } else {
      fill(255);
      noStroke();
      rect(px + 6, py + 6, 4, 12, 1);
      rect(px + 14, py + 6, 4, 12, 1);
    }
  }
  if (mostrandoPortada) {
    noStroke();
    fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 46);
    ellipse(width / 2 - 35, 108, 250 + pulsoSuave * 0.4, 96);
    fill(red(colorFondoDetalle), green(colorFondoDetalle), blue(colorFondoDetalle), 40);
    ellipse(width / 2 + 38, 124, 225 - pulsoSuave * 0.3, 84);
    for (let i = 0; i < 16; i++) {
      let angPt = (TWO_PI / 16) * i + anguloDecoracion * 0.6;
      fill(i % 2 === 0 ? colorFondoFig : colorFondoDetalle);
      ellipse(width / 2 + cos(angPt) * 165, 205 + sin(angPt * 1.4) * 95, 4.5, 4.5);
    }
    textAlign(CENTER);
    fill(24, 18, 44);
    textSize(32);
    text("El peso del impulso", width / 2, 114);

    fill(18, 44, 92);
    textSize(15.5);
    text("Hay un reloj corriendo y cuatro pruebas frente a ti.", width / 2, 174);
   text("Entra a tu manera, sigue tu propio ritmo", width / 2, 198);
    text("y observa qué ocurre mientras avanzas.", width / 2, 222);

    fill(colorAzul);
    textSize(17);
    text("¿Estás listo para cumplir con las tareas?", width / 2, 276);
    let ox = width / 2 - 72;
    let oy = 316;
    let ow = 144;
    let oh = 44;
    fill(colorAzul);
    stroke(32, 24, 38);
    strokeWeight(2.2);
    rect(ox, oy, ow, oh, 9);
    fill(255);
    noStroke();
    textSize(17);
    text("Empezar", ox + ow / 2, oy + 28);
    textAlign(LEFT);
    textSize(12);
  } else if (juegoTerminado) {
    let resultadoATiempo = tareasEnTiempo > 2;
    let esEmpateTiempo = tareasEnTiempo === 2;
    let colorResalte = resultadoATiempo ? colorAzul : (esEmpateTiempo ? colorFondoDetalle : colorRojo);
    fill(red(colorFondoFig), green(colorFondoFig), blue(colorFondoFig), 38);
    stroke(red(colorResalte), green(colorResalte), blue(colorResalte), 185);
    strokeWeight(2.4);
    rect(24, 42, width - 48, 136, 12);
    noStroke();
    fill(18, 44, 92);
    textSize(14.5);
    textAlign(CENTER);
    if (resultadoATiempo) {
      text("felicidades!! lograste completar las tareas en el", width / 2, 74);
       text("tiempo asignado pero tal vez no disfrutaste del", width / 2, 98);
      text("proceso ni aprendiste de el.", width / 2, 122);
    } else if (esEmpateTiempo) {
      text("La mitad de las tareas salieron a tiempo, qué bueno que", width / 2, 68);
      text("lo lograste, aunque lastimosamente no disfrutaste ni", width / 2, 90);
      text("aprendiste del proceso. La buena noticia es que en las otras 2", width / 2, 112);
    text("sí aprendiste a ir a tu propio ritmo, que es lo más valioso.", width / 2, 134);
    } else {
      text("A pesar de que no lograste completar las actividades", width / 2, 74);
      text("en el tiempo asignado vale mucho mas hacerlo a tu", width / 2, 98);
      text("ritmo aprendiendo del proceso y disfrutando cada parte de el.", width / 2, 122);
    }
    let nombresTareas = ["Tarea 1", "Tarea 2", "Tarea 3", "Tarea 4"];
    for (let t = 0; t < 4; t++) {
      let yFila = 204 + t * 29;
      fill(255, 255, 255, 165);
      stroke(32, 24, 38, 65);
      strokeWeight(1.2);
      rect(36, yFila - 15, width - 72, 23, 6);
      noStroke();

      fill(32, 24, 38);
      textSize(12);
      textAlign(LEFT);
      text(nombresTareas[t], 50, yFila + 1);
      let textoTiempoFila = resultadosTareas[t] !== "" ? resultadosTareas[t] : "--";
      fill(tareaExcedidaLista[t] ? colorRojo : colorAzul);
      textAlign(RIGHT);
      text(textoTiempoFila, width - 50, yFila + 1);
    }

    let estadosCaminito = [tarea1Completa, tarea2Completa, tarea3Completa, tarea4Completa];
    let inicioX = width / 2 - 105;
    let separacionHex = 70;
    let yCaminito = 356;
    let radioHex = 21;
    stroke(32, 24, 38);
    strokeWeight(2.5);
    line(inicioX, yCaminito, inicioX + separacionHex * 3, yCaminito);

    for (let i = 0; i < 4; i++) {
      let hx = inicioX + i * separacionHex;
      if (estadosCaminito[i]) {
        fill(colorAzul);
        stroke(32, 24, 38);
      } else {
        fill(236, 232, 244);
        stroke(115, 98, 132);
  }
      strokeWeight(2);
      beginShape();
      for (let a = 0; a < 6; a++) {
        let ang = TWO_PI / 6 * a;
        let vx = hx + cos(ang) * radioHex;
        let vy = yCaminito + sin(ang) * radioHex;
        vertex(vx, vy);
      }
      endShape(CLOSE);
      fill(32, 24, 38);
      noStroke();
      textSize(10);
      textAlign(CENTER);
      text("Nivel", hx, yCaminito - radioHex - 5);
      fill(estadosCaminito[i] ? 255 : 32);
      textSize(12);
      text(i + 1, hx, yCaminito + 4);
    }
    let rx = width / 2 - 68;
    let ry = 426;
    let rw = 136;
    let rh = 42;
    fill(colorAzul);
    stroke(32, 24, 38);
    strokeWeight(2);
    rect(rx, ry, rw, rh, 8);

   fill(255);
    noStroke();
    textSize(14);
    textAlign(CENTER);
    text("Jugar de nuevo", rx + rw / 2, ry + 26);
    textAlign(LEFT);
    textSize(12);
} else if (mostrandoInstruccion) {
    fill(colorAzul);
    textSize(26);
    textAlign(CENTER);
    text("Tarea " + fase, width / 2, 96);
    textSize(21);
    fill(24, 18, 44);
    if (fase === 1) {
      text("Haz clic en los circulos", width / 2, 142);
      text("(Meta: 25 puntos)", width / 2, 170);
    } else if (fase === 2) {
      text("Sigue el centro del círculo", width / 2, 142);
      text("con el cursor (Meta: 1000)", width / 2, 170);
    } else if (fase === 3) {
      text("Presiona alternado 'a' y 's'", width / 2, 142);
       text("con calma", width / 2, 170);
    } else if (fase === 4) {
     text("Presiona ESPACIO", width / 2, 142);
      text("cuando este azul", width / 2, 170);
    }
    textSize(16);
    fill(18, 44, 92);
    text("El tiempo inicia cuando presiones Comenzar", width / 2, 222);

    let ix = width / 2 - 74;
    let iy = 266;
    let iw = 148;
    let ih = 46;
     fill(colorAzul);
    stroke(32, 24, 38);
    strokeWeight(2.2);
    rect(ix, iy, iw, ih, 9);

    fill(255);
    noStroke();
    textSize(17);
   text("Comenzar", ix + iw / 2, iy + 29);
    textAlign(LEFT);
    textSize(12);
  } else if (mostrandoTransicion) {
    fill(24, 18, 44);
    textSize(26);
    textAlign(CENTER);
    text("Tarea " + fase + " completada", width / 2, 92);
   textSize(20);
    fill(tareaFueExcedida ? colorRojo : colorAzul);
  text(resumenTiempoTarea, width / 2, 130);
   textSize(16.5);
    fill(18, 44, 92);
    text("Presiona Siguiente para avanzar", width / 2, 166);
    textAlign(LEFT);
  } else if (fase === 1) {
    fill(32, 24, 38);
    text("Tarea 1: Haz clic en los circulos (Meta: 25 puntos)", margen + 20, margen + 30);
    fill(colorDifuminado);
    text("Puntaje: " + puntaje, margen + 20, margen + 60);

    //pone a funcionar a todos los círculos al mismo tiempo
    for (let i = 0; i < tareas.length; i++) {
      if (!juegoPausado) {
        tareas[i].moverse();
 //Movimiento
        tareas[i].actualizar(velocidadMouse);
        //Reacciona al afán
      }
      tareas[i].mostrar(margen, factorEscala);
      // dibujarse proporcional
   }
  } 
  //Segunda tarea
  else if (fase === 2) {
    if (puntaje < 1000) {
      //texto
      fill(32, 24, 38);
      text("Tarea 2: Sigue el ritmo del círculo (Meta: 1000)", margen + 20, margen + 30);
      fill(colorDifuminado);
     text("Progreso: " + puntaje + " / 1000", margen + 20, margen + 60);
      let objetivo = tareas[0];
      //reconoce el  círculo que el jugador debe seguir
      if (objetivo.vx === undefined) {
        objetivo.vx = 0.003;
        objetivo.vy = 0.002;
      }
      
      if (!juegoPausado) {
       //varia la velocidad del circulo
        factorVel = factorVel + direccionVel;
        if (factorVel > 2.2 || factorVel < 0.4) {
          direccionVel = direccionVel * -1;
        }
        
   // mueve el círculo
        objetivo.nx += objetivo.vx * factorVel;
        objetivo.ny += objetivo.vy * factorVel;

 // rebotar en los bordes 
        if (objetivo.nx < 0.15 || objetivo.nx > 0.85) {
          objetivo.vx *= -1;
        }
        if (objetivo.ny < 0.15 || objetivo.ny > 0.85) {
          objetivo.vy *= -1;
        }

        objetivo.actualizar(velocidadMouse);
      }

      // coordenadas del objetivo
      let anchoCuadro = width - (margen * 2);
      let altoCuadro = height - (margen * 2);
      let xReal = margen + (objetivo.nx * anchoCuadro);
    let yReal = margen + (objetivo.ny * altoCuadro);
      let tamReal = (objetivo.tamBase * factorEscala) / 2;

      noFill();
      stroke(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 135);
      strokeWeight(2.5);
      ellipse(xReal, yReal, (objetivo.tamBase * factorEscala) + 30);
     stroke(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 75);
   strokeWeight(1.5);
      ellipse(xReal, yReal, (objetivo.tamBase * factorEscala) + 46);
      noStroke();

      objetivo.mostrar(margen, factorEscala);

      if (!juegoPausado) {
        //comprueba si el cursor está siguiendo el círculo
        let d = dist(mouseX, mouseY, xReal, yReal);
     if (d < tamReal && velocidadMouse <= 6) {
          puntaje += 1; 
        }
      }

      // meta de la tarea 2 al llegar a 1000
      if (puntaje >= 1000 && !tarea2Completa) {
        tarea2Completa = true;
        if (tiempoRestante >= 0) {
        tareasEnTiempo++;
          tareaFueExcedida = false;
          tareaExcedidaLista[1] = false;
          resumenTiempoTarea = "A tiempo: " + textoMinutos + segundosMostrar + " restantes";
          resultadosTareas[1] = textoMinutos + segundosMostrar + " restantes";
        } else {
          tareaFueExcedida = true;
          tareaExcedidaLista[1] = true;
          resumenTiempoTarea = "Fuera de tiempo: " + textoMinutos + segundosMostrar + " de exceso";
          resultadosTareas[1] = "+" + textoMinutos + segundosMostrar + " de exceso";
        }
        mostrandoTransicion = true;
      }
    }
  }
  else if (fase === 3) {
  fill(32, 24, 38);
    text("Tarea 3: Presiona alternado 'a' y 's' con calma", margen + 20, margen + 30);
    fill(colorDifuminado);
    text("Progreso barra: " + floor(barraProgresoTarea3) + " / 70", margen + 20, margen + 60);

    let anchoBarraTotal = (width - (margen * 2)) - 40;
    let altoBarra = 22;
    let xBarra = margen + 20;
    let yBarra = margen + 110;

    fill(236, 232, 244);
    stroke(32, 24, 38);
    strokeWeight(1.8);
    rect(xBarra, yBarra, anchoBarraTotal, altoBarra, 6);
    noStroke();

    if (penalizacionTeclado > 0) {
      fill(158, 152, 168);
    } else {
      fill(colorDifuminado);
    }
    let anchoActualBarra = map(barraProgresoTarea3, 0, 70, 0, anchoBarraTotal);
    rect(xBarra, yBarra, anchoActualBarra, altoBarra, 6);

    for (let d = 1; d < 7; d++) {
      let xMarca = xBarra + (anchoBarraTotal / 7) * d;
      stroke(32, 24, 38, 120);
      strokeWeight(1.5);
      line(xMarca, yBarra + 3, xMarca, yBarra + altoBarra - 3);
    }
    noStroke();

    let cx3 = width / 2;
    let cy3 = yBarra + altoBarra + ((height - margen - (yBarra + altoBarra)) / 2);
    let radioBase3 = map(barraProgresoTarea3, 0, 70, 24, 72) * factorEscala;
    if (radioBase3 < 10) {
      radioBase3 = 10;
    }

    for (let r = 3; r >= 1; r--) {
      noFill();
      if (penalizacionTeclado > 0) {
        stroke(158, 152, 168, 145);
      } else {
        stroke(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 155);
      }
    strokeWeight(2.5);
      ellipse(cx3, cy3, (radioBase3 * r) / 1.75);
    }

    push();
    translate(cx3, cy3);
    rotate(barraProgresoTarea3 * 0.08);
    if (penalizacionTeclado > 0) {
      fill(158, 152, 168);
    } else {
      fill(colorDifuminado);
    }
    stroke(32, 24, 38);
    strokeWeight(1.8);
   rectMode(CENTER);
    let ladoCentro3 = 28 * factorEscala;
    rect(0, 0, ladoCentro3, ladoCentro3, 6);
    rectMode(CORNER);
    pop();
    noStroke();

    for (let k = -4; k <= 4; k++) {
      if (k !== 0) {
        let lx = cx3 + k * (24 * factorEscala);
       if (lx > margen + 15 && lx < width - margen - 15) {
          stroke(red(colorDifuminado), green(colorDifuminado), blue(colorDifuminado), 140);
          strokeWeight(2);
          line(lx, cy3 - (11 * factorEscala), lx, cy3 + (11 * factorEscala));
      }
      }
    }
    noStroke();

    if (barraProgresoTarea3 >= 70 && !tarea3Completa) {
      tarea3Completa = true;
      if (tiempoRestante >= 0) {
       tareasEnTiempo++;
        tareaFueExcedida = false;
        tareaExcedidaLista[2] = false;
        resumenTiempoTarea = "A tiempo: " + textoMinutos + segundosMostrar + " restantes";
        resultadosTareas[2] = textoMinutos + segundosMostrar + " restantes";
      } else {
        tareaFueExcedida = true;
       tareaExcedidaLista[2] = true;
        resumenTiempoTarea = "Fuera de tiempo: " + textoMinutos + segundosMostrar + " de exceso";
        resultadosTareas[2] = "+" + textoMinutos + segundosMostrar + " de exceso";
      }
      mostrandoTransicion = true;
    }
  }
  else if (fase === 4) {
    fill(32, 24, 38);
    text("Tarea 4: Presiona ESPACIO cuando este azul", margen + 20, margen + 30);
    fill(colorDifuminado);
    text("Aciertos: " + aciertosTarea4 + " / 10", margen + 20, margen + 60);

    if (!juegoPausado) {
      anguloTarea4 = anguloTarea4 + 0.03;
    }

    let moduloAngulo = anguloTarea4 % TWO_PI;
    if (moduloAngulo < 0.8) {
 momentoCalmaTarea4 = true;
    } else {
      momentoCalmaTarea4 = false;
    }

  let cx = width / 2;
    let cy = height / 2 + 15;
    let tamFigura = 90 * factorEscala;
    let colorCuadro4 = momentoCalmaTarea4 ? colorAzul : colorRojo;

    noFill();
  stroke(red(colorCuadro4), green(colorCuadro4), blue(colorCuadro4), momentoCalmaTarea4 ? 195 : 145);
    strokeWeight(momentoCalmaTarea4 ? 3.5 : 2);
    ellipse(cx, cy, tamFigura * 1.95);

    for (let m = 0; m < 8; m++) {
      let angMarca = (TWO_PI / 8) * m;
      let rInterno = tamFigura * 0.92;
      let rExterno = tamFigura * 1.05;
      let x1 = cx + cos(angMarca) * rInterno;
      let y1 = cy + sin(angMarca) * rInterno;
      let x2 = cx + cos(angMarca) * rExterno;
      let y2 = cy + sin(angMarca) * rExterno;
      stroke(colorCuadro4);
        strokeWeight(2);
      line(x1, y1, x2, y2);
    }
    noStroke();

   push();
    translate(cx, cy);
    rotate(anguloTarea4);
    fill(colorCuadro4);
    stroke(32, 24, 38);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, tamFigura, tamFigura, 6);
    rectMode(CORNER);
    pop();

    if (aciertosTarea4 >= 10 && !tarea4Completa) {
      tarea4Completa = true;
     ultimaTareaExcedida = (tiempoRestante < 0);
    if (tiempoRestante >= 0) {
        tareasEnTiempo++;
        tareaFueExcedida = false;
        tareaExcedidaLista[3] = false;
        resumenTiempoTarea = "A tiempo: " + textoMinutos + segundosMostrar + " restantes";
        resultadosTareas[3] = textoMinutos + segundosMostrar + " restantes";
      } else {
        tareaFueExcedida = true;
        tareaExcedidaLista[3] = true;
        resumenTiempoTarea = "Fuera de tiempo: " + textoMinutos + segundosMostrar + " de exceso";
        resultadosTareas[3] = "+" + textoMinutos + segundosMostrar + " de exceso";
      }
      mostrandoTransicion = true;
    }
  }

  if (mostrandoTransicion) {
    let estadosCaminito = [tarea1Completa, tarea2Completa, tarea3Completa, tarea4Completa];
    let inicioX = width / 2 - 105;
    let separacionHex = 70;
    let yCaminito = 248;
    let radioHex = 23;

    stroke(32, 24, 38);
    strokeWeight(2.5);
    line(inicioX, yCaminito, inicioX + separacionHex * 3, yCaminito);

    for (let i = 0; i < 4; i++) {
      let hx = inicioX + i * separacionHex;
      if (estadosCaminito[i]) {
        fill(colorAzul);
        stroke(32, 24, 38);
      } else if (fase === i + 1 && !mostrandoTransicion && !juegoTerminado) {
        fill(colorFondoFig);
        stroke(32, 24, 38);
      } else {
        fill(236, 232, 244);
        stroke(115, 98, 132);
      }
      strokeWeight(2);
      beginShape();
      for (let a = 0; a < 6; a++) {
        let ang = TWO_PI / 6 * a;
        let vx = hx + cos(ang) * radioHex;
        let vy = yCaminito + sin(ang) * radioHex;
        vertex(vx, vy);
      }
      endShape(CLOSE);

      fill(32, 24, 38);
      noStroke();
      textSize(11);
      textAlign(CENTER);
      text("Nivel", hx, yCaminito - radioHex - 6);

      fill(estadosCaminito[i] ? 255 : 32);
      textSize(13);
      text(i + 1, hx, yCaminito + 4.5);
      textAlign(LEFT);
    }
  }

  if (mostrandoTransicion) {
    let bx = width / 2 - 74;
    let by = 324;
    let bw = 148;
    let bh = 46;

    fill(colorAzul);
    stroke(32, 24, 38);
    strokeWeight(2.2);
    rect(bx, by, bw, bh, 9);

    fill(255);
    noStroke();
    textSize(17);
    textAlign(CENTER);
    text("Siguiente", bx + bw / 2, by + 29);
    textAlign(LEFT);
    textSize(12);
  }

  if (juegoPausado) {
    fill(colorRojo);
    textSize(15);
    textAlign(CENTER);
    text("Juego en pausa", width / 2, height - 35);
    textAlign(LEFT);
    textSize(12);
  }
}

// Funciones
//Eventos
//detecta cuando se hace clic con el mouse
function mousePressed() {
  if (mostrandoPortada) {
    let ox = width / 2 - 72;
    let oy = 316;
    let ow = 144;
    let oh = 44;
    if (mouseX >= ox && mouseX <= ox + ow && mouseY >= oy && mouseY <= oy + oh) {
      mostrandoPortada = false;
      mostrandoInstruccion = true;
    }
    return;
  }

  if (mostrandoInstruccion) {
    let ix = width / 2 - 74;
    let iy = 266;
    let iw = 148;
    let ih = 46;
    if (mouseX >= ix && mouseX <= ix + iw && mouseY >= iy && mouseY <= iy + ih) {
      if (sonidoPresion && sonidoPresion.isLoaded() && !sonidoPresion.isPlaying()) {
        sonidoPresion.loop();
      }
      mostrandoInstruccion = false;
      tiempoInicio = millis();
    }
    return;
  }

  if (juegoTerminado) {
    let rx = width / 2 - 68;
    let ry = 426;
    let rw = 136;
    let rh = 42;
    if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh) {
      margen = 0;
      puntaje = 0;
      fase = 1;
      factorVel = 1.0;
      direccionVel = 0.02;
      barraProgresoTarea3 = 0;
      ultimaPulsacion = 0;
      ultimaTeclaPresionada = "";
      penalizacionTeclado = 0;
      aciertosTarea4 = 0;
      anguloTarea4 = 0;
      momentoCalmaTarea4 = false;
      ultimaAccionTarea4 = 0;
      tarea1Completa = false;
      tarea2Completa = false;
      tarea3Completa = false;
      tarea4Completa = false;
      mostrandoTransicion = false;
      juegoTerminado = false;
      resumenTiempoTarea = "";
      tareaFueExcedida = false;
      mostrandoPortada = true;
      mostrandoInstruccion = false;
      tareasEnTiempo = 0;
      juegoPausado = false;
      nivelAfán = 0;
      resultadosTareas = ["", "", "", ""];
      tareaExcedidaLista = [false, false, false, false];
      ultimaTareaExcedida = false;
      for (let i = 0; i < tareas.length; i++) {
        tareas[i].nx = random(0.15, 0.85);
        tareas[i].ny = random(0.15, 0.85);
        tareas[i].mezcla = 0;
        tareas[i].colorG = color(30, 168, 255);
      }
    }
    return;
  }

  if (!mostrandoTransicion && !juegoTerminado) {
    let px = width - margen - 135;
    let py = margen + 24;
    let pw = 24;
    let ph = 24;
    if (mouseX >= px && mouseX <= px + pw && mouseY >= py && mouseY <= py + ph) {
      if (!juegoPausado) {
        juegoPausado = true;
        inicioPausa = millis();
      } else {
        tiempoInicio = tiempoInicio + (millis() - inicioPausa);
        juegoPausado = false;
      }
      return;
    }
  }

  if (juegoPausado) {
    return;
  }

  if (mostrandoTransicion) {
    let bx = width / 2 - 74;
    let by = 324;
    let bw = 148;
    let bh = 46;
    if (mouseX >= bx && mouseX <= bx + bw && mouseY >= by && mouseY <= by + bh) {
      mostrandoTransicion = false;
      margen = 0;
      if (fase === 1) {
     fase = 2;
        puntaje = 0;
        mostrandoInstruccion = true;
      } else if (fase === 2) {
        fase = 3;
        puntaje = 0;
       mostrandoInstruccion = true;
      } else if (fase === 3) {
        fase = 4;
        mostrandoInstruccion = true;
      } else if (fase === 4) {
        juegoTerminado = true;
      }
    }
    return;
  }

  if (fase === 1) {
    for (let i = 0; i < tareas.length; i++) {
  //Pregunta si el lugar donde se hizo clic coincide con las coordenadas de ese círculo
      if (tareas[i].fueClickeado(mouseX, mouseY, margen)) {
        puntaje++;
//cambia la posición del circulo a un lugar aleatorio
        tareas[i].nx = random(0.15, 0.85);
        tareas[i].ny = random(0.15, 0.85);
      }
    }
  }
}

function keyPressed() {
  if (juegoPausado || mostrandoTransicion || juegoTerminado || mostrandoInstruccion || mostrandoPortada) {
    return;
  }
  if (fase === 3 && penalizacionTeclado === 0 && barraProgresoTarea3 < 70) {
    let teclaPresionada = key.toLowerCase();
    if (teclaPresionada === 'a' || teclaPresionada === 's') {
      if (teclaPresionada !== ultimaTeclaPresionada) {
        let tiempoActual = millis();
        let tiempoEntreTeclas = tiempoActual - ultimaPulsacion;

        if (tiempoEntreTeclas < 120) {
          penalizacionTeclado = 50;
          margen = margen + 15;
          if (margen > 220) {
            margen = 220;
          }
          impulsoTeclaElectro = 1.0;
        } else {
          if (margen <= 20) {
            barraProgresoTarea3 += 1;
          }
          let ritmoTecla = constrain(map(tiempoEntreTeclas, 650, 140, 0.25, 0.9), 0.25, 0.9);
          impulsoTeclaElectro = max(impulsoTeclaElectro, ritmoTecla);
          ultimaPulsacion = tiempoActual;
          ultimaTeclaPresionada = teclaPresionada;
          if (barraProgresoTarea3 > 70) {
            barraProgresoTarea3 = 70;
          }
        }
      }
    }
  } else if (fase === 4 && aciertosTarea4 < 10) {
    if (key === ' ') {
      let ahora = millis();
      if (ahora - ultimaAccionTarea4 < 400) {
        margen = margen + 15;
        if (margen > 220) {
          margen = 220;
        }
        impulsoTeclaElectro = 1.0;
      } else if (momentoCalmaTarea4) {
        aciertosTarea4++;
        impulsoTeclaElectro = max(impulsoTeclaElectro, 0.45);
      } else {
        margen = margen + 12;
        if (margen > 220) {
          margen = 220;
        }
        impulsoTeclaElectro = 0.9;
      }
      ultimaAccionTarea4 = ahora;
    }
  }
}