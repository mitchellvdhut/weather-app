const request = require('request')

const kanye = (callback) => {
    request(
        {
            url: process.env.KANYE_REST_ENDPOINT,
            json: true,
        },
        (error, { body } = {}) => {
            if (error) {
                callback('Unable to get quote.', undefined)
            } else {
                callback(undefined, body.quote)
            }
        }
    )
}

module.exports = kanye
