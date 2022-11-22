const express = require('express');
const {RefreshTokenExpiredError} = require("./link/errors");
const {UserDoesNotExistError} = require("./user/errors");
const router = express.Router();

router.use('/user', require('./user/router'));
router.use('/auth', require('./auth/router'));
router.use('/group', require('./group/router'));
router.use('/link', require('./link/router'));
router.use('/personality', require('./personality/router'));
router.use('/playlist', require('./playlist/router'));

router.use((err, req, res, next) => {
    if (err instanceof RefreshTokenExpiredError) {
        res.status(403).json({
            message: "Votre lien avec Spotify a expiré. Veuillez lier à nouveau votre compte Spotify.",
        });
    } else {
        next(err);
    }
});

router.use((err, req, res, next) => {
    if (err instanceof UserDoesNotExistError) {
        res.status(404).json({
            message: "L'Utilisateur n'existe pas.",
            username: err.username,
        });
    } else {
        next(err);
    }
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.stack);
});

module.exports = router;
