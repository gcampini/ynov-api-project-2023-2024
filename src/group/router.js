const express = require('express');
const {bearer} = require("../auth/middlewares");
const service = require('./service');
const axios = require("../axios");
const router = express.Router();

router.patch('/:name/members', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    service.join(req.params.name, req.user.username);
    res.status(204).end();
});

router.get('/list', bearer, (req, res) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    const groups = service.list();
    res.json(groups);
});

router.get('/:name/members', bearer, async (req, res, next) => {
    // #swagger.tags = ['Utilisateurs et Groupes']
    try {
        const name = req.params.name;

        if (req.user.group?.name !== name) {
            res.status(403).json({message: "Vous n'êtes pas membre de ce groupe."});
            return;
        }

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
                try {
                    const client = await axios.instance(member.username);
                    const response = await client.get(`me/player`);
                    info.spotify.device = response.data?.device?.name;
                    info.spotify.track = response.data?.item?.name;
                } catch (e) {
                    console.error(`Error while getting playback state for user ${member.username}`, e);
                }
            }
            result.push(info);
        }

        res.json(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
