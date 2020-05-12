const weatherForm = document.querySelector('form')
const query = document.querySelector('#query')
const cookieSwitch = document.querySelector('#cookieSwitch')
const locationText = document.querySelector('#message-1')
const forecastText = document.querySelector('#message-2')
const weatherIcon = document.querySelector('#icon')

const KEY = 'rememberLast'

const setSwitch = (bool) => {
    if (bool === 'true') cookieSwitch.control.checked = true
    if (bool === 'false') cookieSwitch.control.checked = false
}

setSwitch(localStorage.getItem(KEY))

window.addEventListener('storage', (e) => {
    setSwitch(e.newValue)
})

cookieSwitch.addEventListener('click', (e) => {
    localStorage.setItem(KEY, cookieSwitch.control.checked.toString())
})

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const _query = query.value
    if (!_query) return
    locationText.textContent = 'Loading weather data...'
    forecastText.textContent = ''
    fetch(`/weather?address=${_query}`, {
        headers: {
            setCookie: cookieSwitch.control.checked.toString(),
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) return (locationText.textContent = data.error)
            locationText.textContent = data.location
            forecastText.textContent = data.forecastData
            weatherIcon.setAttribute('src', data.icon_url)
        })
        .catch((err) => console.log(err))
})
