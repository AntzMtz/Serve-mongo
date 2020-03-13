const express = require('express');
const router = express.Router();
const Nota = require('../models/Notes')
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');

router.get('/notes/add',isLoggedIn, (req, res) => {
    try {
        res.render('notes/newnote');
    } catch (error) {
        req.flash('error_ms', "No estas Logeado Favor de Logearte")
        res.redirect('/');
    }
});

router.post('/notes/newnote',isLoggedIn, async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const errors = [];
        if (!titulo) {
            errors.push({ text: 'Porfavor escribe un titulo' });
        }
        if (!descripcion) {
            errors.push({ text: 'Porfavor escribe una descripción' });
        }
        if (errors.length > 0) {
            res.render('notes/newnote', {
                errors,
                titulo,
                descripcion
            })
        } else {
            const nuevaNota = new Nota({ titulo, descripcion });
            nuevaNota.user=req.user.idUser;
            try {
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
        req.flash('error_ms', "No estas Logeado Favor de Logearte")
        res.redirect('/');
    }
});

router.get('/notes', isLoggedIn,async (req, res) => {
    const datosBD = await Nota.find({user:req.user.idUser}).sort({ "dia": -1 })
    res.render('notes/findNote', {
        datosBD
    })
});

router.get('/notes/ReadQR', async(req,res)=>{
    res.render('notes/readQr');
});

router.get('/notes/ReadQR2', async(req,res)=>{
    res.render('notes/ReadQr2');
});

router.get('/notes/edit/:id',isLoggedIn, async (req, res) => {
    const dato = req.params.id;
    const datosBD1 = await Nota.find({ "_id": dato })
    const datosBD = datosBD1[0];
    res.render('notes/editNote', { datosBD });
});

router.put('/notes/editNote/:id',isLoggedIn, async (req, res) => {
    const { titulo, descripcion } = req.body;
    try {
        await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion })
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

router.delete('/notes/editNote/:id',isLoggedIn, async (req, res) => {
    try {
        const del = await Nota.findByIdAndDelete(req.params.id);
        req.flash('success', 'Se elimino el registro ' + del.titulo + " de forma exitosa");
    } catch (error) {
        req.flash('error_ms', error.message);
    }
    res.redirect('/notes')
});

module.exports = router;