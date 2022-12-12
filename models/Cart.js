const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
        userId: {
            type: String,
            // required: true,
        },
        
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default:1,
                    
                },
                price:{
                    type:Number,
                    
                },
                title:{
                    type:String
                },
                image: {
            type: String,
            required: true
        },
              
            }
        ],
        totalCost: {
            type: Number,
            required: true,
          },
       
    },
    
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);