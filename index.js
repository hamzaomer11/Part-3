const express = require('express')
const app = express()

const persons =
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})