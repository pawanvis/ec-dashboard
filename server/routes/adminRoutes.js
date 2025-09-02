const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, dashboard } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");

// Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/dashboard", verifyToken, dashboard);

module.exports = router;
