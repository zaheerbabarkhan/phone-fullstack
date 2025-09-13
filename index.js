require("dotenv").config()
const express = require("express")
const morgan = require("morgan")

const Person = require("./models/person")

const app = express()

app.use(express.json())
morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static("dist"))

let persons = [
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
    }
]

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        return response.json(persons)
    })

})

app.post("/api/persons", (request, response, next) => {
    const {name, number} = request.body

    if (!name) {
        return response.status(400).send("Name is missing")
    }
    if (!number) {
        return response.status(400).send("Number is missing")
    }
    const newPerson = new Person({
        name: name,
        number: number,
    })
    newPerson.save().then(result => {
        response.status(201).json(result)
    }).catch(error => next(error))

})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        }
        else {
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.put("/api/persons/:id", (request, response, next) => {
    const { number } = request.body
    const id = request.params.id

    Person.findById(id).then(person => {
        if (!person) {
            return response.status(404).end()
        }
        person.number = number

        return person.save().then(updatedPerson => {
            response.json(updatedPerson)
        })
    })
})

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            return response.status(204).end()
        }).catch(error => next(error))

})

app.get("/info", (request, response) => {
    return response.send(`<div><p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p></div>`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === "CastError") {
        return response.status(400).send({
            error: "malformated id"
        })
    } else if (error.name === "ValidationError") {
        console.log(error)
        return response.status(400).send({
            error: error
        })
    }
}
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server listening on port ", PORT)
})