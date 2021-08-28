const mongoose =  require('mongoose')
const schema = mongoose.Schema

const bookschema  = new schema({
    username:{
        type:String
    },
    books:[{
        type:String
    }],
    
})

module.exports = mongoose.model('books',bookschema)
