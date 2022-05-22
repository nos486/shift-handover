const refreshTokenModel = require("../models/RefreshToken")
const jwt = require("jsonwebtoken");
const {randomString} = require("../helper/utils");

module.exports = {
    generateJwtToken,
    generateRefreshToken,
    getRefreshTokenByUserId,
    getRefreshTokenByToken,
    removeOldRefreshToken,
    refreshToken,
    deleteRefreshToken
}

async function getUser (userId) {
    return refreshTokenModel.find({user: userId});
}

async function getRefreshTokenByToken (token) {
    const refreshToken = await refreshTokenModel.findOne({token}).populate('user');
    if (!refreshToken) throw 'Invalid token';
    return refreshToken;
}

async function getRefreshTokenByUserId (userId) {
    // return refreshTokenModel.findOne({user: userId}).populate('user');
    return refreshTokenModel.findOne({user: userId});
}


async function removeOldRefreshToken(userId){
    await refreshTokenModel.findOneAndDelete({user: userId})

}


function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    //todo change expiresIn
    return jwt.sign(
        { id: user.id },
        process.env.SECRET,
        { expiresIn: '15m' },null
    );
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new refreshTokenModel({
        user: user.id,
        token: randomString(40),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createmodelsyIp: ipAddress
    });
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshTokenByToken(token);
    const { user } = refreshToken;

    await refreshTokenModel.findOneAndDelete({user: user.id})
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    await newRefreshToken.save();

    const newJwtToken = generateJwtToken(user);

    // return basic details and tokens
    return {
        ...user.toJSON(),
        jwtToken : newJwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function deleteRefreshToken(token) {
    const refreshToken = await getRefreshTokenByToken(token)
    refreshToken.delete()
}



