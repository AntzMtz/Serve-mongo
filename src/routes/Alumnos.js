const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/aut');

router.get('/Alumnos/add',(req,res)=>{
    res.render('Alumno/alumnosAdd.hbs')
});


router.post('/Alumnos/add',(req,res)=>{
    console.log(req.user);
    
    res.send('Alumno/alumnosAdd.hbs')
});


module.exports = router;