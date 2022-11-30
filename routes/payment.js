require('dotenv').config()
const express = require('express');
const router = express.Router();
const stripe=require("stripe")(process.env.STRIPE_KEY);

// const { accessLevelVerifier } = require('../middlewares/verifyToken');
const { PaymentController } = require('../controllers');


router.get('/payment',(req,res)=>{
    res.render("shop/checkout");

});

router.post('/payment',PaymentController.create_payment);

module.exports = router;