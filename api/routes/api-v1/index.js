const express =require( "express");
const user =require( "./user");
const event =require( "./event");
const domain =require( "./domain");
const service =require( "./service");
const shift =require( "./shift");


const router = express.Router();
router.use("/user",user)
router.use("/event",event)
router.use("/domain",domain)
router.use("/service",service)
router.use("/shift",shift)


module.exports = router