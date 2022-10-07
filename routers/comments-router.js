const express = require('express')
const router = express.Router()
const expressSession = require('express-session')
const db = require('../db')

const MIN_COMMENT_TEXT_LENGTH = 1
const SERVER_ERROR="Server error, I'm working on fixing it"

router.get('/', function(request, response){

  db.getAllComments (function(error,comments){
    if (error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('comment.hbs',model)
    }else{
      const model={
        comments: comments
      }
      response.render('comment.hbs',model)
    }
  })
})

function getavalidationErrorForComment(name,comment){
  const validationError = []

   if(name.length < MIN_COMMENT_TEXT_LENGTH){
      validationError.push("Name must contain at least "+MIN_COMMENT_TEXT_LENGTH+" character")
   }
   if(comment.length < MIN_COMMENT_TEXT_LENGTH){
      validationError.push("Comment must contain at least "+MIN_COMMENT_TEXT_LENGTH+" character")
   }
    return validationError
}

router.post('/', function(request,response){
  const name = request.body.name
  const comment = request.body.comment

  const errors = getavalidationErrorForComment(name,comment)

    if ( errors.length==0){
      db.createComment(name,comment,function(error){
        if(error){
          console.log(error)
          const model ={
            SERVER_ERROR
          }
          response.render('comment.hbs',model)
        }else{
          response.redirect('/comment')
        }
      })
    }else{
      db.getAllComments (function(error,comments){
        if (error){
          console.log(error)
          const model ={
            SERVER_ERROR
          }
          response.render('comment.hbs',model)
        }else{
          const model={
            errors,
            name,
            comment,
            comments: comments
          }
          response.render('comment.hbs',model)
        }
      })
    }
})

router.get('/update-comment/:id', function( request,response){
  const id = request.params.id
  
  db.getUpdateCommentById (id,function(error,comments){
    if (error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('comment.hbs',model)
    }else{
      const model={
        comments: comments
      }
      response.render('update-comment.hbs',model)
    }
  })
})

router.post('/update-comment/:id', function(request,response){
  const id = request.params.id
  const newName = request.body.nameU
  const newComment = request.body.commentU
  const errors = getavalidationErrorForComment(newName,newComment) 

  if(!request.session.isLoggedIn){
      errors.push("You have to login.")
  }

  if(errors.length == 0){ 
    db.updateComment(newName,newComment,id,function(error){
      if (error){
        console.log(error)
        const model ={
          SERVER_ERROR
        }
        response.render('comment.hbs',model)
      }else{
        response.redirect('/comment')
      }
    })
  }else{
    const model={
      comments:{
        id,
        name: newName,
        comment: newComment
      },
      errors
    }
    response.render('update-comment.hbs', model)
  }
})

router.get('/delete-comment/:id', function(request,response){
  const id = request.params.id
  
  db.getDeleteCommentById ( id,function(error,comments){
    if (error){
      console.log(error)
      const model ={
        SERVER_ERROR
      }
      response.render('comment.hbs',model)
    }else{
      const model={
        comments: comments
      }
      response.render('delete-comment.hbs',model)
    }
  })
})

router.post('/delete-comment/:id', function(request, response){
  const id = request.params.id
  const errors = []
  
  if(!request.session.isLoggedIn){
    errors.push("You have to login.")
  }
  
  if(errors.length == 0){ 
    db.deleteComment(id,function(error,comments){
      if(error){
        console.log (error)
        const model ={
          SERVER_ERROR
        }
        response.render('comment.hbs',model)
      }else{          
        response.redirect('/comment')
      }
    })
  }else{
    const model={
      errors
    }
    response.render('delete-comment.hbs', model)
  }
})

module.exports = router