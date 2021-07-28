const mongoose = require('mongoose')
const Schema = mongoose.Schema

let clientSchema = new Schema({
    _id: {type: String },
    manutenção: {type: Boolean, default: false},
    
})

let Client = mongoose.model("Client", clientSchema)
module.exports = Client