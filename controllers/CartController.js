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
          const cart = await Cart.findOne({ userId: req.session.user});
          if (!cart) {
              res.status(404).json({
                  type: "error",
                  message: "User doesn't exists"
              })
          } else {
              res.status(200).render("shop/shopping-cart",{cart: cart})
          }
      } catch (err) {
          res.status(500).json({
              type: "error",
              message: "Something went wrong please try again",
              err
          })
      }
  },

              //.json(cart
                  // {
                  //     // cart: cart,
                  //     // pageName: "Shopping Cart",
                  //     products: await productsFromCart(cart),
                  //   }
          //     )
          // }
            //  let cart_user;
    // if (req.user) {
    //     cart_user = await Cart.findOne({ user:  req.session.user });
    //   }
    //   if (req.user && cart_user) {
    //     req.session.cart = cart_user;
    //     return res.render("shop/shopping-cart", {
    //       cart: cart_user,
    //       pageName: "Shopping Cart",
    //       products: await productsFromCart(cart_user),
    //     });
      
          
            // if (!req.session.cart) {
            //     return res.render("shop/shopping-cart", {
            //       cart: null,
            //       pageName: "Shopping Cart",
            //       products: null,
            //     });
            //   }
            //   // otherwise, load the session's cart
            //   return res.render("shop/shopping-cart", {
            //     cart: req.session.user,
            //     pageName: "Shopping Cart",
            //     products: await productsFromCart(req.session.user),
            //   });
    
  //    catch (err) {
  //           res.status(500).json({
  //               type: "error",
  //               message: "Something went wrong please try again",
  //               err
  //           })
  //       }
    
  // },

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
        
      const { quantity, price, title } = req.body;
    
      try {
          const productId = req.params.id;
          const userId = req.session.user;
          let cart = await Cart.findOne({ userId:userId });
        
          if (cart) {
              const product = await Product.findById(productId);
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => p.productId == productId);
          //   console.log(cart.products)
          //   console.log(productId)
          //   console.log(quantity)
            if (itemIndex > -1) {
              //product exists in the cart, update the quantity
              let productItem = cart.products[itemIndex];
              productItem.quantity =  1;
              cart.products[itemIndex] = productItem;
            } else {
              //product does not exists in cart, add new item
              cart.products.push({ productId: productId,
                  quantity: 1,
                  price: product.price,
                  title: product.title 
              });
            }
            cart = await cart.save();
          //   return res.status(201).send(cart);
          } else {
          const product = await Product.findById(productId);
          //no cart for user, create new cart
          const newCart = await Cart.create({
            userId : req.session.user,
            products: [
              { 
                  productId: productId,
                  quantity: 1,
                  price: product.price,
                  title: product.title
              }
          ]
          });
          
           //render("order",{cart: product});            
        }
        return res.status(201).redirect("/") 
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