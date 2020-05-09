const axios = require('axios')

const forecast = (latitude, longitude) => {
    if(!latitude || !longitude) return 'forecast.js - invalid params'
    const url = `http://api.weatherstack.com/current?access_key=6edabfb63087324fba55bfee385ad43b&query=${latitude},${longitude}`
    return axios(url).then((res) => {
        console.log(res)
        const {temperature, feelslike, weather_descriptions} = res.data.current;
        if(res.data.error) return 'Unable to find location. Try another search query.'
        return `It is currently ${weather_descriptions[0]} at ${temperature} degrees. 
        'It feels like ${feelslike} degrees.`
    }).catch(err => err.message);
}

module.exports = forecast
