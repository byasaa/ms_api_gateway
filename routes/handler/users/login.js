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
    const user = await api.post('/users/login', req.body)
    const result = user.data.result

    const token = jwt.sign({ result }, JWT_SECRET, { expiresIn: JWT_EXP })
    const refreshToken = jwt.sign({ result }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXP,
    })

    await api.post('/refresh_tokens', {
      refresh_token: refreshToken,
      user_id: result.id,
    })
    return res.json({
      status: 'success',
      result: {
        token,
        refresh_token: refreshToken,
      },
    })
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        status: 'error',
        message: 'service unreachable',
      })
    }
    const { status, data } = error.response
    return res.status(status).json(data)
  }
}
