const express = require("express");
const multer = require("multer");
const path = require("path");
const colors= require("colors");
//Set the Storage engine
const Storage = multer.diskStorage({
destination:'./files/',
filename: function(req,file,cb){
    cb(null,file.filename + "-" + Date.now() + path.extname(file.originalname));

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
}).single("myfile");


// Check File Type
function checkFileType(file,cb){
    //Allowed ext
    const  fileTypes = /wav|mp3|mp4|ogg/;

    //Check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

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

// Public Folder
app.use(express.static('./hirzuzim-angular'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.header("Origin","http://localhost:4200");
    next();
  });

  
app.post("/addFile",(req,res)=>{
  upload(req,res,(err)=>{


      if(err){
          res.send("ERROR IN UPLOADING.  Details:  "+err);
      }
      else{
          if(req.file == undefined)
          {
              res.send("ERROR: NO FILE SELECTED");
          }
          else{

              res.render("http://localhost:4200/",{

               msg:"File Uploaded!",
               file: `files/${req.file.filename}`
            });
          }
      }

  });//end of Upload object defintion

});//end of .post()

const port = 4400;
app.listen(port,()=>{
console.log('Server started on port 4400'.yellow);
});
