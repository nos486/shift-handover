const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        crNumber: {
            type: String,
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
        title: {
            type: String,
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        },
        domainName: {
            type: String,
        },
        executer: {
            type: String,
        },
        workGroup: {
            type: String,
        },
        status: {
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

const CR = mongoose.model('CR', schema);

module.exports = CR;
