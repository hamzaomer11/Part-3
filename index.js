const express = require('express')
const app = express()
const morgan = require('morgan')
/* 
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger) */

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

morgan(function (tokens, req, res) {
  return [
    tokens.tiny(req, res),
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

const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0

app.get('/info', (request, response) => {    
    const date = new Date()
    response.send(`<p>Phonebook has info for ${maxId} people</p> <br/><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const item = persons.find(person => person.id === id)

    if (item) {
        response.json(item)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(typeof id)
    console.log(id, 'Resource ID')
    persons = persons.filter(person => person.id !== id)
    if(persons) {
        response.status(204).end()
    }
})

app.use(express.json())

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 10**10)
    : 0
  return String(maxId)
}

app.post('/api/persons', (request, response) => {
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

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  for(const i in persons) {
    if(person.name === persons[i].name) {
      console.log(person.name, 'new person name')
      console.log(persons[i].name, 'existing person name')
      return response.status(400).json({
        error: 'name must be unique' 
      })
    }
  }

  persons = persons.concat(person)

  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)