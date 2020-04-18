const express = require('express');
const router = express.Router();
const path1 = require('path');
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');
const alumno = require('../models/alumno');
const Mat1 = require('../models/Mat01');
const fs = require('fs');

const qrcode = require('qrcode');

router.get('/Alumnos/add', isLoggedIn, async(req, res) => {
    json01 = []
    materias = await Mat1.aggregate([{ $group: { _id: "$Nombre", entries: { $push: "$Grado" } } }])

    for (var i = 0; i < materias.length; i++) {
        json01.push(JSON.stringify(materias[i]));
    }
    console.log(materias);

    res.render('Alumno/alumnosAdd.hbs', { materias, json01 });

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

        console.log(Texto);

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
        console.log("Error: " + error);
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