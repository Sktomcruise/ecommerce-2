require('dotenv').config()
const express = require('express');
const router = express.Router();
const stripe=require("stripe")(process.env.STRIPE_KEY);

// const { accessLevelVerifier } = require('../middlewares/verifyToken');
// const { PaymentController } = require('../controllers');

const storeditems=new Map([
    [1,{priceInCents:1000,name:"learn react"}
],
[2,{priceInCents:2000,name:"learn css "}
],
])
router.get('/payment',(req,res)=>{
    res.render("shop/final-payment")

})

router.post('/payment',async (req,res)=>{
    try{
        const session=await stripe.checkout.session.create({
payment_method_types:["card"],
line_items: req.body.newOrder.map(item=>{
const storeditem=storeditems.get(item.id)
return{
    product_data:{
        name:storeditem.name,
        unit_amount:storeditem.priceInCents
    },
    
    quantity:item.quantity,
}
}),
mode:'payment',
success_url:res.render("shop/success"),
cancel_url:res.render("shop/paymenterr"),
        })
        res.json({url:session.url})



    }catch(e){
        res.status(500).json({error:e.messsage})
    }
    

});

module.exports = router;