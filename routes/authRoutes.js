const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/user", authController.user);

router.post("/withdraw", authController.withdraw);

router.post("/deposit", authController.deposit);

router.post("/purchase", authController.purchase);

router.post("/profile", authController.profile);

router.get("/logout", authController.logout);

module.exports = router;
