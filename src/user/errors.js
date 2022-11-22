class UserDoesNotExistError extends Error {
    constructor(username) {
        super(`User with username ${username} does not exist`);
        this.username = username;
    }
}

module.exports = {
    UserDoesNotExistError,
}
