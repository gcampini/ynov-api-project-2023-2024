const axios = require("axios");
const linkService = require("./link/service");

module.exports.instance = async function (username) {
    const token = await linkService.token(username);
    return axios.create({
        baseURL: `https://api.spotify.com/v1/`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
}
