const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique : true,
            required: true,
        },
        domain: {
            type: mongoose.Types.ObjectId,
            ref: 'Domain'
        },
        domainName: {
            type: String,
        },
    }, {timestamps: true},
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.updatedAt
        delete ret.createdAt
    }
});

const Service = mongoose.model('Service', schema);
module.exports = Service;