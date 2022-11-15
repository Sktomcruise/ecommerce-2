const express = require('express');
const session = require("express-session")
const router = express.Router();

const { AuthController } = require('../controllers');

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/login",(req,res)=>{
    req.login_user=session().save;
    res.render("signin");
   
});

router.get("/register",(req,res)=>{
    res.render("signup")
});

router.get("/logout",(req,res)=>{
    res.render("index")
})

router.post('/register', AuthController.create_user);
router.post('/login', AuthController.login_user);
router.post('/logout', AuthController.logout_user);

module.exports = router;