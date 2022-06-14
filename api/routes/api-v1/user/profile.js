const express = require("express");
const authorize = require("../../../middleware/authorize");
const validateRequest = require("../../../middleware/validate-request");
const userController = require("../../../controllers/user");
const tokenController = require("../../../controllers/token");

const router = express.Router();

router.get('/', authorize() ,getSelf);
router.get('/:username', authorize() ,getById);

module.exports =  router;

function getSelf(req, res, next) {
    userController.findUserById(req.user.id).then((user) =>{
        res.json(user)
    }).catch(next);
}

function getById(req, res, next) {
    userController.findUserById(req.params.username).then((user) =>{
        res.json(user)
    }).catch(next);
}