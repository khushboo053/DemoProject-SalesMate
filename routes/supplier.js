const express = require("express");
const {auth} = require("../middlewares/auth");
const supplierController = require("../controllers/supplier");
const router = express.Router();

router.post("/createSupplier", auth, supplierController.postCreateSupplier);
router.get("/suppliers", supplierController.getSuppliers);
router.get("/getSupplier/:id", auth, supplierController.getSupplierById);
router.post("/updateSupplier/:id", auth, supplierController.postUpdateSupplier);
router.post("/deleteSupplier/:id", auth, supplierController.postDeleteSupplier);

module.exports = router;
