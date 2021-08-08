const express = require('express')
const router = express.Router()
const Oauth20Controller = require('../controllers/oauth20Controller')

// Get client credentials using Oauth 2.0
router.get('/getClientCredentials', Oauth20Controller.getClientCredentials)

// Authorized redirect URL after user has successfully authenticated with google
router.get('/oauthcallback', Oauth20Controller.oauthcallback)

module.exports = router