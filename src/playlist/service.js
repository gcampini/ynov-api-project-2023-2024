const axios = require("../axios");
const repository = require("../user/repository");

module.exports.getTop10BestTracksIds = async function (username) {
    const instance = await axios.instance(username);
    const {data: {items: bestTracks}} = await instance.get('me/top/tracks', {
        params: {
            limit: 10,
        }
    });
    return bestTracks.map(track => track.id);
};

module.exports.createTop10BestTracksPlaylist = async function (username, targetUsername) {
    const bestTracksIds = await this.getTop10BestTracksIds(targetUsername);
    const instance = await axios.instance(username);
    const user = repository.get(username);
    const {data: {id: playlistId}} = await instance.post('users/' + user.spotify.user_id + '/playlists', {
        name: "Les 10 meilleurs morceaux (" + targetUsername + ")",
    });
    await instance.post('playlists/' + playlistId + '/tracks', {
        uris: bestTracksIds.map(id => 'spotify:track:' + id),
    });
    return playlistId;
}
