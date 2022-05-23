const shiftModel = require('./../models/Shift')
const userController = require("./user")
const domainController = require("./domain")
const serviceController = require("./service")
const {queryPaginationHandler} = require("../helper/utils");


const endOfDay  = require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay')

module.exports = {
    addShift,
    getShiftsPagination,
    deleteShifts,
    updateShift
}

async function addShift({date, isDay, operator, domain}) {

    let operatorQuery = await userController.getUserByIdError(operator)
    let domainQuery = await domainController.getDomainByIdError(domain)

    let shiftQuery = await shiftModel.findOne({
        date : {
            $gte: startOfDay(new Date(date)),
            $lte: endOfDay(new Date(date))
        },
        isDay: isDay
    })

    if (shiftQuery !== null){
        throw `shift taken by ${shiftQuery.operatorName}`
    }

    return await shiftModel.create({
        date,
        isDay,
        operator,
        operatorName: operatorQuery.username,
        domain,
        domainName: domainQuery.name
    })

}

async function getShiftsPagination(query) {
    let pagination = queryPaginationHandler(query)


    if (query.date !== undefined){
        query.date = {
            $gte: startOfDay(new Date(query.date)),
            $lte: endOfDay(new Date(query.date))
        }
    }

    return {
        itemsPerPage: pagination.itemsPerPage,
        page: pagination.page,
        total: await shiftModel.count(query),
        result: await shiftModel.find(query).sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1) * pagination.itemsPerPage)
    }
}


async function deleteShifts(ids,checkIsOwn=true,userId=null) {
    let result = []
    for (let id of ids) {
        let shift = await shiftModel.findOne({_id: id});
        console.log(shift.operator.toString() , userId)
        if (checkIsOwn && shift.operator.toString() !== userId){
            throw `you can't remove others shift`
        }
        result.push(await shift.remove())
    }
    return result
}

async function updateShift(query) {

    let domainQuery = domainController.getDomainByIdError(query.domain,false)
    let operatorQuery = userController.getUserByIdError(query.operator,false)


    let shift = await shiftModel.findOne({_id: query._id});
    delete query._id

    for (const [key, value] of Object.entries(query)) {
        shift[key] = value
    }

    shift.opratorName = operatorQuery.username
    shift.domainName = domainQuery.username

    await shift.save()
    return shift
}

