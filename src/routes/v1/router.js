const router = require('express').Router()

const takeSS = require('./takeSS')

module.exports = () => {
    router.get('/screenshot/*', takeSS)

    return router
}
