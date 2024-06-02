const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const personName = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://barbarred:${password}@part3.zvfcsbt.mongodb.net/?retryWrites=true&w=majority&appName=part3`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  personName: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length<4){
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.personName} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}else{
  const person = new Person({
    personName: personName,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${personName} number ${number} to phonebook`)
    mongoose.connection.close()
    process.exit(1)
  })
}



