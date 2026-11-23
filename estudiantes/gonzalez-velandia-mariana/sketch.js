let principal;
let secundaria;
let hora;
let minutos;
let momento;
let comenzo = false;
let cookies = false;
let leercookies = false;
let rechazarcookies = false;
let aceptarcookies = false;
let usuario;
let robot;
// Estados
let estado = "pagina-explicacion";

//puntaje del jugador dependiendo de los click que haga 
let puntaje= 0;

//Inicia para entrar al navegador a los 5 segundo
let tiempoInicio = 0;

//Ingreso de datos personales
let nombre = "";
let cedula = "";
let celular = "";
let direccion = "";
let espacio = "";

async function setup() {

  //Instalación de funtes
  principal = await loadFont('Tall.ttf');
  secundaria = await loadFont('proximanova-thin.otf');

  //Pantalla
  createCanvas(890, 700);

  // El usuario juega con el robot
  usuario = new Usuario();

  // El robot es el cursor
  noCursor();

  // Imagen de mi robot
  robot = await loadImage ('robot.png');

// Imagen de mi robot rastreado
  robotr = await loadImage ('robotr.png');

  // Imagen del fondo de la explicación
  explicacion = await loadImage ('explica.png');

  // Imagen de perdiste
  perdiste = await loadImage ('PERDISTE.png');

  // Imagen de ganaste
  ganaste = await loadImage ('GANASTE.png');
  
}

