const express = require('express')
const router = express.Router()
const MailController = require('../controllers/mailController')
const MailValidator = require('../validators/sendMailValidator')

// Send mail 
router.post('/sendmail', MailValidator.sendmail, MailController.sendMail)

// Logout the user
router.post('/logout', MailController.logout)

module.exports = router