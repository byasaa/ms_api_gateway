const jwt = require('jsonwebtoken')
const apiAdapter = require('../../apiAdapter')

const {
  URL_MEDIA_USER,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXP,
  JWT_REFRESH_EXP,
} = process.env

const api = apiAdapter(URL_MEDIA_USER)

module.exports = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token
    const email = req.body.email

    if (!refreshToken || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid token',
      })
    }

    await api.get('/refresh_tokens', {
      params: { refresh_token: refreshToken },
    })

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'error',
          message: err.message,
        })
      }

      if (email != decoded.result.email) {
        return res.status(401).json({
          status: 'error',
          message: 'email is not valid',
        })
      }

      const token = jwt.sign({ result: decoded.result }, JWT_SECRET, {
        expiresIn: JWT_EXP,
      })
      return res.json({
        status: 'success',
        result: {
          token,
        },
      })
    })
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        status: 'error',
        message: 'service unreachable',
      })
    }

    console.log(error)
    const { status, data } = error.response
    return res.status(status).json(data)
  }
}
