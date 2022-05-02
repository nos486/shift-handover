const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const {dbConnect} = require("./db")

const app = express()

//json body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    exposedHeaders: 'Key',
}))

app.use('/static', express.static('public'))

//routes
app.use('/', require("./routes"));

// global error handler
app.use(require("./middleware/error-handler"));

dbConnect()

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Example app listening at http://0.0.0.0:${port}`)
})

module.exports = server
