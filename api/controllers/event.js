const eventModel = require('./../models/SpecialEvent')

async function createEvent ({title,rca,status,severity,reporter,startTime,endTime,outageStartTime,outageEndTime,domain}){

    let event = new eventModel({
        title,rca,status,severity,reporter,startTime,endTime,outageStartTime,outageEndTime,domain
    })
    await event.save();


}
