const request = require('request')

const geocode = (address, callback) => {
    const url =
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        encodeURIComponent(address) +
        '.json?access_token=pk.eyJ1IjoibWl0Y2hlbGx2ZGh1dCIsImEiOiJjazlnNmtreXIwMGRnM21vN2p1cGYwYTJuIn0.N4a9wgI9Y08XrZSm6I12Pg&limit=1'

    request(
        {
            url,
            json: true,
        },
        (error, { body } = {}) => {
            if (error) {
                callback('Unable to connect to location services.', undefined)
            } else if (body.features.length === 0) {
                callback(
                    'Unable to find location. Try another search query.',
                    undefined
                )
            } else {
                callback(undefined, {
                    latitude: body.features[0].center[1],
                    longitude: body.features[0].center[0],
                    location: body.features[0].place_name,
                })
            }
        }
    )
}

module.exports = geocode
