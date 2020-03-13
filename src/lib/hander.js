const { format } = require('timeago.js');

const help = {};
help.time = (dia) => {
    return format(dia);
};
help.comparaAd = (usuario, idUser) => {
    var puente = 0;
    for (var propiedad in usuario) {
        console.log(usuario[propiedad]);
        if (usuario[propiedad] == "Administrador" || (usuario == null && idUser)) {
            puente = 1;
        }
    }
    if (puente == 0) {
        return false;
    } else {
        return true;
    }

};

help.comparaDoc = (usuario, idUser) => {
    var puente = 0;
    for (var propiedad in usuario) {
        if (usuario[propiedad] == "Docente" || (usuario == null && idUser)) {
            puente = 1;
        }
    }
    console.log("puente"+puente);
    
    if (puente == 0) {
        return false;
    } else {
        return true;
    }

};

help.comparaPuesto = (puesto) => {
    var Puest01 = [];
    var AdminTXT = "En Este Modulo Podras Dar de Alta, Baja y Cambios de los Docentes Asi Como Podras Dar CheckIn de los Alumnos y Docentes";
    var DocenTXT = "En Este Modulo Podras Dar de Alta, Baja y Cambios de las actividades Asi Como Podras Dar CheckIn de los Alumnos";
    Puest01.push({PuestoMd:"Docente",TextMd:DocenTXT});
    
    for (var propiedad in puesto) {
        if (puesto[propiedad] == "Administrador") {
            Puest01 = [];
            Puest01.push({PuestoMd:puesto[propiedad],TextMd:AdminTXT});
        }
    }
    console.log(Puest01);
    return Puest01;
};

module.exports = help;