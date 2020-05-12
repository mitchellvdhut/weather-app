const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const kanye = require('./utils/kanye')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to serve
app.use(express.static(publicDirectoryPath))

const cookieParser = (req, res, next) => {
    let cookies = {}
    if (req.headers.cookie) {
        req.headers.cookie.split(';').forEach((str) => {
            str = str.split('=')
            const key = str[0].trim()
            const value = str[1].trim()
            cookies[key] = value
        })
    }
    req.cookies = cookies
    next()
}

app.use(cookieParser)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Mitchell',
        lastLocation: req.cookies.mitchell_site
            ? Buffer.from(req.cookies.mitchell_site, 'base64').toString()
            : null,
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        name: 'Mitchell',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        error: 'error: content missing',
        name: 'Mitchell',
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address)
        return res.status(400).send({
            error: 'You must provide an address',
        })
    const setCookie = req.headers.setcookie
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error)
            return res.status(500).send({
                error,
            })
        forecast(latitude, longitude, (error, current) => {
            if (error)
                return res.status(500).send({
                    error,
                })
            const {
                temperature,
                feelslike,
                weather_descriptions,
                weather_icons,
            } = current
            const YEAR_IN_SECONDS = 60 * 60 * 24 * 365
            setCookie === 'true'
                ? res.setHeader(
                      'Set-Cookie',
                      `mitchell_site=${Buffer.from(address).toString(
                          'base64'
                      )};Max-Age=${YEAR_IN_SECONDS}`
                  )
                : !!setCookie
                ? res.clearCookie('mitchell_site', {
                      path: '/',
                  })
                : null
            res.send({
                location,
                forecastData:
                    'It is currently ' +
                    weather_descriptions[0] +
                    ' at ' +
                    temperature +
                    ' degrees. ' +
                    'It feels like ' +
                    feelslike +
                    ' degrees.',
                icon_url: weather_icons[0],
            })
        })
    })
})

app.get('/quote', (req, res) => {
    kanye((error, data) => {
        const quote = error ? error.message : data
        res.json(quote)
    })
})

app.get('/cookies', (req, res) => {
    res.json(req.cookies)
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mitchell',
        errorMessage: 'Help article not found',
    })
})

app.get('*', (req, res) => {
    kanye((error, data) => {
        const quote = error ? error.message : data
        res.render('404', {
            title: '404 - Not Found',
            error: 'Page not found',
            name: 'Mitchell',
            quote: quote,
        })
    })
})

app.listen(port, () => {
    console.log('Server is up on port', port, '.')
})
