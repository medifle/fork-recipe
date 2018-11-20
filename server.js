// TODO:
// R1.6 R3.2 R3.5
// pass to client JSON data instead of parsed HTML

// cleanup:
// delete node_modules directory

const express = require('express')
const app = express()
const path = require('path')
const request = require('request') //npm module for easy http requests
const exphbs = require('express-handlebars')


const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages
const API_KEY = '5e8648501d84d62c45e87fc486e8f655'
const REGEX = /^\/(recipes|index)?(?:\.html)?$/ //route all valid path to one page


// view engine setup
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')


//Middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, ROOT_DIR))) //provide static server

function getRecipes(ingredient, req, res, next) {
  request(
    `https://www.food2fork.com/api/search?q=${ingredient}&key=${API_KEY}`, { json: true },
    function(error, response, body) {
      if (error) console.log(error)
      if (!error && response.statusCode == 200) {
        res.locals.context = body
        // console.log('resLocalsf2f', res.locals) //test
        if (req.method === 'POST') {
          renderRecipe2(res, next)
        }
        if (req.method === 'GET') {
          res.render('query', body)
        }
      }
    })
}

function renderRecipe2(res, next) {
  // console.log("reach renderRecipe2", res.locals.context) //test
  hbs.render('views/partials/recipe.hbs', res.locals.context).then(function(result) {
      if (result.length) {
        // console.log('111') //test
        res.locals.recipes = result
      }
      setImmediate(next)
      // next()
    })
    .catch(next)
}

//Routes
app.get(REGEX, (req, res, next) => {
  console.log('req query:', req.query)
  if (req.query.ingredients) {
    getRecipes(req.query.ingredients, req, res, next)
    return
  }
  res.render('index')
})

// handle submit from user input
app.post('/ingredients', function(req, res, next) {
    console.log('reqbody', req.body)
    getRecipes(req.body.ingredient, req, res, next)
  },
  // renderRecipe,
  function(req, res) {
    // console.log('222') //test
    res.json({ recipes: res.locals.recipes })
  })

//Error handler
// if this middleware is triggered, it seems file not found
app.use(function(req, res) {
  res.status(404).render('404');
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
