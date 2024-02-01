const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

console.log(`connecting to ${uri}`);
mongoose.connect(uri).then(result => {
    console.log("connected to MongoDB");
}).catch(error => {
    console.log(`error connecting to MongoDB: ${error.message}`);
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: value => (value.length >= 8 && /\d{2,3}-\d+$/.test(value)),
            message: props => `${props.value} is not a valid phone number`
        }
    }
});
personSchema.set("toJSON", {
    transform: (document, result) => {
        result.id = result._id.toString();
        delete result._id;
        delete result.__v;
    }
});

module.exports = mongoose.model("Person", personSchema);