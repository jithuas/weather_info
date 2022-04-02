const axios = require('axios')
const APIError = require('./errorObject')

var days = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7
}

/**
 * Get current weather for location
 */
const getCurrentWeather = async function (location) {
  try {
    let geoRequestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.APPID}`
    const resp = await axios.get(geoRequestUrl)
    if(resp.data.length) {
      let place = resp.data[0]
      if (!place.lat || !place.lon) {
        throw new APIError(500, 'Weather API not working as expected')
      }
      
      let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${process.env.APPID}&units=metric`
      const weatherResp = await axios.get(weatherRequestUrl)
      weatherResp.data ? weatherResp.data.location = place.name : ''
      return weatherResp.data
    } else {
      throw new APIError(400, 'No such Location')
    }
  } catch(e) {
    throw e
  }
}

/**
 * Get weather for location as defined by day
 */
const getForcastWeather = async function(location, day) {
  try {
    /**
     * get location
     */
    let geoRequestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.APPID}`
    const resp = await axios.get(geoRequestUrl)
    if(resp.data.length) {
      let place = resp.data[0]
      if (!place.lat || !place.lon) {
        throw new APIError(500, 'Weather API not working as expected')
      }

      /**
       * get forecast for location
       */
      let forcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${place.lat}&lon=${place.lon}&exclude=current,minutely,hourly&appid=${process.env.APPID}&units=metric`
      const forecastData = await axios.get(forcastUrl)
      if (!forecastData.data || !forecastData.data.daily) {
        throw new APIError(500, 'Weather API not working as expected')
      }
      
      /**
       * get forecast based on location
       * 
       * we are going to do a littel magic here
       * 
       * we will use the utc offset along with the sunrise time to figure out the day
       */
      let weather = '';
      
      switch(day) {
        case 'today':
          weather = forecastData.data.daily[0]
          break;
        case 'monday':
        case 'tuesday':
        case 'wednesday':  
        case 'thursday':
        case 'friday':
        case 'saturday':
        case 'sunday':
          /** Get Day based on the sunrise time. Add offset to caculate based on GMT */
          let sunriseTime = forecastData.data.daily[0].sunrise + forecastData.data.timezone_offset;
          let dateSunriseTime = new Date(sunriseTime * 1000);
          /** Compare with day list to caculate difference */
          let dayNum = days[day] - dateSunriseTime.getDay() - 1;
          /** Sanitize the difference to array index */
          let index = dayNum > 0 ? daynum : 7 + dayNum
          /** Get weather data from index */
          weather = forecastData.data.daily[index]
          break;
        case 'default':
          throw new APIError(400, 'Unknown Day')
      }
      
      weather ? weather.location = place.name : ''
      return weather;
    } else {
      throw new APIError(400, 'No such Location')
    }
  } catch (e) {
    throw e
  }
}

/**
 * Export functions
 */
module.exports = { getCurrentWeather, getForcastWeather }