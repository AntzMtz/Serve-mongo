const passtport = require('passport');
const localSt = require('passport-local').Strategy;
const usuar = require('../models/user');
passtport.use(new localSt({
    usernameField:'usuario'
}, async (usuario,password,done)=>{
     const Usuar01 = await usuar.findOne({idUser:usuario});
    if(!Usuar01){
        return done(null,false,{message:'Usuario o contraseña invalidos'});

    }else{
        const match =await Usuar01.desCript(password);
        if(match){
            return done(null,Usuar01)
        }else{
            return done(null,false,{message:'Contraseña invalida'});
        }
    }
}));

passtport.serializeUser((user,done)=>{
    done(null,user.idUser);

});

passtport.deserializeUser((idUser,done)=>{
    usuar.findById(idUser,(err,user)=>{
        return done(err,user);
    })
})