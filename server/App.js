const express = require("express")
const graphqlHTTP = require("express-graphql")
const app = express()
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require("cors")

// allow cross-origin requests
app.use(cors())

// connect MongoLab database
mongoose.connect('mongodb+srv://duchuy:24122000@cluster0-i92zv.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log("connected to database")
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("now listening for requests on port 4000")
})

