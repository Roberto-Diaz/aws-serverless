'use strict';
const serverless = require('serverless-http');
const express    = require('express');
const app = express();
const AWS = require('aws-sdk');
const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDB;
if(IS_OFFLINE === 'true'){
  dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http//localhost:8000'
  });
}else{
  dynamoDB = new AWS.DynamoDB.DocumentClient();  
}

app.use(express.urlencoded({extended: true}));

app.get('/',(req, res) => {
  res.send('Hola mundo con express');
});

app.post('/users', (req,res) => {
    const { userId, name } = req.body;
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId, name
      }
    }

    dynamoDB.put(params, (error) => {
      if(error){
        res.status(400).json({
          error: "No se pudo hacer el registro"
        });
      }else{  
        res.json({userId,name});
      }
    });
});

app.get('/users', (req, res) => {
  const params = {
    TableName: USERS_TABLE
  };
  
  dynamoDB.scan(params, (error,result) =>{
    if(error){
      res.status(400).json({
        error: 'No se ha podido acceder a los usuarios'
      })
    } else {
      const {Items} = result;
      res.json({
        success: true,
        message: "Usuarios listados correctamente",
        users: Items
      });
    }
  });

}); 

app.get('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    }
  }

  dynamoDB.get(params, (error,result) => {
    if(error){
      return res.status(400).json({
        error: 'No se pudo acceder al usuario'
      });
    }

    if(result.Item){
      const  {userId, name} = result.Item;
      return res.json({
        userId, name
      });      
    }else{
      res.status(400).json({error: 'Usuario no encontrado'})
    }
  })

})

module.exports.app = serverless(app);