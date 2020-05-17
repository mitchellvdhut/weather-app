const path = require('path')
const express = require('express')
const hbs = require('hbs')
const cors = require('cors')
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

const whitelist = ['http://mitchellvdhut.com', 'localhost:3000']
const corsOptions = {
    function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(undefined, true)
        } else {
            callback(new Error('Not allowed by CORS'), undefined)
        }
    }
}

app.use(cookieParser)

app.get('',cors(corsOptions), (req, res, next) => {

    const lastLocation = decodeURI(req.cookies.mitchell_site)
    const args = {
        title: 'Weather app',
        name: 'Mitchell',
        lastLocation: lastLocation ? lastLocation : "Location"
    }

    // res.render('index', args)
    res.json(args)
})

app.get('/weather', cors(corsOptions), (req, res, next) => {

    let address = req.query.address

    //set cookie
    res.cookie('mitchell_site', address, { maxAge: 900000 })

    if (!address) {
        return res.json({
            error: 'You must provide an address'
        })
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {

        if (error) return res.json({ error })

        forecast(latitude, longitude, (error, forecastData) => {

            error ? res.json({ error }) : res.json({ location, forecastData })

        })
    })
})

app.get('/about', (req, res) => {
    // res.render('about', {
    //     title: 'About page',
    //     name: 'Mitchell'
    // })
    res.json({
        title: 'About page',
        name: 'Mitchell'
    })
})

app.get('/help', (req, res) => {
    // res.render('help', {
    //     title: 'Help page',
    //     error: 'error: content missing',
    //     name: 'Mitchell'
    // })
    res,json({
        title: 'Help page',
        error: 'error: content missing',
        name: 'Mitchell'
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

        // res.render('404', {
        //     title: '404',
        //     name: 'Mitchell',
        //     errorMessage: 'Some beautiful paths can\'t be discovered without getting lost.',
        //     quote: error ? error.message : data
        // })
        res.json({
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
