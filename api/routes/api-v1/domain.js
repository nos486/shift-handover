const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const domainController = require("../../controllers/domain");


const router = express.Router();
router.post("/", addDomainSchema, addDomain)
router.get("/all", getDomains)
router.get("/", viewDomainSchema, getDomain)
router.delete("/", viewDomainSchema, deleteDomain)
router.put("/", updateDomainSchema, updateDomain)


function addDomainSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        manager: Joi.objectId().allow(null),
    });

    validateRequest(req, next, schema);
}

function addDomain(req, res, next) {
    const {name, manager} = req.body;
    domainController.addDomain({name, manager}).then((domain) => {
        res.json(domain)
    }).catch(next);
}

function getDomains(req, res, next) {
    domainController.getDomains().then((domains) => {
        res.json(domains)
    })
}

function viewDomainSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        name: Joi.string().optional(),
        manager: Joi.objectId().optional(),
    }).or('_id', 'name', 'manager').required();
    validateQuery(req, next, schema);
}

function getDomain(req, res, next) {
    domainController.getDomain(req.query).then((domain) => {
        res.json(domain)
    })
}

function deleteDomain(req, res, next) {
    domainController.deleteDomain(req.query).then((domain) => {
        res.json(domain)
    })
}

function updateDomainSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().optional(),
        manager: Joi.objectId().optional(),
    });
    validateRequest(req, next, schema);
}

function updateDomain(req, res, next) {
    domainController.updateDomain(req.body).then((domain) => {
        res.json(domain)
    })
}


module.exports = router