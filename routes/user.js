const express = require("express");
const userController = require("../controllers/user");
const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/users", userController.getAllUsers);
router.get("/getUser/:id", auth, userController.getUserById);
router.get("/editUser/:id", auth, userController.getUpdateUser);
router.post("/editUser/:id", auth, userController.postUpdateUser);
router.get("/deleteUser/:id", auth, userController.deleteUser);
router.get("/", userController.getHome);
router.get("/dashboard", auth, userController.dashboard);
router.get("/admin/dashboard", auth, userController.adminDashboard);
router.get("/supplier/dashboard", auth, userController.supplierDashboard);

module.exports = router;
