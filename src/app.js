const path = require('path')
const express = require('express')
const hbs = require('hbs')
require('dotenv').config()

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
        req.headers.cookie.split(';').forEach(cookie => {
            cookie = cookie.split("=")
            const key = cookie[0].trim()
            const value = cookie[1]
            cookies [key] = value
        });
    }
    req.cookies = cookies;
    next()
}

const corsWare = (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
}

app.use(corsWare)
app.use(cookieParser)

app.get('', (req, res) => {

    lastLocation = decodeURI(req.cookies.mitchell_site)
    const args = {
        title: 'Weather app',
        name: 'Mitchell',
    }

    if (lastLocation) {
        args ['lastLocation'] = lastLocation
    }
    res.render('index', args)
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        name: 'Mitchell'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        error: 'error: content missing',
        name: 'Mitchell'
    })
})

app.get('/weather', (req, res) => {
    
    let address = req.query.address

    //set cookie
    res.cookie('mitchell_site', address, { maxAge: 900000})

    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {

        if (error) return res.send({ error })

        forecast(latitude, longitude, (error, forecastData) => {

            error ? res.send({ error}) : res.send({location, forecastData})

        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/kanye', (req, res) => {
    kanye((error, data) => {
        res.json(data)
    })
})

app.get('/cookies', (req, res) => {
    res.json(req.cookies)
})

// app.get('/help/*', (req, res) => {
//     res.render('404', {
//         title: '404',
//         name: 'Mitchell',
//         errorMessage: 'Help article not found'
//     })
// })

app.get('*', (req, res) => {
    kanye((error, data) => {

        res.render('404', {
            title: '404',
            name: 'Mitchell',
            errorMessage: 'Some beautiful paths can\'t be discovered without getting lost.',
            quote: error ? error.message : data
        })
    })
})

app.listen(port, () => {
    console.log('Server is up on port', port, ".")
})
