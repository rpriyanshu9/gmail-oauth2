# API documentation

## Notes to use the API

Please use this live endpoint to test this API, as the authorized redirect endpoint used in Oauth 2.0 settings contains this live url only. The application won't run properly on localhost.

**live endpoint :** https://rpriy-gmail-oauth2.herokuapp.com

## Get client credentials using OAuth 2.0

**Endpoint** : GET method

**NOTE :** Use this endpoint from a browser for best experience, as this endpoint will redirect you to the Oauth consent screen.

/oauth20/getClientCredentials


## Send Email

**Endpoint** : POST method

/mail/sendmail

**JSON body required**

```json
{
    "sendTo": "rpriyanshu9@gmail.com",
    "subject": "Dummy subject",
    "messageToSend": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio modi sed tempora ipsa error minus veritatis eos est in saepe."
}
```

## Logout

**Endpoint** : POST method

/mail/logout
