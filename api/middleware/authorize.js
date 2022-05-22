const jwt = require('express-jwt');
const refreshTokenController = require('../controllers/token')
const userController = require('../controllers/user')



function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({secret: process.env.SECRET, algorithms: ['HS256']}),

        // authorize based on user role
        async (req, res, next) => {
            userController.findUserById(req.user.id).then((user)=>{
                if (!user || (roles.length && !roles.includes(user.role))) {
                    return res.status(403).json({message: 'Forbidden'});
                }
                req.user = user
                // const refreshTokens = await models.RefreshToken.find({ user: user.id });
                next();
            }).catch(next)


        }
    ];
}

module.exports = authorize;
