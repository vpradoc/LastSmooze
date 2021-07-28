const mongoose = require('mongoose')
const Schema = mongoose.Schema

let guildSchema = new Schema({
    _id: {type: String, required: true},
    prefix: {type: String, default: "s."},
    entrada: {
        modelo: {type: String, default: "null"},
        status: {type: Boolean, default: false},
        channel: {type: String, default: "null"},
        msg: {type: String, default: "null"},
        //--------------------EMBED--------------------//
        embedtitulo: {type: String, default: "null"},
        embedimage: {type: String, default: "null"},
        embedavatar: {type:Boolean, default: false},
        embeddescription: {type: String, default: "null"}
    },
    saida: {
        modelo: {type: String, default: "null"},
        status: {type: Boolean, default: false},
        channel: {type: String, default: "null"},
        msg: {type: String, default: "null"},
        //--------------------EMBED--------------------//
        embedtitulo: {type: String, default: "null"},
        embedimage: {type: String, default: "null"},
        embedavatar: {type:Boolean, default: false},
        embeddescription: {type: String, default: "null"}
    }
})

let Guild = mongoose.model("Guilds", guildSchema)
module.exports = Guild