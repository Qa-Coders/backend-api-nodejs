const { find } = require('lodash')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const restful = require('node-restful')
const mongoose = restful.mongoose

const recommendationSchema = new mongoose.Schema({
   fullName: { type: String, required: true },
   description: { type: String, required: false },
   stars: { type: Number, required: false },
   situation: { type: String, required: true },
   status: { type: Boolean, required: true },
})

recommendationSchema.plugin(beautifyUnique)

module.exports = restful.model('Recommendation', recommendationSchema )