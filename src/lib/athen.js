module.exports={
    isLoggedIn(req,res,next){
        console.log("hola: "+req.body);
        if(req.isAuthenticated()){
            //    isAuthenticated
            return next();
        }else{
            return res.redirect('/users/singin');
        }
    },
    
    isNotLoggedIn(req,res,next){
        console.log("hola2: "+req.body);
        
        if(!req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/profile');
        }
    }
}