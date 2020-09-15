const _ = require('lodash')

const DEFAULT_SUPPORTED_METHOD = ['post', 'put', 'delete']
const DEFAULT_VALIDATION_OPTIONS = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
}

/**
 * Schema validator is middleware which validates schema of incoming request's body
 * @param schemaList
 * @returns {function(*, *, *): Promise<*>}
 */
module.exports = schemaList => async (req, res, next) => {
    const route = req.path
    const method = req.method.toLowerCase()

    if (!(_.includes(DEFAULT_SUPPORTED_METHOD, method) && _.has(schemaList, route))) return next()
    try {
        req.body = await schemaList[route].validateAsync(req.body, DEFAULT_VALIDATION_OPTIONS)
    } catch (err) {
        err.errors = {
            original: req.body,
            details: _.map(err.details, ({ message, type }) => ({ message: message.replace(/['"]/g, ''), type })),
        }
        err.message = 'validation error'
        next(Object.assign(err, { statusCode: 412 }))
    }

    return next()
}
