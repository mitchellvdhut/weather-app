const axios = require('axios')

const geocode = (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibWl0Y2hlbGx2ZGh1dCIsImEiOiJjazlnNmtreXIwMGRnM21vN2p1cGYwYTJuIn0.N4a9wgI9Y08XrZSm6I12Pg&limit=1`
    return axios({url}).then(res => {
        return res.data.features.length === 0 ?
            'Unable to find location. Try another search query.' :
            {
                latitude: res.data.features[0].center[1],
                longitude: res.data.features[0].center[0],
                location: res.data.features[0].place_name,
            }
    }).catch(err => err.message);
}

module.exports = geocode
