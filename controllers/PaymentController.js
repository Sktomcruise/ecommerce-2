// require("dotenv").config();
const stripe = require('stripe')('sk_test_51M57U7SEHz7Df90b1mXlebZhHP1B79SY2gSjbxOY6pOsDSRZpDeQlTdwYbfFOkeupom5hjEmXaEhe1EQ2baMw7li00Cyv6JlsI');
const express = require('express');
const Cart = require('../models/Cart');

const app = express();
app.use(express.static('public'));



const PaymentController = {

     async  create_payment  (req, res)  {
      
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1M57g0SEHz7Df90bzoQw1O75',
            adjustable_quantity: {enabled: true, minimum: 1, maximum: 10},
            quantity: 1,
          },
         
        ],
        mode: 'payment',
        success_url: `http://localhost:4000/success.html`,
        cancel_url: `http://localhost:4000/cancel.html`,
      });
    
      res.redirect(303, session.url);
    }};

    // line_items: [
    //   {
    //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    //     price_data:{
    //       unit_amount:amountToCharge,
    //       currency:'INR',
    //       product:'prod_MolCAB4xhlZpEJ'
    //     } ,
    //     adjustable_quantity: {enabled: true, minimum: 1, maximum: 10},
    //     quantity: 1,
    //   },
     
    // ],

module.exports = PaymentController;


