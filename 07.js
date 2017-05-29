
/*Empezamos cuando todo esta cargado*/

crearEvento(window, "load", comienzo);

/*Variables a inicializar*/
var miNombre=new Array;
var miIndice=new Array;
var miUrl=new Array;
var miReg=totalReg=0;
var miAccion="";									

/*Cargamos los eventos para los botones y vemos los registros en la BD*/

function comienzo(){
	crearEvento(anterior, 'click', antes);
	crearEvento(siguiente, 'click',despues);
	crearEvento(crearRSS, 'click', creacion);
	crearEvento(borrarRSS, 'click', borrar);
	crearEvento(campoSelect, 'change', cambioOpcion);
	verRSS('numRSS', '','');
}

/*Si pulsamos en anterior le restamos uno al registro actual y lo mostramos*/

function antes(){
miReg--;
if(miReg<0){
	miReg=0;
	noMas("","NO EXISTEN RSS ANTERIORES");
	}else{
	mostar(miReg);
	}

}

/*Si pulsamos siguiente añadimos al registro y mostramos el resultado*/

function despues(){
	miReg++;
	if(miReg>=miNombre.length){
	miReg=miNombre.length;
	noMas("","NO EXISTEN POSTERIORES RSS");
	
	}else{
	mostrar(miReg);
	}
}
/*Muestra los registros*/

function mostrar(que){
	//Si existe
	if(compruebaIndice(que)){
		/*y hemos pulsado sobre nueva o borrar*/
		if(miAccion=='nueva'||miAccion=='borrar'){
		miAccion='';
		/*Hacemos tiempo para ver el mensaje de borrado o añadir*/
		setTimeout("verRSS('cargar','id',miIndice[0])",1000);
		/*Ponemos reg a 0*/
		miReg=0;
		
		}else{
		
			/*Cargamos el registro solicitado*/
			verRSS('cargar','id',miIndice[que]);
			//Guardamos el registro pasado en el actual
			miReg=que;
		
	}
		//Seleccionamos el registro pasado
		document.getElementById("campoSelect")[miReg].selected="selected";
	}else{
	//Si el registro no existe
	noMas("","NO EXISTEN MAS FEEDS");
	}
	
}
//Cambiamos de registro con siguiente y anterior
function cambioOpcion(){
	mostrar(document.getElementById("campoSelect").selectedIndex);
}

//Borrar registros
function borrar(){
	//Nos pide confirmacion
	if(confirm("¿Quieres borrar" +miNombre[miReg])){
	miAccion='borrar';
	
	//Confirmado, lo borramos
	
	verRSS('borrar', 'id',miIndice[miReg]);
	
	//Confirmamos el borrado
	
	noMas("","RSS de" +miNombre[miReg]+" BORRADO");
	//Inicializamos las globales
	miNombre=miIndice=null;
	miNombre=new Array;
	miIndice=new Array;
	miReg=0;
	//Vemos cuantos registros nos quedan en la BD
	verRSS('numRSS', '','');
	}
}
	
//Añadir RSSs

function creacion(){
miAccion='nueva';
//Pedimos los datos
var nombreM=prompt("Introduzca el nombre de la web","");
var urlM=prompt("Introduzca la url que contien el RSS","");
//Comprobamos
if(nombreM!=''&&urlM!=''&&nombreM!=null&&urlM!=null){
	//creamos registro
	verRSS(miAccion, 'titulo='+nombreM+'$url', urlM);
	noMas(urlM,"Registro"+nombreM+"a�adido"); 
	//Inicializamos variables
	miNombre=miIndice=null;
	miNombre=new Array;
	miIndice=new Array;
	miReg=0;
	// Vemos los registros existentes en la BD e introducimos los datos en las variables.
	verRSS('numRSS', '','');
	
}else{
	//Han dejado algún dato en blanco o null
	alert("Los datos no pueden quedar en blanco");
	miAccion='';
	}
}

//Comprobamos que el indice coincide con el de algún registro.
function compruebaIndice(indi){
if(miNombre[indi]==undefined||miNombre[indi]==null||miNombre[indi]==""){
return false;
}else{ 
	return true;
	}
}
	
