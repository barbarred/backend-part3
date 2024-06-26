require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('post', function(req, res){
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }else{
    return null
  }
  
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

/*
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/

//route to get all persons 
app.get('/api/persons', (request, response)=>{
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// route to show some info about how many peoples has the phonebook
app.get('/info', (request, response)=>{
  Person.find({}).then(persons => {
    const numberOfPersons = persons.length
    const date = new Date()
    response.send(` <p>Phonebook has info for ${numberOfPersons} persons</p><p>${date}</p>`)
  })
})

// route to get person info by ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      next(error)
    })
})

// route to create person in the json file
app.post('/api/persons', (request, response, next) => {

  const body = request.body

  if(body.personName === undefined){
    return response.status(400).json({error: 'Person Name missing'})
  }
  /*
  const createId = () => {
    const min = 1
    const max = 10000
    return Math.floor(Math.random() * (max - min ) + min)
  }
  const id = createId()
  const person  = request.body

  const validate = () => {
    const userExist = persons.some(per => per.name === person.name)
    return userExist
  }

  if(validate()) {
    return response.status(400).json({
      error:'name must be unique'
    })
  }

  if(!person.name){
    return response.status(400).json({
      error: 'the name not be empty'
    })
  }else if(!person.number){
    return response.status(400).json({
      error: 'the number not be empty'
    })
  }else{
    person.id = id
    persons = persons.concat(person)
    response.json(person)
  }*/

  const person = new Person({
    personName: body.personName,
    number: body.number,
  })
  person.save().then(personSaved => {
    response.json(personSaved)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    'personName': body.personName,
    'number': body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(personUpdated => {
      response.json(personUpdated)
    })
    .catch(error => next(error))
})


// route to delete the person by ID
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(202).json(result)
    })
    .catch(error => {
      response.send(error.message)
    })
})

const errorHandler = (error, request, response, next) => {

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformated id'})
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})