'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const config = require('./config');
let mongoose = require('mongoose');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const models = require('./models');

const url = "mongodb://localhost:27017/";

/*
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

//let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
mongoClient.connect(function(err, client){

    const db = client.db("dataB");
    const collection = db.collection("products");
    collection.insertMany(users, function(err, result){

        if(err){
            return console.log(err);
        }
        console.log(result.ops);
        client.close();
    });
});

*/


const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
    
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//bd


const db = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', process.env.IS_PRODUCTION);

    mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Db connection closed'))
    .on('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(url, {
              useNewUrlParser: true,
              useFindAndModify: false,
              useUnifiedTopology: true
            });
  });
}

db().
  then(info => {
  console.log((`Connected to ${info.host}:${info.port}/${info.    name}`))

}).catch( () => {
  console.error('Unable to connect to database');
  process.exit(1)
});



//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        let error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing

