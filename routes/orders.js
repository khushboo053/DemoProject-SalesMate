const express = require('express');
const {auth} = require('../middlewares/auth');
const ordersController = require('../controllers/orders');
const router = express.Router();

router.get('/getSeeProducts', auth, ordersController.getSeeProducts);
router.get('/getCart/:id', auth, ordersController.getCart);
router.post('/raiseQuantity/:productId', auth, ordersController.raiseQuantity);
router.get('/cartList', auth, ordersController.getCartList);

module.exports = router;