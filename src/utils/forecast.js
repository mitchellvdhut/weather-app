const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url =
        'http://api.weatherstack.com/current?access_key=6edabfb63087324fba55bfee385ad43b&query=' +
        latitude +
        ',' +
        longitude

    request(
        {
            url,
            json: true,
        },
        (error, { body } = {}) => {
            if (error) {
                callback('Unable to connect to weather services.', undefined)
            } else if (body.error) {
                callback(
                    'Unable to find location. Try another search query.',
                    undefined
                )
            } else {
                callback(undefined, body.current)
            }
        }
    )
}

module.exports = forecast
