const express = require('express');
const router = express.Router();

router.get('/users/singin', (req, res) => {
    res.render('./users/singin')
});

router.get('/users/signup', (req, res) => {
    res.render('./users/singup')
});

router.post('/users/signup', (req, res) => {
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

    const errors=[];
    if (error_mesa.length > 0) {
        errors.push({ text: errores_dis });
        req.flash('error_ms', errores_dis);
        res.render('users/singup',{
            errors,
            usuario,
            Nombre, 
            password, 
            password1
        })
    } else {
        req.flash('success', "Los datos son correctos");
        res.redirect('/notes');
    }
    

});
module.exports = router;