const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        orderId: {
            type: String,
            unique: true,
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
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
        reporter: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            require: true
        },
        status: {
            type: String,
            default : "ongoing"
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
