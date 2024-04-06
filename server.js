const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

const uploadsDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.json());

// Middleware to log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Endpoint to create a file
app.post('/createFile', (req, res) => {
  const { filename, content, password } = req.body;

  // Validate input params
  if (!filename || !content) {
    return res.status(400).send('Both filename and content are required.');
  }

  // Handle password protection
  // Implement password checking logic here if needed

  const filePath = path.join(uploadsDir, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to create file.');
    }
    res.status(200).send('File created successfully.');
  });
});

// Endpoint to get list of uploaded files
app.get('/getFiles', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to get files.');
    }
    res.status(200).json(files);
  });
});

// Endpoint to get file content
app.get('/getFile', (req, res) => {
    
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  const filePath = path.join(uploadsDir, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).send('File not found.');
    }
    res.status(200).send(data);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