function draw() {
  if (estado == "pagina-explicacion"){

    //fondo
    image(explicacion,0,0, 890, 700 );

    //explicación
    fill(255);
    textFont(principal);
    textSize(74);
    text("ACEPTA PARA CONTINUAR",430,206);

    textFont(principal);
    textSize(40);
    text("¿Aceptas todo lo que aparece en tu pantalla?",416,280);
    textFont(principal);
    textSize(30);
    text("Lee, decide y haz clic. Cada elección tiene una consecuencia.\nNo todo lo que necesitas aceptar es lo que deberías acepta.",414,340);

    //boton de continuar
    fill('#FEF484');
    rect(550,430,160,60,10);
    
    fill('#35383D');
    textFont(principal);
    textSize(44);
    text("INICIAR",600,474);
    
  }
  if (estado == "pagina-inicial"){
    
    if(millis() - tiempoInicio < 1000){
      
      //Fondo inicial
      background(0);
      
      //Borde computador
      noFill();
      stroke('#5D5B5C');
      strokeWeight(20);
      rect(10,10,870,680);
      noStroke();
      fill('#35383D');
      rect(34,618,810,54,20);
      
      //Inicio de pantalla
      fill(255);
      textFont(principal);
      textSize(40);
      text("Inicio",150,648);

      noFill();
      stroke(255);
      strokeWeight(2);
      rect(55,630,15,15);
      rect(70,630,15,15);
      rect(55,646,15,15);
      rect(70,646,15,15);
      rect(65,641,10,10);

      //Hora y minutos en tiempo real
      hora = hour();
      minutos = minute();
      if(hora>= 12){
        momento = "PM"
      } else{
        momento = "AM"
      }
      
      fill(255);
      textFont(secundaria);
      textSize(30);
      textAlign(RIGHT, CENTER);
      text(hora,710,644);
      text(':',724,644);
      text(minutos,764,644);
      text(momento,814,644);

      beginShape();
      vertex(616,632);
      vertex(596,642);
      vertex(616,654);
      endShape();
      line(616,626,616,660);
      line(595,636,595,648);
      stroke('#ff0000');
      strokeWeight(4);
      line(595,626,626,660);

      //Menu
      fill('#FEF484');
      noStroke();
      textFont(secundaria);
      textSize(20);
      textAlign(CENTER, CENTER);
      text('Mi PC',90,144);
      noFill();
      stroke('#FEF484');
      rect(60,62,58,40,5);
      line(84,112,96,112);
      line(80,120,100,120);

      fill('#8FB7DE');
      noStroke();
      textFont(secundaria);
      textSize(20);
      textAlign(CENTER, CENTER);
      text('Navegador',94,264);
      noFill();
      stroke('#8FB7DE');
      ellipse(90,212,62,62);
      noFill();
      beginShape();
      bezierVertex(69,189);
      bezierVertex(70,190);
      bezierVertex(79,198);
      bezierVertex(92,195);
      bezierVertex(100,193);
      bezierVertex(105,188);
      bezierVertex(107,186);
      endShape();
      beginShape();
      bezierVertex(59,210);
      bezierVertex(61,211);
      bezierVertex(72,213);
      bezierVertex(86,213);
      bezierVertex(103,213);
      bezierVertex(114,210);
      bezierVertex(119,208);
      endShape();
      beginShape();
      bezierVertex(70,236);
      bezierVertex(70,233);
      bezierVertex(79,226);
      bezierVertex(92,229);
      bezierVertex(100,231);
      bezierVertex(105,236);
      bezierVertex(110,236);
      endShape();
      beginShape();
      bezierVertex(81,182);
      bezierVertex(77,186);
      bezierVertex(72,198);
      bezierVertex(73,213);
      bezierVertex(75,228);
      bezierVertex(82,239);
      bezierVertex(85,243);
      endShape();
      beginShape();
      bezierVertex(96,182);
      bezierVertex(98,187);
      bezierVertex(103,198);
      bezierVertex(102,213);
      bezierVertex(101,229);
      bezierVertex(94,239);
      bezierVertex(91,243);
      endShape();
      fill('#FEF484');
      noStroke();
      textFont(secundaria);
      textSize(20);
      textAlign(CENTER, CENTER);
      text('Archivos',94,390);
      noFill();
      stroke('#FEF484');
      rect(61,326,62,41);
      beginShape();
      vertex(61,326);
      vertex(61,313);
      vertex(83,313);
      vertex(91,321);
      vertex(123,321);
      vertex(123,326);
      endShape();
      fill('#8FB7DE');
      noStroke();
      textFont(secundaria);
      textSize(20);
      textAlign(CENTER, CENTER);
      text('Papelera',94,522);
      noFill();
      stroke('#8FB7DE');
      rect(66,438,55,60,2);
      rect(81,429,25,9,2);
      line(60,438,125,438);
      line(84,454,84,486);
      line(104,454,104,486);
    
    }
    if(millis() - tiempoInicio > 1000){
      estado = "navegador";
    }
  }

  if (estado == "navegador"){
    
    //Va al Navegador
    background('#5D5B5C');
    noStroke();
    fill(255);
    rect(0,84,890,623,20);
    rect(20,40,196,45,10);
    stroke(255);
    fill('#191a1e');
    rect(393,40,196,45,10);
    rect(210,40,196,45,10);
    noFill();
    stroke(255);
    rect(804,18,19,18);
    line(760,30,780,30);
    line(851,19,866,34);
    line(866,19,851,34);
    line(616,50,616,70);
    line(606,60,626,60);
    line(560,56,570,66);
    line(570,56,560,66);
    line(378,56,388,66);
    line(388,56,378,66);
    fill(255);
    stroke('#191a1e');
    rect(170,108,694,46,10);
    line(16,129,38,129);
    line(60,129,82,129);
    line(27,120,16,129);
    line(16,129,27,138);
    line(71,120,82,129);
    line(82,129,71,138);
    ellipse(837,132,26,26);
    rect(186,127,24,19);
    beginShape();
    bezierVertex(190,125);
    bezierVertex(190,120);
    bezierVertex(193,117);
    bezierVertex(196,116);
    bezierVertex(201,116);
    bezierVertex(206,120);
    bezierVertex(206,125);
    endShape();
    beginShape();
    bezierVertex(137,128);
    bezierVertex(135,120);
    bezierVertex(126,117);
    bezierVertex(120,120);
    bezierVertex(114,123);
    bezierVertex(112,131);
    bezierVertex(115,137);
    bezierVertex(119,143);
    bezierVertex(129,143);
    bezierVertex(134,139);
    endShape();
    line(138,120,138,128);
    line(138,128,130,128);
    fill(0);
    noStroke();
    textFont(secundaria);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Inicio',100,65);
    fill(255);
    text('Servicios',300,65);
    text('Perfil',480,65);
    fill(0);
    textSize(24);
    textAlign(LEFT, CENTER);
    text('www.tuvidaenlinea.com',240,130);
    fill('#eae2e4');
    rect(0,170,890,530);
    fill(0);
    textSize(60);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('TuVidaEnLinea',90,228);
    textSize(26);
    strokeWeight(3);
    textFont(secundaria);
    textAlign(LEFT, CENTER);
    text('Inicio',525,240);
    text('Servicios',612,240);
    text('Ayuda',750,240);
    noFill();
    stroke(0);
    line(524,260,586,260);
    ellipse(47,226,59,61);
    beginShape();
    bezierVertex(25,206);
    bezierVertex(27,208);
    bezierVertex(35,213);
    bezierVertex(47,212);
    bezierVertex(56,210);
    bezierVertex(63,205);
    bezierVertex(65,203);
    endShape();
    beginShape();
    bezierVertex(17,226);
    bezierVertex(26,228);
    bezierVertex(37,229);
    bezierVertex(50,228);
    bezierVertex(60,227);
    bezierVertex(69,226);
    bezierVertex(76,224);
    endShape();
    beginShape();
    bezierVertex(27,248);
    bezierVertex(29,246);
    bezierVertex(37,240);
    bezierVertex(48,241);
    bezierVertex(58,241);
    bezierVertex(65,246);
    bezierVertex(67,248);
    endShape();
    beginShape();
    bezierVertex(31,200);
    bezierVertex(33,206);
    bezierVertex(37,215);
    bezierVertex(37,227);
    bezierVertex(38,238);
    bezierVertex(37,248);
    bezierVertex(35,254);
    endShape();
    beginShape();
    bezierVertex(60,199);
    bezierVertex(58,206);
    bezierVertex(55,216);
    bezierVertex(54,228);
    bezierVertex(54,239);
    bezierVertex(56,248);
    bezierVertex(57,254);
    endShape();
    noStroke();
    fill('#FEF484');
    rect(687,441,65,58);
    beginShape();
    vertex(570,349);
    vertex(564,360);
    vertex(572,364);
    vertex(579,356);
    vertex(570,349);
    endShape();
    fill('#8FB7DE');
    rect(693,353,74,35);
    rect(607,439,80,60);
    beginShape();
    vertex(732,308);
    vertex(720,321);
    vertex(732,337);
    vertex(748,325);
    endShape();
    fill('#111449');
    rect(745,410,27,51);
    rect(590,393,36,50);
    rect(556,463,20,18);
    rect(576,481,15,16);
    beginShape();
    vertex(591,310);
    vertex(577,321);
    vertex(594,338);
    vertex(608,325);
    endShape();
    noFill();
    stroke(0);
    ellipse(668,398,145,143);
    beginShape();
    bezierVertex(701,334);
    bezierVertex(695,351);
    bezierVertex(688,373);
    bezierVertex(687,401);
    bezierVertex(686,427);
    bezierVertex(690,450);
    bezierVertex(694,464);
    endShape();
    beginShape();
    bezierVertex(629,339);
    bezierVertex(636,350);
    bezierVertex(643,372);
    bezierVertex(646,399);
    bezierVertex(648,426);
    bezierVertex(644,448);
    bezierVertex(639,463);
    endShape();
    beginShape();
    bezierVertex(615,351);
    bezierVertex(620,354);
    bezierVertex(640,367);
    bezierVertex(668,363);
    bezierVertex(693,360);
    bezierVertex(707,347);
    bezierVertex(713,342);
    endShape();
    beginShape();
    bezierVertex(596,397);
    bezierVertex(617,401);
    bezierVertex(644,404);
    bezierVertex(676,402);
    bezierVertex(701,400);
    bezierVertex(723,396);
    bezierVertex(740,392);
    endShape();
    beginShape();
    bezierVertex(619,450);
    bezierVertex(626,445);
    bezierVertex(644,431);
    bezierVertex(673,432);
    bezierVertex(697,433);
    bezierVertex(713,445);
    bezierVertex(719,449);
    endShape();
    noStroke();
    fill(0);
    textSize(50);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Todo lo que necesitas,',90,332);
    text('en un solo lugar.',90,384);
    textSize(18);
    textFont(secundaria);
    text('Conecta, organiza y simplifica tu vida digital.',90,430);
    textAlign(CENTER, CENTER);
    text('Almacenamiento',170,634);
    text('en la nube',170,652);
    text('Mayor de seguridad',365,634);
    text('Acceso rapido',550,634);
    text('Siempre contigo',726,634);
    stroke(0);
    strokeWeight(1);
    line(260,550,260,680);
    line(470,550,470,680);
    line(640,550,640,680);
    strokeWeight(3);
    noFill();
    rect(145,581,50,35,5);
    rect(145,576,50,40,5);
    rect(145,571,50,45,5);
    ellipse(724,592,46,46);
    fill(0);
    ellipse(716,588,5,5);
    ellipse(732,588,5,5);
    beginShape();
    bezierVertex(718,600);
    bezierVertex(719,603);
    bezierVertex(722,604);
    bezierVertex(724,604);
    bezierVertex(727,604);
    bezierVertex(730,602);
    bezierVertex(731,600);
    endShape();
    beginShape();
    vertex(532,580);
    vertex(514,602);
    vertex(525,602);
    vertex(523,615);
    vertex(542,594);
    vertex(530,595);
    endShape();
    beginShape();
    vertex(582,576);
    vertex(564,598);
    vertex(575,598);
    vertex(573,611);
    vertex(592,590);
    vertex(580,591);
    endShape();
    beginShape();
    vertex(370,563);
    vertex(360,574);
    vertex(350,574);
    vertex(350,598);
    vertex(370,618);
    vertex(390,598);
    vertex(390,574);
    vertex(380,574);
    vertex(370,563);
    endShape();
    noStroke();
    fill('#FEF484');
    rect(90,465,184,45,10);
    fill(0);
    textSize(30);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Comenzar',126,486);
    stroke(0);
    line(215,488,232,488);
    line(232,488,226,484);
    line(232,488,226,494);
  }

    if(estado == "cookies"){

      //Va al Navegador
    background('#5D5B5C');
    noStroke();
    fill(255);
    rect(0,84,890,623,20);
    rect(20,40,196,45,10);
    stroke(255);
    fill('#191a1e');
    rect(393,40,196,45,10);
    rect(210,40,196,45,10);
    noFill();
    stroke(255);
    rect(804,18,19,18);
    line(760,30,780,30);
    line(851,19,866,34);
    line(866,19,851,34);
    line(616,50,616,70);
    line(606,60,626,60);
    line(560,56,570,66);
    line(570,56,560,66);
    line(378,56,388,66);
    line(388,56,378,66);
    fill(255);
    stroke('#191a1e');
    rect(170,108,694,46,10);
    line(16,129,38,129);
    line(60,129,82,129);
    line(27,120,16,129);
    line(16,129,27,138);
    line(71,120,82,129);
    line(82,129,71,138);
    ellipse(837,132,26,26);
    rect(186,127,24,19);
    beginShape();
    bezierVertex(190,125);
    bezierVertex(190,120);
    bezierVertex(193,117);
    bezierVertex(196,116);
    bezierVertex(201,116);
    bezierVertex(206,120);
    bezierVertex(206,125);
    endShape();
    beginShape();
    bezierVertex(137,128);
    bezierVertex(135,120);
    bezierVertex(126,117);
    bezierVertex(120,120);
    bezierVertex(114,123);
    bezierVertex(112,131);
    bezierVertex(115,137);
    bezierVertex(119,143);
    bezierVertex(129,143);
    bezierVertex(134,139);
    endShape();
    line(138,120,138,128);
    line(138,128,130,128);
    fill(0);
    noStroke();
    textFont(secundaria);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Inicio',100,65);
    fill(255);
    text('Servicios',300,65);
    text('Perfil',480,65);
    fill(0);
    textSize(24);
    textAlign(LEFT, CENTER);
    text('www.tuvidaenlinea.com',240,130);
    fill('#eae2e4');
    rect(0,170,890,530);
    fill(0);
    textSize(60);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('TuVidaEnLinea',90,228);
    textSize(26);
    strokeWeight(3);
    textFont(secundaria);
    textAlign(LEFT, CENTER);
    text('Inicio',525,240);
    text('Servicios',612,240);
    text('Ayuda',750,240);
    noFill();
    stroke(0);
    line(524,260,586,260);
    ellipse(47,226,59,61);
    beginShape();
    bezierVertex(25,206);
    bezierVertex(27,208);
    bezierVertex(35,213);
    bezierVertex(47,212);
    bezierVertex(56,210);
    bezierVertex(63,205);
    bezierVertex(65,203);
    endShape();
    beginShape();
    bezierVertex(17,226);
    bezierVertex(26,228);
    bezierVertex(37,229);
    bezierVertex(50,228);
    bezierVertex(60,227);
    bezierVertex(69,226);
    bezierVertex(76,224);
    endShape();
    beginShape();
    bezierVertex(27,248);
    bezierVertex(29,246);
    bezierVertex(37,240);
    bezierVertex(48,241);
    bezierVertex(58,241);
    bezierVertex(65,246);
    bezierVertex(67,248);
    endShape();
    beginShape();
    bezierVertex(31,200);
    bezierVertex(33,206);
    bezierVertex(37,215);
    bezierVertex(37,227);
    bezierVertex(38,238);
    bezierVertex(37,248);
    bezierVertex(35,254);
    endShape();
    beginShape();
    bezierVertex(60,199);
    bezierVertex(58,206);
    bezierVertex(55,216);
    bezierVertex(54,228);
    bezierVertex(54,239);
    bezierVertex(56,248);
    bezierVertex(57,254);
    endShape();
    noStroke();
    fill('#FEF484');
    rect(687,441,65,58);
    beginShape();
    vertex(570,349);
    vertex(564,360);
    vertex(572,364);
    vertex(579,356);
    vertex(570,349);
    endShape();
    fill('#8FB7DE');
    rect(693,353,74,35);
    rect(607,439,80,60);
    beginShape();
    vertex(732,308);
    vertex(720,321);
    vertex(732,337);
    vertex(748,325);
    endShape();
    fill('#111449');
    rect(745,410,27,51);
    rect(590,393,36,50);
    rect(556,463,20,18);
    rect(576,481,15,16);
    beginShape();
    vertex(591,310);
    vertex(577,321);
    vertex(594,338);
    vertex(608,325);
    endShape();
    noFill();
    stroke(0);
    ellipse(668,398,145,143);
    beginShape();
    bezierVertex(701,334);
    bezierVertex(695,351);
    bezierVertex(688,373);
    bezierVertex(687,401);
    bezierVertex(686,427);
    bezierVertex(690,450);
    bezierVertex(694,464);
    endShape();
    beginShape();
    bezierVertex(629,339);
    bezierVertex(636,350);
    bezierVertex(643,372);
    bezierVertex(646,399);
    bezierVertex(648,426);
    bezierVertex(644,448);
    bezierVertex(639,463);
    endShape();
    beginShape();
    bezierVertex(615,351);
    bezierVertex(620,354);
    bezierVertex(640,367);
    bezierVertex(668,363);
    bezierVertex(693,360);
    bezierVertex(707,347);
    bezierVertex(713,342);
    endShape();
    beginShape();
    bezierVertex(596,397);
    bezierVertex(617,401);
    bezierVertex(644,404);
    bezierVertex(676,402);
    bezierVertex(701,400);
    bezierVertex(723,396);
    bezierVertex(740,392);
    endShape();
    beginShape();
    bezierVertex(619,450);
    bezierVertex(626,445);
    bezierVertex(644,431);
    bezierVertex(673,432);
    bezierVertex(697,433);
    bezierVertex(713,445);
    bezierVertex(719,449);
    endShape();
    noStroke();
    fill(0);
    textSize(50);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Todo lo que necesitas,',90,332);
    text('en un solo lugar.',90,384);
    textSize(18);
    textFont(secundaria);
    text('Conecta, organiza y simplifica tu vida digital.',90,430);
    textAlign(CENTER, CENTER);
    text('Almacenamiento',170,634);
    text('en la nube',170,652);
    text('Mayor de seguridad',365,634);
    text('Acceso rapido',550,634);
    text('Siempre contigo',726,634);
    stroke(0);
    strokeWeight(1);
    line(260,550,260,680);
    line(470,550,470,680);
    line(640,550,640,680);
    strokeWeight(3);
    noFill();
    rect(145,581,50,35,5);
    rect(145,576,50,40,5);
    rect(145,571,50,45,5);
    ellipse(724,592,46,46);
    fill(0);
    ellipse(716,588,5,5);
    ellipse(732,588,5,5);
    beginShape();
    bezierVertex(718,600);
    bezierVertex(719,603);
    bezierVertex(722,604);
    bezierVertex(724,604);
    bezierVertex(727,604);
    bezierVertex(730,602);
    bezierVertex(731,600);
    endShape();
    beginShape();
    vertex(532,580);
    vertex(514,602);
    vertex(525,602);
    vertex(523,615);
    vertex(542,594);
    vertex(530,595);
    endShape();
    beginShape();
    vertex(582,576);
    vertex(564,598);
    vertex(575,598);
    vertex(573,611);
    vertex(592,590);
    vertex(580,591);
    endShape();
    beginShape();
    vertex(370,563);
    vertex(360,574);
    vertex(350,574);
    vertex(350,598);
    vertex(370,618);
    vertex(390,598);
    vertex(390,574);
    vertex(380,574);
    vertex(370,563);
    endShape();
    noStroke();
    fill('#FEF484');
    rect(90,465,184,45,10);
    fill(0);
    textSize(30);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Comenzar',126,486);
    stroke(0);
    line(215,488,232,488);
    line(232,488,226,484);
    line(232,488,226,494);
      fill(255);
      rect(220,240,460,282,10);
      noStroke();
      fill(0);
      textSize(40);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Usamos cookies',312,282);
      textSize(20);
      textFont(secundaria);
      text('Utilizamos cookies para mejorar tu experiencia,',250,324);
      text('mostrarte contenido personalizado y analizar',250,350);
      text('el trafico. Puedes aceptar todas o configurar',250,376);
      text('que tipo de cookies quieres',250,400);
      textSize(14);
      text('Leer mas sobre nuestras cookies',250,432);
      fill('#eae2e4');
      rect(250,454,130,46,10);
      rect(393,454,130,46,10);
      fill('#FEF484');
      rect(530,454,130,46,10);
      fill(0);
      textSize(26);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Aceptar todas',556,476);
      text('Rechazar todo',415,476);
      textSize(25);
      text('Leer preferencias',260,476);
    
    }
    
    if(estado == "leercookies"){
      
      background(255);
      fill('#8FB7DE');
      rect(20,20,850,660,40);
      noStroke();
      fill(0);
      textSize(100);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Preferencias de cookies',80,100);
      textSize(20);
      textFont(secundaria);
      textAlign(LEFT, CENTER);
      
      text('Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando\n visitas nuestra página web. Estas permiten recordar información sobre tu navegación,\n mantener tu sesión activa, guardar tus preferencias y ofrecerte una experiencia más\n personalizada. Algunas cookies son esenciales para el funcionamiento del sitio, mientras\n que otras nos ayudan a comprender cómo interactúas con nuestro contenido, mejorar\n nuestros servicios y adaptar la experiencia a tus necesidades.',60,280);
      
      text('En nuestra página utilizamos cookies necesarias para garantizar la seguridad,\n facilitar la navegación y recordar tus preferencias de consentimiento. También\n podemos utilizar cookies de análisis para conocer qué secciones reciben más visitas\n y detectar posibles errores, así como cookies de personalización para recordar\n configuraciones como el idioma seleccionado. Las cookies opcionales solo se utilizarán\n de acuerdo con las preferencias que elijas.',60,450);
      
      fill('#FEF484');
      rect(522,590,312,64,10);
      fill(0);
      textSize(40);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Aceptar y continuar',590,620);

      fill('#FEF484');
      rect(70,590,100,64,10);
      fill(0);
      textSize(40);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Volver',90,620);
      
    }
    
    if(estado == "rechazarcookies"){
      
      background(0);
      fill('#FEF484');
      rect(70,590,100,64,10);
      fill(0);
      textSize(40);
      textFont(principal);
      textAlign(LEFT, CENTER);
      text('Volver',90,620);
      
    }
    if(estado == "aceptarcookies"){

      Errorcookies();
      
    } 
  if(estado == "ubicacion"){
    
    background('#212145');

    //mapa
    fill('#FEF484');
    beginShape();
    vertex(0,0);
    vertex(152,0);
    vertex(122,233);
    vertex(0,233);
    endShape();
    beginShape();
    vertex(158,0);
    vertex(295,0);
    vertex(255,241);
    vertex(128,233);
    endShape();
    beginShape();
    vertex(0,240);
    vertex(121,242);
    vertex(92,499);
    vertex(0,499);
    endShape();
    beginShape();
    vertex(128,242);
    vertex(254,256);
    vertex(240,350);
    vertex(117,339);
    endShape();
    beginShape();
    vertex(116,347);
    vertex(240,362);
    vertex(202,512);
    vertex(97,500);
    endShape();
    beginShape();
    vertex(0,508);
    vertex(91,518);
    vertex(72,689);
    vertex(0,682);
    endShape();
    beginShape();
    vertex(98,520);
    vertex(202,530);
    vertex(186,701);
    vertex(76,690);
    endShape();
    beginShape();
    vertex(264,312);
    vertex(442,385);
    vertex(422,433);
    vertex(257,353);
    endShape();
    beginShape();
    vertex(255,370);
    vertex(420,437);
    vertex(375,535);
    vertex(220,516);
    endShape();
    beginShape();
    vertex(218,532);
    vertex(375,549);
    vertex(313,714);
    vertex(198,702);
    endShape();
    beginShape();
    vertex(456,393);
    vertex(642,478);
    vertex(609,558);
    vertex(388,535);
    endShape();
    beginShape();
    vertex(387,550);
    vertex(605,578);
    vertex(576,675);
    vertex(353,766);
    vertex(321,718);
    endShape();
    beginShape();
    vertex(569,688);
    vertex(542,779);
    vertex(357,781);
    endShape();
    beginShape();
    vertex(589,731);
    vertex(605,677);
    vertex(771,683);
    vertex(772,743);
    endShape();
    fill('#8FB7DE');
    ellipse(256,380,55,76);
    fill('#FEF484');
    ellipse(257,400,18,26);
    fill('#8FB7DE');
    textSize(120);
    textFont(principal);
    textAlign(RIGHT, CENTER);
    text('PERMITR ACCESO\n A LA UBICACIÓN',850,150);

    textFont(secundaria);
    textAlign(CENTER, CENTER);
    fill('#8FB7DE');
    rect(663,308,185,57,10);
    rect(663,390,185,57,10);
    textSize(24);
    fill('#212145');
    text('Denegar',754,406);
    text('Acceso',754,430);
    text('Permitir',754,324);
    text('Acceso',754,348);

    fill('#FEF484');
    rect(663,470,185,57,10);
    fill('#212145');
    textSize(30);
    text('Volver',754,500);
    }
  
  if(estado == "permitir-ubicacion"){

    Errorubicacion();
    
  }

  if(estado == "informacion"){
    
    background('#FEF484');
    fill('#8FB7DE');
    rect(40,40,825,620,40);

    fill('#212145')
    textFont(principal);
    textSize(60);
    text('DATOS PERSONALES',80,90);
    
    //informacion
    fill(255);
    rect(80,170,490,60,20);
    rect(80,280,490,60,20);
    rect(80,390,490,60,20);
    rect(80,500,490,60,20);

     fill('#212145')
    textFont(secundaria);
    textSize(16);
    
    text('NOMBRE Y APELLIDOS*',90,160);
    text(nombre, 95, 205);

    text('CÉDULA DE CIUDADANÍA*',90,270);
    text(cedula, 95, 315);
    
    text('CELULAR*',90,380);
    text(celular, 95, 425);
    
    text('DIRECCIÓN*',90,490);
    text(direccion, 95, 535);

    fill('#FEF484');
    rect(522,590,312,64,10);
    fill(0);
    textSize(40);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Enviar datos',590,620);

    fill('#FEF484');
    rect(70,590,100,64,10);
    fill(0);
    textSize(40);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('Volver',90,620);

    fill('#FEF484');
    rect(280,590,200,64,10);
    fill(0);
    textSize(40);
    textFont(principal);
    textAlign(LEFT, CENTER);
    text('NO ES NECESARIO',300,620);
  }

  if(estado == "errorinformacion"){

    Errorinformacion();
    
  }

  if(estado == "resultado"){
    
    if (puntaje >= 2) {
      
      image(ganaste, 0, 0, 890, 700);
      textFont(principal);
      fill('#FEF484');
      textSize(180);
      text('GANASTE',500,200);
      textSize(100);
      text('Puntaje:'+ puntaje,550,400);
  }
      
  else {
    image(perdiste, 0, 0, 890, 700);
    textFont(principal);
      fill('#8FB7DE');
      textSize(180);
      text('PERDISTE',480,200);
      textSize(100);
      text('Puntaje:'+ puntaje,550,400);
  }
    
  }
  
  
  //Se dibuja la clase jugador
    usuario.dibujar();
}

