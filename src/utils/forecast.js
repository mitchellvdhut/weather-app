const request = require('request')

const forecast = (latitude, longitude, callback) => {
    
    const url = 'http://api.weatherstack.com/current?access_key=6edabfb63087324fba55bfee385ad43b&query=' + latitude + ',' + longitude
    
    request({ url, json: true }, (error, {body} = {}) => {
        const {temperature, feelslike, weather_descriptions} = body.current

        if (error) {
            callback('Unable to connect to weather services.', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search query.', undefined)
        } else {
            callback(undefined, 'It is currently ' + weather_descriptions[0] + ' at ' + temperature + ' degrees. ' + 'It feels like ' + feelslike + ' degrees.')
        }
    })
}

module.exports = forecast