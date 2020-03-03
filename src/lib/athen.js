module.exports={
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            //    isAuthenticated
            return next();
        }else{
            return res.redirect('/users/singin');
        }
    },
    
    isNotLoggedIn(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/profile');
        }
    }
}