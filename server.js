
const express = require('express');
const { fstat, writeFile } = require('fs');
const path = require('path');
const api = require('./routes/index.js');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const app = express();
var noteData = require('./db/db.json')

//connecting middleware static assets
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// // GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
 
);
app.post('/notes', (req, res) => {
  var newNote = req.body;
  newNote.id = uuidv4();
  noteData.push(newNote);
  writeFile('./db/db.json' ,  JSON.stringify(noteData, null, 4), (err) => {
    err ? console.log(err) : res.send(newNote)
  })
});



app.listen(PORT, () =>
  console.log(`Server is up  at  http://localhost:${PORT}`)
);
