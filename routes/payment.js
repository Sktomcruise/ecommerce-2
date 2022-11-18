const express = require('express');
const router = express.Router();

const { accessLevelVerifier } = require('../middlewares/verifyToken');
const { PaymentController } = require('../controllers');

router.get('/payment',(req,res)=>{
    res.render("shop/final-payment")

})

router.post('/payment',accessLevelVerifier,PaymentController. create_payment);

module.exports = router;