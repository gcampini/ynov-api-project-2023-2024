const service = require("./service");

module.exports.linked = async function (req, res, next) {
    if (!await service.isLinked(req.user.sub)) {
        res.status(403).end("Vous devez lier votre compte à Spotify.");
        return;
    }
    next();
};
