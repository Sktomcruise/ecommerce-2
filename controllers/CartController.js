const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User')
const CartController = {

    /* get all carts (only admin) */
    async get_carts(req, res) {
        try {
            
            const carts = await Cart.find();
            for(let i in carts){
                carts[i].userId;
                 // console.log( carts[i].products);         
            }
             console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",carts);
          return res.status(200).render("admin/admincart",{ carts: carts });
         


            // json({
            // type: "success",
            // carts
      //  })
        
              // res.status(200).render("shop/admin-cart",{cart:carts})
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
            const cart = await Cart.findOne({ userId: req.session.user });
           // console.log(cart);
            res.status(200).render("shop/shopping-cart", { cart: cart });
            // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<",cart);

        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

  

    async create_cart (req, res) {
        
      const { quantity, price, title } = req.body;
    
      try {
          const productId = req.params.id;
          const userId = req.session.user;
          let cart = await Cart.findOne({ userId:userId });
        
          if (cart) {
              const product = await Product.findById(productId);
          
            let itemIndex = cart.products.findIndex(p => p.productId == productId);
    
            if (itemIndex > -1) {
              //product exists in the cart, update the quantity
              let productItem = cart.products[itemIndex];
              productItem.quantity =  1;
              cart.products[itemIndex].qty++;
            //   cart.products[itemIndex].price = cart.items[itemIndex].qty * product.price;
              cart.products[itemIndex] = productItem;
            } else {
             
              //product does not exists in cart, add new item
              cart.products.push({ productId: productId,
                quantity: req.body.quantity,
                price: product.price,
                  title: product.title ,
                  image:product.image,
                 // totalPrice: totalPrice +=product.price 
              },
              
              );
              cart.totalCost += product.price;
              
            }
            cart = await cart.save();
            req.session.cart=cart;
            // console.log("<<<<<<<<<<<<<",cart.products.image);
          //   return res.status(201).send(cart);
          } else {
          const product = await Product.findById(productId);
          var totalPrice = 0 ;
        //    for (var i in cart) {
        //       totalPrice +=product.price ;
        //   }
          //no cart for user, create new cart
          const newCart = await Cart.create({
    //         cellAmount.textContent = amount;
    // cellPrice.textContent = amount * product.price;
            userId : req.session.user,
            
            products: [
              { 
                  productId: productId,
                  quantity: req.body.quantity,
                  price: product.price,
                  title: product.title,
                  image:product.image,
                  
              }
          ],
          totalCost: totalPrice +=product.price ,
         
          });
        //   req.seession.cart=cart;
          req.session.save();
           //render("order",{cart: product});            
        }
        return res.status(201).redirect(req.headers.referer) 
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
            await Cart.findOneAndRemove(req.params.productId);
            // CartController.prototype.deleteCartItem = (req, res, next) => {
            //     Cart.update({userid : req.params.userId}, { $pull: { products : {productid: req.params.productId }}}, {multi: true})
            //     };
            res.redirect(req.get('referer'));
            // json({
            //     type: "success",
            //     message: "Product has been deleted successfully"
            // });
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