//sensiblidad del mouse para los botones
function mousePressed () {

  // funciona el boton de iniciar
  if (estado == "pagina-explicacion" && mouseX > 550 && mouseX < 712 && mouseY > 429 && mouseY < 489){
    tiempoInicio = millis();
    estado = "pagina-inicial";
    
    }
  
  // funciona el boton de comezar si no se ha activado antes
  if (estado == "navegador" && mouseX > 90 && mouseX < 274 && mouseY > 465 && mouseY < 510){
    
    cookies = true;
    estado = "cookies";
    
    }
    
    //Si la ventana de cookies no esta abierta no funcionan los botones de desarrollo de cookies
    //Funciona solo un boton el que se precione aceptando, leyendo o rechanzando las cookies
  else if (cookies && !leercookies && !rechazarcookies && !aceptarcookies && mouseX > 249 && mouseX < 380 && mouseY > 452 && mouseY < 495){
    
    estado = "leercookies";
    puntaje = puntaje + 1;
    
    
    }
    
  else if (cookies && !leercookies && !rechazarcookies && !aceptarcookies && mouseX > 390 && mouseX < 516 && mouseY > 452 && mouseY < 495){
    
      estado = "rechazarcookies";

    }
  else if (cookies && !leercookies && !rechazarcookies && !aceptarcookies && mouseX > 528 && mouseX < 654 && mouseY > 452 && mouseY < 495){
    
    estado = "aceptarcookies";
    puntaje = puntaje - 1;
    
    }
  if (estado == "aceptarcookies" && mouseX > 578 && mouseX < 665 && mouseY > 598 && mouseY < 646 ){

    estado = "leercookies";
    return;
    
  }
  
  if (estado == "leercookies" && mouseX > 519 && mouseX < 832 && mouseY > 586 && mouseY < 652 ){
    estado = "ubicacion"
  }

  if (estado == "leercookies" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "navegador"
  }

  if (estado == "rechazarcookies" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "navegador"
  }
  if (estado == "aceptarcookies" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "navegador"
  }
  
  if (estado == "ubicacion" && mouseX > 660 && mouseX < 846 && mouseY > 306 && mouseY < 365 ){
    
    estado = "permitir-ubicacion"
    puntaje = puntaje - 1;
    
  }
  if (estado == "aceptarcookies" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "navegador"
  }
  
  if (estado == "ubicacion" && mouseX > 660 && mouseX < 846 && mouseY > 390 && mouseY < 448 ){
    puntaje = puntaje + 1;
    estado = "informacion"
  }

  if (estado == "ubicacion" && mouseX > 660 && mouseX < 846 && mouseY > 478 && mouseY < 536 ){
    estado = "leercookies"
  }

  // Arreglo de la sensibilidad al hacer click por la modificacion del mouse en el error
  //prompt Chat gpt Bueno, mira, yo creo que es un error en la modificación que yo le hice al apuntador porque lo puse que funcione al revés. Entonces no sé si de pronto el click también funcione al revés, no sé. Revisa eso porque creo otro botón, lo miré a pixel y tampoco funciona en la misma página.
  
  let clickX = width - mouseX;
  let clickY = height - mouseY;
  
  if (estado == "permitir-ubicacion" && clickX > 138 && clickX < 290 && clickY > 99 && clickY < 290) {
    
  estado = "informacion";
    return;
    
}

  if (estado == "permitir-ubicacion" && clickX > 70 && clickX < 170 && clickY > 586 && clickY < 652 ){
    estado = "ubicacion"
  }

  if (estado == "informacion" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "ubicacion"
  }

  if (estado == "informacion" && mouseX > 519 && mouseX < 832 && mouseY > 586 && mouseY < 652 ){
    puntaje = puntaje - 1;
    estado = "errorinformacion"
  }

  if (estado == "informacion" && mouseX > 280 && mouseX < 486 && mouseY > 586 && mouseY < 652 ){
    puntaje = puntaje + 1;
    estado = "resultado"
  }
  
  if (estado == "errorinformacion" && mouseX > 70 && mouseX < 170 && mouseY > 586 && mouseY < 652 ){
    estado = "informacion"
  }

  if(estado == "errorinformacion" && mouseX > 138 && mouseX < 290 && mouseY > 99 && mouseY < 290){
    puntaje = puntaje + 1;
    estado = "resultado";
  }
  // seleciona el espacio en el que va a iniciar a escribor
  
  espacio = "";
  
  if (mouseX > 80 && mouseX < 570 && mouseY > 170 && mouseY < 230) {
    
    espacio = "nombre";
    
    }
  
  else if (mouseX > 80 && mouseX < 570 && mouseY > 280 && mouseY < 340) {
    
    espacio = "cedula";
  
  }
  
  else if (mouseX > 80 && mouseX < 570 && mouseY > 390 && mouseY < 450) {
    
    espacio = "celular";
  
  }
  
  else if (mouseX > 80 && mouseX < 570 && mouseY > 500 && mouseY < 560) {
    
    espacio = "direccion";
  
  }

    return;
  
}

