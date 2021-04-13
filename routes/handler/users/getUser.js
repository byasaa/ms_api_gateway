const apiAdapter = require('../../apiAdapter')

const { URL_MEDIA_USER } = process.env

const api = apiAdapter(URL_MEDIA_USER)

module.exports = async (req, res) => {
  try {
    const id = req.user.result.id
    const user = await api.get(`/users/${id}`, req.body)
    return res.json(user.data)
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
