const express = require('express');
const service = require('./service');
const {bearer} = require("../auth/middlewares");
const axios = require("../axios");
const linkService = require("../link/service");

const router = express.Router();

router.post('/', (req, res) => {
    const user = service.create(req.body.username, req.body.password);
    if (!user) {
        res.status(409).end("Le nom d'utilisateur existe déjà.");
        return;
    }
    res.status(201).end();
});

router.get('/list', bearer, (req, res) => {
    const users = service.list();
    res.json(users);
});

router.get('/test', bearer, async (req, res) => {
    const token = await linkService.token(req.user.sub);
    console.log(token);

});

module.exports = router;
