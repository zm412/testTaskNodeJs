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


module.exports = function (app) {

  app.route('/api/products')


    .get(function (req, res){
      console.log(req, 'req')

       models.Products.find({})
        .then(products => {
          res.json(products)
        })
       .catch( (err) => console.log(err, 'err0') )
      })



    .post(function (req, res){
      console.log(req.body, 'req.body')

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



  app.route('/api/new-item')

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
 
    .delete(function(req, res){
      let bookid = req.params.id;
      models.Products.deleteOne({_id: bookid})
        .then(doc => {
          console.log(doc, 'doc')
          if(doc.deletedCount === 1){
            res.send('delete successful')
          }else{
            res.send('no book exists')
          }
        })
        .catch(err => res.send('no book exists'))
      //if successful response will be 'delete successful'
    });

 app.route('/api/products/:id')

    .get(function (req, res){
      console.log(req, 'req')

       let productId = req.params.id;
        console.log(req.params, 'prodId')

        models.Products.find({_id: productId})
        .then(product => {
              res.json(product)
        })
        .catch(err => console.log(err))
 
      })


    
    .delete(function(req, res){
      let productId = req.params.id;
      console.log(productId, 'deleteId')
      models.Products.deleteOne({_id: productId})
        .then(doc => {
          console.log(doc, 'doc')
          if(doc.deletedCount === 1){
            res.send('delete successful')
          }else{
            res.send('no product exists')
          }
        })
        .catch(err => res.send('no book exists'))
      
      //if successful response will be 'delete successful'
    })


   .put(function (req, res){
      let productId = req.params.id;
      console.log(req.body, 'reqBodyPut');


      if(productId){
        let newData = {};
            for(let key in req.body){
              if(req.body[key] != ''  && key != '_id'){
                newData[key] = req.body[key]
              }
            }

    if(!isEmptyObject(newData)){
    let answ;
    // console.log(newData, 'newData')
        models.Products.findOneAndUpdate({_id: productId}, {$set: newData})
           .then(product => {
              if(product){
                answ = {  result: 'successfully updated', '_id': productId };
              }else{
                answ = {  error: 'could not update', '_id': productId };
              }
                console.log(product, 'updatedProduct')
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
      console.log(req.body, 'reqbodyNew')
      
      if(name && price && quantity){
        models.Products.create({name, price, quantity})
          .then(product => res.send('New item saved'))
          .catch(err => console.log(err, 'err'))
      }else{
        res.send('Required field missing');
      }

  })


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      models.Library.find({_id: bookid})
        .then(book => {
          console.log(book[0], 'book');
            if(book.length > 0){
              res.json(book[0])
            }else{
              res.send('no book exists')
            }
        })
        .catch(err => res.send('no book exists'))
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      console.log(req.body, 'reqBody')
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(comment){
        models.Library.findOneAndUpdate({_id: bookid},  {$push: {comments: comment}, $inc : { commentcount : 1, __v: 1 } },{       returnOriginal: false } )
          .then(foundBook => {
            if(foundBook){
              console.log(foundBook, 'foundbook')
              res.json(foundBook) 
            }else{
              res.send('no book exists')
            }
          })
          .catch(err => {
            res.send('no book exists')
          })
      }else{
        res.send('missing required field comment')
      }
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      models.Library.deleteOne({_id: bookid})
        .then(doc => {
          console.log(doc, 'doc')
          if(doc.deletedCount === 1){
            res.send('delete successful')
          }else{
            res.send('no book exists')
          }
        })
        .catch(err => res.send('no book exists'))
      
      //if successful response will be 'delete successful'
    });
 
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
