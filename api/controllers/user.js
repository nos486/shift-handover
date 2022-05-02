
const userModel = require('./../models/User')
const tokenController = require("./token")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {randomString} = require("../helper/utils");


module.exports = {
    hasUsername,
    hasEmail,
    createUser,
    findUserById,
    authenticate,
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


async function createUser(username, email, password){
    username = username.toLowerCase()

    if (await hasUsername(username)){
        throw "Username exist"
    }

    if (await hasEmail(email)){
        throw "Email exist"
    }

    let user = new userModel({
        username: username,
        email : email,
        password : bcrypt.hashSync(password, 10),
    });

    await user.save();
    return user
}


async function findUserById(userId){
    return userModel.findById(userId)
}


async function authenticate({ username, password, ipAddress }) {
    username = username.toLowerCase()

    const user = await userModel.findOne({ username });

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