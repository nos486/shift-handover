const serviceModel = require('./../models/Service')
const domainModel = require('./../models/Domain')
const {queryPaginationHandler} = require("../helper/utils");
const domainController = require("./domain");

module.exports = {
    addService,
    getServices,
    getServicePagination,
    deleteService,
    updateService
}

async function addService({name, domain}) {

    await serviceModel.findOne({name}).then((service)=>{
        if (service !== null) throw "Service name exist"
    })

    await domainController.getDomainByIdError(domain)

    return await serviceModel.create({
        name,
        domain
    })
}

async function getServices(query) {
    return serviceModel.find(query);
}


async function getServicePagination(query) {

    let pagination = queryPaginationHandler(query)

    return {
        itemsPerPage: pagination.itemsPerPage,
        page : pagination.page,
        total : await serviceModel.count(query),
        result: await serviceModel.find(query).populate("domain").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1)*pagination.itemsPerPage)
    }
}


async function deleteService(ids) {
    let result = []
    for(let id of ids){
        result.push(await serviceModel.deleteOne({_id:id}))
    }
    return result
}

async function updateService(query) {
    let service = await serviceModel.findOne({_id: query._id});
    delete query._id


    await serviceModel.findOne({name:query.name}).then((query)=>{
        if (query !== null && service.name !== query.name) throw "Service name exist"
    })

    for (const [key, value] of Object.entries(query)) {
        service[key] = value
    }

    await service.save()
    return service
}


async function getServiceByIdError(id,nullCheck=true) {
    if (nullCheck && id == null) throw "service is null"

    if(id == null){
        return null
    }else {
        let query = await serviceModel.findOne({_id: id})
        if (query === null) {
            throw "service not find"
        }
        return query
    }
}