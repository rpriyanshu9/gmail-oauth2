require('dotenv').config()
const path = require('path')

// Auth Scopes
exports.SCOPES = [
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
]

// Path to token file
exports.CREDENTIAL_PATH = path.join(__dirname, '../credentials.json');
