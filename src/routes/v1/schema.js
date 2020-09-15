const Joi = require('joi')

module.exports = ({
    '/topAuthor': Joi.object().keys({
        authorFilter: Joi.array().optional(),
    }),
})
