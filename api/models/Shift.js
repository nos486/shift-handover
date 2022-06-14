const mongoose = require("mongoose")
const {object} = require("joi");

const alarmsSchema = new mongoose.Schema(
    {
        critical: {
            type : Number,
            default : 0
        },
        major: {
            type : Number,
            default : 0
        },
        miner: {
            type : Number,
            default : 0
        },
        warning: {
            type : Number,
            default : 0
        }
    }
)

const schema = new mongoose.Schema(
    {
        date: {
            type: Date,
            require: true
        },
        operator: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            require: true
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: "Domain",
        },
        isDay: {
            type: Boolean,
            default : true
        },
        handoverTo: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        isEnd: {
            type: Boolean,
            default : false
        },
        acceptedTime: {
            type: Date,
            default: null
        },
        alarms : {
            type: alarmsSchema,
            default: () => ({})
        },
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
    }
});

const Shift = mongoose.model('Shift', schema);

module.exports = Shift;
