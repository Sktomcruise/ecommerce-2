const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { json } = require('body-parser');


const OrderController = {

    /* get all orders (only admin) */
    async get_orders(req, res) {
        try {
            const orders = await Order.find();
            res.status(200).json({
                type: "success",
                orders
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get monthly income (only admin)*/
    async get_income(req, res) {
        const date = new Date();
        const lastMonth =  new Date(date.setMonth(date.getMonth()-1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

        try {
            const income = await Order.aggregate([
                { $match: { 
                    createdAt: { 
                            $gte: previousMonth
                        },
                    },
                },
                { 
                    $project:{ 
                        month: { $month: "$createdAt" },
                        sales: "$amount",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" }
                    }
                },  
            ]);
            res.status(200).json({
                type: "success",
                income
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get user's orders */
    async get_order(req, res) {
        try {
            const orders = await Order.findOne({ userId: req.params.userId });
            if (!orders) {
                res.status(404).json({
                    type: "error",
                    message: "User doesn't exists"
                })
            } else {
                res.status(200).json({
                    type: "success",
                    orders
                })
            }
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* add order */
    async create_order(req, res) {
        // const productId = req.body.cartid;
        // let productId = await Product.findById({productId:productId});
        const userId = req.session.user;
        let cart = req.session.cart;
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<",cart);
        

        const newOrder = new Order({
            // const user = await User.findById(req.body.id);
           
            username : req.body.username,
            address:req.body.address,
            userId:req.session.user,
            phoneno:req.body.phoneno,
          
            products: [
              { 
                    productId:req.session.cart,
                // title:req.session.cart,
                  price:req.body.price,
                 
                
              },
             
          ],
           
          });
        try {

            const savedOrder =  newOrder.save({savedOrder:newOrder});
            res.status(201).redirect("/pay/payment")
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
   
    },

    /* update order */
    async update_order(req, res) {
        try {
            const updatedOrder = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            res.status(200).json({
                type: "success",
                message: "order updated successfully",
                updatedOrder
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* delete order */
    async delete_order(req, res) {
        try {
            await Order.findOneAndDelete(req.params.id);
            res.status(200).json({
                type: "success",
                message: "Order has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }
};

module.exports = OrderController;