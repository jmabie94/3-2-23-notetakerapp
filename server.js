const express = require('express');
const path = require('path');
const db = require('./db/db.json');
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
  
  db.push(newNote);
  const noteString = JSON.stringify(db);
      fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.title} has been written to JSON file`
          )
    );

  res.json(db)
}});

// if adding an EDIT functionality, use the app.put method

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at PORT ${PORT}`);
  });