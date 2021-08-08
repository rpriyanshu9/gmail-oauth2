const express = require('express')
const oauth20Route = require('./routes/oauth20')
const mailRoute = require('./routes/mail')

const app = express()
const port = process.env.PORT || 3000

// JSON parser
app.use(express.json())

// Oauth 2.0 related route
app.use('/oauth20', oauth20Route)

// Mailing related route
app.use('/mail', mailRoute)

app.listen(port, () => {
    console.log("server up and running!")
})