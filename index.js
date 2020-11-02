const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const gql = require('graphql-tag')
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")
const { MONGOBD } = require("./config.js")


const server = new ApolloServer({
    typeDefs, 
    resolvers
})

mongoose.connect(MONGOBD, { useNewUrlParser: true })
    .then(() => {
        console.log("mongo connected")
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`server running at ${res.url}`)
    })

