const mongoose = require('mongoose')
const args = require("args-parser")(process.argv)
mongoose.Promise = require("bluebird")

if (args.production)
    module.exports = mongoose.connect('mongodb://nome_banco:senha@servidor.com.br:27017/usuario' ) // Umbler
else
    mongoose.set('strictQuery', false)
    module.exports = mongoose.connect('mongodb://172.0.0.1:27017/banco_dados', {useNewUrlParser: true})    

mongoose.Error.messages.general.required = "O campo '{PATH}' é obrigatório."
mongoose.Error.messages.Number.min = "O '{PATH}' informado é menor que o limite mínimo de '{MIN}'."
mongoose.Error.messages.Number.max = "O '{PATH}' informado é maior que o limite máximo de '{MAX}'."
mongoose.Error.messages.String.enum = "O '{VALUE}' não é válido para o campos '{PATH}'."