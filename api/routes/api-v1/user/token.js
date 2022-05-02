const express = require("express");
const router = express.Router();
const enums = require("./../../../models/enums")
const Joi = require("joi");


const authorize = require("../../../middleware/authorize");
const validateRequest = require("../../../middleware/validate-request");
const userController = require("../../../controllers/user");
const tokenController = require("../../../controllers/token");


router.post('/', authenticateSchema, authenticate);
// router.post('/',authenticate);
router.post('/refresh', refreshTokenSchema, refreshToken);
router.post('/revoke', authorize(),revokeTokenSchema, revokeToken);

module.exports = router


function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const {username, password} = req.body;
    const ipAddress = req.ip;
    userController.authenticate({username, password, ipAddress}).then(
        (user) => {
            res.json(user);
        }).catch(next);
}

function refreshTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


function refreshToken(req, res, next) {
    const {token} = req.body;
    const ipAddress = req.ip;
    tokenController.refreshToken({token, ipAddress})
        .then(({...user}) => {
            res.json(user);
        })
        .catch(next);
}


function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const {token} = req.body

    if (!token) return res.status(400).json({message: 'Token is required'});

    // users can revoke their own tokens and admins can revoke any tokens

    tokenController.getRefreshTokenByUserId(req.user.id).then((query)=>{
        if (query!== null && query.token === token){
            tokenController.deleteRefreshToken(token)
                .then(() => res.json({message: 'Token revoked'}))
                .catch(next);
        }else {
            return res.status(403).json({message: 'Forbidden'});
        }
    })
}

