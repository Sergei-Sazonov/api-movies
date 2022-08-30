const jwt = require('jsonwebtoken');
const secret = require('../config/secretkey');

module.exports = {
    createToken(payload) {        
        return jwt.sign(payload, secret.key, { expiresIn: '1h' });
    }
}
