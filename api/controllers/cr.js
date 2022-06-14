const crModel = require('./../models/CR')
const userController = require("./user")
const domainController = require("./domain")
const {queryPaginationHandler} = require("../helper/utils");
const mongoose = require("mongoose");
const endOfDay  = require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay')

module.exports = {
    addCR,
    addCRs,
    getCrsPagination,
    getCrs,
    deleteCrs,
    updateCr
}

async function addCR({
                         title,
                         orderId,
                         domain,
                         startTime,
                         endTime,
                         outageStartTime,
                         outageEndTime,
                         reporter,
                         status
                     }) {


    await crModel.findOne({orderId}).then((cr)=>{
        if (cr !== null) throw "Order Id is exist"
    })

    // let reporterQuery = await userController.getUserByIdError(reporter)
    let domainQuery = await domainController.getDomainByIdError(domain)


    return await crModel.create({
        title,
        orderId,
        domain,
        startTime,
        endTime,
        outageStartTime,
        outageEndTime,
        reporter,
        status
    })

}

async function addCRs(list){
    let results = []
    for(let crData of list){
        await addCR({
            title:crData.title,
            orderId:crData.orderId,
            domain:crData.domain,
            startTime:crData.startTime,
            endTime:crData.endTime,
            outageStartTime:crData.outageStartTime,
            outageEndTime:crData.outageEndTime,
            reporter:crData.reporter,
            status:crData.status,
        }).then((result)=>{
            results.push(result)
        }).catch((e)=>{
            results.push(e)
        })
    }

    return results
}


async function getCrsPagination(query) {

    let pagination = queryPaginationHandler(query)

    if ("title" in query) query["title"] = {'$regex': `${query["title"]}`, '$options': 'i'}

    console.log(query)
    if (query.startTime) query.startTime = {$gte: startOfDay(new Date(query.startTime))}
    //
    // if (query.startTime !== undefined){
    //     query.date = {
    //         $gte: startOfDay(new Date(query.date)),
    //         $lte: endOfDay(new Date(query.date))
    //     }
    // }

    return {
        pagination : pagination.itemsPerPage,
        page: pagination.page,
        total: await crModel.count(query),
        result : await crModel.find(query).populate("reporter").populate("domain").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1) * pagination.itemsPerPage)
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

    await cr.save()
    return cr
}

