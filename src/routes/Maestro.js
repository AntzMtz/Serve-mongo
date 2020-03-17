const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');
const clase = require('../models/Mat01');
const help = require('../lib/hander');

router.get('/Mestro/NewClass', isLoggedIn, (req, res) => {
    res.render('Maestro/newClass')
});

router.get('/Mestro/NewWorkHome', (req, res) => {
    res.render('Maestro/newWorkHome')
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
            errors.push({ text: "La Materia " + nombre + " de la escuela "+ ClaveCentro+" ya existe favor de introducir otro"});
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