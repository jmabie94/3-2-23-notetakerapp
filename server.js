const express = require('express');
const path = require('path');
let db = require('./db/db.json');
const fs = require('fs');
//uuidv4 under MIT license
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const PORT = process.env.PORT||3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});
  
app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    }
  
  // append new Note to the current db list then overwrite the db file with the new Note included
  db.push(newNote);
  const noteString = JSON.stringify(db);
      fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.title} has been written to JSON file`
          )
    );

  // respond with the updated db information
  res.json(db)
}});

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a review`);

  // Specifying the id of what is in the URL of the app.delete
  const noteId = req.params.id;

  // filter the db file for the note with the matching ID, reprint db without it
  db = db.filter(({ id }) => id !== noteId);

  // overwrite the db file with the correct note removed so that delete request works in browser
  const noteString = JSON.stringify(db);
      fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review with ID of ${noteId} has been deleted from JSON file`
          )
    );
  
  // respond with the updated db information
  res.json(db);
});

// if adding an EDIT functionality, use the app.put method
// haven't done this yet, hoping to add in tutoring session after submission

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at PORT ${PORT}`);
  });