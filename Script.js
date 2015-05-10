var s = new Object();			//cria a estrutura que conterá as retas
	s.len = 0;					//inicializa numero de retas
	s.lines = new Array();		//cria a lista para as retas
var l;
var leftrightbutton;
var n;
var b;
var r;

function main() {
	init();
}

function init() {
	d1 = createDot(200,150);
	d2 = createDot(400,150);
	l = createLine (d1,d2);	
	insertLine(l,s);			//insere uma reta inicial na lista
	drawLines();
}

function insertLine(line, struct) {
	var lastPosition = struct.len;
	struct.lines[lastPosition] = new Object;
	struct.lines[lastPosition] = line;
	struct.len = struct.len + 1;
}

function createLine(d1, d2) {
	var m = media(d1, d2);
	var line = {dot1: d1, dot2: d2, dotm: m};
	return line;
}

function createDot(x,y) {
	var dot = {xis:x, ypslon:y}; 
	return dot;
}

function media(d1, d2) {
	var xM = (d1.xis + d2.xis) / 2;
	var yM = (d1.ypslon + d2.ypslon) / 2;
	var dM = createDot(xM, yM);
	return dM;
}

function drawLines() {
	clearCtx();	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	canvas.oncontextmenu = function() {
     return false;  
	} 
	ctx.beginPath();
	var counter = 0;
	ctx.rect(0,0,600,300); 
	ctx.fillStyle="white";
	ctx.fill(); 
	while(counter < s.len) {
		ctx.moveTo(s.lines[counter].dot1.xis,s.lines[counter].dot1.ypslon);
		ctx.lineTo(s.lines[counter].dot2.xis,s.lines[counter].dot2.ypslon);
		ctx.arc(s.lines[counter].dot1.xis,s.lines[counter].dot1.ypslon,2,0,2*Math.PI);
		ctx.arc(s.lines[counter].dot2.xis,s.lines[counter].dot2.ypslon,2,0,2*Math.PI);
		ctx.arc(s.lines[counter].dotm.xis,s.lines[counter].dotm.ypslon,2,0,2*Math.PI);
		counter++;
	}
	ctx.stroke();
}

function findPosition(event) {
	var canvas = document.getElementById("myCanvas");
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
}

function radians(ang){
	return ang*Math.PI/180;
}

//cria poligonos utilizando seno, cosseno e o centro do canvas
function updateOption(event) {
	var opt = document.getElementById("selectList").selectedIndex + 2;
	s.len=0;		//limpa estrutura de dados
	var cx = 300;	//coordenada x do centro do canvas
	var cy = 150;	//coordenada y do centro do canvas
	var raio = 100;	//raio utilizado
	var ang;
	var i;
	ang = 360/opt;
	i=0;
	while(i<360)
	{
		i=i+ang;
		d1 = createDot(Math.cos(radians(i))*raio+cx,Math.sin(radians(i))*raio+cy);
		d2 = createDot(Math.cos(radians(i+ang))*raio+cx,Math.sin(radians(i+ang))*raio+cy);
		l = createLine (d1,d2);
		insertLine(l,s);
	}
	drawLines();		//desenha
}

function whichEvent(event) {
	//Mouse down	
	var mousePosIni = findPosition(event);	
	switch (event.which) {
		case 1:					//Left Mouse button pressed
			l = selectLine(mousePosIni);
			leftrightbutton = 1;
		break;
		case 3:					//Right Mouse button pressed
			l = selectLine(mousePosIni);
			leftrightbutton = 2;
		break;
	}
}

