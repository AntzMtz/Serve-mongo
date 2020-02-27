const express = require('express');
const router = express.Router();
const Nota = require('../models/Notes')

router.get('/notes/add', (req, res) => {
    res.render('notes/newnote');
});

router.post('/notes/newnote', async(req, res) => {
    console.log(req.body)
    const { titulo, descripcion } = req.body;
    const errors = [];
    if (!titulo) {
        errors.push({ text: 'Porfavor escribe un titulo' });
    } 
    
    if (!descripcion) {
        errors.push({ text: 'Porfavor escribe una descripción' });
    }

    if (errors.length > 0) {
        console.log(errors);
        
        res.render('notes/newnote', {
            errors,
            titulo,
            descripcion
        })
    } else {
        const nuevaNota = new Nota({ titulo, descripcion });
        console.log(nuevaNota);
        await nuevaNota.save();
        // console.log('nuevaNota');

        res.redirect('/notes')
    }
});

router.get('/notes', async (req, res) => {
    
    const datosBD= await Nota.find()
    // console.log(datosBD)

    res.render('notes/findNote',{ 
        datosBD
        
    })
});

module.exports = router;