const mongoose = require('mongoose')
const Schema = mongoose.Schema

let guildSchema = new Schema({
    _id: {type: String, required: true},
    prefix: {type: String, default: "s."},
})

let Guild = mongoose.model("Guilds", guildSchema)
module.exports = Guild