const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const colors= require("colors");

const path = require("path");

const router = require("express").Router();
const multer = require("multer");

const domainLocation = "www.moshe-cohen.biz/apps/apps";
const localLocation = "C:\\Users\\moshe\\source\\repos";
const currentLocation = localLocation;






//Set the Storage engine
const Storage = multer.diskStorage({
    destination:'./files/',
    filename: function(req,file,cb){
        

        cb(null,file.originalname + "-" + Date.now() + path.extname(file.originalname));
    
    }
    });


//Init upload to files folder
const sizeLimit = 1024*1024*5;
const upload = multer({

    storage:Storage,
    limits:{fileSize:sizeLimit},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).array("myfile");


// Check File Type
function checkFileType(file,cb){
    //Allowed ext
    const  fileTypes = /wav|mp3|mp4|ogg/;

    //Check ext
  
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    //Link to location
     generatedLink = currentLocation+"\\hirzuzim-server-nodejs\\files\\"+file.originalname;

   
    //Check mime
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname){
       return cb(null,true);
    }else{
        cb("AUDIO FILE ONLY");
    }

}


//DB Config
const db= require("./config/keys").mongoURI;


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





    function insertQuery(_data)
    {
    //Connect MongoDB
    mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true}).then(() =>{
        console.log("MongoDB Database Connected.".bgBlue.yellow);
        //TODO: insert query

          console.log('_data "inserted".');

        //
       }).catch(err=>console.log(err));
       
    
    }

    




// @route POST /hizruz
// @description Add new hizruz
// @access Public
router.post("/",(req,res)=>{
    upload(req,res,(err)=>{
  
        if(err){
            console.log(`error in uploading, details:  ${err.field}`.red);
            res.end("ERROR IN UPLOADING.  Details:  "+err);
        }
        else{ 
            if(req.files == undefined)
            {
              console.log("error- no file selected".red);
               
                res.end("ERROR: NO FILE SELECTED");
            }
            else{
                console.log(`File Uploaded Successfully!`.yellow);
                //TODO: insert into MongoDB database the fullname and link to the location.
                 

                //  console.log(req.body["firstname"]);
                //   console.log(req.files.forEach(...))

                // let _data = {
                //     fileLink:[
                //      "wwww.moshe-cohen.biz\4.mp3",
                //       "www.moshe-cohen.biz\2.mp3"            
                //               ],
                //     firstname="moshe",
                //     lastname:"cohen"
                // };
                //insertQuery(_data);
                 
                
  
                
                              res.redirect("http://localhost:4200/");
            }
        }
  
    });//end of Upload object defintion
  
  });//end of .post()


  //@route GET /hizruz
  //@description get all data
  //@access public
  router.get("/",(req,res)=>{
   console.log("get all data");
   res.end();
  });

  
  //@route GET /hizruz/:firstname/:lastname
  //@description get speicific data
  //@access public
  router.get("/:firstname/:lastname",(req,res)=>{
      console.log("get specific data");
    res.end();
  });
 
 
  //@route DELETE /hizruz/:firstname/:lastname 
  //@description delete specific data 
  //@access only to Admin or Owner
  router.delete("/:firstname/:lastname",(req,res)=>{

    console.log("delete specific data");
    res.end();
  });


module.exports=router;