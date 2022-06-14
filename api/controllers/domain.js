const domainModel = require('./../models/Domain')
const userModel = require('./../models/User')
const userController = require("./user")
const {queryPaginationHandler} = require("../helper/utils");

module.exports = {
    addDomain,
    getDomains,
    getDomainsPagination,
    deleteDomains,
    updateDomain,
    getDomainById,
    getDomainByIdError
}

async function addDomain({name, manager}) {

    await userController.getUserByIdError(manager)

    await domainModel.find({name: name}).then((result) => {
        if (result.length !== 0) throw "domain name exist"
    })

    return await domainModel.create({
        name,
        manager
    })
}

/**
 *
 * @param query
 * @returns  {Promise<[Object]>}
 */
async function getDomainsPagination(query) {
    if ("name" in query) query["name"] = {'$regex' : `${query["name"]}`, '$options' : 'i'}

    let pagination = queryPaginationHandler(query)

    return {
        itemsPerPage : pagination.itemsPerPage,
        page: pagination.page,
        total : await domainModel.count(query),
        result: await domainModel.find(query).populate("manager").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1)*pagination.itemsPerPage)
    }
}

/**
 *
 * @param query
 * @returns  {Promise<[Object]>}
 */
async function getDomains(query) {
    if ("name" in query) query["name"] = {'$regex' : `${query["name"]}`, '$options' : 'i'}
    return domainModel.find(query);
}


async function deleteDomains(ids) {
    let result = []
    for(let id of ids){
        result.push(await domainModel.deleteOne({_id:id}))
    }
    return result
}

async function updateDomain(query) {
    let domain = await domainModel.findOne({_id: query._id});
    delete query._id


    await userController.getUserByIdError(query.manager)

    for (const [key, value] of Object.entries(query)) {
        domain[key] = value
    }

    await domain.save()
    return domain
}


async function getDomainById(userId) {
    return domainModel.findOne({_id: userId});
}

async function getDomainByIdError(id,nullCheck=true) {
    if (nullCheck && id == null) throw "domain is null"

    if(id == null){
        return null
    }else {
        let query = await domainModel.findOne({_id: id})
        if (query === null) {
            throw "domain not find"
        }
        return query
    }
}
