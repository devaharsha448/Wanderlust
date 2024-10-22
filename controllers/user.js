const User = require("../models/user.js");

module.exports.showignUp= (req,res)=>{
    res.render("signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registereduser = await User.register(newUser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To Wanderlust");
            res.redirect("/listings");
    });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.showLogin = (req,res)=>{
    res.render("login.ejs");
} ;

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to wonderlust");
    res.redirect("/listings");
} ;

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};