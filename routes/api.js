'use strict';

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

  if(objBody.name == '' && objBody.price == '' && objBody.quantity == ''){
    return arr;
  }else{

    for(let key in objBody){
      if(objBody[key]){
        for(let i = 0; i < arr.length; i++){
          if(arr[i][key] == objBody[key]){
            await store.push(arr[i]);
            //console.log(arr[i], 'arr[i]')
          }
        }
      }
    }

    return await removeDuplicates(store, '_id');;
  }

}

module.exports = function (app) {

  const { MongoClient } = require("mongodb");
  const url = "mongodb://localhost:27017/";
  const client = new MongoClient(url, { useUnifiedTopology: true });
  let allProducts, filteredStore;

  async function run() {
    try {
      await client.connect();
      const database = client.db("dataB");
      const collection = database.collection("products");

      await collection.find().toArray((err, result) => {
        if(err) console.log(err, 'err')
        allProducts = result;
        console.log(result, 'res')
      })

    } finally {
      //await client.close();
    }
  }

  run().catch(console.dir);

  app.route('/products')
    .get(function (req, res){
      let jsonData = JSON.stringify(allProducts);
        //console.log(allProducts, 'all')
      console.log(jsonData, 'json')
//      res.json(jsonData)
  })
  

  app.route('/products')
    .post(function (req, res){
      console.log(req.body, 'req.body')
     getFilteredData(allProducts, req.body)
        .then( (filtered) => {
          console.log(filtered, 'filtered')
          filteredStore = filtered;
          let jsonData = JSON.stringify(filteredStore);
          res.json(jsonData)
        })
        .catch( (err) => console.log(err, 'err0') )
      //console.log(filteredStore, 'filtered')
      
  })
};
