const { body } = require("express-validator");

exports.sendmail = [
    body('sendTo').not().isEmpty(),
    body('subject').not().isEmpty(),
    body('messageToSend').not().isEmpty(),
    body('sendTo').isEmail()
];