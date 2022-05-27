const crModel = require('./../models/CR')
const userController = require("./user")
const domainController = require("./domain")
const {queryPaginationHandler} = require("../helper/utils");

module.exports = {
    addCR,
    getCrsPagination,
    getCrs,
    deleteCrs,
    updateCr
}

async function addCR({
                         crNumber,
                         reporter,
                         startTime,
                         endTime,
                         outageStartTime,
                         outageEndTime,
                         title,
                         domain,
                         executer,
                         workGroup,
                         status
                     }) {


    let reporterQuery = await userController.getUserByIdError(reporter)
    let domainQuery = await domainController.getDomainByIdError(domain)


    return await crModel.create({
        crNumber,
        reporter,
        reporterName: reporterQuery.username,
        startTime,
        endTime,
        outageStartTime,
        outageEndTime,
        outage: (outageEndTime !== null && outageStartTime !== null) ? ((new Date(outageEndTime) - new Date(outageStartTime)) / 1000).toFixed(0) : 0,
        title,
        domain,
        domainName: (domain !== null) ? domainQuery.name : "",
        executer,
        workGroup,
        status
    })

}

async function getCrsPagination(query) {

    let pagination = queryPaginationHandler(query)

    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}

    return {
        pagination : pagination.itemsPerPage,
        page: pagination.page,
        total: await crModel.count(query),
        result: await crModel.find(query).sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1) * pagination.itemsPerPage)
    }
}

async function getCrs(query) {
    return crModel.find(query)
}

async function deleteCrs(ids) {
    let result = []
    for (let id of ids) {
        result.push(await crModel.deleteOne({_id: id}))
    }
    return result
}

async function updateCr(query) {

    let reporterQuery = await userController.getUserByIdError(query.reporter,false)
    let domainQuery = await domainController.getDomainByIdError(query.domain,false)


    let cr = await crModel.findOne({_id: query._id});
    delete query._id

    for (const [key, value] of Object.entries(query)) {
        cr[key] = value
    }
    console.log(query.startTime)
    if (query.outageEndTime !== undefined && query.outageStartTime !== undefined) {
        cr.outage = ((new Date(query.outageEndTime) - new Date(query.outageStartTime)) / 1000).toFixed(0)
    } else {
        cr.outage = 0
    }
    cr.domainName = (query.domain !== undefined) ? domainQuery.name : ""

    await cr.save()
    return cr
}

