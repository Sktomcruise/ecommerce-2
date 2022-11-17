const express = require('express');
const router = express.Router();

const { accessLevelVerifier } = require('../middlewares/verifyToken');
const { PaymentController } = require('../controllers');

router.get('/payment',(req,res)=>{
    res.render("shop/checkout")

})



module.exports = router;