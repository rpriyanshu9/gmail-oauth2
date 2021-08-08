const fs = require('fs')
const utils = require('../utils/utils')
const axios = require('axios')
const { validationResult } = require('express-validator')

const CREDENTIAL_PATH = utils.CREDENTIAL_PATH

const sendMail = (req, res) => {

    //Validating req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0]
        });
    }

    // Get email details from request body
    const { sendTo, subject, messageToSend } = req.body

    fs.readFile(CREDENTIAL_PATH, (err, credentials) => {

        // Checking if user credential token is not present
        if (err) {
            return res.status(500).json({
                resukt: false,
                msg: "Please complete oauth 2.0 first."
            })
        }

        // Authorizing oauth2Client using the token
        const credentialsData = (JSON.parse(credentials))

        // Building message body
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
        const messageParts = [
            `To: ${sendTo}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            messageToSend,
        ]
        const message = messageParts.join('\n')

        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')

        // Sending email
        const config = {
            url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
            method: 'post',
            headers: {
                "Authorization": `Bearer ${credentialsData.access_token}`,
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "raw": encodedMessage
            })
        }

        axios(config).then((result) => {
            res.json({
                result: true,
                msg: "Email sent successfully!"
            })
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({
                result: false,
                err
            })
        })
    })
}

// Logging out by revoking the access_token and then removing the credentials.json file
const logout = (req, res) => {

    fs.readFile(CREDENTIAL_PATH, (err, credentials) => {

        if (err) {
            return res.status(500).json({
                message: "Already logged out."
            })
        }

        const jsonData = JSON.parse(credentials)

        const config = {
            url: 'https://oauth2.googleapis.com/revoke',
            method: 'post',
            params: {
                token: jsonData.access_token
            }
        }

        // Axios call to revoke access_token
        axios(config).then((result) => {
            fs.unlink(CREDENTIAL_PATH, (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Already logged out."
                    })
                }
                res.json({
                    message: "Successfully logged out."
                })
            })
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({
                result: false,
                msg: "Unable to revoke token access"
            })
        })

    })

}

module.exports = {
    sendMail,
    logout
}