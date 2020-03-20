const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');
const clase = require('../models/Mat01');
const Nota = require('../models/Notes')
const help = require('../lib/hander');
var moment = require('moment');
// const app = express();
router.get('/Mestro/NewClass', isLoggedIn, (req, res) => {
    res.render('Maestro/newClass')
});

router.get('/Mestro/NewWorkHome', (req, res) => {
    res.render('Maestro/newWorkHome')
});

router.post('/notes', async (req, res) => {
    console.log("Donde estoy");

    fechas = JSON.parse(req.body.Nuevo);
    const fecha = JSON.parse(req.body.Nuevo);
    fecha34=fechas;
    req.app.locals.fecha34 =fechas;
    //console.log(req.app.locals.fecha=(fechas));
    //console.log("res.body");



    const fechaini = new Date(moment(fechas[0].fecha).format('YYYY-MM-DD'));
    const fechafin = new Date(moment(fechas[1].fecha).format('YYYY-MM-DD'));
    console.log(fechaini, " ", fechafin);


    const datosBD = await Nota.find({
        user: req.user.IDMaestro,
        dia: {
            $gte: fechaini,
            $lt: fechafin
        }
    })
    console.log(datosBD);

    res.render('notes/findNote', {
        datosBD,
        fechaini
    })
});

router.post('/Mestro/NewClass', isLoggedIn, async (req, res) => {

    const { nombre, grado } = req.body;
    const { ClaveCentro } = req.user;

    try {
        const newClass = new clase({
            Nombre: nombre, Grado: grado, ClaveCentro: ClaveCentro
        });
        await newClass.save();
        res.redirect('/Maestro')
    } catch (error) {
        const errors = [];
        if (error.code == '11000') {
            // req.flash("errors", "La Materia ");
            errors.push({ text: "La Materia " + nombre + " de la escuela " + ClaveCentro + " ya existe favor de introducir otro" });
            res.render('Maestro/newClass', {

                errors,
                nombre,
                grado
            })
        } else {
            req.flash('error_ms', "El error es: " + error);
            res.render('Maestro/newClass', {
                error,
                nombre,
                grado
            });
        }

    }


});



router.get('/Maestro', isLoggedIn, (req, res) => {
    try {
        var conter = help.comparaPuesto(req.user.Puesto);
        var PuesMd = conter[0].PuestoMd;
        var TexMd = conter[0].TextMd;
        res.render('Maestro/maestro', {
            PuesMd,
            TexMd
        })
    } catch (error) {
        req.flash('error_ms', "No estas Logeado Favor de Logearte")
        res.redirect('/');
    }
})

module.exports = router;