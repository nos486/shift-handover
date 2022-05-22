const mongoose = require("mongoose")
const {ROLE,SEVERITY,STATUS} = require("./enums")
const {string} = require("joi");

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
            default : STATUS.OPEN
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
        reporterName: {
            type: String,
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
        outage : {
            type: String,
        },
        affectedDomains:[{
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        }],
        affectedDomainsNames: [{
            type: String,
        }],
        affectedServices:[{
            type: mongoose.Types.ObjectId,
            ref: 'Service'
        }],
        affectedServicesNames: [{
            type: String,
        }],
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        },
        domainName: {
            type: String,
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
