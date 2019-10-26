const express = require("express");
const multer = require("multer");
const path = require("path");
const colors= require("colors");
var cors = require("cors");
const mongoose = require("mongoose");


const domainLocation = "www.moshe-cohen.biz/apps/apps";
const localLocation = "C:\\Users\\moshe\\source\\repos";
const currentLocation = localLocation;

//DB Config
const db= require("./config/keys").mongoURI;

//Connect MongoDB
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true}).then(() =>{
 console.log("MongoDB Database Connected.".bgBlue.yellow);
}).catch(err=>console.log(err));



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



//Init app

const app = express();

app.use(cors());




app.use('/files', express.static('files'));

//TODO: put it in a seperate hizruzim.js file
//[un comment this once ready]
//app.use("/hizruzim",hizruzim);
app.post("/hizruz",(req,res)=>{
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
              console.log("sucess!".yellow);
              //TODO: insert into MongoDB database the fullname and link to the location.

               
              //

            //  console.log(req.body["firstname"]);
              
                            res.redirect("http://localhost:4200/");
          }
      }

  });//end of Upload object defintion

});//end of .post()
///////////////////////////////////

const port = 4400;
app.listen(port,()=>{
console.log('Server started on port 4400'.yellow);
});




