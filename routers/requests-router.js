const express = require('express')
const router = express.Router()
const expressSession = require('express-session')
const db = require('../db')

const MIN_REQUEST_TEXT_LENGTH = 1
const SERVER_ERROR="Server error, I'm working on fixing it"

router.get('/', function(request, response){
  
  db.getAllRequests (function(error,requests){
    if (error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
    }else{
      const model={
        gradeRequests: requests
      }
      response.render('request.hbs',model)
    }
  })
})

function getavalidationErrorForRequest(name,song,artist){
  const validationError = []
  
  if(name.length < MIN_REQUEST_TEXT_LENGTH){
    validationError.push("Name must contain at least "+MIN_REQUEST_TEXT_LENGTH +" character")
  }
  if(song.length < MIN_REQUEST_TEXT_LENGTH){
    validationError.push("Song name must contain at least "+MIN_REQUEST_TEXT_LENGTH +" character")
  }
  if(artist.length < MIN_REQUEST_TEXT_LENGTH){
    validationError.push("Artist name must contain at least "+MIN_REQUEST_TEXT_LENGTH +" character")
  }
  return validationError
}

router.post('/', function(request,response){
  const name = request.body.name
  const song= request.body.song
  const artist=request.body.artist

  const errors = getavalidationErrorForRequest(name,song,artist) 

  if ( errors.length==0){
    db.createRequest(name,song,artist,function(error){
      if(error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('request.hbs',model)
      }else{
        response.redirect('/request')
      }
    })
  }else{
    db.getAllRequests (function(error,requests){
      if (error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
      }else{
        const model={
          errors,
          name,
          song,
          artist,
          gradeRequests: requests
        }
        response.render('request.hbs',model)
      }
    })
  }
})
      
router.get('/delete-request/:id', function(request,response){
  const id = request.params.id

  db.getDeleteRequestById(id,function(error,requests){
    if (error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('request.hbs',model)
    }else{
      const model={
        gradeRequests: requests
      }
      response.render('delete-request.hbs',model)
    }
  })
})

router.post('/delete-request/:id',function(request,response){
  const id = request.params.id
  const errors = []
  
  if(!request.session.isLoggedIn){
      errors.push("You have to login.")
  }

  if(errors.length == 0){ 
    db.deleteRequest(id,function(error,requests){
      if(error){
        console.log (error)
        const model ={
          SERVER_ERROR
        }
        response.render('request.hbs',model)
      }else{
        response.redirect('/request')
      }
    })
  }else{
    const model={
      errors
    }
    response.render('delete-request.hbs', model)
  }
})

router.get('/update-request/:id' ,function(request,response){
  const id = request.params.id
  
  db.getUpdateRequestById (id,function(error,requests){
    if (error){
      console.log(error)
      const model ={          
        SERVER_ERROR
      }
      response.render('request.hbs',model)
    }else{
      const model={
        gradeRequests: requests
      }
      response.render('update-request.hbs',model)
    }
  })
})

router.post('/update-request/:id', function(request,response){
  const id = request.params.id
  const newName = request.body.nameU
  const newSong = request.body.songU
  const newArtist = request.body.artistU

  const errors = getavalidationErrorForRequest(newName,newSong,newArtist)

  if(!request.session.isLoggedIn){
      errors.push("You have to login.")
  }
   
  if(errors.length == 0){ 
    db.updateRequest (newName,newSong,newArtist,id,function(error){
      if (error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('request.hbs',model)
      }else{
        response.redirect('/request')
      }
    })      
  }else{
    const model={
      gradeRequests:{
        id,
        name: newName,
        song: newSong,
        artist: newArtist
      },
      errors
    }
    response.render('update-request.hbs', model)      
  }   
})
   
module.exports = router