var jwt = require('jsonwebtoken');
const {promisify} = require('util')
const promisifiedJwt = promisify(jwt.sign);

class AuthService {
  async login(user, pwd) {
    try {
      const token = await promisifiedJwt({user, pwd}, process.env.SECRET_KEY)
      return token;
    } catch (err) {
      console.log(err.message)
    }
  }
}

module.exports = new AuthService(); 