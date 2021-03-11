const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.log(error)
      return res.sendStatus(403)
    }
    req.username = decoded.username
    next()
  })
}

module.exports = authenticateToken
