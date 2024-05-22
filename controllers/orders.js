const {sequelize} = require('../models');
const Order = require('../models').Order;
const Product = require('../models').Product;
const Category = require('../models').Category;
const Cart = require('../models').Cart;

exports.getSeeProducts = async (req, res) => {
  try {
    // const products = await Product.findAll({});
    const product = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    // console.log('PRODUCT___________________',products[0].dataValues);
    // res.status(200).send(products);

    res.render("orders/seeProducts", {
      user: req.user,
      products: product,
      path: "/getSeeProducts",
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const cart = await Cart.findOne({where: {productId: id, userId: req.user.id}})
    
    res.render('orders/getCart', {
        path: '/getCart',
        product: product,
        cart: cart,
        user: req.user
    })
    // res.status(200).send(product);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.postCart = async (req, res) => {
    try {
        
    } catch (e) {
        res.status(500).send(e);
        console.log(e);        
    }
}

exports.raiseQuantity = async (req, res) => {
  try {
    const productId = req.params.productId;
    const newQty = parseInt(req.body.qty, 10);
    const userId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('Product not found')
    }

    let cart = await Cart.findOne({ where: {productId, userId}});
    if (!cart) {
      if (newQty > product.stock) {
        return res.status(404).send('Requested Quantity exceeds available stock');
      }
      cart = await Cart.create({
        userId,
        productId,
        qty: newQty,
        totalAmount: product.sellPrice * newQty
      })
    }
    else {
      const updatedQty = cart.qty + newQty;
      if (updatedQty > product.stock) {
        return res.status(404).send('Requested Quantity exceeds available stock')
      }
      const updatedTotalAmount = product.sellPrice * updatedQty;
      await cart.update({
        qty: updatedQty,
        totalAmount: updatedTotalAmount,
      });
    }

    res.redirect('/cartList')

  } catch (e) {
    res.status(500).send(e);
    console.log(e); 
  }
}

exports.getCartList = async (req, res) => {
  try {
    const userId = req.user.id;
    const carts = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product'
      }]
    })

    res.render('orders/cartList', {
      path: '/cartList',
      user: req.user,
      carts: carts
    })

  } catch (e) {
    res.status(500).send(e);
    console.log(e); 
  }
}