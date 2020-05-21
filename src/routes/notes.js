const express = require('express');
const router = express.Router();
const Nota = require('../models/Notes')
const alumnos = require('../models/alumno');
const tarea = require('../models/tareas');
var moment = require('moment');
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');


router.get('/notes/add', isLoggedIn, (req, res) => {
    try {
        const mate02 = req.user.Materia;

        mate02.sort(function(a, b) {
            return (a.Materia + a.Grado).localeCompare((b.Materia + b.Grado));
        });

        const mate01 = [];
        var { materia, grado } = "";
        for (x = 0; x < mate02.length; x++) {

            if (materia != mate02[x].Materia || grado != mate02[x].Grado) {

                materia = mate02[x].Materia;
                grado = mate02[x].Grado;
                mate01.push({ Materia: mate02[x].Materia, Grado: mate02[x].Grado })

            }

        }


        res.render('notes/newnote', {
            fechas,
            mate01
        });
    } catch (error) {
        req.flash('error_ms', error.message)
        res.redirect('/notes');
    }
});

router.get('/notes/viewHomeWork', isLoggedIn, (req, res) => {

    try {
        var datos = [];
        var materia = "";
        var grado = "";
        const mate01 = req.user.Materia;
        mate01.sort(function(a, b) {
            return (a.Materia + a.Grado).localeCompare((b.Materia + b.Grado));
        });

        var llave1 = "";
        for (x = 0; x < mate01.length; x++) {
            var llave = mate01[x].Materia + mate01[x].Grado;

            if (llave != llave1) {
                datos.push({ "llave": mate01[x].Materia + mate01[x].Grado, "materia": mate01[x].Materia, "grado": mate01[x].Grado });
                llave1 = mate01[x].Materia + mate01[x].Grado;
            }

        }
        res.render('notes/viewMateria', { datos });
    } catch (error) {
        req.flash('error_ms', error.message)


        res.redirect('/');
    }
});

