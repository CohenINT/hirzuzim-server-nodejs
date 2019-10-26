const express = require("express");
var cors = require("cors");
const hizruz  = require("./hizruz");
const colors= require("colors");










//Init app

const app = express();

//Cors
app.use(cors());




app.use('/files', express.static('files'));


app.use("/hizruz",hizruz);

///////////////////////////////////

const port = 4400;
app.listen(port,()=>{
console.log('Server started on port 4400'.yellow);
});




