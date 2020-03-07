const { format } = require('timeago.js');

const help = {};
help.time = (dia) => {
    return format(dia);
};
help.comparaAd = (usuario, idUser) => {
    // console.log("usu:" + usuario + " id " + idUser);
    var puente = 0;
    for (var propiedad in usuario) {
        // console.log(usuario[propiedad]);
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
    // console.log("usu:" + usuario + " id " + idUser);
    // console.log("usu:" + usuario + " id " + idUser);
    var puente = 0;
    for (var propiedad in usuario) {
        // console.log(usuario[propiedad]);
        if (usuario[propiedad] == "Docente" || (usuario == null && idUser)) {
            puente = 1;
        }
    }

    help.comparaMate = (usuario, idUser) => {
        // console.log("usu:" + usuario + " id " + idUser);
        // console.log("usu:" + usuario + " id " + idUser);
        var puente = 0;
        for (var propiedad in usuario) {
            // console.log(usuario[propiedad]);
            if (usuario[propiedad] == "Docente" || (usuario == null && idUser)) {
                puente = 1;
            }
        }


    if (puente == 0) {
        return false;
    } else {
        return true;
    }

};

module.exports = help;