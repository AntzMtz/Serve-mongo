const express = require('express');
const router = express.Router();
const Nota = require('../models/maestros')
const { format } = require('timeago.js');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');
const help = require('../lib/hander');

router.get('/Maestro',isLoggedIn,(req,res)=>{
    try {
        console.log("Body01");
        console.log(req.user.Puesto);
        var conter = help.comparaPuesto(req.user.Puesto);
        console.log("Body02");
        console.log(conter[0].PuestoMd);
        var PuesMd = conter[0].PuestoMd;
        var TexMd = conter[0].TextMd;

        res.render('Maestro/maestro',{
            PuesMd,
            TexMd
        })
    } catch (error) {
        req.flash('error_ms', "No estas Logeado Favor de Logearte")
        res.redirect('/');
    }
})

module.exports = router;