const express =require( "express");
const user =require( "./user");
const event =require( "./event");
const domain =require( "./domain");
const service =require( "./service");


const router = express.Router();
router.use("/user",user)
router.use("/event",event)
router.use("/domain",domain)
router.use("/service",service)


module.exports = router