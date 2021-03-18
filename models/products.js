let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const schemaLib = new Schema({
  name: {
    type: String,
    require: true
  }, 
  price: {
    type: Number,
    require: true
  },  

  quantity:{
    type: Number,
    require: true
   } ,

  image:{
   } 

   

}, ); 



module.exports = mongoose.model('Products', schemaLib); 
