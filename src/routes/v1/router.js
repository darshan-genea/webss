const router = require('express').Router()
const schemaValidator = require('../../middlewares/schemaValidator')

const takeSS = require('./takeSS')
const schema = require('./schema')

module.exports = () => {
    router.use(schemaValidator(schema))

    router.get('/screenshot/:url', takeSS)

    return router
}
