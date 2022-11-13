const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const authorize = require("../../middleware/authorize");
const crController = require("../../controllers/cr");


const router = express.Router();
router.post("/",authorize(),addSchema, add)
router.post("/batch",authorize(),addsSchema, adds)
router.get("/", authorize(),viewSchema, get)
router.delete("/",authorize(),removeSchema, remove)
router.put("/", authorize(),updateSchema, update)
router.get("/statusList", authorize(),getStatusList)



function addSchema(req, res, next) {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        startTime: Joi.date().required(),
        endTime: Joi.date().required(),
        outageStartTime: Joi.date().allow(null),
        outageEndTime: Joi.date().optional().allow(null),
        title: Joi.string().required(),
        domain: Joi.objectId().required(),
        status: Joi.string().allow(""),
    });

    validateRequest(req, next, schema);
}

function add(req, res, next) {
    req.body.reporter = req.user.id
    crController.addCR(req.body).then((event) => {
        res.json(event)
    }).catch(next);
}

function getStatusList(req, res, next) {
    res.json(crController.getStatusList())
}

function addsSchema(req, res, next) {
    const schema = Joi.array().items(
        Joi.object({
            orderId: Joi.string().required(),
            startTime: Joi.date().required(),
            endTime: Joi.date().required(),
            outageStartTime: Joi.date().allow(null),
            outageEndTime: Joi.date().optional().allow(null),
            title: Joi.string().required(),
            domain: Joi.objectId().required(),
            status: Joi.string().allow(""),
        }
    )
);

    validateRequest(req, next, schema);
}

function adds(req, res, next) {
    for (let cr of req.body){
    }

    crController.addCRs(req.body).then((event) => {
        res.json(event)
    }).catch(next);
}

function viewSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        date : Joi.date().optional(),
        orderId: Joi.string().optional(),
        startTime: Joi.date().optional(),
        endTime: Joi.date().optional(),
        outageStartTime: Joi.date().optional(),
        outageEndTime: Joi.date().optional(),
        title: Joi.string().optional(),
        domain: Joi.objectId().optional(),
        selfDomain : Joi.boolean().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function get(req, res, next) {
    if (req.query.selfDomain) req.query.domain = req.user.domain
    crController.getCrsPagination(req.query).then((event) => {
        res.json(event)
    }).catch(next);
}

function removeSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()) ,
    });
    validateRequest(req, next, schema);
}

function remove(req, res, next) {
    crController.deleteCrs(req.body._ids).then((result) => {
        res.json(result)
    }).catch(next);
}

function updateSchema(req, res, next) {

    const schema = Joi.object({
        _id: Joi.objectId().required(),
        crNumber: Joi.string().optional(),
        startTime: Joi.date().optional(),
        endTime: Joi.optional().optional(),
        outageStartTime: Joi.date().optional(),
        outageEndTime: Joi.optional(),
        title: Joi.string().optional(),
        domain: Joi.objectId().optional(),
        executer: Joi.string().optional(),
        workGroup: Joi.string().optional(),
        status: Joi.string().allow("").optional(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    req.body.reporter = req.user.id
    crController.updateCr(req.body).then((event) => {
        res.json(event)
    }).catch(next);
}


module.exports = router
