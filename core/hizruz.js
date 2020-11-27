const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const colors = require("colors");
const fs = require('fs');


const path = require("path");

const router = require("express").Router();
const multer = require("multer");
const { request } = require("express");
const { Buffer } = require("buffer");

const domainLocation = "www.moshe-cohen.biz/apps/apps";
const localLocation = "C:\\Users\\moshe\\source\\repos";
const currentLocation = localLocation;

//Set the Storage engine
const Storage = multer.diskStorage({
  destination: "./files/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//Init upload to files folder
const sizeLimit = 1024 * 1024 * 5;
const upload = multer({
  storage: Storage,
  limits: { fileSize: sizeLimit },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array("myfile");

// Check File Type
function checkFileType(file, cb) {
  //Allowed ext
  const fileTypes = /wav|mp3|mp4|ogg/;

  //Check ext

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  //Link to location
  generatedLink =
    currentLocation + "\\hirzuzim-server-nodejs\\files\\" + file.originalname;

  //Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("AUDIO FILE ONLY");
  }
}

//DB Config
const db = require("../config/keys").mongoURI;

//Create Schema
// const Hizruz = new Schema({
//   firstname: {
//     type: String,
//     required: true
//   },
//   lastname: {
//     type: String,
//     required: true
//   },

//   filelink: {
//     type: String,
//     required: true
//   }
// });

var cb = (err) => {
  if (err) throw err;
  console.log("OK");
}
async function saveFile(bytesStream) {
  //await fs.writeFile('audioFile.mp3', bytesStream, cb);
  await fs.appendFile('AudioFile.mp3', bytesStream, cb);
  console.log("finished?");

}


function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


function insertQuery(_data) {
  //Connect MongoDB
  //  mongoose.connection.db.collection()

  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => {
      console.log("MongoDB Database Connected.".bgBlue.yellow);
      //TODO: insert query

      mongoose.Hizruzim.insert({
        firstName: _data.firstname,
        lastName: _data.lastname,
        fileLink: _data.filelink
      });
      console.log('_data "inserted".');

      //
    })
    .catch(err => console.log(err))
    .finally(() => {
      mongoose.disconnect();
      console.log("DB connection disconneted.");
    });
}



router.post("/upload", async (req, res, next) => {

  let byteStream = new Array;
  console.log("Reached /hirzuz/upload");

  req.on('data', async (chunk) => {

    console.log("chunk")
    console.log(typeof chunk);
    console.log(chunk);
    byteStream.push(chunk);

  });

  req.on('end', async () => {
    try {

      let newfile = Buffer.concat(byteStream);
      await saveFile(newfile);
      res.end(typeof data);

    }
    catch (err) {
      res.statusCode = 400;
      console.log(err.message);
      return res.end(`error: ${err.message}`);
    }
  });





});


// @route POST /hizruz
// @description Add new hizruz
// @access Public
// router.post("/", (req, res) => {
//   upload(req, res, err => {
//     if (err) {
//       console.log(`error in uploading, details:  ${err.field}`.red);
//       res.end("ERROR IN UPLOADING.  Details:  " + err);
//     } else {
//       if (req.files == undefined) {
//         console.log("error- no file selected".red);

//         res.end("ERROR: NO FILE SELECTED");
//       } else {
//         console.log(`File Uploaded Successfully!`.yellow);
//         //TODO: insert into MongoDB database the fullname and link to the location.

//         //  console.log(req.body["firstname"]);
//         //   console.log(req.files.forEach(...))

//         let _data = {
//           filelink: [req.files[0]],
//           firstname: req.body["firstname"],
//           lastname: req.body["lastname"]
//         };
//         insertQuery(_data);

//         res.redirect("http://localhost:4200/");
//       }
//     }
//   }); //end of Upload object defintion
// }); //end of .post()

//@route GET /hizruz
//@description get all data
//@access public
router.get("/", (req, res, next) => {
  console.log("get all data");
  next();
});

//@route GET /hizruz/:firstname/:lastname
//@description get speicific data
//@access public
router.get("/:firstname/:lastname", (req, res, next) => {
  console.log("get specific data");
  next();
});

//@route DELETE /hizruz/:firstname/:lastname
//@description delete specific data
//@access only to Admin or Owner
router.delete("/:firstname/:lastname", (req, res) => {
  console.log("delete specific data");
  res.end();
});

module.exports = router;
