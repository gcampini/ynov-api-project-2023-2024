const express = require('express');
const {bearer} = require("../auth/middlewares");
const {linked} = require("../link/middlewares");
const {instance} = require("../axios");
const service = require("./service");

const router = express.Router();

router.post('/best', bearer, linked, async (req, res, next) => {
    try {
        const targetUsername = req.body.target;

        if (!targetUsername) {
            res.status(400).json({
                message: "Missing target username"
            });
            return;
        }

        await service.createTop10BestTracksPlaylist(req.user.sub, targetUsername);
        res.status(200).end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
