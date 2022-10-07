const sqlite3 = require ('sqlite3')
const db = new sqlite3.Database ("my-database.db")

db.run(`
CREATE TABLE IF NOT EXISTS songs(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song TEXT,
  artist TEXT,
  review TEXT,
  grade TEXT

)
`, function(error){
  if (error){
    console.log(error)
  }
  else
    console.log("successful")
})

exports.getAllSongs = function(callback){
    const query=`SELECT * FROM songs ORDER BY id DESC`
    db.all(query, function(error,songs){
        callback(error,songs)
    })
}

exports.createSong =function(song,artist,review,grade,callback){
    const query =`INSERT INTO songs(song,artist,review,grade) VALUES(?,?,?,?)`
    const values = [song,artist,review,grade]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getSongById = function(id,callback){
    const query=`SELECT * FROM songs WHERE id =?`
    db.get (query,[id], function(error,song){
        callback(error,song)
    })
}

exports.getUpdateSongById = function(id,callback){
    const query=`SELECT * FROM songs WHERE id =?`
    db.get (query,[id], function(error,song){
        callback(error,song)
    })
}

exports.updateSong = function(newSong,newArtist,newReview,newGrade,id,callback){
    const query =`UPDATE songs SET song=?,artist=?,review=?,grade=? WHERE id=?`
    const values =[newSong,newArtist,newReview,newGrade,id]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getDeleteSongById = function(id,callback){
    const query=`SELECT * FROM songs WHERE id =?`
    db.get (query,[id], function(error,song){
        callback(error,song)
    })
}

exports.deleteSong = function(id,callback){
    const query= `DELETE FROM songs WHERE id=?`
    db.run(query,[id],function(error){
        callback(error)
    })
}

db.run(`
CREATE TABLE IF NOT EXISTS comments(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  comment TEXT
)
`, function(error){
  if (error)
    console.log(error)
  else
    console.log("successful")
})

exports.getAllComments = function(callback){
    const query= `SELECT * FROM comments ORDER BY id DESC`
    db.all(query,function(error,comments){
        callback(error,comments)
    })
}

exports.createComment =function(name,comment,callback){
    const query = `INSERT INTO comments(name,comment) VALUES (?,?)`
    const values = [name,comment]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getUpdateCommentById = function(id,callback){
    const query=`SELECT * FROM comments WHERE id =?`
    db.get (query,[id], function(error,comments){
        callback(error,comments)
    })
}

exports.updateComment = function(newName,newComment,id,callback){
    const query = `UPDATE comments SET name=?, comment=? WHERE id=?`
    const values = [newName,newComment,id]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getDeleteCommentById = function(id,callback){
    const query=`SELECT * FROM comments WHERE id =?`
    db.get (query,[id], function(error,comments){
        callback(error,comments)
    })
}

exports.deleteComment = function(id,callback){
    const query= `DELETE FROM comments WHERE id=?`
    db.run(query,[id],function(error){
        callback(error)
    })
}

db.run(`
CREATE TABLE IF NOT EXISTS requests(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  song TEXT,
  artist TEXT
)
`, function(error){
  if (error)
    console.log(error)
  else
    console.log("successful")
})

exports.getAllRequests = function(callback){
    const query= `SELECT * FROM requests ORDER BY id DESC`
    db.all(query,function(error,requests){
        callback(error,requests)
    })
}

exports.createRequest =function(name,song,artist,callback){
    const query = `INSERT INTO requests(name,song,artist) VALUES (?,?,?)`
    const values = [name,song,artist]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getUpdateRequestById = function(id,callback){
    const query=`SELECT * FROM requests WHERE id =?`
    db.get (query,[id], function(error,requests){
        callback(error,requests)
    })
}

exports.updateRequest = function(newName,newSong,newArtist,id,callback){
    const query = `UPDATE requests SET name=?, song=?, artist=? WHERE id=?`
    const values = [newName,newSong,newArtist,id]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getDeleteRequestById = function(id,callback){
    const query=`SELECT * FROM requests WHERE id =?`
    db.get (query,[id], function(error,requests){
        callback(error,requests)
    })
}

exports.deleteRequest = function(id,callback){
    const query= `DELETE FROM requests WHERE id=?`
    db.run(query,[id],function(error){
        callback(error)
    })
}

db.run(`
    CREATE TABLE IF NOT EXISTS admin(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password varchar(255)
    )
`, function(error){
    if (error)
        console.log(error)
    else
        console.log("successful")
})

exports.postLogin = function(callback){
    const query =`SELECT * FROM admin WHERE id =?`
    const values =1
    db.get(query, values,function(error,adminDatabase){
        callback(error,adminDatabase)
    })
}