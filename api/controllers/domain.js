const domainModel = require('./../models/Domain')
const userModel = require('./../models/User')

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

    let managerName = ""
    if(manager !== null){
        let userQuery = await userModel.findById(manager)
        if (manager !== undefined && !userQuery) {
            throw "manager not find"
        }else {
            managerName = userQuery.username
        }
    }

    await domainModel.find({name: name}).then((result) => {
        if (result.length !== 0) throw "domain name exist"
    })

    return await domainModel.create({
        name,
        manager,
        managerName
    })
}

/**
 *
 * @param query
 * @returns  {Promise<[Object]>}
 */
async function getDomainsPagination(query) {
    if ("name" in query) query["name"] = {'$regex' : `${query["name"]}`, '$options' : 'i'}

    let page = (query.page !== undefined) ? Math.max(1, query.page) : 1
    let itemsPerPage = (query.itemsPerPage !== undefined) ? Math.max(1, query.itemsPerPage) : 5
    let sortBy = (query.sortBy !== undefined) ? {[query.sortBy]: (query.sortDesc === "true" ? 1 : -1)} : {"createdAt":-1}

    return {
        itemsPerPage,
        page,
        total : await domainModel.count(query),
        result: await domainModel.find(query).sort(sortBy).limit(itemsPerPage).skip((page - 1)*itemsPerPage)
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


    let userQuery = await userModel.findById(query.manager)
    if (query.manager !== null && !userQuery) {
            throw "manager not find"
    }

    for (const [key, value] of Object.entries(query)) {
        domain[key] = value
    }

    domain.managerName = query.manager !== null ? userQuery.username : ""

    await domain.save()
    return domain
}


async function getDomainById(userId) {
    return domainModel.findOne({_id: userId});
}

async function getDomainByIdError(id,nullCheck=true) {
    if (nullCheck && id == null) throw "user is null"

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
