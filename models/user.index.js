const User = require('./user.model')
const UserService = require('./user.services')

module.exports = UserService(User)