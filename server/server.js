#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');
const path = require('path');
const { argv } = require('yargs')
const { spawn } = require('child_process');

const appDir = path.dirname(__dirname);
let projectFolder = argv.project;

if (projectFolder == null) {
  projectFolder = appDir;
  console.log(`Starting project folder at ${projectFolder}`);
} else {
  if(fs.lstatSync(projectFolder).isDirectory())
    console.log(`Starting at project folder ${projectFolder}`)
  else console.log(`Project folder ${projectFolder} invalid`);
}

// Configure Express
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(pino);

// Serve svelte app
const clientBuildPath = path.join(path.dirname(__dirname), 'client', 'public');
app.use(express.static(clientBuildPath))
app.get('/', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

// Test Path
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({greeting: `Hello ${name}!`}));
});

// Serve Files
app.get('/files', (req, res) => {
  const reqPath = path.join(projectFolder, req.query.path || '.');

  if(reqPath.startsWith("/") &&!reqPath.startsWith(projectFolder))
    res.send(JSON.stringify({error: 'permission denied'}));

  if(!fs.existsSync(reqPath)) {
    res.statusCode = 404;
    res.send(JSON.stringify({error: "404 File not found"}));
  } else fs.readdir(reqPath, (err, files) => {
    res.setHeader('Content-Type', 'application/json');
    files = files.map(file => {
      let stats = fs.lstatSync(path.join(reqPath, file));
      return {name: file, directory: stats.isDirectory(), file: stats.isFile()};
    });
    res.send(JSON.stringify(files));
  });
});

// Validate Path
const pathExists = (filePath, res) => {
  if(!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.send(JSON.stringify({error: "404 File not found"}));
    return false;
  }
  return true;
}

// Get Image File
app.get('/getImage', (req, res) => {
  let reqPath = path.join(projectFolder, req.query.path);
  if(!pathExists(reqPath, res)) return;
  let extname = path.extname(reqPath).slice(1);
  const allowedExtensions = ['jpg', 'png', 'jpeg', 'gif'];
  if (allowedExtensions.includes(extname))
    res.sendFile(path.resolve(reqPath));
  else res.send(JSON.stringify({error: `File type should be one of ${allowedExtensions}`}))
});

app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  if(cmd == null) {
    res.statusCode = 422;
    res.send(JSON.stringify({error: 'Empty command'}));
    return;
  }
  const child = spawn('ls', );
  child.stdout.setEncoding('utf8');  // for text chunks
  child.stdout.on('data', (chunk) => {
    // data from the standard output is here as buffers
  });

  // since these are streams, you can pipe them elsewhere
  // child.stderr.pipe(dest);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

// Listen for requests
const port = 3005;
app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
);
