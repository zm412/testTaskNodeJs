'use strict';
const models = require('../models');

function isEmptyObject(obj) {
    for (var i in obj) {
        if(obj.hasOwnProperty(i))  return false
    }

    return true;
}

  const getLogs = async (arr, objBody) => {

    let  log = arr;

   if(!objBody.id && !objBody.name && !objBody.price && !objBody.quantity) return arr ;

    if(objBody.id){
      log = await log.filter(prod => prod._id == objBody.id);
    }

    if(objBody.name){
      log = await log.filter(prod => prod.name == objBody.name);
    }

    if(objBody.price){
      log = await log.filter(prod => prod.price <= Number( objBody.price ));
    }

    if(objBody.quantity == 'on'){
      log = await log.filter( prod => prod.quantity > 0 );
      
      console.log(log, 'logQuantity')
    }

    return log;
}


function cutArr(arr, page=1, limit=5){
  
  let skip = (page - 1) * limit;
  let store = arr.slice();
  let sendPart = store.splice(skip, limit);
  return sendPart

}


module.exports = function (app) {

  app.route('/api/products')


    .get(function (req, res){

       models.Products.find({})
        .then(products => {

          res.json({ products:products, count: products.length})
        })
       .catch( (err) => console.log(err, 'err0') )
      })

    .post(function (req, res){

       models.Products.find({})
        .then(products => {

          getLogs(products, req.body)

            .then(result => {
              let cutBit = cutArr(result, req.body.page || 1, req.body.limit || 5);
              console.log(result, 'prods')
              console.log(result[0].image.path, 'prods')
              res.json({ products:cutBit, count: result.length, page: req.body.page || 1, limit:req.body.limit || 5});
            })
            .catch(err => console.log(err, 'err'));
        })
       .catch( (err) => console.log(err, 'err0') );
      })


  app.route('/api/upload/:id')

    .post(function (req, res){

      console.log(req.params.id, 'id')

      let productId = req.params.id;
      let filedata = req.file;

    if(productId && filedata){
      models.Products.findOneAndUpdate({_id: productId}, {image: filedata})
         .then(product => {
            if(product){
                res.send("Файл загружен");
            }else{
                res.send('could not upload imige with ID ' +  productId);
            }

          }).catch(err =>  console.log(err, 'myErr'));
    }else{
      res.send("Ошибка при загрузке файла");
    }
  })
   


  app.route('/api/new-item')

    .post(function (req, res){
      let {name, price, quantity} = req.body;
      
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
            res.send('delete successful');
          }else{
            res.send('no  product exists');
          }
        })
        .catch(err => res.send('no product exists'))
    });

 app.route('/api/filter/:id')

    .get(function (req, res){
       let productId = req.params.id;

        models.Products.find({_id: productId})
        .then(product => {
          console.log(product, 'prod')
          res.json(product); 
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
        .catch(err => res.send('no product exists'))
      
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
                answ = 'successfully updated product ' + productId;
              }else{
                answ = 'could not update product with ID ' +  productId;
              }
              res.json(answ);

            }).catch(err => {
              console.log(err, 'myErr');
            });
      }else{
           res.json('no update field(s) sent');
      }
   }else{
     res.json('missing _id' );
   }

})
    
  app.route('/api/new-item')

    .post(function (req, res){
      let {name, price, quantity} = req.body;
      
      if(name && price && quantity){
        models.Products.create({name, price, quantity})
          .then(product => res.send('New item saved'))
          .catch(err => console.log(err, 'err'))
      }else{
        res.send('Required field missing');
      }
  })

};
