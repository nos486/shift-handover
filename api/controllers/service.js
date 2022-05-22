const serviceModel = require('./../models/Service')
const domainModel = require('./../models/Domain')

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

    let domainName = ""
    await domainModel.findById(domain).then((domain) => {
        if (domain === null) {
            throw "domain not exist"
        }else {
            domainName = domain.name
        }
    })

    return await serviceModel.create({
        name,
        domain,
        domainName
    })
}

async function getServices(query) {
    return serviceModel.find(query);
}


async function getServicePagination(query) {

    let page = (query.page !== undefined) ? Math.max(1, query.page) : 1
    let itemsPerPage = (query.itemsPerPage !== undefined) ? Math.max(1, query.itemsPerPage) : 5
    let sortBy = (query.sortBy !== undefined) ? {[query.sortBy]: (query.sortDesc === "true" ? 1 : -1)} : {"createdAt":-1}

    return {
        itemsPerPage,
        page,
        total : await serviceModel.count(query),
        result: await serviceModel.find(query).sort(sortBy).limit(itemsPerPage).skip((page - 1)*itemsPerPage)
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

    let domainName = ""
    await domainModel.findById(query.domain).then((domain) => {
        if (domain === null) {
            throw "domain not exist"
        }else {
            domainName = domain.name
        }
    })

    for (const [key, value] of Object.entries(query)) {
        service[key] = value
    }

    service.domainName = domainName

    await service.save()
    return service
}
