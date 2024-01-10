const express = require("express");
const db = require("./db/conn")
const Router = require("./routes/routes")
const bodyParser= require("body-parser")
require('dotenv').config();

const app = express();
const port =  process.env.PORT

app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use("/",Router)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  
  
  next();
});

db.sync()
.then(() => {
  console.log('Modelos sincronizados com o banco de dados.');
  app.listen(port,(req,res)=>{
    console.log("aplicação aberta")
    
  });

})
.catch((error) => {
  console.error('Erro ao sincronizar modelos:', error);
});

