// const http = require('http')
const fs = require('fs')
// const path = require('path')
const express = require('express')

const app = express()

// const hostname = 'localhost'
const port = 3000

// Setting static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
  console.log(`Server running at - http://localhost:${port}`)
})

app.get('/public/start_game.html', (request, response) => {
  response.sendFile('./public/start_game.html', { root: __dirname })
})

let database

fs.readFile('./database.json', 'utf-8', (error, content) => {
  if (error) throw error
  database = JSON.parse(content)
  // console.log(database)
})

app.get('/database/:id', (request, response) => {
  response.json(database[request.params.id])
})

app.post('/database', (request, response) => {
  // response.json(data)
  // console.log(typeof request.body)
  const id = request.body.board_ID - 1
  database[id] = request.body
  fs.writeFile('./database.json', JSON.stringify(database, null, 2), error => {
    if (error) throw error
  })
  response.send(request.body)
})

app.post('/index.html', (request, response) => {
  console.log(request.body)
  response.send(request.body)
})



/* const server = http.createServer((request, respose) => {
  let filePath = path.join(__dirname, 'public', request.url == '/' ? 'index.html' : request.url)
  const extname = path.extname(filePath).slice(1)
  const contentType = {
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    wav: 'audio/wav',
    mp3: 'audio/mp3'

  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      throw error
    } else {
      respose.writeHead(200, { 'Content-Type': contentType[extname] })
      respose.end(content, 'utf8')
    }
  })
})

server.listen(port, hostname, () => {
  console.log(`Server running at - http://${hostname}:${port}`)
}) */

/*
images.chesscomfiles.com/chess-themes/pieces/neo/122/bn.png
/
/app.js
/styles/main.css
}) */