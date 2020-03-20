const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn}=require('../lib/aut');
var moment = require('moment');

router.get('/', isNotLoggedIn,(req, res) => {
    console.log(
        moment('2016-10-31').format('YYYY-MM-DD')

    );
    
    res.render('index');
});

router.get('/About', isNotLoggedIn,async (req, res) => {
    res.render('about')
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    req.flash('success','Tu Usuario fue deslogeado');
    res.redirect('/');
});
module.exports = router;