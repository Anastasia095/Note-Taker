const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    (console.log("TEST GET"))
});

// GET Route for a specific note
notes.get('/:note_id', (req, res) => {
    const noteid = req.params.tip_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.note_id === noteid);
            return result.length > 0
                ? res.json(result)
                : res.json('No tip with that ID');
        });
});

// DELETE Route for a specific tip
notes.delete('/:note_id', (req, res) => {
    const noteid = req.params.note_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const result = json.filter((note) => note.note_id !== noteid);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${noteid} has been deleted 🗑️`);
        });
});

// POST Route for a new note
notes.post('/', (req, res) => {
    console.log(req.body);

    const { newNote } = req.body;

    if (req.body) {
        const newNote2 = {
            newNote: 0,
            note_id: uuidv4(),
        };

        readAndAppend(newNote2, './db/db.json');
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding Note');
    }
});

module.exports = notes;
