const express = require("express")
const morgan = require("morgan")
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
    return response.json(persons)
})

app.post("/api/persons", (request, response) => {
    const data = request.body

    if (!data.name) {
        return response.status(400).send("Name is missing")
    }
    if (!data.number) {
        return response.status(400).send("Number is missing")
    }
    const person = persons.some(person => person.name === data.name)
    if (person) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    const newPerson = {
        name: data.name,
        number: data.number,
        id: Math.floor(Math.random() * 10000000)
    }
    persons = persons.concat(newPerson)
    return response.status(201).json(newPerson)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        return response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    return response.status(204).end()
})

app.get("/info", (request, response) => {
    return response.send(`<div><p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p></div>`)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server listening on port ", PORT)
})