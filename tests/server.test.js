/**
 * Functional Test for server
 * Real API invocation tested
 * 
 */
const request = require('supertest')
const app = require('../src/server')

describe('API Request Test', () => {
  let location = 'Sydney';

  it('Location weather API request', async () => {
    const res = await request(app)
    .get('/weather/' + location.toLocaleLowerCase())
    .expect(200)
    expect(res.body.location).toEqual(location)
    expect(res.body).toHaveProperty("weather")
    expect(res.body).toHaveProperty("wind")
  })

  it('Location weather API invalid location request', async () => {
    const res = await request(app)
    .get('/weather/qwegsdfs')
    .expect(400)
  })

  it('Today weather API request', async () => {
    const res = await request(app)
    .get('/weather/' + location.toLocaleLowerCase() + '/today')
    .expect(200)
    .then( resp => {
      expect(resp.body.location).toEqual(location)
      expect(resp.body).toHaveProperty("weather")
      expect(resp.body).toHaveProperty("sunrise")
    })
  })

  it('Weekday weather API request', async () => { 
    const res = await request(app)
    .get('/weather/' + location + '/tuesday')
    .expect(200)
    .then( resp => {
      expect(resp.body.location).toEqual(location)
      expect(resp.body).toHaveProperty("weather")
      expect(resp.body).toHaveProperty("temp")
    })
  })


  it('Weekday weather API request invalid day', async () => { 
    const res = await request(app)
    .get('/weather/' + location + '/someday')
    .expect(400)
  })
})