router.post('/notes/newnote', isLoggedIn, async(req, res) => {
    try {
        const { titulo, descripcion, Materia, grupo, periodo } = req.body;
        const errors = [];

        if (Materia) {
            var Mat1 = Materia.split(",")
            var Materia1 = [];

            Materia1.push({ "Materia": Mat1[0], "Gardo": Mat1[1] })
        } else {
            errors.push({ text: 'Porfavor escribe un Materia' });
        }

        if (!titulo) {
            errors.push({ text: 'Porfavor escribe un titulo' });
        }
        if (!descripcion) {
            errors.push({ text: 'Porfavor escribe una descripción' });
        }
        if (!periodo) {
            errors.push({ text: 'Porfavor escribe un Periodo' });
        }

        if (errors.length > 0) {
            res.render('notes/newnote', {
                errors,
                titulo,
                descripcion,
                periodo
            })
        } else {
            const nuevaNota = new Nota({ titulo, descripcion, periodo });
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
        res.redirect('/Maestro');
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
    const califica = [];
    const grupo01 = [];
    const al03 = [];
    const ClaveCentro = req.user.ClaveCentro;

    const al033 = await alumnos.find({ "idEscuela": ClaveCentro, "materias.Materia": datosBD.grado[0].Materia, "grado": datosBD.grado[0].Gardo });

    for (x = 0; x < req.user.Materia.length; x++) {
        if (req.user.Materia[x].Materia == datosBD.grado[0].Materia &&
            req.user.Materia[x].Grado == datosBD.grado[0].Gardo) {
            grupo01.push({ Grupo: req.user.Materia[x].Grupo })
        }
    }

    for (y = 0; y < al033.length; y++) {
        for (w = 0; w < grupo01.length; w++) {
            if (grupo01[w].Grupo == al033[y].grupo) {

                const al04 = await tarea.find({
                    "idAlumnos": al033[y].codQr,
                    "idTareas": {
                        $elemMatch: {
                            "Materia": datosBD.grado[0].Materia,
                            "NomTare": datosBD.titulo
                        }
                    }
                }, { "idTareas.Materia.$": 1 });

                try {
                    califica.push({ Idalumno: al033[y].codQr, calificacion: al04[0].idTareas[0].califica })

                } catch (error) {
                    console.log(error.message);
                }
                al03.push(al033[y]);

            }
        }
    }
    const alum01 = JSON.stringify(al03);
    const cal01 = JSON.stringify(califica);
    const modal1 = "modi";
    res.render('notes/checkin', { alum01, mate, titulo, descripcion, modal1, dato, cal01 });
});

router.post('/notes/checkin/:id', isLoggedIn, async(req, res) => {
    const id3 = req.params.id;
    const al03 = await Nota.findById(id3);
    const Materia = al03.grado[0].Materia;
    const Grado = al03.grado[0].Gardo;
    const IDMaestro = al03.user;
    const tareas = al03.titulo;
    const fecha = al03.dia;
    const centro = al03.centro;
    const perio = al03.periodo;

    var texto = [];
    var Texto = [];

    try {
        const alum = JSON.parse(req.body.posteo);
        for (x = 0; x < alum.length; x++) {
            var alum98 = await tarea.find({ "idAlumnos": alum[x].id });
            if (alum98.length == 0) {
                try {
                    Texto.push({
                        IdMaestro: IDMaestro,
                        Materia: Materia,
                        NomTare: tareas,
                        fecha: fecha,
                        califica: alum[x].calif,
                        periodo: perio,
                        Grado: Grado
                    });
                    const nuevaTarea = new tarea({
                        idAlumnos: alum[x].id,
                        idEscuela: centro,
                        idTareas: Texto
                    });
                    await nuevaTarea.save();
                    Texto = [];


                } catch (error) {
                    console.log(error.message);

                }

            } else {

                try {
                    var id = alum98[0]._id;
                    var Tareas = alum98[0].idTareas;
                    for (a = 0; a < Tareas.length; a++) {

                        var tare = Tareas[a].IdMaestro + Tareas[a].Materia + Tareas[a].NomTare + Tareas[a].fecha
                        var tar2 = IDMaestro + Materia + tareas + fecha
                        if (tare == tar2) {
                            Tareas.splice(a, 1);
                        }
                    }
                    Tareas.push({
                        IdMaestro: IDMaestro,
                        Materia: Materia,
                        NomTare: tareas,
                        fecha: fecha,
                        califica: alum[x].calif,
                        periodo: perio,
                        Grado: Grado
                    });
                    await tarea.findOneAndUpdate({ _id: id }, { $set: { idTareas: Tareas } })
                    Tareas = [];
                } catch (error) {
                    console.log(error);
                }
            }
        }
    } catch (error) {
        if (error.message == 'Unexpected end of JSON input') {
            req.flash('error_ms', "No se actualizo ningun registro");
        } else {
            req.flash('error_ms', "Error:" + error.message);
        }

    }
    res.redirect('/notes')
});

router.get('/notes/edit/:id', isLoggedIn, async(req, res) => {
    const dato = req.params.id;


    const datosBD1 = await Nota.find({ "_id": dato })
    const datosBD = datosBD1[0];
    const materia = datosBD1[0].grado;

    const mate02 = req.user.Materia;
    mate02.sort(function(a, b) {
        return (a.Materia + a.Grado).localeCompare((b.Materia + b.Grado));
    });



    const mate01 = [];
    var { materia1, grado } = "";
    for (x = 0; x < mate02.length; x++) {

        if (materia1 != mate02[x].Materia || grado != mate02[x].Grado) {

            materia1 = mate02[x].Materia;
            grado = mate02[x].Grado;
            mate01.push({ Materia: mate02[x].Materia, Grado: mate02[x].Grado })

        }


    }

    res.render('notes/editNote', { datosBD, materia, mate01 });
});

router.put('/notes/editNote/:id', isLoggedIn, async(req, res) => {
    const { titulo, descripcion, Materia, periodo } = req.body;

    if (Materia) {
        var Mat1 = Materia.split(",")
        var Materia1 = [];
        Materia1.push({ "Materia": Mat1[0], "Gardo": Mat1[1] })
    } else {
        errors.push({ text: 'Porfavor escribe un Periodo' });
    }


    try {
        const alum = await Nota.findById(req.params.id);

        if (alum.titulo != titulo ||
            alum.periodo != periodo ||
            alum.grado[0].Materia != Mat1[0] ||
            alum.grado[0].Gardo != Mat1[1]) {
            var tare = await tarea.find({
                "idEscuela": alum.centro,
                "idTareas.IdMaestro": alum.user,
                "idTareas.Materia": alum.grado[0].Materia,
                "idTareas.Grado": alum.grado[0].Gardo,
                "idTareas.periodo": alum.periodo,
                "idTareas.NomTare": alum.titulo
            }, {
                "_id": false,
                "idAlumnos": true,
                "idTareas": { $elemMatch: { "NomTare": alum.titulo } }
            })

            for (var x = 0; x < tare.length; x++) {

                const materia = tare[x].idTareas;
                for (var m = 0; m < tare[x].idTareas.length; m++) {

                    await tarea.update({
                        "idAlumnos": tare[x].idAlumnos,
                        "idTareas": {
                            $elemMatch: {
                                "IdMaestro": tare[x].idTareas[m].IdMaestro,
                                "Materia": tare[x].idTareas[m].Materia,
                                "Grado": tare[x].idTareas[m].Grado,
                                "NomTare": tare[x].idTareas[m].NomTare,
                                "periodo": tare[x].idTareas[m].periodo
                            }
                        }
                    }, {

                        $set: {
                            "idTareas.$.Materia": Mat1[0],
                            "idTareas.$.Grado": Mat1[1],
                            "idTareas.$.NomTare": titulo,
                            "idTareas.$.periodo": periodo
                        }
                    })

                }

            }
        }
        await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion, "grado": Materia1, periodo })
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
        const find = await Nota.findById(req.params.id);
        var fin = await tarea.update({
            "idTareas": {
                $elemMatch: {
                    "IdMaestro": find.user,
                    "Materia": find.grado[0].Materia,
                    "Grado": find.grado[0].Gardo,
                    "NomTare": find.titulo,
                    "periodo": find.periodo
                }
            }
        }, {
            '$pull': { 'idTareas': { "NomTare": find.titulo } }
        }, { multi: true })

        const del = await Nota.findByIdAndDelete(req.params.id);
        req.flash('success', 'Se elimino el registro ' + find.titulo + " de forma exitosa");
    } catch (error) {
        req.flash('error_ms', error.message);
    }
    res.redirect('/notes')
});




