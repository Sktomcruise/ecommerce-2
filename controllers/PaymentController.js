// require("dotenv").config();

const stripe = require("stripe")('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');

const PaymentController = {

    async create_payment(req, res) {
        stripe.charges.create({
            source: req.cookies.user_Id,
            // amount: req..amount,
            currentcy: "rupees"
        }, (stripeErr, stripeRes)=>{
            if(stripeErr){
                res.status(500).json(stripeErr)
            } else {
                res.status(200).json(stripeRes)
            }
        });
    }
};

module.exports = PaymentController;