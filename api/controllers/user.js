
const userModel = require('./../models/User')
const domainModel = require('./../models/Domain')
const tokenController = require("./token")
const domainController = require("./domain")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {randomString, queryPaginationHandler} = require("../helper/utils");

module.exports = {
    hasUsername,
    hasEmail,
    createUser,
    findUserById,
    findUserByUsername,
    authenticate,
    getUsersPagination,
    deleteUsers,
    updateUser,
    getUserByIdError
    // refreshToken,
    // deleteRefreshToken,
    // getAll,
    // getUserById,
    // getUserByUsername
}

async function hasUsername (username){
    return !!(await userModel.findOne({username}))
}

async function hasEmail (email){
    return !!(await userModel.findOne({email}))
}


async function createUser({username, email,firstname,lastName,phoneNumber,domain,role,gender,about, password}){
    username = username.toLowerCase()

    if (await hasUsername(username)){
        throw "Username exist"
    }

    if (await hasEmail(email)){
        throw "Email exist"
    }

    console.log(domain)
    await domainController.getDomainByIdError(domain)

    let user = new userModel({
        username,
        email,
        firstname,
        lastName,
        phoneNumber,
        domain,
        role,
        gender,
        about,
        password : bcrypt.hashSync(password, 10),
    });

    await user.save();
    return user
}


async function findUserById(userId){
    return userModel.findOne({_id : userId}).populate("domain")
}

async function findUserByUsername(username){
    return userModel.findOne({username}).populate("domain")
}


async function authenticate({ username, password, ipAddress }) {
    username = username.toLowerCase()

    const user = await userModel.findOne({ username }).populate("domain");

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = tokenController.generateJwtToken(user);

    await tokenController.removeOldRefreshToken(user.id)
    const refreshToken = tokenController.generateRefreshToken(user, ipAddress);
    await refreshToken.save();

    return {
        ...user.toJSON(),
        jwtToken,
        refreshToken: refreshToken.token
    };
}



async function getUsersPagination(query) {
    if ("name" in query) query["name"] = {'$regex' : `${query["name"]}`, '$options' : 'i'}

    let pagination = queryPaginationHandler(query)

    return {
        itemsPerPage : pagination.itemsPerPage,
        page: pagination.page,
        total : await userModel.count(query),
        result: await userModel.find(query).populate("domain").sort(pagination.sortBy).limit(pagination.itemsPerPage).skip((pagination.page - 1)*pagination.itemsPerPage)
    }
}

async function deleteUsers(ids) {
    let result = []
    for(let id of ids){
        result.push(await userModel.deleteOne({_id:id}))
    }
    return result
}

async function updateUser(query) {


    let userQuery = await userModel.findOne({_id: query._id});
    delete query._id

    let username = query.username.toLowerCase()

    if (await hasUsername(username)){
        if (username !== userQuery.username) throw "Username exist"
    }

    if (await hasEmail(query.email)){
        if (query.email !== userQuery.email) throw "Email exist"
    }


    for (const [key, value] of Object.entries(query)) {
        userQuery[key] = value
    }

    if (query.password !== undefined) userQuery.password = bcrypt.hashSync(query.password, 10)

    await userQuery.save()
    return userQuery
}

async function getUserById(userId){
    return userModel.findOne({_id : userId})
}

async function getUserByIdError(userId,nullCheck=true) {
    if (nullCheck && (userId == null) ) throw "user is null"

    if(userId == null){
        return null
    }else {
        let query = await userModel.findOne({_id: userId})
        if (query === null) {
            throw "user not find"
        }
        return query
    }
}


//
// async function getAll() {
//     const users = await models.User.find();
//     return users;
// }

// helper functions


//
// async function getUserById(userId,fullDetails = false) {
//     return await models.User.getUserById(userId,fullDetails);
// }
//
//
// async function getUserByUsername(username,fullDetails = false) {
//     username = username.toLowerCase()
//     return await models.User.getUserByUsername(username,fullDetails);
// }


//
// User.getUserById  = async function(id, fullDetails = false) {
//     if (! mongoose.Types.ObjectId.isValid(id)) throw 'User not found';
//     const user = await User.findById(id);
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
// User.getUserByUsername  = async function(username, fullDetails = false) {
//     const user = await User.findOne({username});
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
// User.hasUsername = async function(username){
//     return !!(await User.findOne({username}))
// }
//
// User.hasEmail = async function(email){
//     return !!(await User.findOne({email}))
// }
//
// User.getUserByEmail  = async function(email, fullDetails = false) {
//     const user = await User.findOne({email});
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
//
// //helpers
//
// function basicDetails(user) {
//     const { id, email, username, role } = user;
//     return { id, email, username, role };
// }