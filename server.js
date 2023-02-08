const express = require('express');
const db = require('./db/db.json');
const fs = require('fs');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const PORT = 3001;

const app = express();

const path = require('path');

//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//-----------------GET root-----------------------

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

//-----------------GET /notes-----------------------

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

//-----------------GET /note/:id-----------------------

app.get('/api/notes/:id', (req, res) => {
    if (req.params.id) {

    const noteId = req.params.id;

    for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        if (currentNote.id === noteId) {
          res.json(currentNote);
          return;
        }
      }
      res.status(404).send('Note not found');
    } else {
      res.status(400).send('Note ID not provided');
    }
});

//-----------------POST /api/notes-----------------------

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const {title, text} = req.body;

    if(req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note Added Successfully!');
    } else {
        res.errored('Error Adding Note!');
    }
});

//---------------------------Listener----------------------

app.listen(PORT, () => {
    console.log(`note-taker app listening at http://localhost:${PORT}`);
})