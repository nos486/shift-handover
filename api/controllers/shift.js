const shiftModel = require('./../models/Shift')
const userModel = require('./../models/User')
const domainModel = require('./../models/Domain')
const userController = require("./user")
const domainController = require("./domain")
const serviceController = require("./service")
const {queryPaginationHandler} = require("../helper/utils");


const endOfDay  = require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay')
const addDays = require('date-fns/addDays')
const setHours = require('date-fns/setHours')
const setMinutes = require('date-fns/setMinutes')
const setSeconds = require('date-fns/setSeconds')
const differenceInDays = require('date-fns/differenceInDays')
const mongoose = require("mongoose");
const {addHours} = require("date-fns");

module.exports = {
    addShift,
    acceptShift,
    getShiftsPagination,
    getLastShift,
    deleteShifts,
    updateShift
}

async function addShift({date, isDay, operator,domain,handoverTo,data}) {

    let operatorQuery = await userController.getUserByIdError(operator)
    let domainQuery = await domainController.getDomainByIdError(domain)

    let shiftQuery = await shiftModel.findOne({
        date : {
            $gte: startOfDay(new Date(date)),
            $lte: endOfDay(new Date(date))
        },
        isDay: isDay
    }).populate("operator")

    if (shiftQuery !== null){
        throw `shift taken by ${shiftQuery.operator.username}`
    }
    let shiftDate = date

    if (isDay) {
        shiftDate = setHours(date,20)
    }else {
        shiftDate = setHours(date,8)
    }

    return await shiftModel.create({
        date:shiftDate,
        isDay,
        operator,
        domain,
        handoverTo,
        data
    })
}


async function acceptShift(lastShiftId, userId) {
    let userQuery = await userController.getUserByIdError(userId)

    let lastShift = await shiftModel.findById(lastShiftId)
    if (lastShift === null ) throw "Shift not find"

    if(lastShift.handoverTo._id.toString() === userId){
        if (lastShift.acceptedTime !== undefined){
            lastShift.acceptedTime = new Date()

            let shiftDate = lastShift.date

            if (lastShift.isDay) {
                shiftDate = setHours(shiftDate,20)
            }else {
                shiftDate = addDays(shiftDate , 1)
                shiftDate = setHours(shiftDate,8)
            }

            if (differenceInDays(new Date(),shiftDate) > 1) {
                throw `Shift date mismatch`
            }

            let shiftQuery = await shiftModel.findOne({
                date : {
                    $gte: startOfDay(shiftDate),
                    $lte: endOfDay(shiftDate)
                },
                isDay: ! lastShift.isDay,
                domain : userQuery.domain
            }).populate("operator")


            if (shiftQuery !== null){
                throw `This shift taken created before`
            }

            return await shiftModel.create({
                date : shiftDate,
                isDay: ! lastShift.isDay,
                operator:userQuery._id,
                domain:userQuery.domain,
            })

        }else {
            throw "This Shift is taken before !!!"
        }

    }else {
        throw "This Shift is not handover to you !!!"
    }
}



async function getShiftsPagination(query) {
    let pagination = queryPaginationHandler(query)

    if (query.date !== undefined){
        query.date = {
            $gte: startOfDay(new Date(query.date)),
            $lte: endOfDay(new Date(query.date))
        }
    }

    if (query.fromDate !== undefined){
        query.date = {
            $gte: startOfDay(new Date(query.fromDate)),
            $lte: endOfDay(new Date(query.toDate))
        }
    }


    // let shiftQueryAggregate = shiftModel.aggregate()
    // shiftQueryAggregate.append({$match : query})
    // shiftQueryAggregate.append({ $lookup:
    //         {
    //             from: "users",
    //             localField: "operator",
    //             foreignField: "_id",
    //             as: "operator",
    //         }
    // })
    // shiftQueryAggregate.append({ $unwind: "$operator"})
    // if (query.domain !== undefined){
    //     shiftQueryAggregate.append({$match : {"operator.domain" : mongoose.Types.ObjectId(query.domain) }})
    // }
    // shiftQueryAggregate.append({ $lookup:
    //     {
    //         from: "domains",
    //         localField: "operator.domain",
    //         foreignField: "_id",
    //         as: "operator.domain",
    //     }
    // })
    // shiftQueryAggregate.append({ $unwind: "$operator.domain"})
    // let len = (await shiftQueryAggregate.exec()).length
    // shiftQueryAggregate.append({ $sort: pagination.sortBy })
    // shiftQueryAggregate.append({ $limit: pagination.itemsPerPage })
    // shiftQueryAggregate.append({ $skip: (pagination.page - 1) * pagination.itemsPerPage })
    //


    return {
        itemsPerPage: pagination.itemsPerPage,
        page: pagination.page,
        total: await shiftModel.count(query),
        result: await shiftModel.find(query).populate("operator").populate("domain").populate("handoverTo").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1) * pagination.itemsPerPage)
    }
}

async function getLastShift(query) {
    return shiftModel.findOne(query).populate("operator").populate("domain").populate("handoverTo").sort({ 'date' : -1 })
}




async function deleteShifts(ids,checkIsOwn=true,userId=null) {
    let result = []
    for (let id of ids) {
        let shift = await shiftModel.findOne({_id: id});
        if (checkIsOwn && shift.operator.toString() !== userId){
            throw `you can't remove others shift`
        }
        result.push(await shift.remove())
    }
    return result
}

async function updateShift(query,userId) {

    let handoverQuery = userController.getUserByIdError(query.handoverTo,false)

    let shift = await shiftModel.findOne({_id: query._id});
    delete query._id

    if(shift.operator._id.toString() === query.handoverTo) throw "Handover user and operator cant be same !!!"
    if(shift.operator._id.toString() !== userId) throw "You can't change others shift !!!"

    if (query.isEnd && (query.handoverTo === undefined)) {
        throw "You must set handover user."
    }

    for (const [key, value] of Object.entries(query)) {
        shift[key] = value
    }

    await shift.save()
    return shift
}