//Mensaje con efecto fundido
function noMas(miTit, miMensa){
$("#titulo").fadeOut(1).html("Lector de titulares RSS con AJAX y jQUERY ->   "+miTit).fadeIn(1000);
$("#noticias").fadeOut(1).html("<h1 style='color:red;'>"+miMensa+"</h1>").fadeIn(1000);
}	

//
// /////////Apartado para la carga asincrona ////////////
//
//Creamos el objeto xhr y cargamos los datos de la BD de forma asíncrona

function verRSS(funcion,opcion,cadena){
	
	//Mostramos como fundido el logo carga ajax
	activarIndicadorAjax();
	//Creamos el objeto XHR
	miXHR= objetoXHR();
	//Añadimos los parámetros, si los hay, a miFinal
	var miFinal='';
	if(opcion!=''&&cadena!='')
	miFinal="&"+opcion+"="+cadena;
	//Cargamos los datos de forma asíncrona
	cargarAsync("rss.php?accion="+funcion+miFinal, preparado);
}
//Funcion a llamar cuando se cargan datos de la base de datos
function preparado(){
	
if(miXHR.readyState==4 && miXHR.status==200){
//Inicializamos las variables locales y el numero de elementos RSS
var texto="";
var miFecha=null;
var opcio=0;
var totalReg=0;
//Capturamos los errores
try{
	//Recogemos los valores devueltos
	var resultados=eval('('+miXHR.responseText+')');
		//Si la longitud no es null, contiene datos RSS
	if(resultados.length!=null){
	texto+="<h1>RSS ofrecido por: "+miNombre[miReg]+"</h1>";
	//Se ponen todas las noticas que contengan el RSS
	for(var i=0; i < resultados.length; i++){
		objeto = resultados[i];
		miFecha = new Date(objeto.fecha);
		//Ponemos el titulo de la noticia
		texto+="<h3><a href='+objeto.url+' target='blank'>"+objeto.titulo+"</a></h3>";
		//La fecha
		texto+="Fecha: "+miFecha.getDate()+"/"+(miFecha.getMonth()+1)+"/"+miFecha.getFullYear();
		//La hora
		texto+=" - Hora: "+miFecha.getHours()+":"+miFecha.getMinutes();
		//Descripcion de la noticia y la linea de separación con la siguiente
		texto+="<br />"+objeto.descripcion+"<hr />";
		
	}
	//Imprimimos el título y el contenido del RSS
	noMas(miNombre[miReg],texto);
	}else if(resultados>=0){
	//Numero de registros
	totalReg=resultados;
	//Ponemos el registro a 0
	miReg=0;
	verRSS('recursosRSS','','');
	}else{
	//Si es null ya se ha cargado todo, mostramos el primero.
	miCombo(totalReg,resultados);
	mostrar(0);
	}
	}catch(unError){
	//No se cargan los datos del RSS
	noMas(miUrl[miReg],"<h3 style='color:red;'>No se ha podido cargar el RSS de:</h3><h1>"+miNombre[miReg]+"</h1>");
	}
	//Desactivamos el indicador AJAX cuando termina la peticion
	desactivarIndicadorAjax();
	}
	}
//Recreamos el combo si hay cambios
function miCombo(totRSS,result){
//Indicamos la longitud del combo(el  numero de elementos)
document.getElementById("campoSelect").length=totRSS;
var alfa=0;
//Incluimos cada elemento en el combo
for(miObjeto in resul){
	miNombre[alfa]=resul[miObjeto]['titulo'];
	miIndice[alfa]=resul[miObjeto]['id'];
	miUrl[alfa]=resul['miObjeto']['miUrl'];
	//Incluimos nombre del RSS e indice
	document.getElementById("campoSelect").options[alfa]=new Option(miNombre[alfa],miIndice[alfa]);
	alfa++;
}
//Seleccionamos el primero
document.getElementById("campoSelect").options[0].selected="selected";
}

