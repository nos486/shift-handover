const express = require("express");
const Joi = require("joi");

const router = express.Router();

router.get('/',register);

function register(req, res, next) {
    res.json({"test":process.env.SECRET})
}

module.exports = router;
