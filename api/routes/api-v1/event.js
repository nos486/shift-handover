const express =require( "express");
const Joi = require("joi");
const validateRequest = require("../../middleware/validate-request");
const userController = require("../../controllers/user");


const router = express.Router();
router.post("/",addEventSchema,addEvent)


function addEventSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function addEvent(req, res, next) {
    const {username, password} = req.body;
    const ipAddress = req.ip;
    userController.authenticate({username, password, ipAddress}).then(
        (user) => {
            res.json(user);
        }).catch(next);
}


module.exports = router