const mongoose = require("mongoose")

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
        operatorName: {
            type: String,
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        },
        domainName: {
            type: String,
        },
        isDay: {
            type: Boolean,
            default : true
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
    }
});

const Shift = mongoose.model('Shift', schema);

module.exports = Shift;
