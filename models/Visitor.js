const {Schema , model} = require('mongoose')


const Visitor = new Schema({
    name  : {
        type : String ,
        require : true , 
        unique  : true
    },
    password :{
        type : String ,
        require : true , 
    },
    roles: [{
        type : String ,
        ref :'Role'
    }]
})

module.exports = model('Visitor' , Visitor)