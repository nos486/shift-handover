const eventModel = require('./../models/SpecialEvent')
const userController = require("./user")
const domainController = require("./domain")
const serviceController = require("./service")

module.exports = {
    addEvent,
    getEvents,
    getEventsPagination,
    deleteEvents,
    updateEvent
}

async function addEvent({
                            title,
                            rca,
                            status,
                            severity,
                            reporter,
                            startTime,
                            endTime,
                            outageStartTime,
                            outageEndTime,
                            affectedDomains,
                            affectedServices,
                            domain
                        }) {

    let reporterQuery = await userController.findUserById(reporter)
    if (reporterQuery === null) {
        throw "reporter not find"
    }

    let domainQuery = await domainController.getDomains({_id: domain})
    if(domain !== null){
        if (domainQuery.length === 0) {
            throw "domain not find"
        }
    }

    let affectedDomainsNames = []
    if (affectedDomains !== undefined) {
        for (let item of affectedDomains) {
            let affectedDomainsQuery = await domainController.getDomains({_id: item})
            if (affectedDomainsQuery.length === 0) {
                throw "affected domain/s not find"
            } else {
                affectedDomainsNames.push(affectedDomainsQuery[0].name)
            }
        }
    }

    let affectedServicesNames = []
    if (affectedServices !== undefined) {
        for (let item of affectedServices) {
            let affectedServicesQuery = await serviceController.getServices({_id: item})
            if (affectedServicesQuery.length === 0) {
                throw "affected domain/s not find"
            } else {
                affectedServicesNames.push(affectedServicesQuery[0].name)
            }
        }
    }

    return await eventModel.create({
        title,
        rca,
        status,
        severity,
        reporter,
        reporterName: reporterQuery.username,
        startTime,
        endTime,
        outageStartTime,
        outageEndTime,
        outage: (outageEndTime !== null && outageStartTime!== null) ? ((new Date(outageEndTime) - new Date(outageStartTime)) / 1000).toFixed(0) : 0,
        affectedDomains,
        affectedDomainsNames,
        affectedServices,
        affectedServicesNames,
        domain,
        domainName: (domain !== null) ? domainQuery[0].name : ""
    })

}

async function getEventsPagination(query) {
    let page = (query.page !== undefined) ? Math.max(1, query.page) : 1
    let itemsPerPage = (query.itemsPerPage !== undefined) ? Math.max(1, query.itemsPerPage) : 5
    let sortBy = (query.sortBy !== undefined) ? {[query.sortBy]: (query.sortDesc === "true" ? 1 : -1)} : {"createdAt":-1}

    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}

    return {
        itemsPerPage,
        page,
        total : await eventModel.count(query),
        result: await eventModel.find(query).sort(sortBy).limit(itemsPerPage).skip((page - 1)*itemsPerPage)
    }
}

async function getEvents(query) {
    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}
    return eventModel.find(query)
}

async function deleteEvents(ids) {
    let result = []
    for (let id of ids) {
        result.push(await eventModel.deleteOne({_id: id}))
    }
    return result
}

async function updateEvent(query) {

    // let reporterQuery = await userController.findUserById(query.reporter)
    // if (reporterQuery === null) {
    //     throw "reporter not find"
    // }

    let domainQuery = await domainController.getDomains({_id: query.domain})
    if(query.domain !== null){
        if (domainQuery.length === 0) {
            throw "domain not find"
        }
    }


    let affectedDomainsNames = []
    if (query.affectedDomains !== undefined) {
        for (let item of query.affectedDomains) {
            let affectedDomainsQuery = await domainController.getDomains({_id: item})
            if (affectedDomainsQuery.length === 0) {
                throw "affected domain/s not find"
            } else {
                affectedDomainsNames.push(affectedDomainsQuery[0].name)
            }
        }
    }

    let affectedServicesNames = []
    if (query.affectedServices !== undefined) {
        for (let item of query.affectedServices) {
            let affectedServicesQuery = await serviceController.getServices({_id: item})
            if (affectedServicesQuery.length === 0) {
                throw "affected domain/s not find"
            } else {
                affectedServicesNames.push(affectedServicesQuery[0].name)
            }
        }
    }

    let event = await eventModel.findOne({_id: query._id});
    delete query._id

    for (const [key, value] of Object.entries(query)) {
        event[key] = value
    }
    // event.reporterName =  reporterQuery.username
    if(query.outageEndTime !== null && query.outageStartTime!== null){
        event.outage =  ((new Date(query.outageEndTime) - new Date(query.outageStartTime)) / 1000).toFixed(0)
    }else{
        event.outage =  0
    }
    event.affectedDomainsNames = affectedDomainsNames
    event.affectedServicesNames = affectedServicesNames
    event.domainName =  (query.domain !== null) ? domainQuery[0].name : ""

    await event.save()
    return event
}