function selectLine(mousePosIni) { //achar ponto e reta que estão mais próximos do mousePosIni
	var counter = 0;
	var powA1;
	var powA2;
	var distA;
	var powB1;
	var powB2;
	var distB;
	var powC1;
	var powC2;
	var distC;
	//calcula ponto inicial
	powA1 = Math.pow(s.lines[counter].dot1.xis - mousePosIni.x,2);
	powA2 = Math.pow(s.lines[counter].dot1.ypslon - mousePosIni.y,2);
	distA = Math.sqrt(powA1 + powA2);
	//
		
	var closerLine = {dist: distA, dot: s.lines[counter].dot1, line: s.lines[counter], ind: counter};
	while(counter < s.len) {
		
		powA1 = Math.pow(s.lines[counter].dot1.xis - mousePosIni.x,2);
		powA2 = Math.pow(s.lines[counter].dot1.ypslon - mousePosIni.y,2);
		distA = Math.sqrt(powA1 + powA2);


		powB1 = Math.pow(s.lines[counter].dot2.xis - mousePosIni.x,2);
		powB2 = Math.pow(s.lines[counter].dot2.ypslon - mousePosIni.y,2);
		distB = Math.sqrt(powB1 + powB2);

		
		powC1 = Math.pow(s.lines[counter].dotm.xis - mousePosIni.x,2);
		powC2 = Math.pow(s.lines[counter].dotm.ypslon - mousePosIni.y,2);
		distC = Math.sqrt(powC1 + powC2);

		if (distA < distB){
			if (distA < distC){
				if (closerLine.dist > distA){	
					closerLine.dot = s.lines[counter].dot1;
					closerLine.line = s.lines[counter];
					closerLine.dist = distA;
					closerLine.ind = counter;
				}
			}
			else{
				if (closerLine.dist > distC){
					closerLine.dot = s.lines[counter].dotm;
					closerLine.line = s.lines[counter];
					closerLine.dist = distC;
					closerLine.ind = counter;
				}
			}
		}
		else{
			if (distB < distC){
				if (closerLine.dist > distB){
					closerLine.dot = s.lines[counter].dot2;
					closerLine.line = s.lines[counter];
					closerLine.dist = distB;
					closerLine.ind = counter;
				}	
			}
			else{
				if (closerLine.dist > distC){
					closerLine.dot = s.lines[counter].dotm;
					closerLine.line = s.lines[counter];
					closerLine.dist = distC;
					closerLine.ind = counter;
				}
			}
		}
		counter++;
	}
	return closerLine;
}

function clearCtx() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,800,400);		
}

function calculatesTolerance(p) {
	switch (p) {
		case 1:					//ponto inicial ou final
			if (l.dist < 20){
				return 1;			
			}
		break;
		case 2:					//ponto medio
			if (l.dist < 30){
				return 1;			
			}
		break;
		case 3:					//ponto medio
			if (l.dist < 40){
				return 1;			
			}
		break;
	}
	return 0;
}

function updateLines(event) {
	//alert("Mouse Up");
	var mousePos = findPosition(event);

	switch (leftrightbutton) {
		case 1:				//left button	
			//alterar o inicio da reta
			if ((s.lines[l.ind].dot1.xis == l.dot.xis) && (s.lines[l.ind].dot1.ypslon == l.dot.ypslon)) {
				if(calculatesTolerance(1)){		
					s.lines[l.ind].dot1.xis = mousePos.x;
					s.lines[l.ind].dot1.ypslon = mousePos.y;
					s.lines[l.ind].dotm = media(s.lines[l.ind].dot1, s.lines[l.ind].dot2);					//recalcula ponto medio
				}		
			}
			else {
				//alterar o ponto final da reta
				if ((s.lines[l.ind].dot2.xis == l.dot.xis) && (s.lines[l.ind].dot2.ypslon == l.dot.ypslon)) {
					if(calculatesTolerance(1)) {
						s.lines[l.ind].dot2.xis = mousePos.x;
						s.lines[l.ind].dot2.ypslon = mousePos.y;
						s.lines[l.ind].dotm = media(s.lines[l.ind].dot1, s.lines[l.ind].dot2);				//recalcula ponto medio
					}
				}
				else {
					//alterar a reta inteira
					if ((s.lines[l.ind].dotm.xis == l.dot.xis) && (s.lines[l.ind].dotm.ypslon == l.dot.ypslon)) {
						if(calculatesTolerance(2)) {
							xDifference = mousePos.x - s.lines[l.ind].dotm.xis;
							yDifference = mousePos.y - s.lines[l.ind].dotm.ypslon;
							//altera o ponto inicial da reta
							s.lines[l.ind].dot1.xis = s.lines[l.ind].dot1.xis + xDifference;
							s.lines[l.ind].dot1.ypslon = s.lines[l.ind].dot1.ypslon + yDifference;
							//altera o ponto medio da reta
							s.lines[l.ind].dotm.xis = s.lines[l.ind].dotm.xis + xDifference;
							s.lines[l.ind].dotm.ypslon = s.lines[l.ind].dotm.ypslon + yDifference;
							//altera o ponto final da reta
							s.lines[l.ind].dot2.xis = s.lines[l.ind].dot2.xis + xDifference;
							s.lines[l.ind].dot2.ypslon = s.lines[l.ind].dot2.ypslon + yDifference;
						}
					}
				}
			}
		break;
		case 2:				//right button
			if(calculatesTolerance(3)) {
				n = createDot(mousePos.x,mousePos.y);				//cria novo ponto n			
				n1 = createDot(mousePos.x,mousePos.y);				//cria novo ponto n1
				b = s.lines[l.ind].dot2;
				s.lines[l.ind].dot2 = n;
				s.lines[l.ind].dotm = media(s.lines[l.ind].dot1,s.lines[l.ind].dot2);
				r = createLine(b, n1);							 	//cria uma nova reta r do ponto final ao n
				insertLine(r,s);
			}
		break;
	}
	drawLines();
}
