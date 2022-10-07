const routers = require('./routers')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const sqlite3 = require ('sqlite3')
const expressSession = require('express-session')
SQLiteStore = require('connect-sqlite3')(expressSession)

app.use(expressSession({
  secret: "aivnvujfwowojd",
  saveUninitialized: false,
  resave: false,
  store: new SQLiteStore({db: 'sessions.db'})
}))

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs',
}))

app.use('/static', express.static(path.join(__dirname,'/static')))

app.use(express.urlencoded({
  extended: false
}))

app.use(function(request,response,next){
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})

app.get('/', function(request, response){
  response.render('start.hbs')
})

app.get('/start', function(request, response){
  
  response.render('start.hbs')
})

app.get('/about', function(request, response){
  response.render('about.hbs')
})

app.get('/contact', function(request, response){
  response.render('contact.hbs')
})

app.use(routers)

app.listen(8080)