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

  if(objBody){
    for(let key in objBody){
      if(objBody[key] !== ''){
        filters[key] = objBody[key];
      }
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

  const getLogs = async (arr, objBody) => {

    let  log = arr;

    if(!objBody.id && !objBody.name && !objBody.price && !objBody.quantity) return arr;
    if(objBody._id){
      log = await log.filter(prod => prod._id == objBody.id);
    }

    if(objBody.name){
      log = await arr.filter(prod => prod.name == objBody.name);
    }

    if(objBody.price){
      console.log(objBody.price, 'objPrice')
      log = await arr.filter(prod => prod.price <= Number( objBody.price ));
    }

    if(objBody.quantity == 'on'){
      log = await log.filter( prod => prod.quantity < 0 );
    }

    //console.log(log, 'loggg')
    return log;
}


async function getFilteredData (arr, objBody){

  let store = [];

  let filters = {};

  if(objBody){
    for(let key in objBody){
      if(objBody[key] !== '' && key != 'limit'){
        filters[key] = objBody[key];
      }
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


module.exports = function (app) {

  app.route('/api/products')


    .get(function (req, res){
      //console.log(req, 'req')

       models.Products.find({})
        .then(products => {
          res.json({ products:products, count: products.length })
        })
       .catch( (err) => console.log(err, 'err0') )
      })



    .post(function (req, res){
      console.log(req.body, 'req.body')

       models.Products.find({})
        .then(products => {
          //console.log(products, 'prods');

          getLogs(products, req.body)
            .then(result => {
              res.json({ products:result, count: result.length })
            })
            .catch(err => console.log(err, 'err'))
        })
       .catch( (err) => console.log(err, 'err0') )
      })


  /*
    .get(async function (req, res){
      console.log(req, 'req')

        const { page = 1, limit = 5, name, price} = req.query;


       try {

        const  productsFiltered = await models.Products.find({name, price })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();

        const count = await models.Products.countDocuments();

        res.json({
          productsFiltered,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        });
        } catch (err) {
          console.error(err.message);
        }
      })

        

    .get(async function (req, res){

      let page = req.params.page || 1;
      let limit = req.body.limit || 3;
      let count;
      await models.Products.find({})
          .then(docs =>  count = docs.length )
          .catch(err => console.log(err, 'err'))
      ;
      console.log(count, 'count')

      await models.Products.aggregate([
            { $match: {} },    
            { $skip: (page - 1) * limit },   
            { $limit:  limit},
        ])  

        .then(products => {
          console.log(count, 'counthere')
          res.json({ products, count })
        })
       .catch( (err) => console.log(err, 'err0') )
      })

*/
/*
  .post(async function (req, res){
    let name = req.body.name;
    let obj = {};
    
    if(req.body._id){
      obj._id = req.body.id;
    }
    
   if(req.body.name != ''){
      obj.name = req.body.name
    }
    
   if(req.body.price != ''){
      obj.price = { $lte: Number( req.body.price ) }
    }

    let page = req.body.page;
    let limit = req.body.limit;
      console.log(req.body, 'req.body')
    console.log(obj, 'obj')

    console.log(req.body.name, 'name')


       try {

        const  productsFiltered = await models.Products.find(obj)
          
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec()
         ;

         for(let key of productsFiltered){
          console.log(key, 'key')
         }

        const count = await models.Products.countDocuments();

        res.json({
          productsFiltered,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        });
        } catch (err) {
          console.error(err.message);
        }  
        })

    .post(function (req, res){
      console.log(req.body, 'req.body')
      let page = req.params.page || 1;
      let limit = req.body.limit || 3;
      let count = models.Products.countDocuments();
      console.log(count, 'count')

      models.Products.aggregate([
            { $match: {} },    
            { $skip: (page - 1) * limit },   
            { $limit:  limit - 1},
        ])  

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


*/

  app.route('/api/new-item')

    .post(function (req, res){
      let {name, price, quantity} = req.body;
      //console.log(req.body, 'req.body.new')
      
      if(name && price && quantity){
        models.Products.create({name, price, quantity})
          .then(product => res.send('New item saved'))
          .catch(err => console.log(err, 'err'))
      }else{
        res.send('Required field missing');
      }

    
  })
 
    .delete(function(req, res){
      let bookid = req.params.id;
      models.Products.deleteOne({_id: bookid})
        .then(doc => {
          if(doc.deletedCount === 1){
            res.send('delete successful')
          }else{
            res.send('no book exists')
          }
        })
        .catch(err => res.send('no book exists'))
      //if successful response will be 'delete successful'
    });

 app.route('/api/filter/:id')

    .get(function (req, res){

       let productId = req.params.id;

        models.Products.find({_id: productId})
        .then(product => {
              res.json(product)
        })
        .catch(err => console.log(err))
 
      })


    
    .delete(function(req, res){
      let productId = req.params.id;
      models.Products.deleteOne({_id: productId})
        .then(doc => {
          if(doc.deletedCount === 1){
            res.send('delete successful')
          }else{
            res.send('no product exists')
          }
        })
        .catch(err => res.send('no book exists'))
      
      //if successful response will be 'delete successful'
    })


   .post(function (req, res){
      let productId = req.params.id;


      if(productId){
        let newData = {};
            for(let key in req.body){
              if(req.body[key] != ''  && key != '_id'){
                newData[key] = req.body[key]
              }
            }

    if(!isEmptyObject(newData)){
    let answ;
        models.Products.findOneAndUpdate({_id: productId}, {$set: newData})
           .then(product => {
              if(product){
                answ = {  result: 'successfully updated', '_id': productId };
              }else{
                answ = {  error: 'could not update', '_id': productId };
              }
              res.json(answ)

            }).catch(err => {
              console.log(err, 'myErr');

            });
      }else{
           res.json({error: 'no update field(s) sent', '_id': productId });
      }
   }else{
     res.json({error: 'missing _id' });
   }
    })
    
  app.route('/api/new-item')

    .post(function (req, res){
      let {name, price, quantity} = req.body;
      //console.log(req.body, 'reqbodyNew')
      
      if(name && price && quantity){
        models.Products.create({name, price, quantity})
          .then(product => res.send('New item saved'))
          .catch(err => console.log(err, 'err'))
      }else{
        res.send('Required field missing');
      }

  })

};
