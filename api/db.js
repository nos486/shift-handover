const mongoose = require('mongoose');
const userController = require("./controllers/user")

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

function dbConnect() {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/handover').then(async () => {


        console.log(await userController.hasUsername("admin"))
        // create admin user
        if (!await userController.hasUsername("admin")) {
            let admin = await userController.createUser("admin", "", "admin",)
            console.log("admin created")
        }

        // userController.getUsers().then(async (users: IUser[]) => {
        //     for (let user of users) {
        //         console.log(user.username)
        //         // @ts-ignore
        //         let temp = user.settings.templateSettings.c2
        //         if(temp != undefined){
        //             temp.push("highlights")
        //         }
        //         // @ts-ignore
        //         user.settings.templateSettings.c2 = temp
        //         await user.save()
        //     }
        // }).catch()

        console.error('database connected');

    }).catch(error => {
        console.error('Error connecting to database: ', error);
    });
}

// mongoose.connection.on('disconnected', dbConnect);

module.exports = {dbConnect}