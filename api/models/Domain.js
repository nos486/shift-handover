const mongoose = require("mongoose")
const {ROLE} = require("./enums")

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        manager: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }

    }, {timestamps: true},
);