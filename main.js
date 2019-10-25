const express = require("express");
const multer = require("multer");
const path = require("path");
const colors= require("colors");
var cors = require("cors");

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
}).array("myfile");


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

app.use(cors());



// // Public Folder
// app.use(express.static('./hirzuzim-angular'));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PATCH, DELETE, OPTIONS"
//     );
//     res.header("Origin","http://localhost:4200");
//     next();
//   });

app.use('/files', express.static('files'));


app.post("/hizruz",(req,res)=>{
  upload(req,res,(err)=>{


      if(err){
          console.log(`error in uploading, details:  ${err.field}`.red);
          console.log(err);
          console.log("___req___");
          console.log(req);
          console.log("____req_____");
          res.end("ERROR IN UPLOADING.  Details:  "+err);
      }
      else{
          if(req.file == undefined)
          {
            console.log("error- no file selected".red);

              res.end("ERROR: NO FILE SELECTED");
          }
          else{
              console.log("sucess!".yellow);
                            res.redirect("http://localhost:4200/");
          }
      }

  });//end of Upload object defintion

});//end of .post()

const port = 4400;
app.listen(port,()=>{
console.log('Server started on port 4400'.yellow);
});
