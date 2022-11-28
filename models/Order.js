const { cookie } = require('express-validator');
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true
       
      },
      username:{
        type:String,
        required:true

      },
     
    // products: [
    //     {
            productId: {
                type: String
            },
            quantity: {
                type: Number,
               
            },
            price:{
                type:Number,
            },
    //     }
    // ],
   
    // amount: {
    //     type: Number,
    //     required: true
    // },
    // totalQty: {
    //     type: Number,
    //     default: 1,
    //     required: true,
    //   }, totalCost: {
    //     type: Number,
    //     default: 1,
    //     required: true,
    //   },
    address:{
        type:String

    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    status: {
        type: String,
        default: "pending"
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);