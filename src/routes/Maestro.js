const express = require('express');
const router = express.Router();
const Nota = require('../models/Maestros')
const { format } = require('timeago.js');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');

router.get('/Maestro',(req,res)=>{
    try {
        console.log("body: "+req.body);
        res.render('Maestro/maestro')
        
    } catch (error) {
        req.flash('error_ms', "No estas Logeado Favor de Logearte")
        res.redirect('/');
    }
})

module.exports = router;