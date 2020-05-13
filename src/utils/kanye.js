const request = require('request')

const kanye = (callback) => {
    const url = "https://api.kanye.rest/"

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to get quote.', undefined)
        } else {
            callback(undefined, body.quote)
        }
    })
}

module.exports = kanye