const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const uri = `mongodb+srv://xwixwi:${password}@cluster0.fslitbh.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    // get entires

    mongoose.connect(uri);

    Person.find({}).then(result => {
        console.log("phonebook:");

        for (const entry of result) {
            console.log(`${entry.name} ${entry.number}`);
        }

        mongoose.connection.close();
    });
} else if (process.argv.length < 5) {
    console.log("give name and number as arguments");
    process.exit(1);
} else if (process.argv.length === 5) {
    // add entry

    const name = process.argv[3];
    const number = process.argv[4];

    mongoose.connect(uri);

    const person = new Person({
        name: name,
        number: number
    });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log("too many arguments");
    process.exit(1);
}