const jwt = require("jsonwebtoken");
const repository = require("../user/repository");
const key = require('../../secrets/jwt.json').secret;


module.exports.bearer = function bearer(req, res, next) {
    const auth = req.header("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
        res.status(401).end();
        return;
    }
    const token = auth.split(' ')[1];
    if (!token) {
        res.status(401).end();
        return;
    }
    const payload = jwt.verify(token, key);
    req.user = repository.get(payload.sub);
    req.user.sub = payload.sub;
    next();
}
