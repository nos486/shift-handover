const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique : true,
            required: true,
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

const Domain = mongoose.model('Domain', schema);
module.exports = Domain;
