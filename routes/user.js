const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.route("/signup").get(userController.showignUp)
.post( wrapAsync(userController.signUp));

router.route("/login").get(userController.showLogin)
.post(passport.authenticate
    ("local",{failureRedirect: '/login',failureFlash : true}),
    wrapAsync(userController.login)
);

router.get("/logout",userController.logOut);

module.exports = router;