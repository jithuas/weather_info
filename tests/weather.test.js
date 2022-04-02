/**
 * Unit test for weather functions
 */
jest.mock('axios')

const weather = require('../src/weather')
const axios = require('axios')
const APIError = require('../src/errorObject')

describe('Weather Module Tests', () => {
    it('Current weather - success', async () => {
        const responseData1 = {data: [{lat: 1, lon: 1, name: 'location'}]}
        const responseData2 = {data: {info: 1, data: 1}}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)
        axios.get.mockResolvedValueOnce(responseData2)

        let data = await weather.getCurrentWeather(location)
        expect(axios.get).toHaveBeenCalledTimes(2)
        expect(data.location).toBe(location)
    })

    it('Current weather - invalid server response', async () => {
        const responseData1 = {data: [{lat: 1, name: 'location'}]}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)

        try {
            await weather.getCurrentWeather(location)
        } catch(e) {
            expect(e).toBeInstanceOf(APIError)
            expect(e.code).toBe(500)
        }
    })

    it('Current weather - invalid location', async () => {
        const responseData1 = {data: []}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)

        try {
            await weather.getCurrentWeather(location)
        } catch(e) {
            expect(e).toBeInstanceOf(APIError)
            expect(e.code).toBe(400)
        }
    })

    it('Today weather - success', async () => {
        const responseData1 = {data: [{lat: 1, lon: 1, name: 'location'}]}
        const responseData2 = {data: {info: 1, daily: [ {data: 1}, {data: 2}]}}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)
        axios.get.mockResolvedValueOnce(responseData2)

        let data = await weather.getForcastWeather(location, 'today')
        expect(data.location).toBe(location)
    })

    it('Today weather - invalid server response', async () => {
        const responseData1 = {data: [{lat: 1, name: 'location'}]}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)

        try {
            await weather.getForcastWeather(location, 'today')
        } catch(e) {
            expect(e).toBeInstanceOf(APIError)
            expect(e.code).toBe(500)
        }
    })

    it('Today weather - invalid location', async () => {
        const responseData1 = {data: []}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)

        try {
            await weather.getForcastWeather(location, 'today')
        } catch(e) {
            expect(e).toBeInstanceOf(APIError)
            expect(e.code).toBe(400)
        }
    })

    /** Using New york weather data as test data */
    it('Monday weather - success', async () => {
        const responseData1 = {data: [{lat: 1, lon: 1, name: 'location'}]}
        const responseData2 = {data: {info: 1, timezone_offset: -14400, daily: [
                { dt: 1648915200, sunrise: 1648895866, day: "Saturday"},
                { dt: 1649001600, sunrise : 1648982168, day: "Sunday"},
                { dt: 1649088000, sunrise: 1649068469, day: "Monday"},
                { dt: 1649174400, sunrise: 1649154772, day: "Tuesday"},
                { dt: 1649260800, sunrise: 1649241074, day: "Wednesday"}]}}
        const location = 'location'
        axios.get.mockResolvedValueOnce(responseData1)
        axios.get.mockResolvedValueOnce(responseData2)

        let data = await weather.getForcastWeather(location, 'monday')

        console.log(data);

        expect(data.location).toBe(location)
        expect(data.day).toBe("Monday")
    })
})
