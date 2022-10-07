const { query, response } = require('express')
const express = require('express')
const router = express.Router()
const expressSession = require('express-session')
const db = require('../db')

const MIN_BLOG_TEXT_LENGTH = 1
const SERVER_ERROR="Server error, I'm working on fixing it"

router.get('/', function(request, response){
  db.getAllSongs(function(error,songs){
    if(error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('blog.hbs',model)
    }
    else{
      const model ={
        reviews: songs
      }
      response.render('blog.hbs',model)
    }
  })
})

router.get('/create', function(request, response){
  const model ={
    errors: []
  }
  response.render('create-songs.hbs',model)
})

function getavalidationErrorForSong(song,artist,review,grade){
  const validationError = []

    if(song.length < MIN_BLOG_TEXT_LENGTH){
      validationError.push("Song name must contain at least "+MIN_BLOG_TEXT_LENGTH+" character")
    }
    if( artist.length < MIN_BLOG_TEXT_LENGTH){
      validationError.push("Artist name must contain at least "+MIN_BLOG_TEXT_LENGTH+" character")
    }
    if( review.length < MIN_BLOG_TEXT_LENGTH){
      validationError.push("Review must contain at least "+MIN_BLOG_TEXT_LENGTH+" character")
    }
    if(isNaN(grade)){
      validationError.push("Must enter a grade between 0 and 10.")
    }
    if( grade > 10 ){
      validationError.push("Max grade is 10.")
    }
    else if( grade<0 ){
      validationError.push("Grade can't be negative.")
    }
    return validationError
}

router.post('/create', function(request,response){
  const song = request.body.songname
  const artist=request.body.artistname
  const review=request.body.review
  const grade=parseInt(request.body.grade)

  const errors = getavalidationErrorForSong(song,artist,review,grade) 

    if(!request.session.isLoggedIn){
      errors.push("You have to login.")
    }

    if ( errors.length==0){
      db.createSong (song,artist,review,grade,function(error){
        if(error){
          console.log(error)
          const model ={
            SERVER_ERROR
          }
          response.render('blog.hbs',model)
        }else{
          response.redirect('/blog')
        }
      })
    }else{
      const model={
        errors,
        song,
        artist,
        review,
        grade
      }
      response.render('create-songs.hbs',model)
    }
})


router.get('/song/:id',function(request,response){
  const id = request.params.id
   
    db.getSongById (id, function(error,song){
      if(error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('blog.hbs',model)
      }else{
        const model={
          reviews:song
        }
        response.render('song.hbs', model)
      }
    })
})

router.get('/update-songs/:id', function(request,response){
  const id = request.params.id
    
    db.getUpdateSongById (id, function(error,song){
      if(error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('blog.hbs',model)
      }else{
        const model={
          reviews:song
        }
        response.render('update-songs.hbs', model)
      }
    })
})

router.post('/update-songs/:id', function(request,response){
  const id = request.params.id
  const newSong = request.body.songReview
  const newArtist = request.body.artistReview
  const newReview = request.body.myReview
  const newGrade = parseInt(request.body.gradeReview)

  const errors = getavalidationErrorForSong(newSong,newArtist,newReview,newGrade)  
    if(!request.session.isLoggedIn){
      errors.push("You have to login.")
    }

  if(errors.length == 0){ 
    db.updateSong(newSong,newArtist,newReview,newGrade,id,function(error){
      if(error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('blog.hbs',model)
      }else{
        response.redirect('/blog')
      }
    })
  }else{
    const model={
      reviews:{
        id,
        song: newSong,
        artist: newArtist,
        review: newReview,
        grade: newGrade
      },
      errors
    }
    response.render('update-songs.hbs', model)
  }
})

router.get('/delete-songs/:id' ,function(request,response){
  const id = request.params.id
  
  db.getDeleteSongById (id, function(error,song){
    if(error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('blog.hbs',model)
    }else{
      const model={
        reviews:song
      }
      response.render('delete-songs.hbs', model)
    }
  })
})

router.post('/delete-songs/:id', function(request,response){
  const id = request.params.id
  const errors = []

    if(!request.session.isLoggedIn){
      errors.push("You have to login.")
    }
    if(errors.length == 0){ 
      db.deleteSong ( id,function(error,song){
       if(error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('blog.hbs',model)
       }else{
        response.redirect('/blog')
       }
     })
    }else{
      const model={
       errors
      }
      response.render('delete-songs.hbs', model)
   }
})
  
module.exports = router