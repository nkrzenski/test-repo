const express = require('express');
const crypto = require('crypto');
const qs = require('qs')
const client_id = '04a301ccb9094be690ff7fea8d0d4db2';
const redirect_uri = 'http://localhost:5500';
const port = 8888;

const app = express();

app.get('/login', function (req, res) {

    const state = crypto.randomUUID().split('-').join('');
    const scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        qs.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.fromn(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })