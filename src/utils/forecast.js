const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url =
        process.env.WEATHER_ENDPOINT +
        '?access_key=' +
        process.env.WEATHER_KEY +
        '&query=' +
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
