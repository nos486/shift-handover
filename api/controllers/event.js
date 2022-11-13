const eventModel = require('./../models/SpecialEvent')
const userController = require("./user")
const domainController = require("./domain")
const serviceController = require("./service")
const {queryPaginationHandler} = require("../helper/utils");

module.exports = {
    addEvent,
    getEvents,
    getEventsPagination,
    getEventList,
    getStatusList,
    getSeverityList,
    deleteEvents,
    updateEvent
}

async function addEvent({
                            title,
                            rca,
                            status,
                            severity,
                            reporter,
                            domain,
                            startTime,
                            endTime,
                            outageStartTime,
                            outageEndTime,
                            affectedDomains,
                            affectedServices,
                        }) {

    let reporterQuery = await userController.findUserById(reporter)
    if (reporterQuery === null) {
        throw "reporter not find"
    }


    return await eventModel.create({
        title,
        rca,
        status,
        severity,
        reporter,
        domain,
        startTime,
        endTime,
        outageStartTime,
        outageEndTime,
        outage: (outageEndTime !== null && outageStartTime !== null) ? ((new Date(outageEndTime) - new Date(outageStartTime)) / 1000).toFixed(0) : 0,
        affectedDomains,
        affectedServices,
    })

}

async function getEventsPagination(query) {
    let pagination = queryPaginationHandler(query)

    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}

    return {
        itemsPerPage: pagination.itemsPerPage,
        page: pagination.page,
        total: await eventModel.count(query),
        result: await eventModel.find(query).populate({
            path: 'reporter',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: {path: 'domain'}
        }).populate("domain").populate("affectedDomains").populate("affectedServices").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1) * pagination.itemsPerPage)
    }
}

async function getEvents(query) {
    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}
    return eventModel.find(query)
}

async function deleteEvents(user,ids) {

    let result = []
    for (let id of ids) {
        let event = await eventModel.findOne({_id: id});
        if (event.reporter.toString() === user._id.toString() || user.role === 'admin') {
            result.push(await eventModel.deleteOne({_id: id}))
        }else {
            throw "you are not allow to delete."
        }

    }
    return result
}

async function updateEvent(user,query) {

    // let reporterQuery = await userController.findUserById(query.reporter)
    // if (reporterQuery === null) {
    //     throw "reporter not find"
    // }

    // let domainQuery = await domainController.getDomains({_id: query.domain})
    // if (query.domain !== null) {
    //     if (domainQuery.length === 0) {
    //         throw "domain not find"
    //     }
    // }


    // let affectedDomainsNames = []
    // if (query.affectedDomains !== undefined) {
    //     for (let item of query.affectedDomains) {
    //         let affectedDomainsQuery = await domainController.getDomains({_id: item})
    //         if (affectedDomainsQuery.length === 0) {
    //             throw "affected domain/s not find"
    //         } else {
    //             affectedDomainsNames.push(affectedDomainsQuery[0].name)
    //         }
    //     }
    // }

    let affectedServicesNames = []
    if (query.affectedServices !== undefined) {
        for (let item of query.affectedServices) {
            let affectedServicesQuery = await serviceController.getServices({_id: item})
            if (affectedServicesQuery.length === 0) {
                throw "affected service/s not find"
            } else {
                affectedServicesNames.push(affectedServicesQuery[0].name)
            }
        }
    }

    let event = await eventModel.findOne({_id: query._id});

    if (event.reporter.toString() !== user._id.toString()) {
        if (user.role !== 'admin') throw "you are not allow to edit."
    }

    delete query._id

    for (const [key, value] of Object.entries(query)) {
        event[key] = value
    }

    if (query.outageEndTime !== null && query.outageStartTime !== null) {
        event.outage = ((new Date(query.outageEndTime) - new Date(query.outageStartTime)) / 1000).toFixed(0)
    } else {
        event.outage = 0
    }
    event.affectedServicesNames = affectedServicesNames

    await event.save()
    return event
}

function getEventList() {
    return {
        result: [
            {name : "title",id: "title"},
            {name : "rca",id: "rca"},
            {name : "status",id: "status"},
            {name : "severity",id: "severity"},
            {name : "startTime",id: "startTime"},
            {name : "endTime",id: "endTime"},
            {name : "outageStartTime",id: "outageStartTime"},
            {name : "reporter",id: "reporter"},
            {name : "outageEndTime",id: "outageEndTime"},
            {name : "affectedDomains",id: "affectedDomains"},
            {name : "affectedServices",id: "affectedServices"},
            {name : "domain",id: "domain"},
            ]
    }
}

function getStatusList() {
    return {
        result: [
            {name : "Close",id: "close"},
            {name : "Open",id: "open"},
        ]
    }
}

function getSeverityList() {
    return {
        result: [
            {name : "Critical",id: "critical"},
            {name : "Major",id: "major"},
            {name : "Miner",id: "miner"},
            {name : "None",id: "none"},
        ]
    }
}
