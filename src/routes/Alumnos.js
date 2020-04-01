const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');
const alumno = require('../models/alumno');


router.get('/Alumnos/add', (req, res) => {
    res.render('Alumno/alumnosAdd.hbs')
});


router.post('/Alumnos/add', async (req, res) => {
    console.log(req.body);
    const { idAlumno, idEscuela, codQr, grupo, grado, correoTutor, nombreTutor, nombre, aPaterno, aMaterno, direccion, delegacion, estado } = req.body;
    try {
        const newAlum = new alumno({
            idAlumno, idEscuela, codQr, grado, grupo, correoTutor, nombreTutor, nombre, aPaterno, aMaterno, direccion, delegacion, estado
        });
        console.log("Pase 3");
        
        await newAlum.save();
        console.log("Pase 4");
        req.flash('success', "Registro insertado de forma satisfactoria");
        res.redirect('/Alumnos/add')

    } catch (error) {
        const errors = [];
        if (error.code == '11000') {
            errors.push({ text: "El Alumno " + idAlumno + " de la escuela " + idEscuela + " ya existe favor de introducir otro" });
        } else {
            errors.push({ text: "El error es: " + error });
            //req.flash('error', "El error es: " + error);
        }
        console.log("Error: " + error);

        res.render('Alumno/alumnosAdd.hbs', { idAlumno, idEscuela, codQr, grado, correoTutor, nombreTutor, nombre, aPaterno, aMaterno, direccion, delegacion, estado, errors })
    }

});


module.exports = router;