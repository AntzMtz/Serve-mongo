const { user, pass, colecion } = require('./keys');
const mongodb = require('mongoose');
mongodb.Promise = global.Promise;
var conMongo = 'mongodb+srv://' + user + ':' + pass + '@cluster0-mdci4.mongodb.net/' + colecion + '?retryWrites=true&w=majority';


mongodb.connect(conMongo, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useMongoClient: true
    })
    .then(() => {
        console.log(mongodb.Collection);

        console.log('DB Connected!' + user)
    })
    .catch(err => console.log("DB Connection Error:" + err.message));








module.exports = mongodb;