// router.get('/notes/viewHomeWork', isLoggedIn, (req, res) => {

//     try {
//         var datos = [];
//         var materia = "";
//         var grado = "";
//         const mate01 = req.user.Materia;
//         mate01.sort(function(a, b) {
//             return (a.Materia + a.Grado).localeCompare((b.Materia + b.Grado));
//         });
//         // console.log(mate01);
//         var llave1 = "";
//         for (x = 0; x < mate01.length; x++) {
//             var llave = mate01[x].Materia + mate01[x].Grado;

//             if (llave != llave1) {
//                 datos.push({ "llave": mate01[x].Materia + mate01[x].Grado, "materia": mate01[x].Materia, "grado": mate01[x].Grado });
//                 llave1 = mate01[x].Materia + mate01[x].Grado;
//             }

//         }
//         res.render('notes/viewMateria', { datos });
//     } catch (error) {
//         req.flash('error_ms', error.message)
//         console.log(error);

//         res.redirect('/');
//     }
//     // try {
//     //     const mate01 = req.user.Materia;
//     //     res.render('notes/newnote', {
//     //         fechas,
//     //         mate01
//     //     });
//     // } catch (error) {
//     //     req.flash('error_ms', error.message)
//     //     res.redirect('/notes');
//     // }
// });


module.exports = router;