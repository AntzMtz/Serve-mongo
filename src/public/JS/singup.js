const materia = document.getElementById('Materia');
const grad = document.getElementById('Grado');
const boton = document.getElementById('btn01');
const tablaDiv = document.getElementById('Tabla');

var datos = [];

function comenzar() {
    document.getElementById("Tabla").innerHTML = "";
    carga();
    boton.addEventListener('click', agregar1, false);
}

function tablaEner() {
    document.getElementById('Tabla').innerHTML = "";
    document.getElementById('Texto').value = JSON.stringify(datos);

    var body = document.getElementById('Tabla');
    var tabla = document.createElement("table");
    var tblBody = document.createElement("tbody");
    var fila = document.createElement("tr");
    for (var y = 0; y < 2; y++) {
        var celda = document.createElement("td");
        if (y == 0) {
            var butn = document.createTextNode("Materia ");
        } else {
            butn = document.createTextNode("Grado ");
        }
        celda.appendChild(butn);
        fila.appendChild(celda);
    }
    tblBody.appendChild(fila);
    // Creamos las celdas
    for (var i = 0; i < datos.length; i++) {
        fila = document.createElement("tr");
        for (var j = 0; j < 3; j++) {
            if (j == 0) {
                celda = document.createElement("td");
                butn = document.createTextNode(datos[i].Materia);
            } else if (j == 1) {
                celda = document.createElement("td");
                butn = document.createTextNode(datos[i].Grado);
            } else {
                celda = document.createElement("td");
                butn = document.createElement('a');
                var ima = document.createElement('i');
                ima.setAttribute("id", datos[i].Materia + "," + i);
                ima.setAttribute('class', 'fas fa-trash');
                butn.appendChild(ima);
                butn.addEventListener("click", eliminarPorName, false);
            }
            celda.appendChild(butn);
            fila.appendChild(celda);
        }
        tblBody.appendChild(fila);
    }
    tabla.appendChild(tblBody);
    body.appendChild(tabla);
    tabla.setAttribute('class', 'table table-dark');
}

function evento(e) {
    grad.innerHTML = "<option disabled selected>Grado</option>"
    for (var i = 0; i < e.length; i++) {
        if (materia.value == e[i]._id) {
            var gra1 = e[i].entries;
            for (var y = 0; y < gra1.length; y++) {
                grad.innerHTML += "<option value=" + gra1[y] + ">" + gra1[y] + "</option>"
            }
        }
    }
}

function eliminarPorName(e) {
    var arrayDeCadenas = e.target.id.split(",");
    var elimi = arrayDeCadenas[1]
    let remo1 = datos.splice(elimi, 1);
    tablaEner();
}

function agregar1() {
    datos.push({ Materia: materia.value, Grado: grad.value })
    tablaEner();
}

function carga() {
    var str = [{}];
    str1 = "{{Texto}}";
    if (str1 == "") {
        datos.push();
    } else {
        var str = str1;
        var res = str.replace(/&quot;/g, '"');
        var jss = JSON.parse(res);
        for (var propiedad in jss) {
            datos.push({ Materia: jss[propiedad].Materia, Grado: jss[propiedad].Grado });
        }
        tablaEner();
    }

    document.getElementById('Texto').value = JSON.stringify(datos);
    document.getElementById("Tipo").value = "{{Tipo}}";
}

window.addEventListener("load", comenzar, false);