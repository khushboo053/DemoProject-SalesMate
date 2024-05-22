const express = require('express')
const {auth} = require('../middlewares/auth')
const categoryController = require('../controllers/category');
const router = express.Router()

router.get("/createCategory", auth, categoryController.getCreateCategory);
router.post("/createCategory", auth, categoryController.postCreateCategory);
router.get("/categories", auth, categoryController.getCategories);
router.get("/getCategory/:id", auth, categoryController.getCatgeoryById)
router.get('/editCategory/:id', categoryController.getUpdateCategory);
router.post("/editCategory/:id", auth, categoryController.postUpdateCategory)
router.get("/deleteCategory/:id", auth, categoryController.deleteCategory)

module.exports = router;