function Errorcookies(){
  
  //Alertas de error
  background (0);
  for (let i = 0; i < 40; i++) {
    let x = random(5, 880);
    let y = random(5, 700);
    fill('#FEF484');
    stroke('#111449');
    rect(x, y, 100, 40);
    fill('#111449');
    noStroke();
    textSize(40);
    text("ERROR", x + 30, y + 20);
  }
  fill('#8FB7DE');
  rect(580,600,85,45,10);
  fill(0);
  textSize(20);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('Leer Cookies',590,620);

  fill('#FEF484');
  rect(70,590,100,64,10);
  fill(0);
  textSize(40);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('Volver',90,620);
}

function Errorubicacion(){
  
  //Alertas de error
  background (0);
  for (let i = 0; i < 40; i++) {
    let x = random(10, 880);
    let y = random(10, 700);
    fill('#FEF484');
    stroke('#111449');
    rect(x, y, 100, 40);
    fill('#111449');
    noStroke();
    textSize(40);
    text("NO", x + 30, y + 20);
  }
  fill('#FEF484');
  rect(70,590,100,64,10);
  fill(0);
  textSize(40);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('Volver',90,620);
  
  fill('#8FB7DE');
  rect(140,100,150,45,10);
  fill(0);
  textSize(20);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('No necesitas ubicación',160,120);

}

