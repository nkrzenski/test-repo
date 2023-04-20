const axios = require("axios")


class SpotifyClient {
    constructor(client_id, client_secret, redirect_uri) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri
    }

    getToken(code) {
        var authOptions = {
            method: "post",
            url: 'https://accounts.spotify.com/api/token',
            data: {
                code: code,
                redirect_uri: this.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(this.client_id + ':' + this.client_secret).toString('base64'))
            },
            json: true
        };
        return axios.request(authOptions);
    }

    getMe(token) {
        const options = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return axios.request(options);
    }

    getUserPlaylists(user_id, token) {
        const options = {
            method: 'GET',
            url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
            params: { limit: '50' },
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return axios.request(options);
    }

    getPlaylistItems(pid, token) {
        const options = {
            method: 'GET',
            url: `https://api.spotify.com/v1/playlists/${pid}/tracks`,
            params: { fields: 'items' },
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return axios.request(options)
    }

    getSavedTracks(token) {
        const options = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me/tracks',
            params: { limit: '50' },
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return axios.request(options)
    }
}


module.exports = SpotifyClient