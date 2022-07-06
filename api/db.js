const mongoose = require('mongoose');
const userController = require("./controllers/user")
const domainController = require("./controllers/domain")
const {ROLE} = require("./models/enums");

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

function dbConnect() {
    mongoose.connect(process.env.MONGODB_URI || `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}/handover`).then(async () => {

        console.log(await userController.hasUsername("admin"))
        // create admin user
        if (!await userController.hasUsername("admin")) {
            let admin = await userController.createUser(
                {
                    username: "admin",
                    password: "admin",
                    domain : null,
                    role : ROLE.ADMIN
                })

            admin.domain = await domainController.addDomain(
                {
                    name: "Administrator",
                    manager: admin._id
                })
            await admin.save()
            console.log("admin created")
        }

        console.error('database connected');

    }).catch(error => {
        console.error('Error connecting to database: ', error);
    });
}

// mongoose.connection.on('disconnected', dbConnect);

module.exports = {dbConnect}
