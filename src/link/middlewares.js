const service = require("./service");

module.exports.linked = async function (req, res, next) {
    if (!await service.isLinked(req.user.username)) {
        res.status(403).json({
            message: "Vous devez lier votre compte Spotify avant d'utiliser cette fonctionnalité.",
        });
        return;
    }
    next();
};
