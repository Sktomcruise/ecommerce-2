const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    // amount: {
    //     type: Number,
    //     required: true
    // },
    totalQty: {
        type: Number,
        default: 1,
        required: true,
      }, totalCost: {
        type: Number,
        default: 1,
        required: true,
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