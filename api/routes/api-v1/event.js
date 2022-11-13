const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const authorize = require("../../middleware/authorize");
const eventController = require("../../controllers/event");
const {ROLE, STATUS} = require("../../models/enums");


const router = express.Router();
router.post("/",authorize(),addEventSchema, addEvent)
router.get("/", authorize(),viewEventSchema, getEvents)
router.get("/eventList", authorize(),getEventList)
router.get("/statusList", authorize(),getStatusList)
router.get("/severityList", authorize(),getSeverityList)
router.delete("/",authorize(),deleteEventSchema, deleteEvents)
router.put("/", authorize(),updateEventSchema, updateEvent)


function addEventSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        rca: Joi.string(),
        status: Joi.string().allow(""),
        severity: Joi.string(),
        startTime: Joi.date().required(),
        endTime: Joi.date().when('status', { is: "close", then: Joi.required(), otherwise: Joi.optional().allow(null) }),
        outageStartTime: Joi.date().allow(null),
        outageEndTime: Joi.date().allow(null),
        affectedDomains: Joi.array().items(Joi.objectId().allow(null)),
        affectedServices: Joi.array().items(Joi.objectId().allow(null)),
    });

    validateRequest(req, next, schema);
}

function addEvent(req, res, next) {
    req.body.reporter = req.user.id
    if (req.body.status === "") req.body.status = STATUS.CLOSE
    req.body.domain = req.user.domain.id
    eventController.addEvent(req.body).then((event) => {
        res.json(event)
    }).catch(next);
}


function viewEventSchema(req, res, next) {

    const Joi = require('joi').extend(joi => ({
        base: joi.array(),
        coerce: (value, helpers) => {
            if(value !== ""){
                return {value: value.split ? value.split(',') : value}
            }else {
                return []
            }
        },
        type: 'stringCommaArray',
    }))

    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        title: Joi.string().optional(),
        rca: Joi.string().optional(),
        status: Joi.optional(),
        severity: Joi.optional(),
        reporter: Joi.objectId().optional(),
        startTime: Joi.date().optional(),
        endTime: Joi.date().optional(),
        outageStartTime: Joi.date().optional(),
        outageEndTime: Joi.date().optional(),
        affectedServices: Joi.array().items(Joi.objectId().optional()).optional(),
        affectedDomains: Joi.array().items(Joi.objectId().optional()).optional(),
        domain: Joi.objectId().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function getEvents(req, res, next) {
    if (req.user.role !== "admin") req.query.domain = req.user.domain.id
    // domain is All
    if (req.query.domain === '62c5e945a9507ef16c996e1e'){
        delete req.query.domain
    }
    eventController.getEventsPagination(req.query).then((event) => {
        res.json(event)
    }).catch(next);
}

function getEventList(req, res, next) {
    res.json(eventController.getEventList())
}

function getStatusList(req, res, next) {
    res.json(eventController.getStatusList())
}

function getSeverityList(req, res, next) {
    res.json(eventController.getSeverityList())
}

function deleteEventSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()) ,
    });
    validateRequest(req, next, schema);
}

function deleteEvents(req, res, next) {
    eventController.deleteEvents(req.user,req.body._ids).then((result) => {
        res.json(result)
    }).catch(next);
}

function updateEventSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        title: Joi.string().optional(),
        rca: Joi.string().allow("").optional(),
        status: Joi.optional(),
        severity: Joi.optional(),
        // reporter: Joi.objectId().optional(),
        startTime: Joi.date().optional(),
        endTime: Joi.date().when('status', { is: "close", then: Joi.required(), otherwise: Joi.optional().allow(null) }),
        outageStartTime: Joi.date().allow(null).optional(),
        outageEndTime: Joi.date().when('outageStartTime', { is: Joi.date(), then: Joi.required(), otherwise: Joi.optional().allow(null) }),
        affectedDomains: Joi.array().items(Joi.objectId().optional()).optional(),
        affectedServices: Joi.array().items(Joi.objectId().optional()).optional(),
    });
    validateRequest(req, next, schema);
}

function updateEvent(req, res, next) {
    eventController.updateEvent(req.user,req.body).then((event) => {
        res.json(event)
    }).catch(next);
}


module.exports = router
