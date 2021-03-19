
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let _id;
  let fakeId = 'llkjlj0909lkjol';

  
  suite('Create new', function() {
  
    test('Test POST /api/new-item for create new item with required field missing (fail)', function(done) {
     chai.request(server)
          .post('/api/new-item')
          .send({name: 'NameOfProduct', price: 10})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Required field missing');
            done();
    });
    });
 
    test('Test POST /api/new-item for create new item', function(done) {
     chai.request(server)
      .post('/api/new-item')
      .send({name: 'NameOfProduct1233315', price: 10, quantity: 2})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'New item saved');
        done();
    });
  })
})


  suite('find item by NAME to got id for next testing', function() {
     
    test('Filtering by name', function(done) {
     chai.request(server)

      .post('/api/products')
      .send({name: 'NameOfProduct1233315'})
      .end(function(err, res){
  
        _id = res.body.products[0]._id;
        console.log(_id, 'id');

        assert.equal(res.status, 200);
        assert.equal(res.body.products[0].name,  'NameOfProduct1233315');
        assert.equal(res.body.products[0].price, 10);
        assert.equal(res.body.products[0].quantity, 2);
        done();
        });
    })
})


suite('update and delete', function() {

   test('Test POST /api/filter for update but without fields', function(done) {
   chai.request(server)

    .post('/api/filter/'+_id)
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.equal(res.body, 'no update field(s) sent');
      done();
      });
  })

    test('Test POST /api/products for update', function(done) {
     chai.request(server)

      .post('/api/filter/'+_id)
      .send({name: 'NameOfProduct77777'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, 'successfully updated product '+ _id);
        done();
        });
    })

    test('Test POST /api/filter for delete with fake id', function(done) {
     chai.request(server)

      .delete('/api/filter/08909809')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no product exists');
        done();
        });
    })

    test('Test POST /api/filter for delete', function(done) {
     chai.request(server)

      .delete('/api/filter/' + _id)
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'delete successful');
        done();
        });
    })
})


/*
  suite('update item ', function() {
    
    test('Test POST /api/products', function(done) {
     chai.request(server)

      .post('/api/products'+id)
      .send({id: id})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.name, 'NameOfProduct1233315');
        assert.equal(res.body.price, '10');
        assert.equal(res.body.quantity, '2');
        done();
        });
    })
})

  test('get all products', function(done){
     chai.request(server)
      .get('/api/products')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'name', 'Products in array should contain name');
        assert.property(res.body[0], 'price', 'Products in array should contain price');
        assert.property(res.body[0], '_id', 'Products in array should contain _id');
        assert.property(res.body[0], 'quantity', 'Products in array should contain quantity');
        done();
      });

  });


  suite('Routing tests', function() {


    suite('POST /api/products with title => create product object/expect product object', function() {
      
      test('Test POST /api/products with title', function(done) {
       chai.request(server)
            .post('/api/products')
            .send({name: 'NameOfProduct'})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.name, 'NameOfProduct');
              assert.property(res.body, '_id', 'Product should contain _id');
              done();
      });


      });
      
      test('Test POST /api/products with no title given', function(done) {
      chai.request(server)
            .post('/api/products')
            .send({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
              done();
      });

      });
      
    });


    suite('GET /api/products => array of products', function(){
      
    test('#example Test GET /api/products', function(done){
     chai.request(server)
      .get('/api/products')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Products in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Products in array should contain title');
        assert.property(res.body[0], '_id', 'Products in array should contain _id');
        done();
      });

  });

   
    });


    suite('GET /api/products/[id] => product object with [id]', function(){
      
      test('Test GET /api/products/[id] with id not in db',  function(done){
         chai.request(server)
          .get('/api/products/' + fakeId)
          .end(function(err, res){

            assert.equal(res.status, 200);
            assert.equal(res.text, 'no product exists');
            done();
      });
      });
      
      test('Test GET /api/products/[id] with valid id in db',  function(done){
         chai.request(server)
        .get('/api/products/' + _id)
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'NameOfProduct');
            done();
      });
      });
      
    });


    suite('POST /api/products/[id] => add comment/expect product object with id', function(){
      
      test('Test POST /api/products/[id] with comment', function(done){
        chai.request(server)
            .post('/api/products/' + _id)
            .send({comment: 'commentForTest1'})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.comments[0],  'commentForTest1');
              assert.equal(res.body._id, _id);
              done();
      });
      });

      test('Test POST /api/products/[id] without comment field', function(done){
        chai.request(server)
            .post('/api/products/' + _id)
            .send({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text,  'missing required field comment');
              done();
      });
      });

      test('Test POST /api/products/[id] with comment, id not in db', function(done){
         chai.request(server)
            .post('/api/products/' + fakeId)
            .send({comment: 'commentForTest2'})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text,  'no product exists');
              done();
      });
      });
      
    });

    suite('DELETE /api/products/[id] => delete product object id', function() {

      test('Test DELETE /api/products/[id] with valid id in db', function(done){
        chai.request(server)
            .delete('/api/products/' + _id)
            .send({_id})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text,  'delete successful');
              done();
      });
      });

      test('Test DELETE /api/products/[id] with  id not in db', function(done){
        chai.request(server)
            .delete('/api/products/' + fakeId)
            .send({_id: fakeId})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text,  'no product exists');
              done();
      });

      });

    });

  });
*/
});
