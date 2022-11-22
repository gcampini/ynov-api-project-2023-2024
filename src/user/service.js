const repository = require('./repository');

module.exports.create = function create(username, password) {
    const user = {
        username,
        password: repository.hash(password),
    };
    if (repository.users.find(u => u.username === username)) {
        // cannot create user with same username
        return null;
    }
    repository.users.push(user);
    repository.save();
    return user;
}

module.exports.list = function list() {
    const result = [];
    for (const user of repository.users) {
        result.push({username: user.username});
    }
    return result;
}
