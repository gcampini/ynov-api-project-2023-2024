const express = require('express');
const service = require('./service');
const {bearer} = require("../auth/middlewares");

const router = express.Router();

router.post('/', (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    const user = service.create(req.body.username, req.body.password);
    if (!user) {
        res.status(409).end("Le nom d'utilisateur existe déjà.");
        return;
    }
    res.status(201).end();
});

router.get('/list', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    const users = service.list();
    res.json(users);
});

module.exports = router;
