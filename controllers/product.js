const { sequelize } = require("../models");
const Sales = require("../models").sales;

const Product = require("../models").Product;
const Category = require("../models").Category;
require("dotenv").config();

exports.getCreateProduct = async (req, res) => {
  try {
    res.render('products/createProduct', {
      path: '/createProduct'
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
}

exports.postCreateProduct = async (req, res) => {
  try {
    const { name, description, stock, buyPrice, sellPrice, categoryId, image } = req.body;
    const total = sellPrice * stock;
    await Product.create({
      name,
      description,
      stock,
      buyPrice,
      sellPrice,
      categoryId,
      total,
      image,
    });

    // res.status(200).send(product);
    res.redirect('/products')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getProducts = async (req, res) => {
  try {
    // const products = await Product.findAll({});
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    // console.log('PRODUCT___________________',products[0].dataValues);
    // res.status(200).send(products);
    res.render('products/product', {
      user: req.user,
      products: products,
      path: '/products'
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }


};

exports.getUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    res.render("products/editProduct", {
      path: "/editProduct",
      product,
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.postUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      stock,
      buyPrice,
      sellPrice,
      categoryId,
      image,
    } = req.body;

    const [productCount] = await Product.update(
      {
        name,
        description,
        stock,
        buyPrice,
        sellPrice,
        categoryId,
        image,
      },
      { where: { id } }
    );

    if (productCount === 0) {
      return res.status(404).send("Product not found");
    }
    // res.status(200).send("Product Updated successfully");
    res.redirect('/products')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.destroy({
      where: { id },
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }
    // res.status(200).send("Product Deleted Successfully");
    res.redirect('/products')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getHighestSellProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Sales,
          as: "sales",
          attributes: [
            [sequelize.fn("SUM", sequelize.col("sales.qty", "totalQtySold"))],
            [sequelize.fn("SUM", sequelize.col("sales.price", "totalRevenue"))],
          ],
        },
        {
          model: sequelize.models.Category,
          as: "category",
          attributes: ["name"],
        },
      ],
      group: ["Product.id", "category.id"],
      attributes: [
        "id",
        "name",
        "description",
        "image",
        "stock",
        "sellPrice",
        "Category.name",
      ],
    });

    res.render('users/dashboard', {
      products,
      path: '/dashboard'
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
}

