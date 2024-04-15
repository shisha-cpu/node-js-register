const express = require("express");
const mongoose = require("mongoose")
const authComtrollers = require('./authController')
const {check} = require('express-validator')
const authMidleware = require('./midlware/authMidleware')


const PORT = process.env.PORT || 4444
const app = express()

app.use(express.json())





 mongoose
   .connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0' )
    .then(()=> console.log('DB okey'))
    .catch((err)=> console.log('db error' , err))


app.post('/login',authComtrollers.login)
app.post('/registration' ,[
    check('name' , 'введите имя ').notEmpty(),
    check('password' , 'слишком корроткий пароль').isLength({min : 3})
],  authComtrollers.register)
app.get('/users' ,authMidleware ,  authComtrollers.getUsers)



const startApp = ()=>{
    try {
       
app.listen(PORT , ()=>{
    console.log('server start');
} ) 
    } catch (error) {
        console.log(error);
    }
}

startApp()