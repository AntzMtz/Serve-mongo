const express = require('express');
const router = express.Router();
const Usuario = require('../models/user')
router.get('/users/singin', (req, res) => {
    res.render('./users/singin')
});

router.get('/users/signup', (req, res) => {
    res.render('./users/singup')
});

router.post('/users/signup', async (req, res) => {
    console.log(req.body);
    const { usuario, Nombre, password, password1 } = req.body;
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
        console.log("En el índice " + indice + " hay este valor: " + valor.text);
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
            password1
        })
    } else {
        try {
            const newUser = new Usuario({ idUser: usuario, Password: password, Nombre: Nombre });
            newUser.Password = await newUser.encrypPass(password);
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
                    password1
                })
            } else {
                req.flash('error_ms', "El error es: " + error.message);
                res.redirect('/users/singin', {
                    usuario,
                    Nombre,
                    password,
                    password1
                });
            }

        }

    }


});
module.exports = router;