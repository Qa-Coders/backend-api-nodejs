const _ = require('lodash')
const Recommendation = require('./recommendation')
const fullNameRegex = /^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/ 

// Gerenciamento da API REST
Recommendation.methods(['get', 'post', 'put', 'delete'])
Recommendation.updateOptions({ new: true, runValidators: true })

// Tratativa das mensagens de erro. Retorna apenas o campo com erro - Insert
Recommendation.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)
Recommendation.before('post', recommendation).before('put', recommendation)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle
  
  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({ errors })
  } else {
     next()    
  }
}

// Gerencia as mensagens de erros geradas no front-end
function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

// Serviço para contar a quantidade de registros gerados para a paginação do front-end.
Recommendation.route('count', function (req, res, next) {
  Recommendation.count(function (error, value) {
    if (error) {
      res.status(500).json({ errors: [error] })
    } else {
      res.json({ value })
    }
  })
})

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

function recommendation(req, res, next){ 
  const fullName = req.body.fullName || ''
  const description = req.body.description || ''
  const stars = req.body.stars || ''
  const situation = req.body.situation || ''
  const status = req.body.status || ''

  if (fullName == null || fullName == "") {
    return res.status(400).send({ alert: ["O campos Nome Completo é obrigatório."] })
  }

  if (!fullName.match(fullNameRegex)) {
    return res.status(400).send({ alert: ['Informe o nome e sobrenome.'] })
  }

  if (description.length > 500) {
    return res.status(400).send({ alert: ["O campo permite apenas 500 caracteres."] })
  }

  if (stars == null || stars == "") {
    return res.status(400).send({ alert: ["Informe a quantidade de estrelas que deseja classificar."] })
  }

  const newBody = new Recommendation(
    {
      fullName: fullName,
      description,
      situation,
      stars,
      status
    })
  newBody.save(err => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      res.status(201).json(newBody)
    }
  })
}

module.exports = Recommendation