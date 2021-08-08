const fs = require('fs')
const querystring = require('querystring')
const axios = require('axios')
const utils = require('../utils/utils')

const CREDENTIAL_PATH = utils.CREDENTIAL_PATH;
const SCOPES = utils.SCOPES

// Auth url for Oauth2.0
const getNewAuthUrl = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: process.env.OAUTH20_REDIRECT_URL,
        client_id: process.env.OAUTH20_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        scope: SCOPES.join(" "),
    }
    return `${rootUrl}?${querystring.stringify(options)}`
}

// Get client credentials using Oauth 2.0
const getClientCredentials = (req, res) => {

    // Checking for the token received after successfull authentication
    fs.readFile(CREDENTIAL_PATH, (err, credentials) => {
        // If not present, generate new auth URL to get token
        if (err) return getNewToken();
        res.json({
            result: true,
            msg: "Oauth successfully done!"
        })
    });

    // Generating new token
    const getNewToken = () => {
        try {
            // Get new auth url
            const authUrl = getNewAuthUrl()

            // redirect to authURL
            res.redirect(authUrl)

        } catch (err) {
            console.log(err)
            res.status(500).json({
                result: false,
                msg: "Failed to generate auth url. Please try again."
            })
        }
    }
}

//Get credentials of user
const getCredentials = (code) => {
    const url = "https://oauth2.googleapis.com/token"
    const values = {
        code,
        client_id: process.env.OAUTH20_CLIENT_ID,
        client_secret: process.env.OAUTH20_CLIENT_SECRET,
        redirect_uri: process.env.OAUTH20_REDIRECT_URL,
        grant_type: "authorization_code",
    }
    return axios
        .post(url, querystring.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch auth tokens`);
            throw new Error(error.message);
        });
}

// Oauth 2.0 authorized redirect url
const oauthcallback = async (req, res) => {

    // Get authorization code
    const code = req.query.code

    try {

        // Get credentials from authorization code
        const credentials = await getCredentials(code)

        fs.writeFile(CREDENTIAL_PATH, JSON.stringify(credentials), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', CREDENTIAL_PATH);
        });

        res.json({
            result: true,
            msg: "Oauth successfully done!"
        })

    } catch (err) {
        return res.status(500).json({
            result: false,
            error: err
        })
    }
}

module.exports = {
    getClientCredentials,
    oauthcallback
}