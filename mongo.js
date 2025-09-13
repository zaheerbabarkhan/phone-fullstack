const mongoose = require("mongoose")


if (process.argv.length < 3) {
    console.log("please provide the password")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

mongoose.set('strictQuery', false)

const url = `mongodb+srv://dingdong:${password}@cluster0.rm7buhk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})



const Person = mongoose.model("Person", personSchema)


const savePerson = (name, number) => {
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}


const findAllPerson = () => {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close()

    })
}

if (name && number) {
    savePerson(name, number)
}
else {
    findAllPerson()
}