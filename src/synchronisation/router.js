const {bearer} = require("../auth/middlewares");
const {linked} = require("../link/middlewares");
const groupService = require('../group/service');
const synchronisationService = require('../synchronisation/service');

const router = require('express').Router();

router.get('/', bearer, linked, async (req, res, next) => {
    // #swagger.tags = ['Extensions Spotify (FT-6, FT-7, FT-8)']
    try {
        if (!req.user.group || !req.user.group.admin) {
            res.status(403).end();
            return;
        }

        const state = await synchronisationService.getPlaybackState(req.user.username);
        if (!state) {
            res.status(400).json({
                message: "Aucune musique n'est en cours de lecture.",
            });
            return;
        }
        const progress = state.progress_ms;
        const track = state.item;
        const members = groupService.members(req.user.group.name);

        let count = 0;
        let errors = {};
        for (const member of members) {
            if (member.username === req.user.username) {
                // skip the member who requested the synchronisation
                continue;
            }
            try {
                await synchronisationService.play(track.id, progress, member.username);
                count += 1;
            } catch (err) {
                console.error("Synchronisation impossible pour l'utilisateur " + member.username, err.response.data);
                errors[member.username] = err.response ? err.response.data.error.reason : err.message;
            }
        }

        res.json({
            track: track.name,
            progress: progress,
            count,
            message: `La synchronisation a été effectuée pour ${count} membre(s).`,
            errors,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
