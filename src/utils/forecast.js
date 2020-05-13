const request = require('request')

const forecast = (latitude, longitude, callback) => {
    
    const weatherstackApiKey = process.env.WEATHERSTACKAPIKEY
    const url = 'http://api.weatherstack.com/current?access_key=' + weatherstackApiKey + '&query=' + latitude + ',' + longitude
    
    request({ url, json: true }, (error, {body} = {}) => {
        const { precip, feelslike, weather_descriptions, weather_icons} = body.current

        if (error) {
            callback('Unable to connect to weather services.', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search query.', undefined)
        } else {
            callback(undefined, {messageOne: 'It is currently ' + weather_descriptions[0] + ' with a ' + precip + '% chance of rain. ' + 'It feels like ' + feelslike + ' degrees.', weather_icons})
        }
    })
}

module.exports = forecast