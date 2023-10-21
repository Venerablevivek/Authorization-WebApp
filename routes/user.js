
const express = require("express");
const router = express.Router();

const {signup, login} = require("../Controllers/Auth");
const {auth, isStudent, isAdmin} = require("../Middlewares/auth");

router.post("/signup",signup);
router.post("/login",login);

router.get("/student", auth, isStudent, (req,res) =>{
    res.json({
        success: true,
        message: "Welcome to the protected Route for students",
    });
})

router.get("/admin", auth, isAdmin, (req,res) =>{
    res.json({
        success: true,
        message: "Welcome to the protected Route for Admin",
    })
})


module.exports = router;