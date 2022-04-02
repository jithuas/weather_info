const express = require('express')
const router = express.Router()
const routeValidator = require('express-route-validator')
const weather = require('./weather')
const APIError = require('./errorObject')

/**
 * Log the request API
 */
router.use((req, res, next) => {
  console.log('Request: ', req.path)
  next()
});

/**
 * Get current weather for location
 */
router.get('/:location',
  routeValidator.validate({
    params: {
      location: { isRequired: true },
    }
  }), async (req, res, next) => {
    weather.getCurrentWeather(req.params.location).then( data => {
        res.send(data);
    }).catch(e => {
      if (e instanceof APIError) {
        res.status(e.code).send(e.message);
      } else {
        next(e)
      }
    })
})

/**
 * Get weather for location as defined by day
 */
router.get('/:location/:day',
  routeValidator.validate({
    params: {
      location: { isRequired: true },
      day: { isIn: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'today'] }
  }
  }), async (req, res, next) => {
    weather.getForcastWeather(req.params.location, req.params.day).then( data => {
      res.send(data);
    }).catch(e => {
      if (e instanceof APIError) {
        res.status(e.code).send(e.message);
      } else {
        next(e)
      }
    })
})

/**
 * Export APIs
 */
module.exports = router