const express = require('express');
const router = express.Router();

const service = require('./service');

router.get('/token', (req, res) => {
    // #swagger.tags = ['Authentification et liaison']
    /* #swagger.security = [{
               "basic": []
        }] */
    const auth = req.header("Authorization");
    if (!auth || !auth.startsWith("Basic ")) {
        res.status(401).end();
        return;
    }
    const [username, password] = Buffer.from(auth.split(' ')[1], "base64").toString("utf-8").split(":");
    if (!username || !password) {
        res.status(401).end();
        return;
    }
    const token = service.login(username, password);
    if (!token) {
        res.status(401).end("Le nom d'utilisateur ou le mot de passe est incorrect.");
        return;
    }
    res.json({token});
});

module.exports = router;
