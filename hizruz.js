const mongoose = require("mongoose");
const Schema = mongoose.Schema;



//Create Schema 
const HizruzSchema = new Schema({

   firstname:{
       type:String,
       required:true
   } ,
   lastname:{
       type:String,
       required:true
   },

   filelink:{
       type:String,
       required:true
   }


});


module.exports=Hizruz=mongoose.model("hizruz",HizruzSchema);