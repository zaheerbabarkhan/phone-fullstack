const mongoose = require("mongoose")



const url = process.env.MONGODB_URI


mongoose.set("strictQuery", false)


mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phoneRegex = /^(?=.{8,}$)\d{2,3}-\d+$/;

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return phoneRegex.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, "phone number is required"]

    }
})


personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model("Person", personSchema)
