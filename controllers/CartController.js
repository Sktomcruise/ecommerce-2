const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const CartController = {

    // / get all carts (only admin) /
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

    // / get user cart /
    async get_cart(req, res) {
        try {
            const cart = await Cart.findOne({ userId: req.params.userId});
            if (!cart) {
                res.status(404).json({
                    type: "error",
                    message: "User doesn't exists"
                })
            } else {
                res.status(200).json({
                    type: "success",
                    cart
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

    // / add product to cart /
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
        // const user = await User.findById(req.session.userId)
      
        try {
          let cart = await Cart.findOne({ userId: req.user._id });
          
      
          if (cart) {
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => p.productId == productId);
      
            if (itemIndex > -1) {
              //product exists in the cart, update the quantity
              let productItem = cart.products[itemIndex];
              productItem.quantity = quantity;
              cart.products[itemIndex] = productItem;
            } else {
              //product does not exists in cart, add new item
              cart.products.push({ productId, quantity });
            }
            cart = await cart.save();
            // return res.status(201).send(cart);
            return res.render("shop/order-cart")

          } else {
            //no cart for user, create new cart
            let product = await Product.findById(req.params.id);
            let cart = await Cart.create({
              userId : req.cookies.userid,
              products: [
                { 
                    productId: productId,
                    quantity: req.body.qty,
                    price:product.price,
                  
                }
               
            ]
            });
            // newCart = await cart.save();
            return res.status(201).render("shop/order-cart",{cart:product});
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

    // / update product /
    // GET: reduce one from an item in the shopping cart
async update_cart (req, res, next) {
  // if a user is logged in, reduce from the user's cart and save
  // else reduce from the session's cart
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }

    // find the item with productId
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      // find the product to find its price
      const product = await Product.findById(productId);
      // if product is found, reduce its qty
      cart.items[itemIndex].qty--;
      cart.items[itemIndex].price -= product.price;
      cart.totalQty--;
      cart.totalCost -= product.price;
      // if the item's qty reaches 0, remove it from the cart
      if (cart.items[itemIndex].qty <= 0) {
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
      req.session.cart = cart;
      //save the cart it only if user is logged in
      if (req.user) {
        await cart.save();
      }
      //delete cart if qty is 0
      if (cart.totalQty <= 0) {
        req.session.cart = null;
        await Cart.findByIdAndRemove(cart._id);
      }
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
},

// GET: remove all instances of a single product from the cart
 async delete_cart (req, res, next) {
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }
    //fnd the item with productId
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      //find the product to find its price
      cart.totalQty -= cart.items[itemIndex].qty;
      cart.totalCost -= cart.items[itemIndex].price;
      await cart.items.remove({ _id: cart.items[itemIndex]._id });
    }
    req.session.cart = cart;
    //save the cart it only if user is logged in
    if (req.user) {
      await cart.save();
    }
    //delete cart if qty is 0
    if (cart.totalQty <= 0) {
      req.session.cart = null;
      await Cart.findByIdAndRemove(cart._id);
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
},
}

module.exports = CartController;