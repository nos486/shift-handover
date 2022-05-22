const express = require("express");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateRequest = require("../../middleware/validate-request");
const validateQuery = require("../../middleware/validate-query");
const serviceController = require("../../controllers/service");
const authorize = require("../../middleware/authorize");
const {ROLE} = require("../../models/enums");
const {deleteService} = require("../../controllers/service");


const router = express.Router();
router.post("/", authorize(ROLE.ADMIN),addServiceSchema, addService)
router.get("/", authorize(),viewServiceSchema, getServices)
router.delete("/", authorize(ROLE.ADMIN),deleteServicesSchema, deleteService)
router.put("/", authorize(ROLE.ADMIN),updateServiceSchema, updateService)


function addServiceSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        domain: Joi.objectId().required(),
    });

    validateRequest(req, next, schema);
}

function addService(req, res, next) {
    serviceController.addService(req.body).then((service) => {
        res.json(service)
    }).catch(next);
}


function viewServiceSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().optional(),
        name: Joi.string().optional(),
        domain: Joi.objectId().optional(),
        itemsPerPage: Joi.number().optional(),
        page: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        sortDesc: Joi.string().optional(),
    })
    validateQuery(req, next, schema);
}

function getServices(req, res, next) {
    serviceController.getServicePagination(req.query).then((services) => {
        res.json(services)
    }).catch(next)
}

function deleteServicesSchema(req, res, next) {
    const schema = Joi.object({
        _ids: Joi.array().items(Joi.objectId().optional()) ,
    });
    validateRequest(req, next, schema);
}

function deleteDomainServices(req, res, next) {
    serviceController.deleteService(req.body._ids).then((service) => {
        res.json(service)
    }).catch(next)
}

function updateServiceSchema(req, res, next) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().optional(),
        domain: Joi.objectId().optional(),
    });
    validateRequest(req, next, schema);
}

function updateService(req, res, next) {
    serviceController.updateService(req.body).then((service) => {
        res.json(service)
    }).catch(next)
}


module.exports = router