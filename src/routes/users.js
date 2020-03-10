const express = require('express');
const router = express.Router();
const Usuario = require('../models/user')
const Mat1 = require('../models/Mat01')
const Maestro = require('../models/maestros')
const note = require('../models/Notes')
const bcrypt = require('../lib/helpers');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');


router.get('/users/singin', isNotLoggedIn, (req, res) => {

    res.render('./users/singin')
});

router.post('/users/singin', isNotLoggedIn, passport.authenticate('local.signin', {

    successRedirect: '/Maestro',
    failureRedirect: '/users/singin',
    failureFlash: true
}));



router.get('/users/signup', isNotLoggedIn, async (req, res) => {
    const json01=[]
    const materias = await Mat1.aggregate([{$group: {_id: "$Nombre",entries: { $push: "$Grado" }}}])

    for(var i=0;i<materias.length;i++){
        json01.push(JSON.stringify(materias[i]));
    }

    res.render('./users/singup',{materias,json01})
});

router.post('/users/signup', isNotLoggedIn, async (req, res) => {
    console.log("Quien es: ");
    
    console.log(req);
    const { usuario, Nombre, password, password1,Centro,ClaveCentro,Texto,Grado, Tipo } = req.body;
    error_mesa = [];
    if (password != password1) {
        error_mesa.push({ text: 'La contraseña no coinside' })
    }
    if (password.length < 4) {
        error_mesa.push({ text: 'La contraseña debe de tener mas de 4 digitos' })
    }
    if (Nombre.length < 1) {
        error_mesa.push({ text: 'Es necesario introducir tu nombre' })
    }
    if (usuario.length < 1) {
        error_mesa.push({ text: 'Es necesario introducir tu usuario' })
    }
    var errores_dis = "";
    error_mesa.forEach(function (valor, indice, array) {
        if (error_mesa.length <= indice + 1) {
            errores_dis += valor.text + " Favor de validar";
        } else {
            errores_dis += valor.text + " , ";
        }
        // console.log("En el índice " + indice + " hay este valor: " + valor.text);
    });

    const errors = [];
    if (error_mesa.length > 0) {
        errors.push({ text: errores_dis });
        req.flash('error_ms', errores_dis);
        res.render('users/singup', {
            errors,
            usuario,
            Nombre,
            password,
            password1,
            Centro,
            ClaveCentro,
            Texto,
            Grado,
            Tipo
        })
    } else {
        try {
            const newUser = new Maestro({ Nombre: Nombre, Materia: JSON.parse(Texto), Centro: Centro, ClaveCentro: ClaveCentro,PassMaes:password,Estatus:'Activo',IDMaestro:usuario,Puesto: Tipo
        });
            newUser.PassMaes = await bcrypt.encypass(password);
            
            console.log(await bcrypt.encypass(password));
            
            await newUser.save();
            req.flash('success', "Los datos son correctos");
            res.redirect('/users/singin');
        } catch (error) {
            const errors = [];
            if (error.code == '11000') {
                req.flash('error_ms', "El usuario " + usuario + " ya existe favor de introducir otro");
                errors.push({ text: "El usuario " + usuario + " ya existe favor de introducir otro" });
                res.render('users/singup', {
                    errors,
                    usuario,
                    Nombre,
                    password,
                    password1,
                    Centro,
                    ClaveCentro,
                    Texto,
                    Grado,
                    Tipo
                })
            } else {
                req.flash('error_ms', "El error es: " + error);
                res.redirect('/users/singin', {
                    errors,
                    usuario,
                    Nombre,
                    password,
                    password1,
                    Centro,
                    ClaveCentro,
                    Texto,
                    Grado,
                    Tipo
                });
            }

        }

    }


});
module.exports = router;