const express = require('express');
const {bearer} = require("../auth/middlewares");
const {linked} = require("../link/middlewares");
const service = require("./service");
const router = express.Router();

router.get('/', bearer, linked, async (req, res, next) => {
    // #swagger.tags = ['Extensions Spotify (FT-6, FT-7, FT-8)']
    try {
        const ids = await service.tracks(req.user.username);
        const features = await service.audioFeatures(req.user.username, ids);

        const length = features.length;

        const danceability = features.reduce((sum, item) => sum + item.danceability, 0) / length;
        const tempo = features.reduce((sum, item) => sum + item.tempo, 0) / length;
        const instrumentalness = features.reduce((sum, item) => sum + item.instrumentalness, 0) / length;
        const valence = features.reduce((sum, item) => sum + item.valence, 0) / length;

        res.json({
            danceability: danceability,
            tempo: tempo,
            instrumentalness: instrumentalness,
            valence: valence,
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
