const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const weatherIcon = document.querySelector('#weatherIcon')


weatherForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    const location = search.value
    messageOne.textContent = 'Loading weather data...'
    messageTwo.textContent = ''


    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                return messageOne.textContent = data.error
            }
            
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecastData.messageOne
            weatherIcon.src = data.forecastData.weather_icons[0]

        })
    })
})