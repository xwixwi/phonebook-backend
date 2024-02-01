require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person.js");

morgan.token();
const app = express();
app.use(express.json());
app.use(morgan.token("post-body", (req) => req.method === "POST" ? JSON.stringify(req.body) : "")(":method :url :status :res[content-length] - :response-time ms :post-body"));
app.use(cors());
app.use(express.static("frontend-dist"));

app.get("/info", (request, response) => {
    Person.find({}).then(persons => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const date = new Date();
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${weekdayNames[date.getDay()]} ${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC ${date.getTimezoneOffset()}</p>
        `);
    });
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    }).catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    }).catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: "query"}).then(updatedPerson => {
        response.json(updatedPerson);
    }).catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end();
    }).catch(error => next(error));
});

// unknown endpoint
app.use((request, response) => {
    response.status(404).send({
        error: "unknown endpoint"
    });
});

// error handler
app.use((error, request, response, next) => {
    console.error(error.message);

    switch (error.name) {
    case "CastError": return response.status(400).send({
        error: "malformatted id"
    });
    case "ValidationError": return response.status(400).json({
        error: error.message
    });
    }

    next(error);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});