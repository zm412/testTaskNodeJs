'use strict';
const models = require('../models');

function removeDuplicates(originalArray, prop) {
     let newArray = [];
     let lookupObject  = {};

     for(let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(let i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

async function getFilteredData (arr, objBody){

  let store = [];

  let filters = {};

    for(let key in objBody){
      if(objBody[key] !== ''){
        filters[key] = objBody[key];
      }
    }


  if(isEmptyObject(filters)){
    return arr;
  }else{

    for(let key in filters){
      if(filters[key]){
        for(let i = 0; i < arr.length; i++){
          if(key != 'price' && arr[i][key] == objBody[key]){
            await store.push(arr[i]);
            //console.log(arr[i], 'arr[i]')
          }else if(key == 'price' && arr[i][key] <= Number(objBody['price'])){
            console.log(arr[i][key], 'key')
            await store.push(arr[i]);
          }
        }
      }
    }

    for(let key in filters){
      store =  store.filter(item => key != 'price' && item[key] == filters[key] || key == 'price' && item[key] <= filters[key]);
    }
    return await removeDuplicates(store, '_id');
  }

}


const getFilteredInfo = async (obj, project) => {
 console.log(obj, 'obj')

  let filters = {};

    for(let key in obj){
      if(obj[key] !== ''){
        filters[key] = obj[key]
      }
    }

  let log;

}

module.exports = function (app) {
/*
  const { MongoClient } = require("mongodb");
  const url = "mongodb://localhost:27017/";
  const client = new MongoClient(url, { useUnifiedTopology: true });
  client.connect();
  const database = client.db("dataB");
  const collection = database.collection("products");

*/
  let allProducts, filteredStore, newItem;
/*
  async function run() {
    try {

      await collection.find().toArray((err, result) => {
        if(err) console.log(err, 'err')
        allProducts = result;
        console.log(result, 'res')
      })

    } finally {
  //    await client.close();
    }
  }

*/

  async function addNew() {
    try {
      if(newItem){
        collection.insertOne(newItem, function(err, result){
          if(err) return console.log(err);
            console.log(result, 'newitem');
        });
      }
    } finally {
   //   await client.close();
    }
  }

  app.route('/products')

  /*
    .get(function (req, res){
      let jsonData = JSON.stringify(allProducts);
        //console.log(allProducts, 'all')
      console.log(jsonData, 'json')
//      res.json(jsonData)
  })
  */
  

    .post(function (req, res){
      console.log(req.body, 'req.body')
      //run();

     models.Products.find({})
        .then(products => {
          console.log(products, 'prods');

           getFilteredData(products, req.body)
            .then( (filtered) => {
              console.log(filtered, 'filtered')
              res.json(JSON.stringify(filtered))
            })
            .catch(err => console.log(err, 'err'))
 
        })
       .catch( (err) => console.log(err, 'err0') )
  
      })



  app.route('/new-item')

    .post(function (req, res){
      let {name, price, quantity} = req.body;
      console.log(req.body, 'reqbodyNew')
      
      if(name && price && quantity){
        models.Products.create({name, price, quantity})
          .then(product => res.send('New item saved'))
          .catch(err => console.log(err, 'err'))
      }else{
        res.send('Required field missing');
      }

  })

//update
  /*
    .put(function (req, res){

      let _id = req.body._id;
      if(req.body.hasOwnProperty('_id') && req.body._id !== ''){
      let newData = {};
                for(let key in req.body){
                  if(req.body[key] != ''  && key != '_id'){
                    newData[key] = req.body[key]
                  }
                }

    if(!isEmptyObject(newData)){
    newData.updated_on = new Date();
    let answ;
    // console.log(newData, 'newData')
        models.Tamplate.findOneAndUpdate({_id}, {$set: newData})
           .then(user => {
              if(user){
                answ = {  result: 'successfully updated', '_id': _id };
              }else{
                answ = {  error: 'could not update', '_id': _id };
              }
                console.log(user, 'updatedUser')
              res.json(answ)

            }).catch(err => {
              console.log(err, 'myErr');

            });
      }else{
           res.json({error: 'no update field(s) sent', '_id': _id });
      }
   }else{
     res.json({error: 'missing _id' });
   }
    })
    */
};
