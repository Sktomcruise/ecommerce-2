const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User')
const CartController = {

    /* get all carts (only admin) */
    async get_carts(req, res) {
        try {
            const carts = await Cart.find();
            res.status(200).json({
                type: "success",
                carts
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get user cart */
    async get_cart(req, res) {
        try {
            const cart = await Cart.find({ userId: req.session.user});
            if (!cart) {
                res.status(404).json({
                    type: "error",
                    message: "User doesn't exists"
                })
            } else {
                res.status(200).render("cart",{cart: cart})
            }
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* add product to cart */
    // async create_cart(req, res) {
    //     const newCart = new Cart(req.body);
    //     try {
    //         const savedCart = await newCart.save();
    //         res.status(201).json({
    //             type: "success",
    //             message: "Product added successfully",
    //             savedCart
    //         })
    //     } catch (err) {
    //         res.status(500).json({
    //             type: "error",
    //             message: "Something went wrong please try again",
    //             err
    //         })
    //     }
    // },

    async create_cart (req, res) {
        const productId = req.params.id;
        let user = await User.findOne({ userId: req.user._id });

        // const user = await User.findById(req.session.userId)
      
        try {
          let cart = await Cart.findOne({ userId: req.user._id });
      
          if (cart) {
            //cart exists for user
            let itemIndex = cart.products.findById(p => p.productId == productId);
      
            if (itemIndex > -1) {
              //product exists in the cart, update the quantity
              let productItem = cart.products[itemIndex];
              productItem.quantity = quantity;
              cart.products[itemIndex] = productItem;
            } else {
              //product does not exists in cart, add new item
              cart.products.push({ productId, quantity,price,title });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
          } else {
            const product = await Product.findById(productId);
            //no cart for user, create new cart
            const newCart = await Cart.create({
              userId : req.session.user,
              products: [
                { 
                    productId: productId,
                    quantity: req.body.qty,
                    price: product.price,
                    title: product.title
                }
            ]
            });
            return res.status(201).redirect("/products")                   //render("order",{cart: product});            
          }
        } catch (err) {
          console.log(err);
          res.status(500).send("Something went wrong");
        }
      },

    // async create_cart  (req, res) {
    //     const productId = req.params.id;
    //     const cart = new Cart(req.session.cart ? req.session.cart : {});
    
    //     Product.findById(productId, function (err, product) {
    //         if(err) {
    //             return res.redirect('/');
    //         }
    //         cart.add(product, product.id);
    //         req.session.cart = cart;
    //         console.log(req.session.cart);
    //         res.redirect('/');
    //     })
    // },

    /* update product */
    async update_cart(req, res) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            res.status(200).json({
                type: "success",
                message: "Cart updated successfully",
                updatedCart
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* delete cart */
    async delete_cart(req, res) {
        try {
            await Cart.findOneAndDelete(req.params.id);
            res.status(200).json({
                type: "success",
                message: "Product has been deleted successfully"
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

module.exports = CartController;