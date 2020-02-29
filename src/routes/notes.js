const express = require('express');
const router = express.Router();
const Nota = require('../models/Notes')
const { format } = require('timeago.js');

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
        try {
            await nuevaNota.save();    
            req.flash('success','Se inserto el registro ' + titulo + ' de forma correcta');
        } catch (error) {
            if(error.code=='11000'){
                req.flash('error_ms',"La tarea ya existe, No puede ser agregada");
            }else{
                req.flash('error_ms',"error: "+error.message);
            }
        }
        
        // console.log('nuevaNota');
        
        res.redirect('/notes');
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
    try {
        await Nota.findByIdAndUpdate(req.params.id,{titulo,descripcion})
        req.flash('success','Modificación correcta del registro: ' + titulo);    
    } catch (error) {
        if(error.code=='11000'){
            req.flash('error_ms',"La tarea ya existe, No puede ser modificada");
        }else{
            req.flash('error_ms',"error: "+error.message);
        }
        
    }
    
    res.redirect('/notes')

});

router.delete('/notes/editNote/:id', async(req,res)=>{
    console.log("Body: "+req.params.id);
    try {
        const del= await Nota.findByIdAndDelete(req.params.id);
        // console.log(del.titulo);
        req.flash('success','Se elimino el registro '+del.titulo+" de forma exitosa");
        
    } catch (error) {
        req.flash('error_ms',error.message );
    }
    
    res.redirect('/notes')
});



module.exports = router;