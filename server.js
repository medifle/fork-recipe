
const express = require('express')
const app = express()
const path = require('path')
const request = require('request') //npm module for easy http requests
const exphbs = require('express-handlebars')

const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages
const REGEX = /^\/(recipes|index)?(?:\.html)?$/ //route all valid path
const API_KEY = ['c043a325cbd65a83c55a08416ec28e87', '5e8648501d84d62c45e87fc486e8f655', '5b60b4de639dd928b9b2e2611712ccf2'] //free keys, please don't abuse them
let api_counter = 0

// View Engine setup
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')


// Middleware
app.use(express.json()) //get body payload for post method in express
app.use(express.static(path.join(__dirname, ROOT_DIR))) //provide static server

function getRecipes(ingredient, req, res) {
  request(
    `https://www.food2fork.com/api/search?q=${ingredient}&key=${API_KEY[api_counter]}`, { json: true },
    function(error, response, body) {
      if (error) console.log(error, body)
      if (!error && response.statusCode == 200) {
        // if a key usage runs out, try another key
        if (body.error === 'limit') {
          if (api_counter !== API_KEY.length-1) {
            api_counter += 1
            console.log('try another key', API_KEY[api_counter], api_counter)
            getRecipes(ingredient, req, res)
            return
          }
        }
        if (req.method === 'GET') {
          res.render('query', body)
        }
        if (req.method === 'POST') {
          res.json(body)
        }
      }
    })
}

// Routes
app.get(REGEX, (req, res) => {
  console.log('req query:', req.query)
  if (req.query.ingredients) {
    getRecipes(req.query.ingredients, req, res)
    return
  }
  res.render('index')
})
// handle user submit from Go button
app.post('/ingredients', function(req, res) {
    console.log('reqbody', req.body)
    getRecipes(req.body.ingredient, req, res)
  })

// Error handler
// if this middleware is triggered, it seems file not found
app.use(function(req, res) {
  res.status(404).render('404');
});

// Start server
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
