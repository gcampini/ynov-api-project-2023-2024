const fs = require('fs');

const DATA_PATH = __dirname + '/../../data';
const USERS_FILE_PATH = DATA_PATH + '/users.json';
save(true);
const users = require(USERS_FILE_PATH);
const crypto = require("crypto");
const {UserDoesNotExistError} = require("./errors");

/**
 * Saves the users content to the file.
 */
function save(init) {
    if (!fs.existsSync(DATA_PATH)) {
        fs.mkdirSync(DATA_PATH);
    }
    if (!fs.existsSync(USERS_FILE_PATH)) {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([]));
    }
    if (!init) {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    }
}

/**
 * SHA256 hash
 * @param password
 * @returns {string}
 */
function hash(password) {
    return crypto.createHash('sha256').update(password).digest('hex')
}

function get(username) {
    const user = users.find(user => user.username === username);
    if (!user) {
        throw new UserDoesNotExistError(username);
    }
    return user;
}

module.exports.save = save;
module.exports.hash = hash;
module.exports.get = get;
module.exports.users = users;
