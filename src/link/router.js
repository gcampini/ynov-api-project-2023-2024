const express = require('express');
const service = require('./service');
const {bearer} = require("../auth/middlewares");

const router = express.Router();

router.get('/auth-url', bearer, (req, res) => {
    // #swagger.tags = ['Authentification et liaison']
    const url = service.url(req.user.sub);
    res.json(url);
});

router.get('/callback', (req, res) => {
    // #swagger.ignore = true
    service.link(req.query.code, req.query.state)
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
});

module.exports = router;
