const mongoose = require("mongoose")
const {ROLE,SEVERITY,STATUS} = require("./enums")

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        rca: {
            type: String,
            require: true
        },
        status: {
            type: String,
            default : STATUS.CLOSE
        },
        severity: {
            type: String,
            default : SEVERITY.NONE
        },
        reporter: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            require: true
        },
        startTime: {
            type: Date,
            require: true
        },
        endTime: {
            type: Date,
            require: true
        },
        outageStartTime: {
            type: Date,
        },
        outageEndTime: {
            type: Date,
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
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

const SpecialEvent = mongoose.model('SpecialEvent', schema);

module.exports = SpecialEvent;
