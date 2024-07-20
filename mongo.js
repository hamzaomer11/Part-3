const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackuser:${password}@cluster0.jrqww5b.mongodb.net/personApp?
  retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personsSchema)

const person = new Person({
  name: 'Leo Messi',
  number: '01234',
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
})