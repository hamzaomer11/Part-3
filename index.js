require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const errorHandler = require('./models/errorhandling')

app.use(cors())

app.use(express.static('dist'))


morgan.token('body', function (req) {
    return JSON.stringify(req.body)
})

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
})

app.use(morgan('tiny'))
app.use(morgan(':body'))

let persons =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": "5",
      "name": "John West", 
      "number": "00-11-64231111"
    },
    {
      "id": "6",
      "name": "Jake Kyle", 
      "number": "00-11-64551111"
    }
]


/* Valid for Exercise 3.2 - Invalid for Exercise 3.18 */
const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0

app.get('/info', (request, response) => {    
    /* Valid for Exercise 3.2 - Invalid for Exercise 3.18 */
    /* const date = new Date()
    response.send(`<p>Phonebook has info for ${maxId} people</p> <br/><p>${date}</p>`) */
    Person.countDocuments({})
      .then(result => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${result} people</p> <br/><p>${date}</p>`)
      })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    console.log(typeof result, 'result: data type')
    response.json(result)
})
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
      Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.use(express.json())

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 10**10)
    : 0
  return String(maxId)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    }),
    console.log(response.status(400))
  }

  if(!body.number) {
    return response.status(400).json({
      error: 'number missing'
    }),
    console.log(response.status(400))
  }

  /*  Valid for Exercise 3.5 - Invalid for Exercise 3.13 */
  const person = new Person({
    /*id: generateId(),*/
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

  /* - Valid for Exercise 3.6 - Invalid for Exercise 3.14 */
  for(const i in persons) {
    if(person.name === persons[i].name) {
      console.log(person.name, 'new person name')
      console.log(persons[i].name, 'existing person name')
      return response.status(400).json({
        error: 'name must be unique' 
      })
    }
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  console.log({name, number})

  /* Valid for Exercise 3.17 **

  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  console.log(person, 'person: data type') 
  */

  Person.findByIdAndUpdate(request.params.id, {name, number}, 
    { new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)