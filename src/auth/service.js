const repository = require("../user/repository");
const jwt = require("jsonwebtoken");
const key = require('../../secrets/jwt.json').secret;

module.exports.login = function login(username, password) {
    const user = repository.users.find(u => u.username === username && u.password === repository.hash(password));
    if (!user) {
        return null;
    }
    return jwt.sign({sub: username}, key, {expiresIn: '1 day'});
}
