const express = require('express');
const router = express.Router();

const { CartController } = require('../controllers');
const { authenticationVerifier, accessLevelVerifier, isAdminVerifier } = require('../middlewares/verifyToken');




router.get('/', isAdminVerifier, CartController.get_carts);
router.get('/:userid', accessLevelVerifier, CartController.get_cart);
router.get('/add-to-cart/:id',(req,res)=>{
    res.render("shop/product")

});
router.post('/add-to-cart/:id', authenticationVerifier, CartController.create_cart);
router.put('/reduce/:id', accessLevelVerifier, CartController.update_cart);
router.delete('/removeAll/:id', accessLevelVerifier, CartController.delete_cart);

module.exports = router;