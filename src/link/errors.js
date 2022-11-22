class UserNotLinkedError extends Error {
  constructor() {
    super("User not linked");
  }
}

class RefreshTokenExpiredError extends Error {
  constructor() {
    super("Refresh token expired");
  }
}

module.exports = {
    UserNotLinkedError,
    RefreshTokenExpiredError,
}
