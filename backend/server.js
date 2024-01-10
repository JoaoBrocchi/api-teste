const express = require("express");
const db = require("./db/conn")
const Router = require("./routes/routes")
const bodyParser= require("body-parser")
const app = express();
const port =  process.env.PORT
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use("/",Router)
require('dotenv').config();
db.sync()
.then(() => {
  console.log('Modelos sincronizados com o banco de dados.');
  app.listen(3000,(req,res)=>{
    console.log("aplicação ouvindo na porta :", 3000)
    
  });

})
.catch((error) => {
  console.error('Erro ao sincronizar modelos:', error);
});

