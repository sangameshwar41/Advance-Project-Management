const express = require("express");
const{registerValidation,
    loginValidation,
    checkValidation} =require("../validations/userValidation")

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

// Register route
router.post("/register",registerValidation,checkValidation,registerUser);

// Login route
router.post("/login",loginValidation,checkValidation, loginUser);

module.exports = router;