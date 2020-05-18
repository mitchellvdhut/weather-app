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

const corsInterceptor = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', 'https://mitchellvdhut.com')
    res.setHeader('Access-Control-Allow-Headers', "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept")
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    next();
}

app.use(corsInterceptor)
app.use(cookieParser)

app.get('', (req, res, next) => {

    const lastLocation = req.cookies.last_location ? decodeURI(req.cookies.last_location) : "Search for a location"
    const args = {
        title: 'Weather app',
        name: 'Mitchell',
        lastLocation: lastLocation,
    }

    // res.render('index', args)
    res.json(args)
})

app.get('/weather', (req, res, next) => {

    let address = req.query.address

    //set cookie
    res.cookie('last_location', address, { 
        maxAge: 900000, 
        //secure: true, 
        SameSite: false,
        Path: '/',
        Domain: 'www.mitchellvdhut.com'
    })
    //res.setHeader('Set-Cookie', `last_location=${address}; Max-Age=900000; Secure; SameSite=None; Path=/; Domain=www.mitchellvdhut.com`)

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
