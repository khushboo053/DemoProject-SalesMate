const express = require("express");
const {auth} = require("../middlewares/auth");
const salesController = require("../controllers/sales");
const router = express.Router();

router.get('/createSales', auth, salesController.getCreateSales);
router.post("/createSales", auth, salesController.postCreateSales);

router.get("/sales", auth, salesController.getSales);
router.get("/getSales/:id", auth, salesController.getSalesById);

router.get("/editSales/:id", auth, salesController.getUpdateSales);
router.post("/editSales/:id", auth, salesController.postUpdateSales);
router.get("/deleteSales/:id", auth, salesController.deleteSales);

router.post("/getDailyReport", auth, salesController.generateDailySalesReport);
router.get("/getReport", auth, salesController.getReport);

router.get("/getSalesVisualize", auth, salesController.getSalesVisualize);
router.post("/postSalesVisualize", auth, salesController.postSalesVisualize);

module.exports = router;