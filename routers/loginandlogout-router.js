const { query, response } = require('express')
const express = require('express')
const router = express.Router()
const expressSession = require('express-session')
SQLiteStore = require('connect-sqlite3')(expressSession)
const bcrypt = require('bcryptjs')
const db = require('../db')

const SERVER_ERROR="Server error, I'm working on fixing it"

router.get('/', function(request, response){
    response.render('login.hbs')
})

router.post('/', function(request,response){
    const enteredUsername = request.body.username
    const enteredPassword = request.body.password
    const errors = []
  
    db.postLogin (function(error,adminDatabase){
        if(error){
            console.log(error)
        }else{
            const hashPassword = adminDatabase.password
            const correctUsername = adminDatabase.username
            const resultComparePassword = bcrypt.compareSync(enteredPassword,hashPassword)
            
            if (enteredUsername == correctUsername && resultComparePassword){
                request.session.isLoggedIn = true
                response.redirect('/start')
            }else{
                errors.push("Wrong password or username")
                const model={
                    errors
                }
                response.render('login.hbs',model)
            }
        }
    })
})
  
router.get('/logout', function(request,response){
    response.render('logout.hbs')
})
  
router.post('/logout', function( request, response){
    request.session.isLoggedIn = false
    response.redirect("/start")
})

module.exports = router