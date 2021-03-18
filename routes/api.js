'use strict';
const models = require('../models');

function isEmptyObject(obj) {
    for (var i in obj) {
        if(obj.hasOwnProperty(i))  return false
    }

    return true;
}

  const getLogs = async (arr, objBody) => {
    console.log(objBody, 'objBody')

    let  log = arr;

    if(!objBody.id && !objBody.name && !objBody.price && !objBody.quantity){
      console.log(arr.length, 'length')
      return arr;
    } 

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

    return log;
}


function cutArr(arr, page=1, limit=5){
  
  let skip = (page - 1) * limit;
  let sendPart = arr.slice(skip, limit);
  return sendPart

}


module.exports = function (app) {

  let storeFiltered = {};

  app.route('/api/products')


    .get(function (req, res){
      //console.log(req, 'req')

       models.Products.find({})
        .then(products => {
          res.json({ products:products, count: products.length,page:1, limit: 5 })
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
              storeFiltered = {products: result, limit: req.body.limit || 5};
              console.log(result.length, 'length')
              let cutBit = cutArr(result, req.body.page, req.body.limit);
              res.json({ products:cutBit, count: result.length, page: req.body.page || 1, limit:req.body.limit || 5});
            })
            .catch(err => console.log(err, 'err'));
        })
       .catch( (err) => console.log(err, 'err0') );
      })

   app.route('/api/products/:page')

    .get(function (req, res){

      let pageOfLis = req.params.page;
      let cutBit = cutArr(storeFiltered.result, pageOfList, storeFiltered.limit);
        res.json({ products:cutBit, count: result.length , page: req.body.page || 1, limit: storeFiltered.limit});
 
    })


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
