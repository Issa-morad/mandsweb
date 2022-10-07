const express = require('express')
const mainRouter = express.Router()
const expressSession = require('express-session')
const { route } = require('./loginandlogout-router')

mainRouter.use(expressSession({
    secret: "aivnvujfwowojd",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore({db: 'sessions.db'})
}))

mainRouter.use(function(request,response,next){
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})

// Routers
mainRouter.use('/comment', require('./comments-router'))
mainRouter.use('/blog', require('./blogs-router'))
mainRouter.use('/request', require('./requests-router'))
mainRouter.use('/login', require('./loginandlogout-router'))

mainRouter.use(function (req, res, next) {
    res.send('404')
})

module.exports = mainRouter