const express =require( "express");
const register =require( "./register");
const token =require( "./token");


const router = express.Router();
router.use("/register",register)
router.use("/token",token)


module.exports = router