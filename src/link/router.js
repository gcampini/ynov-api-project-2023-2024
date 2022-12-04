const express = require('express');
const service = require('./service');
const {bearer} = require("../auth/middlewares");

const router = express.Router();

router.get('/auth-url', bearer, (req, res) => {
    // #swagger.tags = ['Authentification et liaison']
    const url = service.url(req.user.username);
    res.json(url);
});

router.get('/callback', async (req, res, next) => {
    // #swagger.ignore = true
    try {
        await service.link(req.query.code, req.query.state);
        res.json({
            message: "Liaison réussie ! Vous pouvez fermer cette fenêtre.",
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
