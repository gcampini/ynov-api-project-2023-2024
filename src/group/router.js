const express = require('express');
const {bearer} = require("../auth/middlewares");
const service = require('./service');
const router = express.Router();

router.patch('/:name/members', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    service.join(req.params.name, req.user.sub);
    res.status(204).end();
});

router.get('/list', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    const groups = service.list();
    res.json(groups);
});

router.get('/:name/members', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    const members = service.members(req.params.name);
    const result = [];

    for (const member of members) {
        const info = {
            username: member.username,
            group: member.group,
        };
        if (member.spotify) {
            info.spotify = {
                display_name: member.spotify.display_name,
            }
        }
        result.push(info);
    }

    res.json(result);
});

module.exports = router;
