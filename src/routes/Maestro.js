const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');
const help = require('../lib/hander');

router.get('/Maestro',isLoggedIn,(req,res)=>{
    try {
        var conter = help.comparaPuesto(req.user.Puesto);
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