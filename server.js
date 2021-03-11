require('dotenv').config()

const express = require('express')
const authenticateToken = require('./middleware/auth')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Henry',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.username))
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server started on ${PORT}`))
