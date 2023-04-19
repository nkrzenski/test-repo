const express = require('express');
const crypto = require('crypto');
const qs = require('qs');
const axios = require('axios');
const client_id = '04a301ccb9094be690ff7fea8d0d4db2';
const client_secret = process.env.CLIENT_SECRET;
let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
const stateKey = 'spotify_auth_state';
const port = 8888;

const app = express();

app.use(express.static('static'));

app.get('/login', function (req, res) {

    const scope = 'user-read-private user-read-email';
    const state = crypto.randomUUID().split('-').join('');

    res.cookie(stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        qs.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', async function (req, res) {

    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            qs.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            method: "post",
            url: 'https://accounts.spotify.com/api/token',
            data: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        const r = await axios(authOptions);

        res.cookie("access_token", r.data.access_token, { secure: process.env.NODE_ENV !== "development", httpOnly: true });
        res.cookie("refresh_token", r.data.refresh_token, { secure: process.env.NODE_ENV !== "development", httpOnly: true });
        res.redirect(`${req.headers.referer}`);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})