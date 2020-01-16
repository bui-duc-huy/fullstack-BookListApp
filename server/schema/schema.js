const graphql = require("graphql")
const {GraphQLObjectType,
     GraphQLString, 
     GraphQLSchema, 
     GraphQLID, 
     GraphQLInt, 
     GraphQLList, 
     GraphQLNonNull} = graphql
const _ = require('lodash')
const Book = require("../models/book")
const Author = require("../models/author")
//data test
// let books = [
//     {name: "book1", genre: "Fantasy", id: "1" ,authorID: "1"},
//     {name: "book2", genre: "Science", id: "2" ,authorID: "2"},
//     {name: "book3", genre: "Fantasy", id: "3" ,authorID: "3"},
//     {name: "book4", genre: "Fantasy", id: "4" ,authorID: "3"},
//     {name: "book5", genre: "Science", id: "5" ,authorID: "2"},
//     {name: "book6", genre: "Fantasy", id: "6" ,authorID: "3"}
// ]

// let authors = [
//     {name: "author1", age: 30, id: "1"},
//     {name: "author2", age: 20, id: "2"},
//     {name: "author3", age: 25, id: "3"}
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type:GraphQLString },
        genre: { type:GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorID})
                return Author.findById(parent.authorID)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorID: parent.id})
                return Book.find({
                    authorID: parent.id
                })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args){
                //code to get data from database
                // return _.find(books, {id: args.id})
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id:{type: GraphQLID}},
            resolve(parent, args){
                // return _.find(authors, {id: args.id})
                return Author.findById(args.id)
            }
        }, 
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author ({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorID: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorID: args.authorID
                })
                return book.save()
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})