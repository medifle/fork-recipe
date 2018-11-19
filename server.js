
// TODO:
// submit button: ajax, get method, json data type
// handlebar render
// f2f logic
// R1.6 R2.1 R3.1 R3.2 R3.3 R3.4 R3.5 R3.6 R3.7
//

// test:
// post method xhr

// cleanup:
// uninstall morgan
// delete node_modules directory

const express = require('express')
const app = express()
const path = require('path')
const request = require('request') //npm module for easy http requests
const logger = require('morgan') //test

const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public'; //root directory for our static pages
const API_KEY = '5e8648501d84d62c45e87fc486e8f655'
const REGEX = /^\/(recipes|index)?(?:\.html)?$/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//Middleware
// app.use(logger('dev'))  //test
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, ROOT_DIR))) //provide static server

//Routes
app.get(REGEX, function(req, res) {
  console.log('req:',req.query)
  res.sendFile(path.join(__dirname, ROOT_DIR, 'index.html'))
})

//Error handler
// if this middleware is triggered, it seems file not found
app.use(function(req, res) {
//   res.status(404).render('404');
  res.status(404).send('404 NOT FOUND');

});

//start server
app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
  console.log(`To Test:`)
  console.log(`http://localhost:3000/recipes.html`)
  console.log(`http://localhost:3000/recipes`)
  console.log(`http://localhost:3000/index.html`)
  console.log(`http://localhost:3000/`)
  console.log(`http://localhost:3000`)
})
