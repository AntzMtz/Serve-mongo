const express = require('express');
const router = express.Router();
const Nota = require('../models/Notes')
const alumnos = require('../models/alumno');
const tarea = require('../models/tareas');
var moment = require('moment');
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');

router.get('/notes/add', isLoggedIn, (req, res) => {
    try {
        const mate01 = req.user.Materia;
        res.render('notes/newnote', {
            fechas,
            mate01
        });
    } catch (error) {
        req.flash('error_ms', error.message)
        res.redirect('/notes');
    }
});

router.post('/notes/newnote', isLoggedIn, async(req, res) => {
    try {
        const { titulo, descripcion, Materia, grupo } = req.body;
        var Mat1 = Materia.split(",")
        var Materia1 = [];
        Materia1.push({ "Materia": Mat1[0], "Gardo": Mat1[1] })
        const errors = [];
        if (!titulo) {
            errors.push({ text: 'Porfavor escribe un titulo' });
        }
        if (!descripcion) {
            errors.push({ text: 'Porfavor escribe una descripción' });
        }

        if (errors.length > 0) {
            res.render('notes/newnote', {
                errors,
                titulo,
                descripcion
            })
        } else {
            const nuevaNota = new Nota({ titulo, descripcion });
            console.log(req.user.ClaveCentro);
            nuevaNota.user = req.user.IDMaestro;
            nuevaNota.grado = Materia1;
            nuevaNota.centro = req.user.ClaveCentro;
            nuevaNota.grupo = grupo;
            try {
                nuevaNota.dia = new Date(moment(fecha34[0].fecha).format('YYYY-MM-DD'));
                await nuevaNota.save();
                req.flash('success', 'Se inserto el registro ' + titulo + ' de forma correcta');
            } catch (error) {
                if (error.code == '11000') {
                    req.flash('error_ms', "La tarea ya existe, No puede ser agregada");
                } else {
                    req.flash('error_ms', "error: " + error.message);
                }
            }
            res.redirect('/notes');
        }
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/');
    }
});

router.get('/notes', async(req, res) => {
    try {
        fechas = fecha34;
        const fechaini = new Date(moment(fechas[0].fecha).format('YYYY-MM-DD'));
        const fechafin = new Date(moment(fechas[1].fecha).format('YYYY-MM-DD'));
        const datosBD = await Nota.find({
            user: req.user.IDMaestro,
            dia: {
                $gte: fechaini,
                $lt: fechafin
            }
        }).sort({ "dia": -1 })
        res.render('notes/findNote', {
            datosBD,
            fechas
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/Mestro/NewWorkHome');
    }
});

router.get('/notes/ReadQR', isLoggedIn, async(req, res) => {
    res.render('notes/readQr');
});

router.get('/notes/ReadQR2', isLoggedIn, async(req, res) => {
    res.render('notes/ReadQr2');
});

router.get('/notes/checkin/:id', isLoggedIn, async(req, res) => {
    const dato = req.params.id;
    const datosBD1 = await Nota.find({ "_id": dato })
    const datosBD = datosBD1[0];
    const mate = datosBD.grado[0].Materia;
    const { titulo, descripcion } = datosBD;
    console.log(datosBD);


    const ClaveCentro = req.user.ClaveCentro;
    const al03 = await alumnos.find({ "idEscuela": ClaveCentro, "materias.Materia": datosBD.grado[0].Materia, "grado": datosBD.grado[0].Gardo });
    //console.log(al03);


    const alum01 = JSON.stringify(al03);
    const modal1 = "modi";
    res.render('notes/checkin', { alum01, mate, titulo, descripcion, modal1, dato });

});

router.post('/notes/checkin/:id', isLoggedIn, async(req, res) => {

    const id3 = req.params.id;
    const al03 = await Nota.findById(id3);
    console.log(al03);

    const Materia = al03.grado[0].Materia;
    const IDMaestro = al03.user;
    const tareas = al03.titulo;
    const fecha = al03.dia;
    const centro = al03.centro;
    console.log(centro);
    var texto = [];
    var Texto = [];


    const alum = JSON.parse(req.body.posteo);
    console.log("alumn");
    console.log(alum.length);
    for (x = 0; x < alum.length; x++) {
        console.log(alum[x].id);
        var alum98 = await tarea.find({ "idAlumnos": alum[x].id });
        if (alum98.length == 0) {
            console.log("No Hay");
            try {
                Texto.push({
                    IdMaestro: IDMaestro,
                    Materia: Materia,
                    NomTare: tareas,
                    fecha: fecha,
                    caliica: alum[x].calif
                });
                console.log(texto);

                const nuevaTarea = new tarea({
                    idAlumnos: alum[x].id,
                    idEscuela: centro,
                    idTareas: Texto
                });
                await nuevaTarea.save();
                Texto = [];
                console.log("Se inserto");

            } catch (error) {
                console.log(error.message);

            }

        } else {

            try {
                var id = alum98[0]._id;
                var Tareas = alum98[0].idTareas;
                console.log("idddddd");
                console.log(Tareas);
                const tar1 = Tareas.length;

                for (a = 0; a < Tareas.length; a++) {
                    console.log(Tareas[a].IdMaestro);

                    var tare = Tareas[a].IdMaestro + Tareas[a].Materia + Tareas[a].NomTare + Tareas[a].fecha
                    var tar2 = IDMaestro + Materia + tareas + fecha
                    var con = 0;
                    console.log(tare);
                    console.log(tar2);


                    if (tare == tar2) {
                        Tareas.splice(a, 1);
                        console.log("Si se");
                    } else {
                        // Tareas.push({
                        //     IdMaestro: IDMaestro,
                        //     Materia: Materia,
                        //     NomTare: tareas,
                        //     fecha: fecha,
                        //     caliica: alum[x].calif
                        // });

                        console.log("No se");
                    }

                }

                Tareas.push({
                    IdMaestro: IDMaestro,
                    Materia: Materia,
                    NomTare: tareas,
                    fecha: fecha,
                    caliica: alum[x].calif
                });
                console.log(Tareas);

                //const ger = await tarea.find({ _id: id });
                await tarea.findOneAndUpdate({ _id: id }, { $set: { idTareas: Tareas } })
                Tareas = [];
                console.log("Actualizo");
            } catch (error) {
                console.log(error);
            }



        }



    }





    res.send('Llego el post')
});

router.get('/notes/edit/:id', isLoggedIn, async(req, res) => {
    const dato = req.params.id;


    const datosBD1 = await Nota.find({ "_id": dato })
    const datosBD = datosBD1[0];
    console.log(datosBD);
    res.render('notes/editNote', { datosBD });
});

router.put('/notes/editNote/:id', isLoggedIn, async(req, res) => {
    const { titulo, descripcion } = req.body;
    try {
        await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion })
        req.flash('success', 'Modificación correcta del registro: ' + titulo);
    } catch (error) {
        if (error.code == '11000') {
            req.flash('error_ms', "La tarea ya existe, No puede ser modificada");
        } else {
            req.flash('error_ms', "error: " + error.message);
        }
    }
    res.redirect('/notes')
});

router.delete('/notes/editNote/:id', isLoggedIn, async(req, res) => {
    try {
        const del = await Nota.findByIdAndDelete(req.params.id);
        req.flash('success', 'Se elimino el registro ' + del.titulo + " de forma exitosa");
    } catch (error) {
        req.flash('error_ms', error.message);
    }
    res.redirect('/notes')
});

module.exports = router;