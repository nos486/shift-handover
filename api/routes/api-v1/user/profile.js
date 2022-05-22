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
    // regular users can get their own record and admins can get any record
    // if (req.params.username !== req.user.username) {
    //     return res.status(403).json({ message: 'Forbidden' });
    // }
    userController.findUserById(req.params.username).then((user) =>{
        res.json(user)
    }).catch(next);
}