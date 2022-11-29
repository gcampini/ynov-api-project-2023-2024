const axios = require('../axios');

module.exports.play = async function play(trackId, progress, username) {
    const client = await axios.instance(username);
    return client.put(`me/player/play`, {
        uris: [`spotify:track:${trackId}`],
        position_ms: progress,
    });
}

module.exports.getPlaybackState = async function getPlaybackState(username) {
    const client = await axios.instance(username);
    const response = await client.get(`me/player`);
    return response.data;
}
