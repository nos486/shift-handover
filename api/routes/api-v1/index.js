const express =require( "express");
const user =require( "./user");
const event =require( "./event");
const domain =require( "./domain");


const router = express.Router();
router.use("/user",user)
router.use("/event",event)
router.use("/domain",domain)


module.exports = router