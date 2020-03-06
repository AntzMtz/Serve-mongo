const {format}= require('timeago.js');

const help={};
help.time=(dia)=>{
    return format(dia);
};
help.comparaAd =  (usuario) => {
    if (usuario=="Administrador"){
        return true;
    }else{
        return false;
    }
    
};
help.comparaDoc =  (usuario,idUser) => {
    console.log("usu:"+usuario + " id "+ idUser);
    
    if (usuario=="Docente" || (usuario==null && idUser)){
        
        return true;

    }else{
        return false;
    }
    
};

module.exports=help;