const express = require('express')
const bodyParser = require('body-parser')

const logger = require('./helpers/logger')
const errorHandler = require('./middlewares/errorHandler')
const addRemoteIP = require('./middlewares/addRemoteIP')
const requestLogger = require('./middlewares/requestLogger')

const v1API = require('./routes/v1/router')

module.exports = () => {
    const expressApp = express()
    expressApp.use(addRemoteIP)
    expressApp.use(requestLogger({ logger }))
    expressApp.use(bodyParser.json())
    expressApp.use(bodyParser.urlencoded({ extended: false }))

    expressApp.use('/v1', v1API())

    expressApp.use((req, res, next) => next(Object.assign(new Error('requested resource not found'), { statusCode: 404, level: 'debug' })))
    expressApp.use(errorHandler({ logger }))

    return expressApp
}

// TODO: Implement authentication
// TODO: Implement rate-limiter
