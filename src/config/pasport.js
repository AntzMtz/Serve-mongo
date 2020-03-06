const passtport = require('passport');
const localSt = require('passport-local').Strategy;
const usuar = require('../models/user');
const maestro = require('../models/maestros');
const help = require('../lib/helpers');
var Usuar01;
passtport.use('local.signin', new localSt({
    usernameField: 'usuario',
    // passwordField: 'password',
    passReqToCallback: true
}, async (req, usuario, password, done) => {
    // console.log(req.body);
    Usuar01 = await usuar.findOne({ idUser: usuario });

    // console.log("Use: "+Usuar01);
    // console.log(Usuar01);
    if (!Usuar01) {

        Usuar01 = await maestro.findOne({ IDMaestro: usuario });
        console.log("maes: " + Usuar01);
        if (!Usuar01) {
            return done(null, false, { message: 'Usuario no existe' })
        } else {
            // const vali = await help.matchPassword(password,Usuar01.Password);
            // if(!vali){
            //     return done(null,false,{message:'contraseña no es valida'})
            // }else{
            console.log(Usuar01.id);

            return done(null, Usuar01, req.flash('success', 'Usuario valido'))
            // }
        }

    } else {
        // console.log(password+":"+Usuar01.Password);

        const vali = await help.matchPassword(password, Usuar01.Password);

        // console.log(vali);
        if (!vali) {
            return done(null, false, { message: 'contraseña no es valida' })
        } else {
            return done(null, Usuar01, req.flash('success', 'Usuario valido'))
        }

    }
}));



passtport.serializeUser((Usuar01, done) => {
    console.log(Usuar01.id);

    // Usuar01.idUser =new ObjectId();
    done(null, Usuar01.id);

});

passtport.deserializeUser(async (req, id, done) => {
    // console.log("ID: "+id);

    // usuar.findById(idUser,(err,user)=>{
    //     return done(err,user);
    // })
    var Usuar01 = await usuar.findOne({ _id: id });
    // console.log(Usuar01);

    if (!Usuar01) {
        Usuar01 = await maestro.findOne({ _id: id });
        if (!Usuar01) {
            return done(null, false);
        } else {
            return done(null, Usuar01);
        }
    } else {
        return done(null, Usuar01);
    }


})