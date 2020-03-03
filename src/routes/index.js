const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');
router.get('/', isNotLoggedIn,(req, res) => {
    res.render('index');
});

router.get('/About', isNotLoggedIn,(req, res) => {
    res.render('about')
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    req.flash('success','Tu Usuario fue deslogeado');
    res.redirect('/');
});
module.exports = router;