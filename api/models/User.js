const mongoose = require("mongoose")
const {ROLE} = require("./enums")

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: ROLE.USER,
            required: true
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        gender: {
            type: String,
        },
        about: {
            type: String,
        }
    },
    {timestamps: true},
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.updatedAt
        delete ret.password;
    }
});

const User = mongoose.model('User', schema);
module.exports = User;
