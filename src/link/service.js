const querystring = require("querystring");
const credentials = require('../../secrets/spotify.json');
const crypto = require('crypto');
const axios = require('axios');
const repository = require("../user/repository");
const {UserNotLinkedError, RefreshTokenExpiredError} = require("./errors");

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-top-read'
];
const redirect_uri = 'http://localhost:3000/link/callback';

/**
 * TODO
 * @type {{}}
 */
const tokens = {};

/**
 * Maps a state (in the context of a link request) to a username.
 * Will be used to determine which local user to link the Spotify account to.
 *
 * @type {{}}
 */
const states = {};

module.exports.url = function (username) {
    const state = crypto.randomBytes(16).toString('hex');
    states[state] = username;
    return 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: credentials.id,
            scope: scopes.join(' '),
            redirect_uri: redirect_uri,
            state: state
        });
}

module.exports.link = async function (code, state) {
    const username = states[state];
    if (!username) {
        throw new Error('Invalid state');
    }
    delete states[state];

    const {data: tokenData} = await axios.post('https://accounts.spotify.com/api/token', {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    }, {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    const {data: userData} = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + tokenData.access_token,
        }
    });

    const user = await repository.get(username);
    user.spotify = {
        user_id: userData.id,
        display_name: userData.display_name,
        refresh_token: tokenData.refresh_token,
    };
    repository.save();

    tokens[username] = {
        access_token: tokenData.access_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
    };
}

module.exports.token = async function (username) {
    if (tokens[username] && tokens[username].expires_at > Date.now()) {
        return tokens[username].access_token;
    }
    delete tokens[username];

    if (!await module.exports.isLinked(username)) {
        throw new UserNotLinkedError();
    }

    const user = await repository.get(username);

    let response;
    try {
        response = await axios.post('https://accounts.spotify.com/api/token', {
            grant_type: 'refresh_token',
            refresh_token: user.spotify.refresh_token
        }, {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
    } catch (e) {
        user.spotify = null;
        repository.save();
        throw new RefreshTokenExpiredError();
    }

    tokens[username] = {
        access_token: response.data.access_token,
        expires_at: Date.now() + response.data.expires_in * 1000,
    };

    return response.data.access_token;
}

module.exports.isLinked = async function (username) {
    const user = await repository.get(username);
    return !!user.spotify;
}
