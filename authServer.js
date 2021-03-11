require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

const generateAccessToken = payload => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s'
  })
  return accessToken
}

app.post('/login', (req, res) => {
  // Authenticate
  const username = req.body.username
  const payload = { username }

  const accessToken = generateAccessToken(payload)
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)

  refreshTokens.push(refreshToken)

  res.json({ accessToken, refreshToken })
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.refreshToken
  if (!refreshToken) return res.sendStatus(401)

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error) return res.sendStatus(403)

      // because decoded has other properties, not just only username
      const newAccessToken = generateAccessToken({ username: decoded.username })
      res.json({ accessToken: newAccessToken })
    }
  )
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(
    refreshToken => refreshToken !== req.body.refreshToken
  )
  res.sendStatus(204)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on ${PORT}`))
