const express = require("express");
const {auth} = require("../middlewares/auth");
const productController = require("../controllers/product");
const router = express.Router();

router.get("/createProduct", auth, productController.getCreateProduct);
router.post("/createProduct", auth, productController.postCreateProduct);
router.get("/products", auth, productController.getProducts);
router.get("/getProduct/:id", auth, productController.getProductById);
router.get("/editProduct/:id", auth, productController.getUpdateProduct)
router.post("/editProduct/:id", auth, productController.postUpdateProduct);
router.get("/deleteProduct/:id", auth, productController.deleteProduct);
router.get("/highestSell", auth, productController.getHighestSellProducts)

module.exports = router;
