const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const authorize = require("../../middleware/authorize");
const shiftController = require("../../controllers/shift");
const {ROLE, STATUS} = require("../../models/enums");


const router = express.Router();
router.post("/", authorize(), addSchema, add)
router.post("/accept", authorize(), acceptSchema, accept)
router.get("/", authorize(), viewSchema, get)
router.get("/last", authorize(), getLastSchema, getLastShift)
router.delete("/", authorize(), removeSchema, remove)
router.put("/", authorize(), updateSchema, update)


function addSchema(req, res, next) {
    const schema = Joi.object({
        date: Joi.date().required(),
        isDay: Joi.bool().required(),
    });

    validateRequest(req, next, schema);
}

function add(req, res, next) {
    req.body.operator = req.user.id
    req.body.domain = req.user.domain
    shiftController.addShift(req.body).then((event) => {
        res.json(event)
    }).catch(next);
}


function acceptSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional()
    });

    validateRequest(req, next, schema);
}

function accept(req, res, next) {
    shiftController.acceptShift(req.body._id,req.user.id).then((event) => {
        res.json(event)
    }).catch(next);
}


function viewSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        date: Joi.date().optional(),
        fromDate: Joi.date().optional(),
        toDate: Joi.date().when('fromDate', {is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional()}),
        isDay: Joi.bool().optional(),
        operator: Joi.objectId().optional(),
        domain: Joi.objectId().optional(),
        handoverTo: Joi.objectId().optional(),
        data: Joi.object().optional(),
        selfDomain: Joi.boolean().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function get(req, res, next) {
    if (req.query.selfDomain) req.query.domain = req.user.domain
    delete req.query.selfDomain
    shiftController.getShiftsPagination(req.query).then((event) => {
        res.json(event)
    }).catch(next);
}

function getLastSchema(req, res, next) {
    const schema = Joi.object({
        domain: Joi.objectId().optional(),
    })
    validateQuery(req, next, schema);
}

function getLastShift(req, res, next) {
    if (!req.query.domain) req.query.domain = req.user.domain
    shiftController.getLastShift(req.query).then((event) => {
        res.json(event)
    }).catch(next);
}


function removeSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()),
    });
    validateRequest(req, next, schema);
}

function remove(req, res, next) {
    shiftController.deleteShifts(req.body._ids, true, req.user.id).then((result) => {
        res.json(result)
    }).catch(next);
}

function updateSchema(req, res, next) {

    const schema = Joi.object({
        _id: Joi.objectId().required(),
        handoverTo: Joi.objectId().optional(),
        alarms: Joi.object({
                critical: Joi.number(),
                major: Joi.number(),
                miner: Joi.number(),
                warning: Joi.number()
            }
        ).optional(),
        isEnd : Joi.boolean().optional()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    shiftController.updateShift(req.body,req.user._id.toString()).then((event) => {
        res.json(event)
    }).catch(next);
}


module.exports = router