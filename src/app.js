const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

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

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Mitchell'
    })
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
    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {

        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {

            if (error) {
                return res.send({ error }) 
            }

            res.send({
                location,
                forecastData
            })
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

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mitchell',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mitchell',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
