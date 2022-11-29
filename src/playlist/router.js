const express = require('express');
const {bearer} = require("../auth/middlewares");
const {linked} = require("../link/middlewares");
const playlistService = require("./service");
const groupService = require("../group/service");

const router = express.Router();

router.post('/best', bearer, linked, async (req, res, next) => {
    // #swagger.tags = ['Extensions Spotify (FT-6, FT-7, FT-8)']
    try {
        const targetUsername = req.body.target;

        if (!targetUsername) {
            res.status(400).json({
                message: "Le paramètre 'target' est obligatoire.",
            });
            return;
        }

        const members = groupService.members(req.user.group.name);
        if (!members.some(member => member.username === targetUsername)) {
            res.status(400).json({
                message: "L'utilisateur ciblé n'est pas dans votre groupe.",
            });
            return;
        }

        await playlistService.createTop10BestTracksPlaylist(req.user.sub, targetUsername);
        res.status(200).end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
