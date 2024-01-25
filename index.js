const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const port = 3001;

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
morgan.token()
const app = express();
app.use(express.json());
app.use(morgan.token("post-body", (req, res) => req.method == "POST" ? JSON.stringify(req.body) : "")(":method :url :status :res[content-length] - :response-time ms :post-body"));
app.use(cors());
app.use(express.static("dist"));

app.get("/info", (request, response) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const date = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${weekdayNames[date.getDay()]} ${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC ${date.getTimezoneOffset()}</p>
    `);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id == id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.post("/api/persons", (request, response) => {
    const person = request.body;
    if (!person.name || !person.number) {
        response.status(400).json({
            error: "content missing"
        });
    } else if (persons.findIndex(person_ => person_.name == person.name) != -1) {
        response.status(400).json({
            error: "person already exists"
        });
    } else {
        person.id = Math.floor(Math.random() * 655356);
        persons = persons.concat(person);

        response.json(person);
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id != id);

    response.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});