const domainModel = require('./../models/Domain')
const userController = require("./user")

module.exports = {
    addDomain,
    getDomains,
    getDomain,
    deleteDomain,
    updateDomain
}

async function addDomain({name, manager}) {

    if (manager !== null && !await userController.findUserById(manager)) {
        throw "manager not find"
    }

    await getDomain({name: name}).then((result) => {
        if (result !== null) throw "domain name exist"
    })

    return await domainModel.create({
        name, manager
    })
}

async function getDomain(query) {
    return domainModel.findOne(query);
}

async function deleteDomain(query) {
    return domainModel.deleteOne(query);
}

async function updateDomain(query) {
    let domain = await domainModel.findOne({_id: query._id});
    delete query._id

    for (const [key, value] of Object.entries(query)) {
        domain[key] = value
    }

    await domain.save()
    return domain
}

async function getDomains() {
    return domainModel.find({});
}