function Errorinformacion(){
  
  //Alertas de error
  background (0);
  for (let i = 0; i < 40; i++) {
    let x = random(10, 880);
    let y = random(10, 700);
    fill('#FEF484');
    stroke('#111449');
    rect(x, y, 150, 40);
    fill('#111449');
    noStroke();
    textSize(40);
    text("innecesario", x + 30, y + 20);
  }
  fill('#FEF484');
  rect(70,590,100,64,10);
  fill(0);
  textSize(40);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('Volver',90,620);
  
  fill('#8FB7DE');
  rect(140,100,200,45,10);
  fill(0);
  textSize(20);
  textFont(principal);
  textAlign(LEFT, CENTER);
  text('Nadie necesita esta información',160,120);

}

class Usuario {
  constructor (){
    this.x = mouseX;
    this.y = mouseY;
  }
  dibujar(){
    
    //Si  lee las cookies se mueve bien pero puede ver mejor al robot ya que se pone mas grande
    if(estado == "leercookies"){
      
      this.x = mouseX;
      this.y = mouseY;
      image(robot,this.x,this.y, 60, 60 );
      
    }
      
    //Si no lee las cookies se mueve mas lento y se pone mas pequeño
    else if(estado == "aceptarcookies" || estado == "errorinformacion"){
      
      this.x = lerp(this.x, mouseX, 0.02);
      this.y = lerp(this.y, mouseY, 0.03);
      image(robot,this.x,this.y, 20, 20 );
      
    }else{
      
      image(robot,this.x,this.y, 40, 40 );
      this.x = mouseX;
      this.y = mouseY;
      
    }
    if(estado == "permitir-ubicacion"){
    
      this.x = width - mouseX;
      this.y = height- mouseY;
      image(robotr,this.x,this.y, 40, 40 );
      
    }
  }
}

function keyPressed() {

  // En nombre y direccion puede escribir letras y numeros
  if (espacio == "nombre" || espacio == "direccion") {
    if (key.length == 1) {
      
      if (espacio == "nombre") {
        
        nombre += key;
        
      }
      
      if (espacio == "direccion") {
        
        direccion += key;
      
      }
    }
  }

  // cedula y celular recibe solo numeros
  
  if (espacio == "cedula" && key >= "0" && key <= "9") {
    
    cedula += key;
  
  }

  if (espacio == "celular" && key >= "0" && key <= "9") {
    
    celular += key;
  
  }

  
}