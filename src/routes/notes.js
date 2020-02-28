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
    
    const datosBD= await Nota.find().sort({"dia":-1})
    // console.log(datosBD)

    res.render('notes/findNote',{ 
        datosBD
        
    })
});

router.get('/notes/edit/:id', async (req,res)=>{
    const dato=req.params.id;
    const datosBD1 = await Nota.find({"_id":dato})
    // const datosBD = await Nota.findById(req.params.id);
    console.log(datosBD1[0]);
    const datosBD=datosBD1[0];
    res.render('notes/editNote',{datosBD});
});
router.put('/notes/editNote/:id',async (req,res)=>{
    const {titulo,descripcion}=req.body;
    await Nota.findByIdAndUpdate(req.params.id,{titulo,descripcion})
    res.redirect('/notes')

});

router.delete('/notes/editNote/:id', async(req,res)=>{
    console.log(req.params.id);
    await Nota.findByIdAndDelete(req.params.id)
    res.redirect('/notes')
});



module.exports = router;