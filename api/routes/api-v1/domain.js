const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const domainController = require("../../controllers/domain");
const authorize = require("../../middleware/authorize");
const {ROLE} = require("../../models/enums");


const router = express.Router();
router.post("/", authorize(ROLE.ADMIN),addDomainSchema, addDomain)
router.get("/", authorize(),viewDomainSchema, getDomains)
router.get("/all", authorize(), getAllDomains)
router.delete("/", authorize(ROLE.ADMIN),deleteDomainSchema, deleteDomains)
router.put("/", authorize([ROLE.ADMIN]),updateDomainSchema, updateDomain)


function addDomainSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        manager: Joi.objectId().optional().allow(null),
    });

    validateRequest(req, next, schema);
}

function addDomain(req, res, next) {
    domainController.addDomain(req.body).then((domain) => {
        res.json(domain)
    }).catch(next);
}


function viewDomainSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        name: Joi.string().optional(),
        manager: Joi.objectId().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function getDomains(req, res, next) {
    domainController.getDomainsPagination(req.query).then((domains) => {
        res.json(domains)
    }).catch(next)
}

function getAllDomains(req, res, next) {
    domainController.getDomains(req.query).then((domains) => {
        res.json(domains)
    }).catch(next)
}

function deleteDomainSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()) ,
    });
    validateRequest(req, next, schema);
}

function deleteDomains(req, res, next) {
    domainController.deleteDomains(req.body._ids).then((domain) => {
        res.json(domain)
    }).catch(next)
}

function updateDomainSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().optional(),
        manager: Joi.objectId().optional().allow(null),
    });
    validateRequest(req, next, schema);
}

function updateDomain(req, res, next) {
    domainController.updateDomain(req.body).then((domain) => {
        res.json(domain)
    }).catch(next)
}


module.exports = router