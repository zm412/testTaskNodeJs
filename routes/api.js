'use strict';

module.exports = function (app) {

  const { MongoClient } = require("mongodb");
  const url = "mongodb://localhost:27017/";
  const client = new MongoClient(url, { useUnifiedTopology: true });
  let allProducts;

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
        console.log(allProducts, 'all')
      console.log(jsonData, 'json')
      res.json(jsonData)
    })
  
};
