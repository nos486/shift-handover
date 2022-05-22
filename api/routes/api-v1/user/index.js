const express = require("express");
const register = require("./register");
const token = require("./token");
const profile = require("./profile");
const authorize = require("../../../middleware/authorize");
const Joi = require("joi");
const validateQuery = require("../../../middleware/validate-query");
const {ROLE} = require("../../../models/enums");
const validateRequest = require("../../../middleware/validate-request");
const userController = require("../../../controllers/user");
const bcrypt = require("bcrypt");


const router = express.Router();
router.use("/register", register)
router.use("/token", token)
router.use("/profile", profile)

router.get('/', authorize(), viewUsersSchema, getUsers);
router.post("/", authorize(ROLE.ADMIN),addUserSchema, addUser)
router.delete("/", authorize(ROLE.ADMIN),deleteUserSchema, deleteUsers)
router.put("/", authorize(ROLE.ADMIN),updateUserSchema, updateUser)

function viewUsersSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        username: Joi.string().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function getUsers(req, res, next) {
    userController.getUsersPagination(req.query).then((domains) => {
        res.json(domains)
    }).catch(next)
}

function addUserSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).optional(),
        // password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
        firstName: Joi.string().allow("").optional(),
        lastName: Joi.string().allow("").optional(),
        phoneNumber: Joi.string().allow("").optional(),
        domain: Joi.objectId().required(),
        gender: Joi.string().optional(),
        role: Joi.string().required(),
        about: Joi.string().allow("").optional(),
    });

    validateRequest(req, next, schema);
}

function addUser(req, res, next) {
    userController.createUser(req.body).then((domain) => {
        res.json(domain)
    }).catch(next);
}

function deleteUserSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()) ,
    });
    validateRequest(req, next, schema);
}

function deleteUsers(req, res, next) {
    userController.deleteUsers(req.body._ids).then((domain) => {
        res.json(domain)
    }).catch(next)
}

function updateUserSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).optional(),
        firstName: Joi.string().allow("").optional(),
        lastName: Joi.string().allow("").optional(),
        phoneNumber: Joi.string().allow("").optional(),
        domain: Joi.objectId().required(),
        gender: Joi.string().optional(),
        role: Joi.string().required(),
        about: Joi.string().allow("").optional(),
    });
    validateRequest(req, next, schema);
}

function updateUser(req, res, next) {
    userController.updateUser(req.body).then((domain) => {
        res.json(domain)
    }).catch(next)
}

module.exports = router