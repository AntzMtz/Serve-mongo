const passtport = require('passport');
const localSt = require('passport-local').Strategy;
const maestro = require('../models/maestros');
const help = require('../lib/helpers');
var Usuar01;
passtport.use('local.signin', new localSt({
    usernameField: 'usuario',
    passReqToCallback: true
}, async (req, usuario, password, done) => {
    Usuar01 = await maestro.findOne({ IDMaestro: usuario });
    if (!Usuar01) {
        return done(null, false, { message: 'Usuario no existe' })
    } else {
        const vali = await help.matchPassword(password, Usuar01.PassMaes);
        if (!vali) {
            return done(null, false, { message: 'contraseña no es valida' })
        } else {
            //return done(null, Usuar01, req.flash('success', 'Usuario valido'))
            return done(null, Usuar01)
        }
    }
}));

passtport.serializeUser((Usuar01, done) => {
    done(null, Usuar01.id);

});

passtport.deserializeUser(async (req, id, done) => {
    Usuar01 = await maestro.findOne({ _id: id });
    if (!Usuar01) {
        return done(null, false);
    } else {
        return done(null, Usuar01);
    }


})