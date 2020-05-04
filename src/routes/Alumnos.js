const express = require('express');
const router = express.Router();
const path1 = require('path');
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');
const alumno = require('../models/alumno');
const Mat1 = require('../models/Mat01');
const tarea = require('../models/tareas');
const fs = require('fs');

const qrcode = require('qrcode');

router.get('/Alumnos/add', isLoggedIn, async(req, res) => {
    json01 = []
    materias = await Mat1.aggregate([{ $group: { _id: "$Nombre", entries: { $push: "$Grado" } } }])

    for (var i = 0; i < materias.length; i++) {
        json01.push(JSON.stringify(materias[i]));
    }

    res.render('Alumno/alumnosAdd.hbs', { materias, json01 });

});

router.get('/Alumnos/alumnoCal/:materia,:grado', isLoggedIn, async(req, res) => {
    json01 = [];
    Alumnos01 = [];
    var mater = req.user.Materia;
    var materia = req.params.materia;
    var grado = req.params.grado;
    for (m = 0; m < mater.length; m++) {
        if (mater[m].Materia == req.params.materia && mater[m].Grado == req.params.grado) {
            json01.push({ "grupo": mater[m].Grupo });
        }
    }

    const alumnos = await alumno.find({ "idEscuela": req.user.ClaveCentro, "materias.Materia": materia, "grado": grado });
    for (m = 0; m < alumnos.length; m++) {
        for (n = 0; n < json01.length; n++) {
            if (alumnos[m].grupo == json01[n].grupo) {
                Alumnos01.push(alumnos[m])
            }
        }
    }
    var alu05 = [];
    var alu06 = [];
    for (o = 0; o < Alumnos01.length; o++) {
        const materAlum = await tarea.find({ "idAlumnos": Alumnos01[o].codQr });
        var nom = Alumnos01[o].nombre + " " + Alumnos01[o].aPaterno + " " + Alumnos01[o].aMaterno;
        alu05.push({ "Nombre": nom });
        console.log("Quien");

        console.log(materAlum[0]);

        var idmate = materAlum[0].idTareas;
        var mate = "";
        for (p = 0; p < idmate.length; p++) {
            if (idmate[p].Materia == materia) {

                alu05.push({ "NomTare": idmate[p].NomTare, "calificacion": idmate[p].caliica, "fecha": idmate[p].fecha });
            }
        }
        alu06.push(alu05);
        alu05 = [];
    }
    console.log("alu06");
    console.log(alu06);
    var Json01 = JSON.stringify(alu06);
    var Json02 = JSON.parse(Json01);

    console.log("por aqui");

    console.log(Json02[0]);

    res.render('Alumno/viewAlumno', { Json01, materia, grado });
});

router.post('/Alumnos/add', isLoggedIn, async(req, res) => {
    const { idAlumno, idEscuela, codQr, grupo, grado, correoTutor, nombreTutor, nombre, aPaterno, aMaterno, direccion, delegacion, estado, Texto } = req.body;
    const errors1 = [];
    const errors = [];
    try {

        if (idAlumno == "") {
            errors1.push({ text: 'Debes de Ingresar una clave de Usuario' });
        }
        if (idEscuela == "") {
            errors1.push({ text: 'Debes de Ingresar la clave de la Escuela' });
        }
        if (codQr == "") {
            errors1.push({ text: 'Generar el codigo QR del alumno' });
        }
        if (grupo == "") {
            errors1.push({ text: 'Ingresar el grupo del Alumno' });
        }
        if (grado == "") {
            errors1.push({ text: 'Ingresar el Grado del Alumno' });
        }
        if (correoTutor == "") {
            errors1.push({ text: 'Ingresar el Email del Tutor Legal' });
        }
        if (nombreTutor == "") {
            errors1.push({ text: 'Debes de Ingresar El nombre completo del Tutor' });
        }
        if (nombre == "") {
            errors1.push({ text: 'Ingresar el Nombre del Alumno' });
        }
        if (aPaterno == "") {
            errors1.push({ text: 'Ingresar el Apellido Paterno del Alumno' });
        }
        if (aMaterno == "") {
            errors1.push({ text: 'Ingresar el Apellido Materno del Alumno' });
        }
        if (direccion == "") {
            errors1.push({ text: 'Ingresar la Dirección del Alumno' });
        }
        if (delegacion == "") {
            errors1.push({ text: 'Ingresar la Delegación' });
        }
        if (estado == "") {
            errors1.push({ text: 'Ingresar el Estado' });
        }
        if (Texto.length < 1 || Texto == "{}" || Texto == "[]") {
            errors1.push({ text: 'Es necesario introducir almenos una materia ' })
        }
        const newAlum = new alumno({
            idAlumno,
            idEscuela,
            codQr,
            grado,
            grupo,
            correoTutor,
            nombreTutor,
            nombre,
            aPaterno,
            aMaterno,
            direccion,
            delegacion,
            estado,
            materias: JSON.parse(Texto)
        });
        await newAlum.save();
        const path3 = path1.join(__dirname, '../', 'imagu/');
        var clave = codQr;
        var nomb = idAlumno + idEscuela;
        qrcode.toFile(path3 + nomb + '.png', clave, { width: 500 })
        req.flash('success', "Registro insertado de forma satisfactoria");
        res.redirect('/Alumnos/add')

    } catch (error) {

        if (error.code == '11000') {
            errors.push({ text: "El Alumno " + idAlumno + " de la escuela " + idEscuela + " ya existe favor de introducir otro" });
        } else {
            if (errors1.length > 0) {
                var errores_dis = "";
                errors1.forEach(function(valor, indice, array) {
                    if (errors1.length <= indice + 1) {
                        errores_dis += valor.text + " Favor de validar";
                    } else {
                        errores_dis += valor.text + " , ";
                    }
                });
                errors.push({ text: errores_dis });
            } else {
                errors.push({ text: "El error es: " + error });
            }
        }

        res.render('Alumno/alumnosAdd.hbs', {
            idAlumno,
            idEscuela,
            codQr,
            grupo,
            grado,
            correoTutor,
            nombreTutor,
            nombre,
            aPaterno,
            aMaterno,
            direccion,
            delegacion,
            estado,
            errors,
            Texto,
            materias,
            json01
        })
    }

});


router.get('/Alumnos/imagenes', isLoggedIn, (req, res) => {
    res.render('Alumno/imagenes.hbs')
});

router.post('/Alumnos/imagenes', isLoggedIn, (req, res) => {

    const path3 = path1.join(__dirname, '../', 'imagu/');
    const { path, name } = req.files.archivo;
    fs.rename(path, path3 + name, () => {
        null
    });
    res.send(path3 + name)


});



module.exports = router;