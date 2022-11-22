const axios = require("../axios");

module.exports.tracks = async function (username) {
    const client = await axios.instance(username);
    let ids = [];
    let url = '/me/tracks';
    do {
        const response = await client.get(url, {
            params: {
                limit: 50,
            }
        });
        ids = ids.concat(response.data.items.map(item => item.track.id));
        url = response.data.next;
    } while (url);
    return ids;
};

module.exports.audioFeatures = async function (username, ids) {
    const client = await axios.instance(username);
    const chunks = [];
    for (let i = 0; i < ids.length; i += 100) {
        chunks.push(ids.slice(i, i + 100));
    }
    const features = [];
    for (const chunk of chunks) {
        const response = await client.get('/audio-features', {
            params: {
                ids: chunk.join(','),
            }
        });
        features.push(...response.data.audio_features);
    }
    return features;
}
